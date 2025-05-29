import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function LocationLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log('LocationLogger: location changed to', location.pathname, location.hash);
  }, [location]);

  return null; // This component doesn't render anything visible
}

export default LocationLogger; 