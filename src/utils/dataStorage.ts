import { Judge, Courtroom, CourtCalendar, Petition, TimeSlot, ScheduledHearing } from '@/types/scheduler';

// Local storage keys
const STORAGE_KEYS = {
  JUDGES: 'court_scheduler_judges',
  COURTROOMS: 'court_scheduler_courtrooms',
  CALENDAR: 'court_scheduler_calendar',
  PETITIONS: 'court_scheduler_petitions',
  TIME_SLOTS: 'court_scheduler_time_slots',
  SCHEDULED_HEARINGS: 'court_scheduler_scheduled_hearings'
};

// Default court calendar configuration
export const DEFAULT_COURT_CALENDAR: CourtCalendar = {
  id: 'default',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  holidays: [],
  workingHours: { start: '09:00', end: '17:00' },
  lunchBreak: { start: '13:00', end: '14:00' },
  emergencySlots: false
};

// Default judges for initial setup
export const DEFAULT_JUDGES: Judge[] = [
  {
    id: 'judge-1',
    name: 'Justice Sarah Martinez',
    email: 'sarah.martinez@court.gov',
    phone: '+1 (555) 101-2001',
    specialization: ['Criminal Law', 'Bail Matters'],
    courtrooms: ['Courtroom 1A'],
    workingHours: {
      'Monday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Tuesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Wednesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Thursday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Friday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] }
    },
    unavailableDates: [],
    isActive: true
  },
  {
    id: 'judge-2',
    name: 'Justice Michael Thompson',
    email: 'michael.thompson@court.gov',
    phone: '+1 (555) 101-2002',
    specialization: ['Civil Law', 'Constitutional Law'],
    courtrooms: ['Courtroom 2B'],
    workingHours: {
      'Monday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Tuesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Wednesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Thursday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'Friday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] }
    },
    unavailableDates: [],
    isActive: true
  }
];

// Default courtrooms
export const DEFAULT_COURTROOMS: Courtroom[] = [
  {
    id: 'courtroom-1',
    name: 'Courtroom 1A',
    capacity: 80,
    equipment: ['Audio System', 'Video Conferencing', 'Recording Equipment', 'Microphones', 'Security Cameras'],
    isActive: true
  },
  {
    id: 'courtroom-2',
    name: 'Courtroom 2B',
    capacity: 60,
    equipment: ['Audio System', 'Projector', 'Document Camera', 'Microphones', 'Wi-Fi'],
    isActive: true
  }
];

// Storage utilities
export const storage = {
  // Generic storage functions
  save: <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },

  // Specific data type functions
  saveJudges: (judges: Judge[]): void => {
    storage.save(STORAGE_KEYS.JUDGES, judges);
  },

  loadJudges: (): Judge[] => {
    return storage.load(STORAGE_KEYS.JUDGES, DEFAULT_JUDGES);
  },

  saveCourtrooms: (courtrooms: Courtroom[]): void => {
    storage.save(STORAGE_KEYS.COURTROOMS, courtrooms);
  },

  loadCourtrooms: (): Courtroom[] => {
    return storage.load(STORAGE_KEYS.COURTROOMS, DEFAULT_COURTROOMS);
  },

  saveCalendar: (calendar: CourtCalendar): void => {
    storage.save(STORAGE_KEYS.CALENDAR, calendar);
  },

  loadCalendar: (): CourtCalendar => {
    return storage.load(STORAGE_KEYS.CALENDAR, DEFAULT_COURT_CALENDAR);
  },

  savePetitions: (petitions: Petition[]): void => {
    storage.save(STORAGE_KEYS.PETITIONS, petitions);
  },

  loadPetitions: (): Petition[] => {
    return storage.load(STORAGE_KEYS.PETITIONS, []);
  },

  saveTimeSlots: (slots: TimeSlot[]): void => {
    storage.save(STORAGE_KEYS.TIME_SLOTS, slots);
  },

  loadTimeSlots: (): TimeSlot[] => {
    return storage.load(STORAGE_KEYS.TIME_SLOTS, []);
  },

  saveScheduledHearings: (hearings: ScheduledHearing[]): void => {
    storage.save(STORAGE_KEYS.SCHEDULED_HEARINGS, hearings);
  },

  loadScheduledHearings: (): ScheduledHearing[] => {
    return storage.load(STORAGE_KEYS.SCHEDULED_HEARINGS, []);
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Initialize with default data
  initializeDefaults: (): void => {
    if (!localStorage.getItem(STORAGE_KEYS.JUDGES)) {
      storage.saveJudges(DEFAULT_JUDGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURTROOMS)) {
      storage.saveCourtrooms(DEFAULT_COURTROOMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
      storage.saveCalendar(DEFAULT_COURT_CALENDAR);
    }
  }
};

// Priority detection utilities
export const priorityDetection = {
  detectUrgency: (petition: Petition): 'urgent' | 'high' | 'medium' | 'low' => {
    const urgentKeywords = [
      'habeas corpus', 'detention', 'custody', 'arrest', 'bail',
      'emergency', 'urgent', 'immediate', 'injunction', 'restraining'
    ];

    const highPriorityKeywords = [
      'constitutional', 'fundamental rights', 'writ', 'mandamus',
      'certiorari', 'prohibition', 'quo warranto'
    ];

    const description = petition.description.toLowerCase();
    const petitionerName = petition.petitionerName.toLowerCase();
    const respondentName = petition.respondentName.toLowerCase();
    const fullText = `${description} ${petitionerName} ${respondentName}`;

    // Check for urgent keywords
    if (urgentKeywords.some(keyword => fullText.includes(keyword))) {
      return 'urgent';
    }

    // Bail cases are typically high priority
    if (petition.petitionType === 'bail' || petition.isBailable) {
      return 'high';
    }

    // Constitutional and writ petitions are high priority
    if (petition.petitionType === 'constitutional' || petition.petitionType === 'writ') {
      return 'high';
    }

    // Check for high priority keywords
    if (highPriorityKeywords.some(keyword => fullText.includes(keyword))) {
      return 'high';
    }

    // Age-based priority escalation
    const daysSinceFiling = Math.floor(
      (new Date().getTime() - petition.filingDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceFiling > 30) {
      return 'high';
    } else if (daysSinceFiling > 14) {
      return 'medium';
    }

    return 'low';
  },

  generateUrgencyReason: (petition: Petition, detectedPriority: string): string => {
    if (detectedPriority !== 'urgent' && detectedPriority !== 'high') {
      return '';
    }

    const reasons = {
      bail: 'Accused in custody, fundamental right to liberty at stake',
      constitutional: 'Constitutional rights violation requiring immediate judicial intervention',
      writ: 'Fundamental rights enforcement matter',
      criminal: 'Time-sensitive criminal proceedings affecting personal liberty',
      civil: 'Matter involves irreparable harm or significant financial implications'
    };

    return reasons[petition.petitionType as keyof typeof reasons] || 
           'Time-sensitive matter requiring immediate judicial attention';
  }
};

// Export storage for external use
export default storage;