// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { act } from 'react';
import { useSelector } from 'react-redux';

// Replace with your actual API URL
const apiurl = process.env.REACT_APP_API_URL;

// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const fetchFabrics = createAsyncThunk(
  'products/fetchFabrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/fabric`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchOfferProducts = createAsyncThunk(
  'products/fetchOfferProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/offerproducts`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchSarees = createAsyncThunk(
  'products/fetchSarees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/product`);// product is nothing but saree
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCollections = createAsyncThunk(
  'products/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/collections`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// fetch product by ID 
export const fetchSareeById = createAsyncThunk(
  'products/fetchSareeById',
  async ({id,url}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// fetch product by ID 
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async ({id,url}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// fetch product by ID 
export const fetchFabricById = createAsyncThunk(
  'products/fetchFabricById',
  async ({id,url}, { rejectWithValue }) => {
  console.log("fabric is fetching by id is ",id)

    try {
      const response = await fetch(`${url}/products/${id}`);
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// add Product 
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async ({formData,access_token}, { rejectWithValue }) => {
    console.log("from product slice",access_token,"products ",formData)
    try {
      const response = await fetch(`${apiurl}/products/`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
        body: formData, 
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);



// add Product 
export const addCombination = createAsyncThunk( 
  'products/addCombination',
  async ({formData,access_token}, { rejectWithValue }) => {
    console.log("from product token",access_token,"products ",formData)
    try {
      const response = await fetch(`${apiurl}/outfits/`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
        body: formData, 
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);


export const updateCombination = createAsyncThunk( 
  'products/updateCombination',
  async ({formData,access_token,}, { rejectWithValue }) => {
    console.log("from product token",access_token,"products ",formData)
    try {
      const response = await fetch(`${apiurl}/outfits/`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
        body: formData, 
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);


export const deleteCombination = createAsyncThunk( 
  'products/deleteCombination',
  async ({access_token,id}, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/outfits/${id}`, {
        method: 'DELETE', 
        headers: {
          Authorization: `Bearer ${access_token}`, 
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message); 
    }
  }
);



export const fetchCombinations = createAsyncThunk(
  'products/fetchCombinations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/outfits/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch combinations`);
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      // Log error to help with debugging
      console.error('Error fetching combinations:', error);
      return rejectWithValue(error.message);
    }
  }
);



export const fetchCombinationById = createAsyncThunk(
  'products/fetchCombinationById',
  async ({apiurl,id}, { rejectWithValue }) => {
    console.log("id",id)
    try {
      const response = await fetch(`${apiurl}/outfits/${id}`);
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);







//delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({ id, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}/`, {
        method: 'DELETE', // Use DELETE method to delete a product
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');

      return id; 
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  }
);


// update
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData, access_token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiurl}/products/${id}/`, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message); // Return the error message
    }
  }
);


// Initial state for products slice
const initialState = {
  products: [],
  productsloading:false,
  productserror:null,
  fabrics:[],
  addproductloading:false,
  addproducterror:null,
  sarees:[],
  sareesloading:false,
  sareeserror:false,
  collections:[],
  collectionloading:false,
  collectionerror:null,
  fabricsloading: false,
  fabricserror: null,
  singleproduct:{},
  singleproductloading:false,
  singleproducterror:null,
  singleSaree:{},
  singlesareeloading:false,
  singlesareeerrror:null,
  singleFabric:{},
  singleFabricLoading:false,
  singleFabricerror:null,
  Combinations:[],
  loadingcombinations:false,
  errorcombinations:null,
  singlecombinationloading:false,
  singlecombiantionerror:null,
  singlecombination:{},
  offersloading:false,
  offerserror:false,
  offersproducts:[],
};

// Create the products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetSingleFabric:(state)=>{
      state.singleFabric = {};
    }
  },
  extraReducers: (builder) => {
    // Handle fetching products
    builder
    .addCase(fetchProductById.pending, (state) => {
      state.singleproductloading = true;
      state.singleproducterror = null; // Reset error state
    })
    .addCase(fetchProductById.fulfilled, (state, action) => {
      state.singleproductloading = false;
      state.singleproduct = action.payload; 
      console.log(action.payload)
    })
    .addCase(fetchProductById.rejected, (state, action) => {
      state.singleproductloading = false;
      state.singleproducterror = action.payload
        })
      .addCase(fetchProducts.pending, (state) => {
        state.productsloading = true;
        state.productserror = null; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsloading = false;
        state.products = action.payload; 
        console.log(action.payload)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsloading = false;
        state.productserror = action.payload; 
      })
      .addCase(fetchSarees.pending, (state) => {
        state.sareesloading=true
        state.sareeserror=null
      })
      .addCase(fetchSarees.fulfilled, (state, action) => {
        state.sarees = action.payload; 
        console.log("sarees in payload ",action.payload)
        state.sareesloading=false

      })
      .addCase(fetchSarees.rejected, (state, action) => {
        state.sareesloading=false
        state.sareeserror=action.error
      })
      .addCase(fetchCombinations.pending, (state) => {
        state.loadingcombinations=true
      })
      .addCase(fetchCombinations.fulfilled, (state, action) => {
        state.loadingcombinations=false
        state.Combinations=action.payload

      })
      .addCase(fetchCombinations.rejected, (state, action) => {
        state.loadingcombinations=false
        state.errorcombinations=action.payload
      })
      .addCase(fetchFabrics.pending, (state) => {
        state.fabricsloading = true;
        state.fabricserror = null; 
      })
      .addCase(fetchFabrics.fulfilled, (state, action) => {
        state.fabricsloading = false;
        state.fabrics = action.payload; 
        console.log(action.payload)
      })
      .addCase(fetchFabrics.rejected, (state, action) => {
        state.fabricsloading = false;
        state.fabricserror = action.payload; 
      })
      .addCase(fetchCollections.pending, (state) => {
        state.collectionloading = true;
        state.collectionerror = null; // Reset error state
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collectionloading = false;
        state.collections
         = action.payload; 
        console.log(action.payload)
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.collectionloading = false;
        state.collectionerror = action.payload; // Set the error message
      })
      // Handle adding a new product
      .addCase(addProduct.pending, (state) => {
        state.addproductloading = true; // Set loading state
        state.addproducterror = null; // Reset error state
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.addproductloading = false; 
        // state.products =action.payload.
        // console.log(action.payload)
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.addproductloading = false; 
        state.addproducterror = action.payload; 
      })
      .addCase(fetchSareeById.pending, (state) => {
        state.singlesareeloading=true
        state.singleFabricerror=null
       
      })
      .addCase(fetchSareeById.fulfilled, (state, action) => {
        state.singleSaree=action.payload
        console.log("payload",action.payload)
        state.singlesareeloading=false
      })
      .addCase(fetchSareeById.rejected, (state, action) => {
        state.singlesareeloading=true
        state.singlesareeerrror=action.payload


      })
      .addCase(fetchFabricById.pending, (state) => {
        state.singleFabric=null
        state.singleFabricLoading=true
      })
      .addCase(fetchFabricById.fulfilled, (state, action) => {
        state.singleFabricLoading=false
        state.singleFabric=action.payload
        console.log("payload",action.payload)
      })
      .addCase(fetchCombinationById.pending, (state) => {
        state.singlecombinationloading=true

      })
      .addCase(fetchCombinationById.fulfilled, (state, action) => {
        state.singlecombination=action.payload
        state.singlecombinationloading=false

      })
      .addCase(fetchCombinationById.rejected, (state, action) => {
        state.singlecombinationloading=false
        state.singlecombiantionerror=action.payload
      })
      .addCase(fetchOfferProducts.pending, (state) => {
        state.offersloading=true
        state.offerserror=null

      })
      .addCase(fetchOfferProducts.fulfilled, (state, action) => {
        state.offersproducts=action.payload
        state.offersloading=false

      })
      .addCase(fetchOfferProducts.rejected, (state, action) => {
        state.offersloading=false
        state.offerserror=action.payload
      })
  },
});
export const { resetSingleFabric } = productsSlice.actions;
export default productsSlice.reducer; 
