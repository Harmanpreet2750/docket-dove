import { useState } from 'react';
import { PetitionForm } from '@/components/PetitionForm';
import { ScheduleDisplay } from '@/components/ScheduleDisplay';
import { SlotManagement } from '@/components/SlotManagement';
import { Petition, TimeSlot, ScheduledHearing } from '@/types/scheduler';
import { scheduleHearings } from '@/utils/scheduler';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Calendar, Clock, TrendingUp } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [scheduledHearings, setScheduledHearings] = useState<ScheduledHearing[]>([]);
  const [unscheduledPetitions, setUnscheduledPetitions] = useState<Petition[]>([]);

  const handleAddPetition = (petition: Petition) => {
    setPetitions(prev => [...prev, petition]);
  };

  const handleSlotsGenerated = (slots: TimeSlot[]) => {
    setAvailableSlots(slots);
    toast({
      title: "Slots Generated",
      description: `${slots.length} time slots have been generated for the next 4 weeks`,
    });
  };

  const runScheduler = () => {
    if (petitions.length === 0) {
      toast({
        title: "No Petitions",
        description: "Please add petitions before running the scheduler",
        variant: "destructive"
      });
      return;
    }

    if (availableSlots.length === 0) {
      toast({
        title: "No Available Slots",
        description: "Please generate time slots before running the scheduler",
        variant: "destructive"
      });
      return;
    }

    const result = scheduleHearings(petitions, availableSlots);
    setScheduledHearings(result.scheduled);
    setUnscheduledPetitions(result.unscheduled);

    toast({
      title: "Scheduling Complete",
      description: `${result.scheduled.length} hearings scheduled, ${result.unscheduled.length} petitions require manual scheduling`,
    });
  };

  const stats = {
    totalPetitions: petitions.length,
    scheduledHearings: scheduledHearings.length,
    availableSlots: availableSlots.filter(slot => slot.isAvailable).length,
    urgentPetitions: petitions.filter(p => p.priority === 'urgent').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-judicial text-judicial-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">AI Court Scheduler</h1>
              <p className="text-judicial-foreground/80">
                Intelligent hearing scheduling with priority management and bail considerations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-judicial" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Petitions</p>
                  <p className="text-2xl font-bold">{stats.totalPetitions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Hearings</p>
                  <p className="text-2xl font-bold">{stats.scheduledHearings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                  <p className="text-2xl font-bold">{stats.availableSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-urgent" />
                <div>
                  <p className="text-sm text-muted-foreground">Urgent Cases</p>
                  <p className="text-2xl font-bold">{stats.urgentPetitions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule & Queue</TabsTrigger>
            <TabsTrigger value="petition">Add Petition</TabsTrigger>
            <TabsTrigger value="slots">Manage Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleDisplay
              scheduledHearings={scheduledHearings}
              unscheduledPetitions={unscheduledPetitions}
              onRunScheduler={runScheduler}
            />
          </TabsContent>

          <TabsContent value="petition">
            <PetitionForm onAddPetition={handleAddPetition} />
          </TabsContent>

          <TabsContent value="slots">
            <SlotManagement
              availableSlots={availableSlots}
              onSlotsGenerated={handleSlotsGenerated}
            />
          </TabsContent>
        </Tabs>

        {/* AI Scheduler Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-judicial">AI Scheduler Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Priority-Based Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically prioritizes urgent cases and considers filing dates for optimal scheduling
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Weekend Bail Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Ensures bailable petitions are not scheduled on weekends to allow for bail processing
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Judge & Courtroom Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Efficiently allocates available judges and courtrooms based on case duration and type
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;