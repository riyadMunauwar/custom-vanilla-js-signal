import { createSignal, createEffect, createMemo } from './signal.js';

const [count, setCount] = createSignal(0);
const double = createMemo(() => count() * 2);

createEffect(() => {
  console.log(`Count: ${count()}, Double: ${double()}`);
});

setCount(5); // Will log: Count: 5, Double: 10