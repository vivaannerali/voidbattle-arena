export const SNACKS = [
  { id: 'popcorn-small', name: 'Small Popcorn', short: 'Popcorn', model: 'popcorn', size: 0.82, kind: 'food', bite: 'You took a bite of your Popcorn!' },
  { id: 'popcorn-medium', name: 'Medium Popcorn', short: 'Popcorn', model: 'popcorn', size: 1, kind: 'food', bite: 'You took a bite of your Popcorn!' },
  { id: 'popcorn-large', name: 'Large Popcorn', short: 'Popcorn', model: 'popcorn', size: 1.24, kind: 'food', bite: 'You took a big bite of your Popcorn!' },
  { id: 'choc-top', name: 'Large Choc-Top', short: 'Choc-Top', model: 'choc', size: 1, kind: 'food', bite: 'You took a bite of your Choc-Top!' },
  { id: 'nachos', name: 'Nachos with Warm Cheese', short: 'Nachos', model: 'nachos', size: 1, kind: 'food', bite: 'You crunched into your Nachos with Warm Cheese!' },
  { id: 'soda', name: 'Ice-cold Soda', short: 'Soda', model: 'soda', size: 1, kind: 'drink', bite: 'You took a sip of your Ice-cold Soda!' },
  { id: 'sour-candy', name: 'Sour Candy Bag', short: 'Sour Candy', model: 'candy', size: 1, kind: 'food', bite: 'You popped a sour candy. Your face is now a lemon!' },
];

export const snackById = (id) => SNACKS.find((snack) => snack.id === id) || null;