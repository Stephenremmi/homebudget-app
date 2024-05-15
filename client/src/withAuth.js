import React, {useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

  const withAuth = (ComponentToProtect) => {
    return (props) => {
      const [loading, setLoading] = useState(true);
      const [redirect, setRedirect] = useState(false);
  
      useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await axios.get('/checkToken'); // Use GET for typical token checks
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
            setRedirect(true);
          }
        };
  
        checkAuth();
      }, []);
  
      return loading ? null : redirect ? <Redirect to="/login" /> : <ComponentToProtect {...props} />;
    };
  };

export default withAuth;