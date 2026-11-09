import { useState } from 'react';
import { WALLET_BALANCE } from '@/cinema/cinemaProfile';
import { snackById } from '@/cinema/snacks';

export default function CinemaHud({ ticket, held, notice, onEat, docked = false }) {
  const [open, setOpen] = useState(false);
  const counts = held.reduce((map, id) => map.set(id, (map.get(id) || 0) + 1), new Map());

  return (
    <div className="cinema-hud">
      <div className="cinema-topbar">
        <button type="button" className="cinema-ticket" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          <span className="cinema-ticket-kicker">Premium Free Pass</span>
          <span className="cinema-ticket-title">IMAX 70MM · ULTIMATE ARENA</span>
          <span className="cinema-ticket-meta">Admit one · permanent · no expiry</span>
        </button>
        <div className="cinema-wallet">
          <span>Free Pass Wallet</span>
          <b>{WALLET_BALANCE}</b>
          <small>Simulated balance · everything costs $0.00</small>
        </div>
      </div>

      {open && ticket && (
        <div className="cinema-ticket-detail">
          <p><span>Pass</span><b>{ticket.tier}</b></p>
          <p><span>Ticket</span><b>{ticket.number}</b></p>
          <p><span>Issued</span><b>{new Date(ticket.issued).toLocaleDateString()}</b></p>
          <p><span>Valid</span><b>Forever · all five presentations</b></p>
          <p><span>Wallet</span><b>Infinite · simulated, not real money</b></p>
          <small>Saved on this device. Cinema audio starts on your first click.</small>
        </div>
      )}

      <div className={`cinema-shelf${docked ? ' cinema-shelf-docked' : ''}`}>
        <span className="cinema-shelf-label">Held snacks</span>
        {held.length === 0 && <small className="cinema-shelf-empty">Empty — visit the Candy Bar counter.</small>}
        <div className="cinema-shelf-items">
          {Array.from(counts.entries()).map(([id, count]) => {
            const snack = snackById(id);
            if (!snack) return null;
            return (
              <button type="button" key={id} className="cinema-snack" onClick={() => onEat(id)} title={snack.bite}>
                {snack.short}
                {count > 1 && <b>×{count}</b>}
              </button>
            );
          })}
        </div>
      </div>

      {notice && <div className="cinema-notice">{notice}</div>}
    </div>
  );
}