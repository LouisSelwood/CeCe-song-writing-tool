export function createStore(initialState, actions, domain) {
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
      fn(state, domain, boundActions);

      //calls publisher
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
