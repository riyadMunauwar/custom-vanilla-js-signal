//  Signal Implementation

let currentEffect;
const context = [];

function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  const read = () => {
    const runningEffect = context[context.length - 1];
    if (runningEffect) subscribers.add(runningEffect);
    return value;
  };

  const write = (newValue) => {
    if (value !== newValue) {
      value = newValue;
      queueMicrotask(() => {
        subscribers.forEach(sub => sub.execute());
      });
    }
  };

  return [read, write];
}

function createEffect(fn) {
  const effect = {
    execute() {
      subscribers.forEach(sub => sub.delete(this));
      context.push(this);
      try {
        fn();
      } finally {
        context.pop();
      }
    },
    dispose() {
      subscribers.forEach(sub => sub.delete(this));
    }
  };

  effect.execute();
  return effect.dispose;
}

function createMemo(fn) {
  const [get, set] = createSignal();
  createEffect(() => set(fn()));
  return get;
}

function batch(fn) {
  const prevContext = context.slice();
  context.length = 0;
  try {
    fn();
  } finally {
    context.push(...prevContext);
  }
}

function untrack(fn) {
  const prevContext = context.slice();
  context.length = 0;
  try {
    return fn();
  } finally {
    context.push(...prevContext);
  }
}

// Export the API
export {
  createSignal,
  createEffect,
  createMemo,
  batch,
  untrack
};