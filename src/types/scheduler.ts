export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  judgeId: string;
  judgeName: string;
  courtroom: string;
  isAvailable: boolean;
}

export interface Petition {
  id: string;
  caseNumber: string;
  petitionerName: string;
  respondentName: string;
  petitionType: 'bail' | 'civil' | 'criminal' | 'constitutional' | 'writ';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  isBailable: boolean;
  filingDate: Date;
  estimatedDuration: number; // in minutes
  lawyerName: string;
  description: string;
  urgencyReason?: string;
}

export interface ScheduledHearing {
  id: string;
  petition: Petition;
  timeSlot: TimeSlot;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
}

export interface Judge {
  id: string;
  name: string;
  specialization: string[];
  availability: {
    [key: string]: { start: string; end: string }[];
  };
}