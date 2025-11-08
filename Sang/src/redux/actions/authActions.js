import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../constants/authConstants';
import { loginService } from '../services/authService';

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user, entityId) => ({
  type: LOGIN_SUCCESS,
  payload: { user, entityId },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const user = await loginService(credentials);
      dispatch(loginSuccess(user, credentials.entityId));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};