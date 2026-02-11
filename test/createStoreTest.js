import {createStore} from "../src/state/store/createStore.js";
import {initialState} from "../src/state/store/initialState.js";
import {actions} from "../src/state/store/actions.js";

export function createTestStore(overrides = {}) {
  const testState = structuredClone(initialState)

  // allow overriding parts of state for specific tests
  Object.assign(testState, overrides)

  const fakeDomain = {
    history: { validateSnapshot: x => x },
    chords: { validate: x => x },
    sequences: { validate: x => x }
  }

  return createStore(testState, actions, fakeDomain)
}
