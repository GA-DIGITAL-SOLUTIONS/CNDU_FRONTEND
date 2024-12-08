import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching colors
export const fetchCategory = createAsyncThunk(
  'colors/fetchCategory',
  async ({apiurl}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch colors');
      }
      const data = await response.json();
      return data; // Assuming the API returns an array of colors
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const catogerySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    categoriesloading: false,
    categorieserror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.categoriesloading = true;
        state.categorieserror = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.categoriesloading = false;
        console.log("color papyload",action.payload)
        state.categories = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.categoriesloading = false;
        state.categorieserror = action.payload;
      });
  },
});

export default catogerySlice.reducer;
