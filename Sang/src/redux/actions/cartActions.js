import {
  SET_CART_COUNT,
  SET_WISHLIST_COUNT,
} from '../constants/cartConstants';
import { getCartist, getWishist } from '../services/productService';

export const setCartCount = (count) => ({
  type: SET_CART_COUNT,
  payload: count,
});

export const setWishlistCount = (count) => ({
  type: SET_WISHLIST_COUNT,
  payload: count,
});

export const fetchCartCount = () => {
  return async (dispatch) => {
    try {
      const res = await getCartist();
      const parsedResult = JSON.parse(res.result);
      const count = parsedResult?.Data ? parsedResult.Data.length : 0;
      dispatch(setCartCount(count));
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };
};

export const fetchWishlistCount = () => {
  return async (dispatch) => {
    try {
      const res = await getWishist();
      const parsedResult = JSON.parse(res.result);
      const count = parsedResult?.Data ? parsedResult.Data.length : 0;
      dispatch(setWishlistCount(count));
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };
};