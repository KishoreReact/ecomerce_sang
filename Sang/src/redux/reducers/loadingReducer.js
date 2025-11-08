const initialState = {
  loading: 0,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return {
        ...state,
        loading: state.loading + 1,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: state.loading - 1,
      };
    default:
      return state;
  }
};

export default loadingReducer;