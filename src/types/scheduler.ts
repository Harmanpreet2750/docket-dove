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
  email: string;
  phone: string;
  specialization: string[];
  courtrooms: string[];
  workingHours: {
    [key: string]: { start: string; end: string; breaks: { start: string; end: string }[] };
  };
  unavailableDates: Date[];
  isActive: boolean;
}

export interface Courtroom {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  isActive: boolean;
}

export interface CourtCalendar {
  id: string;
  workingDays: string[];
  holidays: Date[];
  workingHours: { start: string; end: string };
  lunchBreak: { start: string; end: string };
  emergencySlots: boolean;
}