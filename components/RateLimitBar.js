import React, { useState, useEffect, useRef } from 'react';

const initialTimer = (reset) => reset - Math.round(Date.now() / 1000);

const RateLimitBar = ({ title, rateLimit, refresh }) => {
  const { limit, remaining, reset } = rateLimit;
  const [timer, setTimer] = useState(initialTimer(reset));
  const countdownRef = useRef(null);

  useEffect(() => {
    if (limit === remaining) { return }
    setTimer(initialTimer(reset));
    countdownRef.current = setInterval(() => { setTimer(x => x - 1) }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [rateLimit]);

  useEffect(() => {
    if (timer > 0) { return }
    refresh();
    clearInterval(countdownRef.current);
  }, [timer]);

  const usage = limit - remaining;
  const timerString = timer > 30 ? `${Math.ceil(timer / 60)} min.` : `${timer} sec.`
  const percent = usage / limit * 100;
  let barColor = 'bg-blue-400';
  if (percent >= 80) {
    barColor = 'bg-red-400';
  } else if (percent >= 50) {
    barColor = 'bg-yellow-400';
  }

  return (
    <div>
      <div className="flex justify-between">
        <p><b>API Credits:</b> {title}</p>
        {usage > 0 ? (
          <p><em>{usage}/{limit}. Refreshes in {timerString}</em></p>
        ) : (
          <p><em>{usage}/{limit}</em></p>
        )}
      </div>
      <div className="relative w-full h-2 rounded-full bg-white shadow overflow-hidden">
        <div className={`absolute left-0 inset-y-0 ${barColor} transition-all`} style={{ width: `${percent}%` }}/>
      </div>
    </div>
  )
}

export default RateLimitBar;
