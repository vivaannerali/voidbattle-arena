import { useEffect, useRef } from 'react';
import { SEATS, ROWS, COLUMNS, getSeat, seatLabel } from '@/cinema/seatLayout';
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
    <div className="cinema-seat-screen">CURVED 70MM SCREEN</div>
    <div className="cinema-seat-map" aria-label="Choose a row and seat">
      {Array.from({ length: ROWS }, (_, row) => <div className="cinema-seat-row" key={row}><span aria-hidden="true">{String.fromCharCode(65 + row)}</span>{SEATS.slice(row * COLUMNS, (row + 1) * COLUMNS).map(seat => <button key={seat.id} type="button" data-seat={seat.id} aria-label={seatLabel(seat)} aria-pressed={seat.id === selected} tabIndex={seat.id === selected ? 0 : -1} onKeyDown={event => move(event, seat)} onClick={() => onSelect(seat.id)}>{seat.column + 1}</button>)}</div>)}
    </div>
    <p className="cinema-seat-help">Click a seat to preview the view. Arrow keys move between seats.<br/>100 fellow moviegoers · All seats available · No charge</p>
    <footer><strong>{seatLabel(current)}</strong><button type="button" className="cinema-seat-start" onClick={onStart}>Start movie</button><button type="button" onClick={onCancel}>Back to films</button></footer>
  </section></div>;
}