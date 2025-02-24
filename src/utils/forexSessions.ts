
import { format } from 'date-fns';

export interface Session {
  name: string;
  startHour: number;
  endHour: number;
  color: string;
}

export const sessions: Session[] = [
  {
    name: "Sydney/Tokyo",
    startHour: 22,
    endHour: 7,
    color: "text-session-asian",
  },
  {
    name: "London",
    startHour: 8,
    endHour: 16,
    color: "text-session-european",
  },
  {
    name: "New York",
    startHour: 13,
    endHour: 21,
    color: "text-session-american",
  },
];

export const isSessionActive = (session: Session, currentHour: number): boolean => {
  if (session.startHour > session.endHour) {
    // Session crosses midnight
    return currentHour >= session.startHour || currentHour < session.endHour;
  }
  return currentHour >= session.startHour && currentHour < session.endHour;
};

export const getNextSessionStart = (currentHour: number): { name: string; hoursUntil: number } => {
  let nextSession = sessions[0];
  let minHoursUntil = 24;

  sessions.forEach((session) => {
    let hoursUntil;
    if (currentHour >= session.startHour) {
      hoursUntil = 24 - currentHour + session.startHour;
    } else {
      hoursUntil = session.startHour - currentHour;
    }
    
    if (hoursUntil < minHoursUntil) {
      minHoursUntil = hoursUntil;
      nextSession = session;
    }
  });

  return { name: nextSession.name, hoursUntil: minHoursUntil };
};
