import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

const useInternetConnection = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
      } catch (error) {
        setIsConnected(false);
      }
    };

    const handleConnectivityChange = state => {
      setIsConnected(state.isConnected);
    };

    // Check the internet connection when the component mounts
    checkConnection();

    // Set up NetInfo listener for network changes
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};

export default useInternetConnection;
