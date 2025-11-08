import api from "./api"; 
import axios from 'axios';
import { showSuccess, showError } from "../../utils/alert";


// ✅ Get all products
export const getProducts = async ({ category, subCategory, itemBrand, pageSize, pageNumber, search, minPrice, maxPrice, sortColumn, isAscending, inStock } = {}) => {
  const response = await api.get("tag/getproducts", {
    params: {
      refreshFlag: true,
      pageSize : 12,
      pageNumber: pageNumber,
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      ...(itemBrand && { itemBrand }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      ...(sortColumn && { sortColumn }),
      ...(isAscending !== undefined && { isAscending }),
      ...(inStock !== undefined && { inStock }),
      search:search
    },
  });
  return response.data;
};

// ✅ Get subcategories by category
export const getSubCategoryByCategory = async (categoryId) => {
  const response = await api.get("tag/getsubcategorybycategory", {
    params: { category: categoryId },
  });
  return response.data;
};

export const regenerateTokens = async (refreshToken) => {
  const response = await api.get('/login/regeneratetokens', {
    params: { refreshToken },
    headers: {
      Accept: 'text/plain',
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  return response.data;
};

// ✅ Get product rate by productId and unitId
export const getProductRate = async (productId, unitId) => {
  const response = await api.get("tag/getproductrate", {
    params: { productId, unitId },
  });
  return response.data;
};

// ✅ Get master details by tagId
export const getMasterDetails = async (tagId) => {
  const response = await api.get("tag/getmasterdetails", {
    params: { tagId },
  });
  return response.data;
};

// ✅ Get stock by productId
export const getStock = async (productId) => {
  const response = await api.get("tag/getstock", {
    params: { product: productId },
  });
  return response.data;
};

// Remove duplicate function

// ✅ Get tag list by tagId
export const getTagList = async (tagId) => {
  const response = await api.get("tag/gettaglist", {
    params: { tagId },
  });
  return response.data;
};

// ✅ Get brands by category
export const getBrandsByCategory = async (category) => {
  const response = await api.get("tag/getbrandsbycategory", {
    params: { category },
  });
  return response.data;
};


export const getWishist = async () => {
  const response = await api.get("gsgtransaction/gettransactionsummary?docType=2");
  return response.data;
};

export const getCartist = async () => {
  const response = await api.get("gsgtransaction/gettransactionsummary?docType=3");
  return response.data;
};

export const getCustomerOverdue = async (payload) => {
  try {
    const response = await api.post("customer/checkcustomeroverdue", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });

    // Handle API response status
    if (response.data.status === "Success") {
      showSuccess("");
    } else {
      showError(response.data.message || "Something went wrong");
    }

    return response.data;
  } catch (err) {
    // Show backend-provided error if available
    const errorMessage =
      err.response?.data?.message || "";
    showError(errorMessage);
    throw err; // Optional: keep this if you want upstream code to handle it too
  }
};

export const addToWishlist = async (payload) => {
  try {
    const response = await api.post("gsgtransaction/upsertwishlist", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    showSuccess("Added to wishlist!");
    return response.data;
  } catch (err) {
    // Show backend-provided error if available
    const errorMessage =
      err.response?.data?.message || "";
    showError(errorMessage);
    throw err; // Optional: keep this if you want upstream code to handle it too
  }
};

export const getTransactionDetails = async (transId) => {
  try {
    const response = await api.get(`gsgtransaction/gettransactiondetails`, {
      params: {
        id: transId,
        docType: 3,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};
export const getOrderSummary = async (orderId) => {
  try {
    const response = await api.get(`gsgtransaction/gettransactiondetails`, {
      params: {
        id: orderId,
        docType: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};
export const getOrderList = async (pageNumber = 1) => {
  try {
    const response = await api.get(`gsgtransaction/gettransactionsummary`, {
      params: {
        docType: 1,
        pageNumber,
        pageSize: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};
export const getCustomerAddress  = async (customerId) => {
  try {
    const response = await api.get(`customer/getcustomeraddress`, {
      params: {
        customerId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};

export const getCountryList = async () => {
  try {
    const response = await axios.get(
      'http://103.120.178.195/Sang.GermanStandard.API/customer/getdefaulttaglist',
      {
        params: { tagId: 8 },
        headers: { accept: '*/*' },
      }
    );

    if (response.data.status === 'Success') {
      // parse result because API returns it as string
      const countries = JSON.parse(response.data.result);
      return countries.map((c) => ({
        code: c.Code.toLowerCase(), // convert to lowercase for consistency
        name: c.Name,
        Id: c.Id,
        flag: `https://flagcdn.com/w20/${c.Code.slice(0, 2).toLowerCase()}.png`, // generate flag URL dynamically
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};
 

// 🆕 Add to cart
export const addToCart = async (payload) => {
  try {
    const response = await api.post("gsgtransaction/upsertcart", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    showSuccess("Added to cart!");
    return response.data;
  } catch (err) {
    // Show backend-provided error if available
    const errorMessage =
      err.response?.data?.message || "";
    showError(errorMessage);
    throw err; // Optional: keep this if you want upstream code to handle it too
  }
};
export const updateCart = async (payload) => {
  try {
    const response = await api.post("gsgtransaction/upsertcart", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    showSuccess("Cart Updated!");
    return response.data;
  } catch (err) {
    showError("Failed to update cart");
    throw err;
  }
};


export const placeOrder = async (payload) => {
  try {
    const response = await api.post("gsgtransaction/upsertorder", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    showSuccess("Order placed successfully!");
    return response.data;
  } catch (err) {
    showError("Failed to place order");
    throw err;
  }
};

export const deleteTransaction = async (payload) => {
  try {
    const response = await api.delete(
      "gsgtransaction/deletetransaction",
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        data: payload, // axios DELETE needs payload in `data`
      }
    );

    showSuccess("Removed from Cart!");
    return response.data;
  } catch (err) {
    showError("Failed to delete transaction");
    throw err;
  }
};

export const deleteWishlist = async (transId) => {
  try {
    const payload = {
      docType: 2, // wishlist document type
      be: 0,
      idCollection: [{ id: transId }]
    };

    const response = await api.delete(
      "gsgtransaction/deletetransaction",
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        data: payload, // axios delete supports "data"
      }
    );
showSuccess("Removed from wishlist!");
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
