import { createContext, useContext, useEffect, useState } from 'react';

// project imports
import { APIURL } from '../../constant';

// third party
import axios from 'axios';
import { toast } from 'react-toastify';
// Create a context to manage API-related state and functions
const ApiContext = createContext();

// Toast success handler
const handleSuccess = (value) => {
  toast.success(value);
};

const handleError = (value) => {
  // Assuming you have the ID from the POST API response
  toast.error(value ? value :"Something Went Wrong");
};

// Context provider component for managing API-related state
export const ApiProvider = ({ children }) => {
  const [rows, setRows] = useState([]);
  const [autocomplete, setAutoComplete] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // hard coded login without db
  const handleUserLogin = async (username, password, setAccount, navigate) => {
    try {
      const response = await axios.post(`${APIURL}/login`, { username, password });
      const token = response.data.token;
      // Store the token in the session
      sessionStorage.setItem('token', token);

      // Reset the input fields
      setAccount({ username: "", password: "" });

      // Redirect to the home page
      navigate("/home");
      // return token;
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  // Function to fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${APIURL}/users`);
      setRows(response.data);
      if (response.data.length > 0) {
        const combinedDataArray = response.data.map(user => ({ name: `${user.firstName} ${user.lastName}`, _id: user._id }))
          .concat(response.data.map(user => ({ name: user.uniqueId, _id: user._id })));
        setAutoComplete(combinedDataArray);
      }
    } catch (err) {
      setError(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch deleted data from the API
  const deletedFetchData = async () => {
    setLoading(true);
    setError(null);
    setAutoComplete([]);
    try {
      const response = await axios.get(`${APIURL}/deletedUsers`);
      setRows(response.data);
      if (response.data.length > 0) {
        const combinedDataArray = response.data.map(user => ({ name: `${user.firstName} ${user.lastName}`, _id: user._id }))
          .concat(response.data.map(user => ({ name: user.uniqueId, _id: user._id })));
        setAutoComplete(combinedDataArray);
      }
    } catch (err) {
      setError(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };


  // Function to fetch a single user's data by ID
  const fetchSingleData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${APIURL}/users/${id}`);
      setRows([response.data]);
    } catch (err) {
      setError(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete or (disable or enable based on condition) users based on selected IDs

  const deleteAllUsers = async (deleteUsers, type, handleCloseDelete) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${APIURL}/users/bulk`, { data: { ids: deleteUsers.ids, delete: deleteUsers.delete } });
      if (type === "single") {
        handleCloseDelete();
        handleSuccess('User Deleted Successfully');
        fetchData();
      } else if (type === "enableAll") {
        setSelected([]);
        handleSuccess(`All Users Enabled Successfully`);
        deletedFetchData();
      } else if (type === "enableSingle") {
        handleSuccess(`User Enabled Successfully`);
        deletedFetchData();
      } else {
        setSelected([]);
        handleSuccess(`All Users Deleted Successfully`);
        fetchData();
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  // Effect hook to fetch data on component mount
  useEffect(() => {
    fetchData();
    deletedFetchData();
  }, []);


  // Function to post new user data to the API
  const postApiData = async (requestData, setSubmitting, handleClose) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${APIURL}/users`, requestData);
      fetchData();
      setSubmitting();
      handleSuccess(`ID ${response.data._id} created successfully!`);
      handleClose();
    } catch (err) {
      setError(err);
      if(err.response.status == 400) {
        handleError(err.response.data.error)
      } else {
        console.log(err)
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to update user data on the API
  const putApiData = async (requestData, id, setSubmitting, handleClose) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${APIURL}/users/${id}`, requestData);
      fetchData();
      setSubmitting();
      handleSuccess(`ID ${id} Edited successfully!`);
      handleClose();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // formate dateValue for showing porpose
  const formateDate = value => {
    // Convert the string to a Date object
    let dateObject = new Date(value);

    // Check if the dateObject is valid
    if (isNaN(dateObject.getTime())) {
      // Handle invalid date, return an appropriate value or throw an error
      return 'Invalid Date';
    }

    let year = dateObject.getFullYear();
    let m = dateObject.getMonth() + 1;
    let month = m < 10 ? '0' + m : m;
    let dd = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : dateObject.getDate();

    let formattedDate = dd + '/' + month + '/' + year;
    return formattedDate;
  };

  return (
    <ApiContext.Provider value={{ handleUserLogin, rows, setRows, fetchData, deletedFetchData, autocomplete, fetchSingleData, selected, setSelected, deleteAllUsers, loading, error, postApiData, putApiData, formateDate }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};