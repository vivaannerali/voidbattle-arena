const KEY = 'imax70mm.profile.v1';

function ticketNumber() {
  const bytes = new Uint8Array(6);
  if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `IMAX-70MM-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function freshProfile() {
  return { ticket: { number: ticketNumber(), issued: new Date().toISOString(), tier: 'Premium Free Pass' }, snacks: [] };
}

export function readCinemaProfile() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return freshProfile();
    const parsed = JSON.parse(raw);
    if (!parsed?.ticket?.number) return freshProfile();
    return { ticket: parsed.ticket, snacks: Array.isArray(parsed.snacks) ? parsed.snacks.slice(0, 20) : [] };
  } catch (error) {
    return freshProfile();
  }
}

export function saveCinemaProfile(profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch (error) {
    /* storage can be blocked; the session still works */
  }
  return profile;
}

export const WALLET_BALANCE = '$999,999,999.00';