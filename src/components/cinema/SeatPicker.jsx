import { useEffect, useRef } from 'react';
import { SEATS, ROWS, COLUMNS, DEFAULT_SEAT, getSeat, seatLabel } from '@/cinema/seatLayout';
import '@/components/cinema/seatPicker.css';

export default function SeatPicker({ selected, experience, onSelect, onStart, onCancel }) {
  const dialog = useRef(null), current = getSeat(selected);
  useEffect(() => {
    const before = document.activeElement;
    dialog.current?.querySelector('[aria-pressed="true"]')?.focus();
    return () => before?.isConnected && before.focus();
  }, []);
  const keys = event => {
    if (event.key === 'Escape') { event.preventDefault(); onCancel(); }
    if (event.key === 'Tab') {
      const controls = [...dialog.current.querySelectorAll('button:not([tabindex="-1"])')], index = controls.indexOf(document.activeElement);
      event.preventDefault(); controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
    }
  };
  const move = (event, seat) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLUMNS, ArrowDown: COLUMNS }[event.key];
    if (!step) return;
    event.preventDefault(); const next = SEATS[Math.max(0, Math.min(SEATS.length - 1, seat.row * COLUMNS + seat.column + step))];
    onSelect(next.id); dialog.current.querySelector(`[data-seat="${next.id}"]`)?.focus();
  };
  return <div className="cinema-seat-backdrop"><section className="cinema-seat-picker" role="dialog" aria-modal="true" aria-labelledby="seat-heading" ref={dialog} onKeyDown={keys}>
    <header><p>BED WARS CINEMA · AUDITORIUM 01</p><h2 id="seat-heading">Take your seat.</h2><span>{experience.marquee}</span></header>
    <div className="cinema-seat-screen">23M TALL · FULL-FRAME 1.43:1 · 70MM SIMULATION</div>
    <div className="cinema-seat-map" aria-label="Choose a row and seat">
      {Array.from({ length: ROWS }, (_, row) => <div className="cinema-seat-row" key={row}><span aria-hidden="true">{String.fromCharCode(65 + row)}</span>{SEATS.slice(row * COLUMNS, (row + 1) * COLUMNS).map(seat => <button key={seat.id} type="button" data-seat={seat.id} aria-label={`${seatLabel(seat)}${seat.id === DEFAULT_SEAT ? ', recommended sweet spot' : ''}`} title={seat.id === DEFAULT_SEAT ? 'Sweet spot: dead centre, two-thirds back' : seatLabel(seat)} aria-pressed={seat.id === selected} tabIndex={seat.id === selected ? 0 : -1} onKeyDown={event => move(event, seat)} onClick={() => onSelect(seat.id)}>{seat.column + 1}</button>)}</div>)}
    </div>
    <p className="cinema-seat-help"><button type="button" onClick={() => onSelect(DEFAULT_SEAT)}>Choose G8 · Recommended sweet spot</button><br/>Dead centre, two-thirds back. Click any seat to preview its sightline.<br/>100 moviegoers · 12 virtual speaker positions · Device-dependent audio</p>
    <footer><strong>{seatLabel(current)}</strong><button type="button" className="cinema-seat-start" onClick={onStart}>Start movie</button><button type="button" onClick={onCancel}>Back to films</button></footer>
  </section></div>;
}