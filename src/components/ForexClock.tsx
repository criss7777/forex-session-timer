
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { sessions, isSessionActive, getNextSessionStart, getSessionTimeInAlbania } from '@/utils/forexSessions';
import SessionIndicator from './SessionIndicator';
import { useToast } from '@/hooks/use-toast';

const ForexClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previousSessionStates, setPreviousSessionStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const albaniaTime = toZonedTime(currentTime, "Europe/Tirane");
    const currentHour = albaniaTime.getHours();
    const currentMinute = albaniaTime.getMinutes();
    
    sessions.forEach((session) => {
      const isActive = isSessionActive(session, currentHour);
      const wasActive = previousSessionStates[session.name];
      
      // Check for session start (transition from inactive to active)
      if (isActive && !wasActive && currentMinute === 0) {
        toast({
          title: `${session.name} Session Started`,
          description: `The ${session.name} forex trading session is now active!`,
          duration: 5000,
        });
      }
      
      // Check for session end (transition from active to inactive)
      if (!isActive && wasActive && currentMinute === 0) {
        toast({
          title: `${session.name} Session Ended`,
          description: `The ${session.name} forex trading session has closed.`,
          duration: 5000,
        });
      }
    });
    
    // Update previous states
    const newStates: Record<string, boolean> = {};
    sessions.forEach((session) => {
      newStates[session.name] = isSessionActive(session, currentHour);
    });
    setPreviousSessionStates(newStates);
  }, [currentTime, toast, previousSessionStates]);

  const albaniaTime = toZonedTime(currentTime, "Europe/Tirane");
  const currentHour = albaniaTime.getHours();
  const nextSession = getNextSessionStart(currentHour);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Albania Time</div>
          <div className="text-5xl font-bold text-foreground">
            {formatInTimeZone(currentTime, "Europe/Tirane", 'HH:mm:ss')}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatInTimeZone(currentTime, "Europe/Tirane", 'EEEE, MMMM d, yyyy')}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center text-foreground mb-4">Forex Trading Sessions</h2>
        <div className="grid gap-4">
          {sessions.map((session) => {
            const sessionTime = getSessionTimeInAlbania(session);
            return (
              <div
                key={session.name}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  sessionTime.isActive 
                    ? 'bg-primary/5 border-primary/20 shadow-md' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        sessionTime.isActive ? `${session.color} animate-pulse` : 'bg-muted-foreground/30'
                      }`}
                    />
                    <div>
                      <div className={`font-semibold ${sessionTime.isActive ? session.color : 'text-muted-foreground'}`}>
                        {session.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sessionTime.start} - {sessionTime.end} (Albania Time)
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    sessionTime.isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {sessionTime.isActive ? 'ACTIVE' : 'CLOSED'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center p-6 bg-muted/50 rounded-xl border">
        <div className="text-sm text-muted-foreground">Next Session</div>
        <div className="font-semibold text-lg text-foreground">{nextSession.name}</div>
        <div className="text-sm text-muted-foreground">
          Opens in {nextSession.hoursUntil} hour{nextSession.hoursUntil !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default ForexClock;
