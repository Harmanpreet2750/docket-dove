import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScheduledHearing, Petition } from '@/types/scheduler';
import { Calendar, Clock, User, MapPin, AlertTriangle, Gavel } from 'lucide-react';
import { format } from 'date-fns';

interface ScheduleDisplayProps {
  scheduledHearings: ScheduledHearing[];
  unscheduledPetitions: Petition[];
  onRunScheduler: () => void;
}

export const ScheduleDisplay = ({ 
  scheduledHearings, 
  unscheduledPetitions, 
  onRunScheduler 
}: ScheduleDisplayProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-urgent text-urgent-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-success text-success-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPetitionTypeIcon = (type: string) => {
    switch (type) {
      case 'bail': return '🔓';
      case 'civil': return '⚖️';
      case 'criminal': return '🔒';
      case 'constitutional': return '📜';
      case 'writ': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Court Schedule</h2>
        <Button 
          onClick={onRunScheduler}
          className="bg-judicial hover:bg-judicial/90 text-judicial-foreground"
        >
          <Gavel className="h-4 w-4 mr-2" />
          Run AI Scheduler
        </Button>
      </div>

      {/* Scheduled Hearings */}
      <Card>
        <CardHeader className="bg-success/10 border-b">
          <CardTitle className="flex items-center gap-2 text-success">
            <Calendar className="h-5 w-5" />
            Scheduled Hearings ({scheduledHearings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {scheduledHearings.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No hearings scheduled yet. Add petitions and run the scheduler.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {scheduledHearings
                .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                .map((hearing) => (
                  <div key={hearing.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getPetitionTypeIcon(hearing.petition.petitionType)}
                          </span>
                          <h3 className="font-semibold">{hearing.petition.caseNumber}</h3>
                          <Badge className={getPriorityColor(hearing.petition.priority)}>
                            {hearing.petition.priority}
                          </Badge>
                          {hearing.petition.isBailable && (
                            <Badge variant="outline" className="text-xs">Bailable</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(hearing.scheduledDate, 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {hearing.timeSlot.startTime} - {hearing.timeSlot.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {hearing.timeSlot.judgeName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {hearing.timeSlot.courtroom}
                          </div>
                        </div>
                        
                        <p className="text-sm">
                          <strong>Petitioner:</strong> {hearing.petition.petitionerName} | 
                          <strong> Lawyer:</strong> {hearing.petition.lawyerName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unscheduled Petitions */}
      {unscheduledPetitions.length > 0 && (
        <Card>
          <CardHeader className="bg-warning/10 border-b">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Unscheduled Petitions ({unscheduledPetitions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {unscheduledPetitions
                .sort((a, b) => {
                  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((petition) => (
                  <div key={petition.id} className="p-4 hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getPetitionTypeIcon(petition.petitionType)}
                          </span>
                          <h3 className="font-semibold">{petition.caseNumber}</h3>
                          <Badge className={getPriorityColor(petition.priority)}>
                            {petition.priority}
                          </Badge>
                          {petition.isBailable && (
                            <Badge variant="outline" className="text-xs">
                              Bailable (No Weekends)
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          <strong>Petitioner:</strong> {petition.petitionerName} | 
                          <strong> Duration:</strong> {petition.estimatedDuration} mins |
                          <strong> Lawyer:</strong> {petition.lawyerName}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          Filed: {format(petition.filingDate, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};