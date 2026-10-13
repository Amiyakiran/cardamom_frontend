import { serverUrl } from './serverUrl'; // Import the server URL
import { commonApi } from './commonApi'; // Import the common API function

//common request

//register api
export const registerApi = async (body) => {
  try {
    return await commonApi("POST", `${serverUrl}/register`, body);

  } catch (error) {
    return error;
  }
};

//login api
export const loginApi = async (body) => {
  try {
    return await commonApi("POST", `${serverUrl}/login`, body);

  } catch (error) {
    return error;
  }
}
//to get the username and email of the logged in user
export const getMeApi = async () => {
  try {
    return await commonApi("GET", `${serverUrl}/me`);
  } catch (error) {
    return error;
  }
}

//logout api
export const logoutApi = async () => {
  try {
    return await commonApi("POST", `${serverUrl}/logout`);
  } catch (error) {
    return error;
  }
}

//googlelogin
export const googleLoginApi = async (body) => {
  try {
    return await commonApi("POST", `${serverUrl}/google_login`, body);

  } catch (error) {
    return error;
  }
}

//forgotPassword
export const forgotPasswordApi = async (body) => {
  try {
    return await commonApi("POST", `${serverUrl}/forgot_password`, body);

  } catch (error) {
    return error;
  }
}

//forgotPassword
export const resetPasswordApi = async (body, token) => {
  try {
    return await commonApi("POST", `${serverUrl}/reset_password/${token}`, body);

  } catch (error) {
    return error;
  }
}

//get all products

export const getAllProductApi = async (search) => {
  try {
    return await commonApi('GET', `${serverUrl}/all_products?search=${search}`)
  } catch (error) {
    return error
  }
}

//get a particular product
export const getAproductApi = async (id) => {
  try {
    return await commonApi('GET', `${serverUrl}/a_product/${id}`)

  } catch (error) {
    return error
  }
}

//get home products
export const getHomeProductsApi = async () => {
  try {
    return await commonApi('GET', `${serverUrl}/home_products`)
  } catch (error) {
    return error
  }
}
//----------------------------------------------------------

//---------------------------customer--------------------------

//send message
export const sendMessageApi = async (body) => {
  try {
    return await commonApi('POST', `${serverUrl}/sendmessage`, body)

  } catch (error) {
    return error
  }
}

//add to wishlist
export const addToWishlistApi = async (body, userId) => {
  try {
    return await commonApi('POST', `${serverUrl}/add_to_wishlist/${userId}`, body)
  }
  catch (error) {
    return error
  }
}

//delete from wishlist
export const deleteFromWishlistApi = async (id, body) => {
  try {
    return await commonApi('DELETE', `${serverUrl}/delete_from_wishlist/${id}`, body)

  } catch (error) {
    return error
  }
}

//get all wishlist
export const getAllWishlistProductApi = async (userId) => {
  try {
    return await commonApi('GET', `${serverUrl}/wishlist/${userId}`)
  } catch (error) {
    return error
  }
}

//add to cart
export const addToCartApi = async (userId, body) => {
  try {
    return await commonApi('POST', `${serverUrl}/add_to_cart/${userId}`, body)
  } catch (error) {
    return error
  }
}

//get all cart items
export const getAllCartItemApi = async (userId) => {
  try {
    return await commonApi('GET', `${serverUrl}/all-cart-items/${userId}`)
  } catch (error) {
    return error
  }
}

//delete from cart
export const deleteFromCartApi = async (id, body) => {
  try {
    return await commonApi('DELETE', `${serverUrl}/delete_from_cart/${id}`, body)

  } catch (error) {
    return error
  }
}

//increment the product count

export const incrementProductCountApi = async (id, body) => {
  try {
    return await commonApi('PUT', `${serverUrl}/increment-count/${id}`, body)

  } catch (error) {
    return error
  }
}

//decrement the product count

export const decrementProductCountApi = async (id, body) => {
  try {
    return await commonApi('PUT', `${serverUrl}/decrement-count/${id}`, body)

  } catch (error) {
    return error
  }
}

//update the product quantity

export const updateProductQuantityApi = async (id, body) => {
  try {
    return await commonApi('PUT', `${serverUrl}/update-quantity/${id}`, body)

  } catch (error) {
    return error
  }
}

//update profile image

export const updateProfileImageApi = async (id, body, header) => {
  try {
    return await commonApi('PUT', `${serverUrl}/update-profile-image/${id}`, body, header)

  } catch (error) {
    return error
  }
}

//update the Address
export const UpdateAdressApi = async(id, body)=>{
   try {
    return await commonApi('PUT', `${serverUrl}/update-address/${id}`, body)

  } catch (error) {
    return error
  }
}

//delete the Address
export const deleteAddressApi = async(id, body)=>{
   try {
    return await commonApi('DELETE', `${serverUrl}/delete_address/${id}`, body)

  } catch (error) {
    return error
  }
}



//----------------------------------------------------------

//admin

//add blog
export const addBlogApi = async (body, reqHeader) => {
  try {
    return await commonApi('POST', `${serverUrl}/add-blog`, body, reqHeader)

  } catch (error) {
    return error
  }
}

//add products

export const addProductApi = async (body, reqHeader) => {
  try {
    return await commonApi('POST', `${serverUrl}/add-products`, body, reqHeader)

  } catch (error) {
    return error
  }
}

//delete product

export const deleteproductApi = async (id) => {
  try {
    return await commonApi('DELETE', `${serverUrl}/delete_product/${id}`)

  } catch (error) {
    return error
  }
}

//edit product

export const editproductApi = async (id, body, header) => {
  try {
    return await commonApi('PUT', `${serverUrl}/edit_product/${id}`, body, header)

  } catch (error) {
    return error
  }
}

//get all users
export const getAllUsersApi = async () => {
  try {
    return await commonApi('GET', `${serverUrl}/all_users`)

  } catch (error) {
    return error
  }
}

//delete a user
export const deleteAUsersApi = async (id) => {
  try {
    return await commonApi('DELETE', `${serverUrl}/delete_user/${id}`)

  } catch (error) {
    return error
  }
}