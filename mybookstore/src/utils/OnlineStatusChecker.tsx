import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOnlineStatus } from '../slices/onlineStatusSlice';
import offlineStatus from '../assets/offlineStatus.png'


function OnlineStatusChecker() {
    const {isOnline} = useSelector((state:any)=> state.status);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <div className="online-status">
      {isOnline ? (
        ''
      ) : (
        // User is offline
        <div  style={{display:'flex', flexDirection:'column',alignItems:'center', justifyContent:'center'}}>
        <img src={offlineStatus} alt=""  style={{height:'20%', width:'20%'}}/>
        <p>
          You are currently offline. Please check your internet connection
          and try again.
        </p>
        </div>
      )}
    </div>
  );
}

export default OnlineStatusChecker;