import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch cart items
export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async ({ apiurl, access_token }) => {
  const response = await fetch(`${apiurl}/cart/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }

  const data = await response.json();
  return data;
});


export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ apiurl, access_token,updateObj }, { rejectWithValue }) => {
    console.log("cartslic obj",apiurl,updateObj)
    try {
      const response = await fetch(`${apiurl}/cart/`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(updateObj)
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
    return data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Action to remove an item from the cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ apiurl, access_token, itemId }) => {
    console.log("itemId",itemId);
    const response = await fetch(`${apiurl}/cart/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(itemId),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }

    const data = await response.json(); 
    return itemId; 
  }
);


// Add item to cart
export const addCartItem = createAsyncThunk("cart/addCartItem", async ({ apiurl, access_token, item }) => {
  const response = await fetch(`${apiurl}/cart/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
    body: JSON.stringify(item), 
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  const data = await response.json();
  return data; 
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Handle fetchCartItems actions
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        console.log("cart payload", action.payload);
        state.items = action.payload; // Set the items from fetched data
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle addCartItem actions
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Item added to cart", action.payload);
       
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
