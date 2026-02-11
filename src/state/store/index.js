import { initialState } from "./initialState"
import { actions } from "./actions"
import { createStore } from "./createStore"
import { domain } from "../../domain"

export const store = createStore(initialState, actions, domain)
