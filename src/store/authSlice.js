import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiurl = process.env.REACT_APP_API_URL;


const initialState = {
  apiurl:process.env.REACT_APP_API_URL,
  user: null,
  access_token: sessionStorage.getItem("access_token") || null,
  userRole: sessionStorage.getItem("userRole") || null, // Store user role from session
  loading: false,
  error: null,
};

console.log(apiurl)

// Async thunk for user signup
export const signup = createAsyncThunk("auth/signup", async (formData) => {
  console.log(formData,typeof formData)
  const response = await fetch(`${apiurl}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
   
  });
  console.log(initialState.user)

  if (!response.ok) {
    throw new Error("Signup failed");
  }
  const data= await response.json(); 

  // sessionStorage.setItem("access_token", data.access_token); 
  // sessionStorage.setItem("userRole",'user');
  
});

// Async thunk for user login
export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await fetch(`${apiurl}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  const data= await response.json();
  sessionStorage.setItem("access_token", data.access_token); 
  sessionStorage.setItem("userRole", data.data.role);

  return data 
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.access_token = null;
      state.userRole = null;
      state.user = null;
      
      // Clear sessionStorage
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("userRole");
    },
  },
  extraReducers: (builder) => {
    // Signup handling
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data after signup
        console.log("signuppayload",action.payload)
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Login handling
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data after login
      
    
        if (action.payload) {
            console.log("login payload store the access_token token here in the session action.payload is : ", action.payload);
        }
    })
    
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

