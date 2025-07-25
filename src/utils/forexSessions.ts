
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export interface Session {
  name: string;
  startHour: number;
  endHour: number;
  color: string;
  timezone: string;
}

export const sessions: Session[] = [
  {
    name: "Sydney/Tokyo",
    startHour: 22,
    endHour: 7,
    color: "text-session-asian",
    timezone: "Australia/Sydney",
  },
  {
    name: "London",
    startHour: 8,
    endHour: 16,
    color: "text-session-european",
    timezone: "Europe/London",
  },
  {
    name: "New York",
    startHour: 13,
    endHour: 21,
    color: "text-session-american",
    timezone: "America/New_York",
  },
];

const ALBANIA_TIMEZONE = "Europe/Tirane";

export const getSessionTimeInAlbania = (session: Session): { start: string; end: string; isActive: boolean } => {
  const now = new Date();
  const albaniaTime = toZonedTime(now, ALBANIA_TIMEZONE);
  const currentHour = albaniaTime.getHours();
  
  // Create times for start and end in Albania timezone
  const today = new Date(albaniaTime);
  today.setHours(session.startHour, 0, 0, 0);
  
  const endDay = new Date(albaniaTime);
  if (session.endHour < session.startHour) {
    endDay.setDate(endDay.getDate() + 1);
  }
  endDay.setHours(session.endHour, 0, 0, 0);
  
  return {
    start: formatInTimeZone(today, ALBANIA_TIMEZONE, 'HH:mm'),
    end: formatInTimeZone(endDay, ALBANIA_TIMEZONE, 'HH:mm'),
    isActive: isSessionActive(session, currentHour)
  };
};

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
