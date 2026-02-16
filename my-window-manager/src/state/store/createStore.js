export function createStore(initialState, actions, domain) {
  const state = structuredClone(initialState)

  const boundActions = {}

  for (const [name, action] of Object.entries(actions)) {
    boundActions[name] = (...args) => {
      const fn = action(...args)
      return fn(state, domain, boundActions)
    }
  }

  return {
    state,
    actions: boundActions,
    getState: () => state
  }
}
