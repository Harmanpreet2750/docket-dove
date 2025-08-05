import { TimeSlot, Petition, ScheduledHearing } from '@/types/scheduler';

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

export const getPriorityScore = (petition: Petition): number => {
  const priorityScores = {
    urgent: 100,
    high: 75,
    medium: 50,
    low: 25
  };
  
  let score = priorityScores[petition.priority];
  
  // Add urgency for older petitions
  const daysSinceFiling = Math.floor((Date.now() - petition.filingDate.getTime()) / (1000 * 60 * 60 * 24));
  score += Math.min(daysSinceFiling * 2, 50);
  
  return score;
};

export const canScheduleOnDate = (petition: Petition, date: Date): boolean => {
  // Bailable petitions cannot be scheduled on weekends
  if (petition.isBailable && isWeekend(date)) {
    return false;
  }
  
  return true;
};

export const scheduleHearings = (
  petitions: Petition[],
  availableSlots: TimeSlot[]
): { scheduled: ScheduledHearing[]; unscheduled: Petition[] } => {
  const scheduled: ScheduledHearing[] = [];
  const unscheduled: Petition[] = [];
  const usedSlots = new Set<string>();
  
  // Sort petitions by priority score (highest first)
  const sortedPetitions = [...petitions].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  
  for (const petition of sortedPetitions) {
    let isScheduled = false;
    
    // Find suitable slots for this petition
    const suitableSlots = availableSlots
      .filter(slot => 
        !usedSlots.has(slot.id) && 
        slot.isAvailable &&
        canScheduleOnDate(petition, slot.date)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Earlier dates first
    
    for (const slot of suitableSlots) {
      // Check if the slot duration is sufficient
      const slotDuration = calculateSlotDuration(slot.startTime, slot.endTime);
      if (slotDuration >= petition.estimatedDuration) {
        // Schedule the hearing
        scheduled.push({
          id: `hearing-${petition.id}-${slot.id}`,
          petition,
          timeSlot: slot,
          scheduledDate: slot.date,
          status: 'scheduled'
        });
        
        usedSlots.add(slot.id);
        isScheduled = true;
        break;
      }
    }
    
    if (!isScheduled) {
      unscheduled.push(petition);
    }
  }
  
  return { scheduled, unscheduled };
};

const calculateSlotDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60); // Return minutes
};

export const generateWeeklySlots = (
  judges: { id: string; name: string }[],
  startDate: Date,
  weeksCount: number = 4
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const courtrooms = ['Court 1', 'Court 2', 'Court 3', 'Court 4'];
  
  for (let week = 0; week < weeksCount; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      // Skip weekends for some slots, but keep some available for urgent non-bailable matters
      const isWeekendDay = isWeekend(currentDate);
      
      judges.forEach((judge, judgeIndex) => {
        const availableCourtrooms = isWeekendDay ? 
          courtrooms.slice(0, 2) : // Limited weekend availability
          courtrooms;
        
        availableCourtrooms.forEach((courtroom, roomIndex) => {
          // Generate morning and afternoon slots
          const morningSlot: TimeSlot = {
            id: `slot-${week}-${day}-${judgeIndex}-${roomIndex}-morning`,
            date: new Date(currentDate),
            startTime: '09:00',
            endTime: '12:00',
            judgeId: judge.id,
            judgeName: judge.name,
            courtroom,
            isAvailable: true
          };
          
          const afternoonSlot: TimeSlot = {
            id: `slot-${week}-${day}-${judgeIndex}-${roomIndex}-afternoon`,
            date: new Date(currentDate),
            startTime: '14:00',
            endTime: '17:00',
            judgeId: judge.id,
            judgeName: judge.name,
            courtroom,
            isAvailable: true
          };
          
          slots.push(morningSlot, afternoonSlot);
        });
      });
    }
  }
  
  return slots;
};
