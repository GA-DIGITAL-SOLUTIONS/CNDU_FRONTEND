import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch wishlist items
export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async ({ apiurl, access_token }) => {
    const response = await fetch(`${apiurl}/wishlist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch wishlist items");
    }
    const data = await response.json();
    return data;
  }
);



export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async ({ apiurl, access_token, itemId }) => {
    const response = await fetch(`${apiurl}/wishlist/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify({wishlist_item_id:itemId}),
    });

    if (!response.ok) {
      throw new Error("Failed to remove item from wishlist");
    }

    return itemId; // This will be used to update the Redux store
  }
);



// Add item to wishlist
export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async ({ apiurl, access_token, item }) => {
    const response = await fetch(`${apiurl}/wishlist/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message )
    }

    const data = await response.json();
    return data;
  }
);




const wishListSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
    addwishlistloading:false,
    addwishlisterror:null,
  },
  reducers: {
    // You can add additional non-async reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        // console.log("fetchWishlistItems items",action.payload.items)
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addWishlistItem.pending,(state,action)=>{
        state.addwishlistloading=true
        state.addwishlisterror=null
      })
      .addCase(addWishlistItem.fulfilled,(state,action)=>{
        state.addwishlistloading=false
        // console.log("addWishlistItem is full filled ")
      })
      .addCase(addWishlistItem.rejected,(state,action)=>{
        state.addwishlisterror = action.error.message;
      })
  },
});

export default wishListSlice.reducer;
