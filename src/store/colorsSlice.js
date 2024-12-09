import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching colors
export const fetchColors = createAsyncThunk(
  'colors/fetchColors',
  async ({apiurl}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/colors`);
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
const colorsSlice = createSlice({
  name: 'colors',
  initialState: {
    havingcolors: [],
    colorsloading: false,
    colorserror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.colorsloading = true;
        state.colorserror = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.colorsloading = false;
        console.log("color papyload",action.payload)
        state.havingcolors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.colorsloading = false;
        state.colorserror = action.payload;
      });
  },
});

export default colorsSlice.reducer;
