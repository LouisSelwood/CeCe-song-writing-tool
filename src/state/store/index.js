import { initialState } from "./initialState.js"
import { actions } from "./actions.js"
import { createStore } from "./createStore.js"
import { domain } from "../../domain/index.js"

export const store = createStore(initialState, actions, domain)
