// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Replace with your actual API URL
const apiurl = process.env.REACT_APP_API_URL;

// Async thunk to perform a search request
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ apiurl,access_token,query }, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query cannot be empty.');
      }
      // Send a GET request to the search endpoint with the query parameter
      const response = await fetch(`${apiurl}/search?query=${query}`);
      if (!response.ok) throw new Error('Failed to fetch search results');

      // Parse the JSON response
      const data = await response.json();
      return data; // Return the successful search results
    } catch (error) {
      // Handle errors by rejecting with the error message
      return rejectWithValue(error.message);
    }
  }
);
const productsSlice = createSlice({
  name: 'searchproducts',
  initialState: {
    searchResults: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload; // Store the search results
        console.log(action.payload)
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default productsSlice.reducer;
