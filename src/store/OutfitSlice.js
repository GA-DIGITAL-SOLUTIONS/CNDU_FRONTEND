import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";




export const fetchOutfits=createAsyncThunk(
  'outfits/fetchOutfits',async({apiurl},{rejectWithValue})=>{
    try{
      const response=await fetch(`${apiurl}/outfits`);
      if(!response.ok) throw Error('Network response was not ok');
      const data=await response.json()
      return data
    }catch{
      return rejectWithValue('Failed to fetch outfits')
    }
  }
)

export const deleteOutfit = createAsyncThunk(
  'outfits/deleteOutfit', 
  async ({ apiurl, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/outfits/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete outfit');
      }
      // console.log("status",response.status )
      return { id };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete outfit');
    }
  }
);


export const addOutfit = createAsyncThunk('outfits/addOutfit',
  async ({ apiurl, formData }, { rejectWithValue }) => {
    // console.log("data is coming",formData)
    try {
      const response = await fetch(`${apiurl}/outfits/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add outfit');
      }

      const data = await response.json();
      // console.log("data",data)
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add outfit');
    }
  }
);




const initialState={
 outfits:[],
 loading: false,
 error: null,
 addoutfitloading:false,
 addoutfiterror:null,
}


const OutfitSlice = createSlice({
  name: 'outfits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutfits.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchOutfits.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action.payload",action.payload)
        state.outfits=action.payload

      })
      .addCase(fetchOutfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(addOutfit.pending,(state)=>{
        state.addoutfitloading = true;
        state.addoutfiterror = null;
      })
      .addCase(addOutfit.fulfilled,(state,action)=>{
        state.addoutfitloading = false;
        // console.log(action.payload)
      })
      .addCase(addOutfit.rejected,(state,action)=>{
        state.addoutfitloading = false;
        // console.log(action.payload)
      })
      .addCase(deleteOutfit.pending,(state)=>{
        // state.loading = true;
      })
      .addCase(deleteOutfit.fulfilled,(state,action)=>{
        // state.outfits = state.outfits.filter(outfit=>outfit.id !== action.payload)
      })
      .addCase(deleteOutfit.rejected,(state,action)=>{
        // console.log(action.payload)
      })
  },
});

export default OutfitSlice.reducer; 