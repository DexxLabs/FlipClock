import React, { useEffect, useRef, useState } from 'react';
import './FlipClock.css';

/* ─────────────────────────────────────────────────────────────
   FlipCard  –  single digit with a mechanical flip animation.
   Shows the previous digit folding away and the new one
   unfurling — exactly like a real split-flap display.
───────────────────────────────────────────────────────────── */
function FlipCard({ digit }) {
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [animating, setAnimating] = useState(false);
  const prevDigitRef = useRef(digit);

  useEffect(() => {
    if (digit === prevDigitRef.current) return;

    setPrevious(prevDigitRef.current);
    setAnimating(true);

    // After animation (top: 220ms + bottom: 220ms), lock in new digit
    const t = setTimeout(() => {
      setCurrent(digit);
      setAnimating(false);
    }, 450);

    prevDigitRef.current = digit;
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <div className="flip-card">
      {/* ── Static faces (visible when not animating) ── */}
      {/* Top: shows the current digit's upper half */}
      <div className="flip-top">
        <span>{animating ? previous : current}</span>
      </div>
      {/* Bottom: shows the current digit's lower half */}
      <div className="flip-bottom">
        <span>{current}</span>
      </div>

      {/* ── Animated fold: old digit top flips down ── */}
      {animating && (
        <div className={`flip-fold-top animating`}>
          <span>{previous}</span>
        </div>
      )}

      {/* ── Animated fold: new digit bottom unfurls ── */}
      {animating && (
        <div className={`flip-fold-bottom animating`}>
          <span>{current}</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FlipUnit  –  a two-digit group (tens + units) as one slab.
───────────────────────────────────────────────────────────── */
function FlipUnit({ value, showAmPm, amPm }) {
  const padded = String(value).padStart(2, '0');
  const tens   = Number(padded[0]);
  const units  = Number(padded[1]);

  return (
    <div className="flip-unit">
      {showAmPm && <span className="ampm-badge">{amPm}</span>}
      <FlipCard digit={tens}  />
      <FlipCard digit={units} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FlipClock  –  HH : MM, 12-hour format, full-screen widget
───────────────────────────────────────────────────────────── */
export default function FlipClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const raw  = time.getHours();
  const amPm = raw >= 12 ? 'PM' : 'AM';
  const h12  = raw % 12 || 12;
  const m    = time.getMinutes();

  const pad = n => String(n).padStart(2, '0');

  return (
    <div
      className="flip-clock-page"
      role="timer"
      aria-label={`${pad(h12)}:${pad(m)} ${amPm}`}
    >
      <div className="clock-row">
        <FlipUnit value={h12} showAmPm amPm={amPm} />

        <div className="clock-colon">
          <span /><span />
        </div>

        <FlipUnit value={m} />
      </div>
    </div>
  );
}
