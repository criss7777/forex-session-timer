
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sessions, isSessionActive, getNextSessionStart } from '@/utils/forexSessions';
import SessionIndicator from './SessionIndicator';

const ForexClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentHour = currentTime.getHours();
  const nextSession = getNextSessionStart(currentHour);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-500 uppercase tracking-wide">Current Time</div>
        <div className="text-4xl font-bold">
          {format(currentTime, 'HH:mm:ss')}
        </div>
      </div>
      
      <div className="space-y-2">
        {sessions.map((session) => (
          <SessionIndicator
            key={session.name}
            name={session.name}
            isActive={isSessionActive(session, currentHour)}
            colorClass={session.color}
          />
        ))}
      </div>

      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-500">Next Session</div>
        <div className="font-medium">{nextSession.name}</div>
        <div className="text-sm text-gray-500">
          in {nextSession.hoursUntil} hour{nextSession.hoursUntil !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default ForexClock;
