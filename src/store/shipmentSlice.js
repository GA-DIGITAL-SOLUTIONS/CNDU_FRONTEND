import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTimeEstimates = createAsyncThunk(
  'fetchTimeEstimates/fetch',
  async ({ apiurl, access_token, payload }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/fetch-time-estimates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch time estimates');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCostEstimates = createAsyncThunk(
  'fetchCostEstimates/fetch',
  async ({ apiurl, access_token, payload }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/fetch-cost-estimates/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cost estimates');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const shipmentSlice = createSlice({
  name: 'timeEstimates',
  initialState: {
    timeEstimate: null,
    timeEstimateloading: false,
    timeEstimateerror: null,
    constEsitmate: null,
    constEstimateloading: false,
    constEstimateerror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeEstimates.pending, (state) => {
        state.timeEstimateloading = true;
        state.timeEstimateerror = null;
      })
      .addCase(fetchTimeEstimates.fulfilled, (state, action) => {
        state.timeEstimateloading = false;
        state.timeEstimate = action.payload;
      })
      .addCase(fetchTimeEstimates.rejected, (state, action) => {
        state.timeEstimateloading = false;
        state.timeEstimateerror = action.payload;
      });

    builder
      .addCase(fetchCostEstimates.pending, (state) => {
        state.constEstimateloading = true;
        state.constEstimateerror = null;
      })
      .addCase(fetchCostEstimates.fulfilled, (state, action) => {
        state.constEstimateloading = false;
        console.log("after full fill of the fetchCostEstimates then ",action.payload)
        state.constEsitmate = action.payload;
      })
      .addCase(fetchCostEstimates.rejected, (state, action) => {
        state.constEstimateloading = false;
        state.constEstimateerror = action.payload;
      });
  },
});


export default shipmentSlice.reducer;
