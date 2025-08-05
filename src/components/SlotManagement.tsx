import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/types/scheduler';
import { Calendar, Clock, User, MapPin, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { generateWeeklySlots } from '@/utils/scheduler';

interface SlotManagementProps {
  availableSlots: TimeSlot[];
  onSlotsGenerated: (slots: TimeSlot[]) => void;
}

export const SlotManagement = ({ availableSlots, onSlotsGenerated }: SlotManagementProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleJudges = [
    { id: 'judge-1', name: 'Justice A.K. Sharma' },
    { id: 'judge-2', name: 'Justice M.R. Patel' },
    { id: 'judge-3', name: 'Justice S.L. Verma' },
    { id: 'judge-4', name: 'Justice R.K. Singh' }
  ];

  const generateSlots = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    
    const newSlots = generateWeeklySlots(sampleJudges, startDate, 4);
    onSlotsGenerated(newSlots);
    
    setIsGenerating(false);
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped = slots.reduce((acc, slot) => {
      const dateKey = format(slot.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(0, 7); // Show only next 7 days
  };

  const groupedSlots = groupSlotsByDate(availableSlots);

  return (
    <Card>
      <CardHeader className="bg-judicial text-judicial-foreground">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Available Time Slots
          </CardTitle>
          <Button
            onClick={generateSlots}
            disabled={isGenerating}
            variant="secondary"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Slots'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-4">
          Total Available Slots: <span className="font-semibold text-foreground">{availableSlots.length}</span>
        </div>
        
        {groupedSlots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No time slots available. Generate slots to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedSlots.map(([date, slots]) => (
              <div key={date} className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {format(new Date(date), 'EEEE, MMMM do, yyyy')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots
                    .filter(slot => slot.isAvailable)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{slot.judgeName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{slot.courtroom}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {slots.filter(slot => slot.isAvailable).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No available slots for this date
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};