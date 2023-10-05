import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from './slices/cartSlice'

import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store;
