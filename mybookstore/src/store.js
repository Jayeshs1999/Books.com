import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from './slices/cartSlice'

import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import onlineStatusSlice from "./slices/onlineStatusSlice";

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        status: onlineStatusSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store;
