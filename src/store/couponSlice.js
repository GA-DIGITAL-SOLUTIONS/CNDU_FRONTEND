// src/store/couponSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const validateCoupon = createAsyncThunk(
  "coupon/validate",
  async ({ apiurl, access_token, code, payment_method }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiurl}/coupons/validate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ code, payment_method }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ message: "Network error. Please try again." });
    }
  }
);

export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async ({ apiurl, access_token, code, payment_method }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiurl}/coupons/apply/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ code, payment_method }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { ...data, code };
    } catch (err) {
      return rejectWithValue({ message: "Network error. Please try again." });
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "coupon/remove",
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiurl}/coupons/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ message: "Network error. Please try again." });
    }
  }
);

export const fetchAvailableCoupons = createAsyncThunk(
  "coupon/available",
  async ({ apiurl, access_token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${apiurl}/coupons/available/`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ message: "Network error." });
    }
  }
);

// ─── Error Code → Human-readable Messages ─────────────────────────────────────

export const COUPON_ERROR_MESSAGES = {
  COUPON_NOT_FOUND: "Invalid coupon code.",
  COUPON_EXPIRED: "This coupon has expired.",
  COUPON_INACTIVE: "This coupon is currently inactive.",
  MIN_CART_NOT_MET: "Your cart total is below the minimum required for this coupon.",
  USAGE_LIMIT_EXCEEDED: "This coupon has reached its usage limit.",
  USER_LIMIT_EXCEEDED: "You've already used this coupon.",
  NEW_USER_ONLY: "This coupon is for new users only.",
  CATEGORY_MISMATCH: "No eligible items in your cart for this coupon.",
  PAYMENT_METHOD_INVALID: "This coupon isn't valid for the selected payment method.",
  USER_NOT_ELIGIBLE: "You are not eligible for this coupon.",
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    // Applied coupon state
    appliedCoupon: null,      // { code, coupon_id, discount_amount, message }
    discountAmount: 0,

    // Validation preview (before apply)
    validatedCoupon: null,    // same shape as appliedCoupon
    validating: false,

    // Loading / error for apply/remove
    loading: false,
    error: null,              // error_code string (key into COUPON_ERROR_MESSAGES)
    errorMessage: null,       // human-readable string

    // Available coupons for auto-suggest
    availableCoupons: [],
    loadingAvailable: false,
  },
  reducers: {
    clearCouponError(state) {
      state.error = null;
      state.errorMessage = null;
    },
    resetCoupon(state) {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.validatedCoupon = null;
      state.error = null;
      state.errorMessage = null;
    },
    // Hydrate from cart API on load (when cart already has a coupon applied)
    hydrateCouponFromCart(state, action) {
      const { applied_coupons, coupon_discount } = action.payload;
      if (applied_coupons?.length > 0) {
        // We track the primary/last applied coupon in appliedCoupon, 
        // but the total savings in discountAmount
        state.appliedCoupon = applied_coupons[applied_coupons.length - 1];
        state.discountAmount = parseFloat(coupon_discount) || 0;
      } else {
        state.appliedCoupon = null;
        state.discountAmount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    // ── Validate ──
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.validating = true;
        state.validatedCoupon = null;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validating = false;
        state.validatedCoupon = {
          code: action.payload.code,
          discount_amount: parseFloat(action.payload.discount_amount),
          message: action.payload.message,
        };
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.validating = false;
        state.validatedCoupon = null;
        state.error = action.payload?.error_code || "UNKNOWN";
        state.errorMessage =
          action.payload?.message ||
          COUPON_ERROR_MESSAGES[action.payload?.error_code] ||
          "Invalid coupon.";
      });

    // ── Apply ──
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = {
          code: action.payload.code,
          coupon_id: action.payload.coupon_id,
          discount_amount: parseFloat(action.payload.discount_amount),
          message: action.payload.message,
        };
        state.discountAmount = parseFloat(action.payload.discount_amount);
        state.validatedCoupon = null;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error_code || "UNKNOWN";
        state.errorMessage =
          action.payload?.message ||
          COUPON_ERROR_MESSAGES[action.payload?.error_code] ||
          "Could not apply coupon.";
      });

    // ── Remove ──
    builder
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.loading = false;
        state.appliedCoupon = null;
        state.discountAmount = 0;
        state.validatedCoupon = null;
        state.error = null;
        state.errorMessage = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.error || "Could not remove coupon.";
      });

    // ── Available Coupons ──
    builder
      .addCase(fetchAvailableCoupons.pending, (state) => {
        state.loadingAvailable = true;
      })
      .addCase(fetchAvailableCoupons.fulfilled, (state, action) => {
        state.loadingAvailable = false;
        state.availableCoupons = action.payload.coupons || [];
      })
      .addCase(fetchAvailableCoupons.rejected, (state) => {
        state.loadingAvailable = false;
      });
  },
});

export const { clearCouponError, resetCoupon, hydrateCouponFromCart } = couponSlice.actions;
export default couponSlice.reducer;
