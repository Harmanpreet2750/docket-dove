import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Users, Clock, Scale, Shield, Zap, AlertTriangle, User, Building, Settings, TrendingUp } from 'lucide-react';
import { PetitionForm } from '@/components/PetitionForm';
import { SlotManagement } from '@/components/SlotManagement';
import { ScheduleDisplay } from '@/components/ScheduleDisplay';
import { JudgeManagement } from '@/components/JudgeManagement';
import { CalendarManagement } from '@/components/CalendarManagement';
import { CourtroomManagement } from '@/components/CourtroomManagement';
import { BulkPetitionEntry } from '@/components/BulkPetitionEntry';
import { useToast } from '@/hooks/use-toast';
import { Petition, TimeSlot, ScheduledHearing, Judge, Courtroom, CourtCalendar } from '@/types/scheduler';
import { scheduleHearings } from '@/utils/scheduler';
import { storage } from '@/utils/dataStorage';

const Index = () => {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [scheduledHearings, setScheduledHearings] = useState<ScheduledHearing[]>([]);
  const [unscheduledPetitions, setUnscheduledPetitions] = useState<Petition[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [courtrooms, setCourtrooms] = useState<Courtroom[]>([]);
  const [courtCalendar, setCourtCalendar] = useState<CourtCalendar | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    storage.initializeDefaults();
    setJudges(storage.loadJudges());
    setCourtrooms(storage.loadCourtrooms());
    setCourtCalendar(storage.loadCalendar());
    setPetitions(storage.loadPetitions());
    setAvailableSlots(storage.loadTimeSlots());
    setScheduledHearings(storage.loadScheduledHearings());
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (judges.length > 0) storage.saveJudges(judges);
  }, [judges]);

  useEffect(() => {
    if (courtrooms.length > 0) storage.saveCourtrooms(courtrooms);
  }, [courtrooms]);

  useEffect(() => {
    if (courtCalendar) storage.saveCalendar(courtCalendar);
  }, [courtCalendar]);

  useEffect(() => {
    storage.savePetitions(petitions);
  }, [petitions]);

  useEffect(() => {
    storage.saveTimeSlots(availableSlots);
  }, [availableSlots]);

  useEffect(() => {
    storage.saveScheduledHearings(scheduledHearings);
  }, [scheduledHearings]);

  const handleAddPetition = (petition: Petition) => {
    setPetitions(prev => [...prev, petition]);
    toast({
      title: "Petition Added",
      description: `Case ${petition.caseNumber} has been added to the queue.`
    });
  };

  const handleAddPetitions = (newPetitions: Petition[]) => {
    setPetitions(prev => [...prev, ...newPetitions]);
    toast({
      title: "Petitions Added",
      description: `${newPetitions.length} petitions have been added to the queue.`
    });
  };

  const handleJudgesUpdate = (updatedJudges: Judge[]) => {
    setJudges(updatedJudges);
  };

  const handleCourtroomsUpdate = (updatedCourtrooms: Courtroom[]) => {
    setCourtrooms(updatedCourtrooms);
  };

  const handleCalendarUpdate = (updatedCalendar: CourtCalendar) => {
    setCourtCalendar(updatedCalendar);
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
                Comprehensive court management with intelligent hearing scheduling
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
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="petition">Add Petition</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Entry</TabsTrigger>
            <TabsTrigger value="slots">Slots</TabsTrigger>
            <TabsTrigger value="judges">Judges</TabsTrigger>
            <TabsTrigger value="courtrooms">Courtrooms</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
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

          <TabsContent value="bulk">
            <BulkPetitionEntry onPetitionsAdd={handleAddPetitions} />
          </TabsContent>

          <TabsContent value="slots">
            <SlotManagement 
              availableSlots={availableSlots} 
              onSlotsGenerated={handleSlotsGenerated} 
            />
          </TabsContent>

          <TabsContent value="judges">
            <JudgeManagement 
              judges={judges}
              onJudgesUpdate={handleJudgesUpdate}
            />
          </TabsContent>

          <TabsContent value="courtrooms">
            <CourtroomManagement 
              courtrooms={courtrooms}
              onCourtroomsUpdate={handleCourtroomsUpdate}
            />
          </TabsContent>

          <TabsContent value="calendar">
            {courtCalendar && (
              <CalendarManagement 
                courtCalendar={courtCalendar}
                onCalendarUpdate={handleCalendarUpdate}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* AI Scheduler Features */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-judicial flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Scheduler Features
            </CardTitle>
            <CardDescription>
              Advanced features for intelligent court scheduling and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-urgent" />
                  <h3 className="font-semibold">Priority-Based Scheduling</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically prioritizes urgent cases and considers filing dates for optimal scheduling
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-success" />
                  <h3 className="font-semibold">Weekend Bail Protection</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ensures bailable petitions are not scheduled on weekends to allow for bail processing
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-judicial" />
                  <h3 className="font-semibold">Judge Specialization Matching</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Matches cases with judges based on their specializations and experience
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">Courtroom Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Efficiently allocates courtrooms based on capacity, equipment, and case requirements
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold">Dynamic Calendar Management</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Respects court holidays, working hours, and judge availability for accurate scheduling
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-warning" />
                  <h3 className="font-semibold">Bulk Data Processing</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate sample data or import existing cases for comprehensive scheduling testing
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