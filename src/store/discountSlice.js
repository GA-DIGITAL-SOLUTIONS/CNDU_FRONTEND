import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for creating a discount
export const createDiscount = createAsyncThunk(
  'discounts/createDiscount',
  async ({apiurl,access_token,formData}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/discounts/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`, 
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create discount');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const deleteDiscount = createAsyncThunk(
  'discounts/deleteDiscount',
  async ({ apiurl, access_token, d_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/discounts/${d_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      });

      // Check if the response status is 204 (No Content)
      if (response.status === 204) {
        return { message: 'Discount deleted successfully' };
      }

      // If the response is not 204, try to parse the response as JSON
      if (!response.ok) {
        const errorData = await response.json(); // Handle the error response
        throw new Error(errorData?.message || 'Failed to delete discount');
      }

      // If the response has a body (e.g., status 200), parse and return it
      return await response.json();

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const fetchDiscounts = createAsyncThunk(
  'discounts/fetchDiscounts',
  async ({apiurl,access_token}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/discounts/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to create discount');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const discountsSlice = createSlice({
  name: 'discounts',
  initialState: {
    discounts: [],
    discountsloading: false,
    discountserror: null,
    creatediscountsloading:false,
    creatediscountserror: null,
  },
  reducers: {
    // You can add additional reducers for other actions if needed
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscounts.pending, (state) => {
        state.discountsloading = true;
        state.discountserror=null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.discountsloading = false;
        state.discounts=action.payload
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.discountsloading = false;
        state.discountserror = action.payload;
      })
      .addCase(createDiscount.pending, (state) => {
        state.creatediscountsloading = true;
        state.creatediscountserror=null;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.creatediscountsloading = false;
        state.discounts.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.creatediscountsloading = false;
        state.creatediscountserror = action.payload;
      });
  },
});

export const { resetError } = discountsSlice.actions;

export default discountsSlice.reducer;
