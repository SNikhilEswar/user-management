import React from "react";
// material-ui
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    CardContent,
    CardActions,
    Divider,
    Grid,
    IconButton,
    Modal,
    Typography,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CloseIcon from "@material-ui/icons/Close";

// project imports
import MainCard from "../../customs/MainCard";
import { useApi } from './ApiContext';


 // Styles using Material-UI makeStyles
const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: "16px",
        height: 500,
        flexGrow: 1,
        minWidth: 350,
        zIndex: -1,
        transform: "translateZ(0)",
        // The position fixed scoping doesn't work in IE 11.
        // Disable this demo to preserve the others.
        "@media all and (-ms-high-contrast: none)": {
            display: "none",
        },
    },
    modal: {
        display: "flex",
        padding: theme.spacing(1),
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        width: 500,
        zIndex: 1,
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

// Render the component with Material-UI components
const Delete = React.memo(({ openDelete, handleCloseDelete, initialValues }) => {
    const classes = useStyles();
    const { deleteAllUsers, error} = useApi();

    const handleDelete = () => {
        const deleteData = { "ids": [initialValues._id], "delete": true }
        deleteAllUsers(deleteData, 'single', handleCloseDelete);
    }

    return (
        <Modal
            open={openDelete}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            className={classes.modal}
        >
            <MainCard
                className={classes.paper}
                title="Delete User"
                content={false}
                secondary={
                    <IconButton
                        onClick={() => {

                            handleCloseDelete();
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent>
                    <Typography variant="body1">
                        Are you sure you want to Delete <b>{initialValues ? initialValues.firstName : ''}</b>{" "} ?
                    </Typography>
                    {error && (
                        <Grid item xs={12}>
                            <Alert
                                severity="error"
                                variant="standard"
                                icon={false}
                                sx={{ color: "error.main" }}
                                action={
                                    <React.Fragment>
                                        <IconButton
                                            size="small"
                                            aria-label="close"
                                            color="inherit"
                                            onClick={() => {
                                                handleCloseDelete();
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            >
                                {error}
                            </Alert>
                        </Grid>
                    )}
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    )
});


export default Delete;