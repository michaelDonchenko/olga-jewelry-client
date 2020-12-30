import {
  LOGOUT,
  LOGIN_USER,
  REGISTER_USER,
  REFRESH_TOKEN,
} from '../types/userTypes'

export const userReducer = (state = null, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return action.payload
    case REGISTER_USER:
      return action.payload
    case LOGOUT:
      return action.payload
    case REFRESH_TOKEN:
      return action.payload
    default:
      return state
  }
}
