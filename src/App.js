import React from "react";
// material-ui
import CssBaseline from "@material-ui/core/CssBaseline";

// third party
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// project imports
import Users from "./components/Users";
import Login from "./components/Login";
import DeletedUsers from "./components/DeletedUsers";
import Protected from './proctedRoutes/Protected';
import { ApiProvider } from './components/Users/ApiContext';



function App() {
  return (
    <>
     {/* Apply global CSS baseline */}
      <CssBaseline />
       {/* Provide API context to components using the ApiProvider */}
      <ApiProvider>
         {/* Set up routing using BrowserRouter */}
        <Router>
          <Routes>
            <Route
              path="/home"
              element={<Protected><Users /></Protected>} />
            <Route
              path="/deleteUsers"
              element={<Protected> <DeletedUsers /></Protected>} />
            <Route
              path="/"
              element={<Login />}
            />
          <Route path="*" element={<Navigate to="/home" />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </ApiProvider>
        {/* Display Toast notifications */}
      <ToastContainer />
    </>
  );
}


export default App;