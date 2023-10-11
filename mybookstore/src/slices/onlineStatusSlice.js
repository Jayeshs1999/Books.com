import { createSlice } from '@reduxjs/toolkit';

const onlineStatusSlice = createSlice({
  name: 'onlineStatus',
  initialState: {
    isOnline: navigator.onLine,
  },
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnlineStatus } = onlineStatusSlice.actions;
export const selectOnlineStatus = (state) => state.onlineStatus.isOnline;

export default onlineStatusSlice.reducer;