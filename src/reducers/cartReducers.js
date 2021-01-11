import { ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART } from '../types/cartTypes'

export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return action.payload
    case REMOVE_FROM_CART:
      return action.payload
    case EMPTY_CART:
      return []

    default:
      return state
  }
}
