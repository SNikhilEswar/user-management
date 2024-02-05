import React from 'react';

// material-ui
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    makeStyles,
  } from "@material-ui/core";

  // third party
  import { Link } from "react-router-dom";

  // Styles using Material-UI makeStyles
  const useStyles = makeStyles((theme) => ({
    navlinks: {
      marginLeft: theme.spacing(10),
      display: "flex",
    },
   logo: {
      flexGrow: "1",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(10),
      "&:hover": {
        color: "yellow",
        borderBottom: "1px solid white",
      },
    },
  }));  

  // Navbar component for navigation
const Navbar = () => {
    const classes = useStyles();
    const removeData = () => {
      sessionStorage.removeItem('token');
    };
  return (
    <>
     <AppBar position="static" style={{marginBottom: 40}}>
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          Users Management
        </Typography>
          <div className={classes.navlinks}>
            <Link to="/home" className={classes.link}>
              Home
            </Link>
            <Link to="/deleteUsers" className={classes.link}>
              Deleted Users
            </Link>
            <Link onClick={removeData} to="/" className={classes.link}>
              Logout
            </Link>
          </div>
      </Toolbar>
    </AppBar>
    </>
  )
}

export default Navbar