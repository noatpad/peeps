import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';
import { InfoCircle } from './Icons';

const initialTimer = (reset) => reset - Math.round(Date.now() / 1000);

const RateLimitBar = ({ title, rateLimit, refresh, creditText }) => {
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
        <div className="inline-flex items-center space-x-1">
          <a data-tip data-for={title}><InfoCircle size={18}/></a>
          <p><b>API Credits:</b> {title}</p>
        </div>
        <p>
          {usage > 0 ? (
            <em>{usage}/{limit}. Refreshes in {timerString}</em>
          ) : (
            <em>{usage}/{limit}</em>
          )}
        </p>
      </div>
      <div className="relative w-full h-2 rounded-full bg-white shadow overflow-hidden">
        <div className={`absolute left-0 inset-y-0 ${barColor} transition-all`} style={{ width: `${percent}%` }}/>
      </div>
      <ReactTooltip id={title} effect="solid" clickable delayHide={250} className="max-w-14rem text-center">
        <p>{creditText}</p>
        <p>
          <Link href="/faq#credits"><a className="italic underline"><b>What are API credits?</b></a></Link>
        </p>
      </ReactTooltip>
    </div>
  )
}

export default RateLimitBar;
