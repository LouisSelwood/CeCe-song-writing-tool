export function createStore(initialState, actions, domain) {
  const state = structuredClone(initialState)
  let listeners = [];

  function notify() {
    for (const fn of listeners) fn();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  }

  const boundActions = {}

  for (const [name, action] of Object.entries(actions)) {
    boundActions[name] = (...args) => {
      const fn = action(...args);

      // IMPORTANT: your actions mutate state directly
      fn(state, domain, boundActions);

      // notify React components
      notify();
    };
  }


  return {
    state,
    actions: boundActions,
    getState: () => state,
    subscribe
  }
}
