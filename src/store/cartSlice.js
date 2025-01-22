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
    items: {},
    cartloading: false,
    carterror: null,
    removeCartitemloading: false,
    removeCartitmeerror: null,
    cartCount:0,
    addCartItemloading:false,
    addCartItemerror:null
  },
  
  extraReducers: (builder) => {
    // Handle fetchCartItems actions
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.cartloading = true;
        state.carterror = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartloading = false;
        console.log("cart payload", action.payload);
        state.items = action.payload; 
        console.log(action.payload.items?.length)
        state.cartCount=action?.payload?.items?.length
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.cartloading = false;
        state.carterror = action.error.message;
      })
      // Handle addCartItem actions
      .addCase(addCartItem.pending, (state) => {
        state.addCartItemloading = true;
        state.addCartItemerror = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.addCartItemloading = false;
        console.log("Item added to cart", action.payload);
       
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.addCartItemloading = false;
        state.addCartItemerror = action.error.message;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.removeCartitemloading = true;
        state.removeCartitmeerror = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removeCartitemloading = false;
        console.log("Item added to cart", action.payload);
       
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removeCartitemloading = false;
        state.removeCartitmeerror = action.error.message;
      });
  },
});

// Export actions and reducer
export const { addToCart ,updateCartCount} = cartSlice.actions;
export default cartSlice.reducer;
