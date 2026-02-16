// Push a new snapshot into history
export const pushHistory = (snapshot) => (state, domain, actions) => {
  const validated = domain.history.validateSnapshot(snapshot)

  if (state.history.present !== null) {
    state.history.past.push(state.history.present)
  }

  state.history.present = validated
  state.history.future = []

  actions.updateUndoRedoFlags()
}


// Undo the last snapshot
export const undo = () => (state, domain, actions) => {
  if (state.history.past.length === 0) return

  const previous = state.history.past.pop()
  state.history.future.unshift(state.history.present)
  state.history.present = previous

  actions.updateUndoRedoFlags()
}


// Redo the next snapshot
export const redo = () => (state, domain, actions) => {
  if (state.history.future.length === 0) return

  const next = state.history.future.shift()
  state.history.past.push(state.history.present)
  state.history.present = next

  actions.updateUndoRedoFlags()
}


// Replace present (used when loading a project)
export const setHistoryPresent = (snapshot) => (state, domain, actions) => {
  state.history.present = domain.history.validateSnapshot(snapshot)
  state.history.past = []
  state.history.future = []

  actions.updateUndoRedoFlags()
}