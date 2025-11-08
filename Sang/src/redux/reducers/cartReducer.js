import {
  SET_CART_COUNT,
  SET_WISHLIST_COUNT,
} from '../constants/cartConstants';

const initialState = {
  cartCount: 0,
  wishlistCount: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_COUNT:
      return {
        ...state,
        cartCount: action.payload,
      };
    case SET_WISHLIST_COUNT:
      return {
        ...state,
        wishlistCount: action.payload,
      };
    default:
      return state;
  }
};

export default cartReducer;