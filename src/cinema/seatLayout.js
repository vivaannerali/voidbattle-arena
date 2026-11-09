export const ROWS = 10;
export const COLUMNS = 14;
export const RISE = .75;
export const ROW_DEPTH = 2.2;
export const FRONT_Z = -10;
export const DEFAULT_SEAT = 'G7';
export const seatLabel = seat => `Row ${seat.id[0]} · Seat ${seat.column + 1}`;
export const SEATS = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
  const row = Math.floor(index / COLUMNS), column = index % COLUMNS;
  return { id: `${String.fromCharCode(65 + row)}${column + 1}`, row, column,
    x: (column - 6.5) * 1.55 + (column < 4 ? -1 : column > 9 ? 1 : 0),
    rowY: .15 + row * RISE, z: FRONT_Z + row * ROW_DEPTH, yaw: 0 };
});
export const getSeat = id => SEATS.find(seat => seat.id === id) || SEATS.find(seat => seat.id === DEFAULT_SEAT);
export function audienceSeats(selected) {
  return SEATS.filter(seat => seat.id !== selected.id && !(seat.row === selected.row - 1 && Math.abs(seat.x - selected.x) < 2))
    .sort((a, b) => ((a.row * 31 + a.column * 17) % 149) - ((b.row * 31 + b.column * 17) % 149)).slice(0, 100);
}