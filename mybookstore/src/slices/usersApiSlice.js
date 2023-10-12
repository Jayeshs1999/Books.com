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

        profile: builder.mutation({ //making post request
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            }),
        }),

        getUsers: builder.query({ //making post request
            query: () => ({
                url: `${USERS_URL}`,
                method: 'GET',
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5
        }),

        deleteUser: builder.mutation({ //making post request
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            }),
        }),

        getUserDetails: builder.query({ //making post request
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'GET',
            }),
            keepUnusedDataFor:5
        }),

        updatedUser: builder.mutation({ //making post request
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: 'PUT',
                body:data
            }),
            invalidatesTags: ['Users']
        }),

        checkUserExist: builder.mutation({ 
            query: (data) => ({
                url: `${USERS_URL}/forgetpassword`,
                method: 'POST',
                body: data
            }),
        }),

        forgetPassword: builder.mutation({ 
            query: (data) => ({
                url: `${USERS_URL}/forgetpassword`,
                method: 'PUT',
                body: data
            }),
        }),

    }),
})
//use and end with query
export const {useLoginMutation,
    useGetUsersQuery
     , useProfileMutation, 
     useLogoutMutation, 
     useDeleteUserMutation,
     useGetUserDetailsQuery,
     useUpdatedUserMutation,
     useCheckUserExistMutation,
     useForgetPasswordMutation,
     
     useRegisterMutation} = usersApiSlice;

