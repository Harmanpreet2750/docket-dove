import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CourtCalendar } from '@/types/scheduler';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarManagementProps {
  courtCalendar: CourtCalendar;
  onCalendarUpdate: (calendar: CourtCalendar) => void;
}

const WORKING_DAYS = [
  { key: 'Monday', label: 'Monday' },
  { key: 'Tuesday', label: 'Tuesday' },
  { key: 'Wednesday', label: 'Wednesday' },
  { key: 'Thursday', label: 'Thursday' },
  { key: 'Friday', label: 'Friday' },
  { key: 'Saturday', label: 'Saturday' },
  { key: 'Sunday', label: 'Sunday' }
];

export const CalendarManagement: React.FC<CalendarManagementProps> = ({ 
  courtCalendar, 
  onCalendarUpdate 
}) => {
  const [isAddingHoliday, setIsAddingHoliday] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [holidayName, setHolidayName] = useState('');
  const { toast } = useToast();

  const updateWorkingDays = (day: string, checked: boolean) => {
    const updatedDays = checked 
      ? [...courtCalendar.workingDays, day]
      : courtCalendar.workingDays.filter(d => d !== day);
    
    onCalendarUpdate({
      ...courtCalendar,
      workingDays: updatedDays
    });
  };

  const updateWorkingHours = (field: 'start' | 'end', value: string) => {
    onCalendarUpdate({
      ...courtCalendar,
      workingHours: {
        ...courtCalendar.workingHours,
        [field]: value
      }
    });
  };

  const updateLunchBreak = (field: 'start' | 'end', value: string) => {
    onCalendarUpdate({
      ...courtCalendar,
      lunchBreak: {
        ...courtCalendar.lunchBreak,
        [field]: value
      }
    });
  };

  const addHoliday = () => {
    if (!selectedDate || !holidayName.trim()) {
      toast({
        title: "Error",
        description: "Please select a date and enter holiday name",
        variant: "destructive"
      });
      return;
    }

    // For simplicity, we'll store holiday name in a custom property
    const updatedHolidays = [...courtCalendar.holidays, selectedDate];
    
    onCalendarUpdate({
      ...courtCalendar,
      holidays: updatedHolidays
    });

    setSelectedDate(undefined);
    setHolidayName('');
    setIsAddingHoliday(false);
    
    toast({
      title: "Success",
      description: "Holiday added successfully"
    });
  };

  const removeHoliday = (index: number) => {
    const updatedHolidays = courtCalendar.holidays.filter((_, i) => i !== index);
    onCalendarUpdate({
      ...courtCalendar,
      holidays: updatedHolidays
    });
    
    toast({
      title: "Success",
      description: "Holiday removed successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-judicial">Court Calendar</h2>
          <p className="text-muted-foreground">Configure working days, hours, and holidays</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Working Days */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-judicial" />
              Working Days
            </CardTitle>
            <CardDescription>
              Select which days the court operates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {WORKING_DAYS.map(day => (
              <div key={day.key} className="flex items-center justify-between">
                <Label htmlFor={day.key}>{day.label}</Label>
                <Switch
                  id={day.key}
                  checked={courtCalendar.workingDays.includes(day.key)}
                  onCheckedChange={(checked) => updateWorkingDays(day.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-judicial" />
              Working Hours
            </CardTitle>
            <CardDescription>
              Set daily court operating hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={courtCalendar.workingHours.start}
                  onChange={(e) => updateWorkingHours('start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={courtCalendar.workingHours.end}
                  onChange={(e) => updateWorkingHours('end', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Lunch Break</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lunch-start">Start</Label>
                  <Input
                    id="lunch-start"
                    type="time"
                    value={courtCalendar.lunchBreak.start}
                    onChange={(e) => updateLunchBreak('start', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lunch-end">End</Label>
                  <Input
                    id="lunch-end"
                    type="time"
                    value={courtCalendar.lunchBreak.end}
                    onChange={(e) => updateLunchBreak('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label htmlFor="emergency-slots">Emergency Slots</Label>
                <p className="text-sm text-muted-foreground">Allow emergency scheduling outside hours</p>
              </div>
              <Switch
                id="emergency-slots"
                checked={courtCalendar.emergencySlots}
                onCheckedChange={(checked) => onCalendarUpdate({
                  ...courtCalendar,
                  emergencySlots: checked
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holidays */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Court Holidays & Closures
              </CardTitle>
              <CardDescription>
                Manage dates when the court is closed
              </CardDescription>
            </div>
            <Dialog open={isAddingHoliday} onOpenChange={setIsAddingHoliday}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Court Holiday</DialogTitle>
                  <DialogDescription>
                    Select a date and provide a name for the holiday
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Holiday Name</Label>
                    <Input
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                      placeholder="e.g., Independence Day"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingHoliday(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addHoliday} className="bg-judicial text-judicial-foreground hover:bg-judicial/90">
                    Add Holiday
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {courtCalendar.holidays.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No holidays configured</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {courtCalendar.holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{format(holiday, "PPPP")}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeHoliday(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};