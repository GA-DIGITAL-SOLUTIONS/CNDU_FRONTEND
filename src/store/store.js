
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import passwordReducer from './password/passwordSlice'
import productsReducer from'./productsSlice'
import cartReducer from './cartSlice'
import wishListReducer from './wishListSlice'
import orderReducer from './orderSlice'
// import outfitReducer from './OutfitSlice'
import outfitReducer from './OutfitSlice';
const store = configureStore({
  reducer: {
    auth: authReducer, 
    password: passwordReducer,
    products:productsReducer,
    cart:cartReducer,
    wishlist:wishListReducer,
    orders:orderReducer,
    outfits:outfitReducer,
  },
});

export default store;
