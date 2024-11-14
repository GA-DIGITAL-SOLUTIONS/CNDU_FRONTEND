// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// Replace with your actual API URL
const apiurl = process.env.REACT_APP_API_URL;

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch product by ID 
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async ({id,url}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/products/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// add Product 
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async ({formData,access_token}, { rejectWithValue }) => {
    console.log("from product slice",access_token,"products ",FormData)
    try {
      const response = await fetch(`${apiurl}/products/`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
        body: formData, 
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);

//delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({ id, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}/`, {
        method: 'DELETE', // Use DELETE method to delete a product
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      return id; 
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);


// update
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}/`, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message); // Return the error message
    }
  }
);


// Initial state for products slice
const initialState = {
  products: [],
  loading: false,
  error: null,
  singleproductloading:false,
  singleproducterror:null,
  singleproduct:{},
};

// Create the products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error state
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; 
        console.log(action.payload)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set the error message
      })
      // Handle adding a new product
      .addCase(addProduct.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Reset error state
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false; 
        // state.products =action.payload.
        // console.log(action.payload)
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(fetchProductById.pending, (state) => {
        state.singleproductloading=true
       
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.singleproduct=action.payload
        console.log("payload",action.payload)
        state.singleproductloading=false
      })
      .addCase(fetchProductById.  rejected, (state, action) => {
        state.singleproducterror=action.payload;
      })
  },
});

export default productsSlice.reducer; 
