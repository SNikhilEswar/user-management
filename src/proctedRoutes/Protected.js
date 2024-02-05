import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({children}) => {

  const storedData = sessionStorage.getItem('token');

    if(!storedData) {
        return <Navigate to="/" replace/>
    }

  return children;
}

export default Protected