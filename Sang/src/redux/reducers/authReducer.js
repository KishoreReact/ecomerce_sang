import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../constants/authConstants';

const initialState = {
  loading: false,
  user: null,
  entityId: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      //localStorage.setItem('accessToken', action.payload.user.token);
      localStorage.setItem('entityId', action.payload.entityId);
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        entityId: action.payload.entityId,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        entityId: null,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('entityId');
      return initialState;
    default:
      return state;
  }
};

export default authReducer;