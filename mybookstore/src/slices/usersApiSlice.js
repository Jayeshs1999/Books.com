import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({ //making post request
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),

        register: builder.mutation({ //making post request
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            }),
        }),

        logout: builder.mutation({ //making post request
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
 
    }),
})
//use and end with query
export const {useLoginMutation, useLogoutMutation, useRegisterMutation} = usersApiSlice;

