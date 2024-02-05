import React from "react";
// material-ui
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";

// project imports
import {useApi} from '../Users/ApiContext';

// third party
import { useNavigate } from "react-router-dom";

// Hardcoded user credentials for demonstration
const users = {
    email: "userManagement@mail.com",
    password: 123456789
}

// Component to display hardcoded credentials
function Creditionals() {
    return (
        <>
            <Typography variant="h6" color="textSecondary" align="center">Creditionals:</Typography>
            <Typography variant="body2" color="textSecondary" align="center">{users.email}</Typography>
            <Typography variant="body2" color="textSecondary" align="center">{users.password}</Typography>
        </>
    );
}

// Styling for the component using Material-UI makeStyles
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor:
            theme.palette.type === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],

        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    size: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },

    paper: {
        margin: theme.spacing(2, 6),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(0),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));


// Main component for signing in
export default function SignInSide() {

    const classes = useStyles();

    // Navigation hook for redirection
    const navigate = useNavigate();

    // State for username and password inputs
    const [account, setAccount] = React.useState({ username: "", password: "" });

    // Update the account state based on input changes
    const handelAccount = (property, event) => {

        const accountCopy = { ...account };
        accountCopy[property] = event.target.value;

        setAccount(accountCopy);

    }

    // Custom hook for api
    const { handleUserLogin } = useApi();

    // Handle login button click
    const handelLogin = (e) => {
        e.preventDefault();
        // Check if the entered credentials match the hardcoded values
        if (users.email === account.username && users.password === parseInt(account.password)) {

            handleUserLogin(account.username, parseInt(account.password), setAccount,navigate)

        }
    };

    // Render the component with Material-UI components
    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid
                className={classes.size}
                item
                xs={12}
                sm={6}
                md={4}
                component={Paper}
                elevation={1}
                square
            >
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={handelLogin}>
                        <TextField
                            value={account.username}
                            onChange={(event) => handelAccount("username", event)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            value={account.password}
                            onChange={(event) => handelAccount("password", event)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Login
                        </Button>
                        <Box mt={5}>
                            <Creditionals />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
