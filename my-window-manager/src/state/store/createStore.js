export function createStore(initialState, actions, selectors, domain) {
  const state = structuredClone(initialState)
  let listeners = [];

  //Publisher: notifies and/or updates each subscribed function/component when the state mutates.
  function notify() {
    for (const fn of listeners) fn(state);
  }

  //Subscriber: subscribes a function to recieve updates of state changes from the publisher
  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  }

  //binds the actions into a single dictionary
  const boundActions = {}

  for (const [name, action] of Object.entries(actions)) {
    boundActions[name] = (...args) => {
      const fn = action(...args);

      //actions mutate the state directly
      const result = fn(state, domain, boundActions);

      //calls publisher
      notify();
      state.app.version++;
      //return result if action returns a value
      return result;
    };
  }


  return {
    state,
    actions: boundActions,
    selectors: selectors,
    domain: domain,
    getState: () => state,
    subscribe
  }
}
