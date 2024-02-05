import React from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    TextField,
    Typography,
    MenuItem
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

// third party
import DateFnsUtils from '@date-io/date-fns';
import { Formik } from "formik";
import * as yup from "yup";

// project imports
import { useApi } from './ApiContext';

// Validation schema using Yup
const validationSchema = yup.object({
    firstName: yup
        .string("Please provide a valid first name")
        .required("First name is required"),
    lastName: yup
        .string("Please provide a valid last name")
        .required("Last name is required"),
    uniqueId: yup
        .string("Please provide a valid ID")
        .required("ID is required"),
    email: yup
        .string("Please provide a valid email")
        .email("Enter a valid email")
        .required("Email is required"),
    gender: yup
        .string("Please select a gender")
        .oneOf(['Male', 'Female'], "Invalid gender")
        .required("Gender is required"),
    selectedDate: yup
        .date("Please provide a valid date")
        .required("Date is required"),
    fullAddress: yup
        .string("Please provide a valid address")
        .required("Address is required"),
    status: yup
        .string("Please select a status")
        .oneOf(['Active', 'Inactive'], "Invalid status")
        .required("Status is required"),
    phoneNumber: yup
        .number("Please provide a valid phone number")
        .required("Phone number is required"),
});


 // Styles using Material-UI makeStyles
const useStyles = makeStyles((theme) => ({
    userAddDialog: {
        "&>div:nth-child(3)": {
            justifyContent: "center",
            "&>div": {
                margin: "0px",
                borderRadius: "0px",
                maxWidth: "600px",
                maxHeight: "90%",
            },
        },
    },
    spacing: {
        margin: '15px 0'
    }
}));

// Transition effect for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

// Options for gender and status select fields
const genders = ['Male', 'Female'];
const status = ['Active', 'Inactive'];

// Functional component for adding/editing user
const AddUser = React.memo(({ open, handleClose, isEditMode, initialValues }) => {

    const classes = useStyles();

    // Access API context functions
    const { postApiData, putApiData } = useApi();

    // Handler to close the dialog and reset the form
    const closeHandler = (reset) => {
        reset();
        handleClose();
    };


    return (
        <>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                className={classes.userAddDialog}
                transitionDuration={800}
            >
                <DialogTitle disableTypography>
                    <Typography variant="h5">{isEditMode ? 'Edit User' : 'Add User'}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Formik
                            initialValues={initialValues || {
                                firstName: "",
                                lastName: "",
                                uniqueId: "",
                                email: "",
                                gender: "",
                                selectedDate: new Date(),
                                fullAddress: "",
                                phoneNumber: null,
                                status: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {

                                // Handle form submission here with api integration both 
                                // if isEditMode is true edit api will run or else post api

                                const requestData = { ...values, delete: false };

                                if (isEditMode) {
                                    putApiData(requestData, initialValues._id, setSubmitting, handleClose)
                                } else {
                                    postApiData(requestData, setSubmitting, handleClose)
                                }
                            }}
                        >
                            {(props) => (
                                <form onSubmit={props.handleSubmit}>
                                    <Grid item xs={12} className={classes.spacing}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="First Name"
                                                    variant="outlined"
                                                    name="firstName"
                                                    value={props.values.firstName}
                                                    onChange={props.handleChange}
                                                    fullWidth
                                                    error={
                                                        props.touched.firstName &&
                                                        Boolean(props.errors.firstName)
                                                    }
                                                    helperText={
                                                        props.touched.firstName &&
                                                        props.errors.firstName
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Laste Name"
                                                    variant="outlined"
                                                    name="lastName"
                                                    value={props.values.lastName}
                                                    onChange={props.handleChange}
                                                    fullWidth
                                                    error={
                                                        props.touched.lastName &&
                                                        Boolean(props.errors.lastName)
                                                    }
                                                    helperText={
                                                        props.touched.lastName &&
                                                        props.errors.lastName
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="ID"
                                                    variant="outlined"
                                                    name="uniqueId"
                                                    value={props.values.uniqueId}
                                                    onChange={props.handleChange}
                                                    fullWidth
                                                    error={
                                                        props.touched.uniqueId &&
                                                        Boolean(props.errors.uniqueId)
                                                    }
                                                    helperText={
                                                        props.touched.uniqueId &&
                                                        props.errors.uniqueId
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Email"
                                                    variant="outlined"
                                                    name="email"
                                                    value={props.values.email}
                                                    onChange={props.handleChange}
                                                    fullWidth
                                                    error={
                                                        props.touched.email &&
                                                        Boolean(props.errors.email)
                                                    }
                                                    helperText={
                                                        props.touched.email &&
                                                        props.errors.email
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    id="gender"
                                                    name="gender"
                                                    label="Gender"
                                                    variant="outlined"
                                                    select
                                                    value={props.values.gender}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    error={props.touched.gender && Boolean(props.errors.gender)}
                                                    helperText={props.touched.gender && props.errors.gender}
                                                >
                                                    {genders.map((gender) => (
                                                        <MenuItem key={gender} value={gender}>
                                                            {gender}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    {/* Your form content */}
                                                    <KeyboardDatePicker
                                                        variant="outlined"
                                                        id="date-picker"
                                                        label="Select Date"
                                                        format="MM/dd/yyyy"
                                                        value={props.values.selectedDate}
                                                        onChange={(event, newValue) => {
                                                            props.setFieldValue("selectedDate", event);
                                                        }}
                                                        error={!props.values.selectedDate}
                                                        helperText={!props.values.selectedDate ? "Date is required" : ""}
                                                        KeyboardButtonProps={{
                                                            'aria-label': 'change date',
                                                        }}
                                                    />
                                                    {/* Other form fields and submit button */}
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Full Address"
                                                    variant="outlined"
                                                    name="fullAddress"
                                                    value={props.values.fullAddress}
                                                    onChange={props.handleChange}
                                                    fullWidth
                                                    error={
                                                        props.touched.fullAddress &&
                                                        Boolean(props.errors.fullAddress)
                                                    }
                                                    helperText={
                                                        props.touched.fullAddress &&
                                                        props.errors.fullAddress
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Phone Number"
                                                    variant="outlined"
                                                    name="phoneNumber"
                                                    fullWidth
                                                    value={props.values.phoneNumber}
                                                    onChange={props.handleChange}
                                                    type="number"  // Remove this line
                                                    error={props.touched.phoneNumber && Boolean(props.errors.phoneNumber)}
                                                    helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    id="status"
                                                    name="status"
                                                    label="Status"
                                                    variant="outlined"
                                                    select
                                                    value={props.values.status}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    error={props.touched.status && Boolean(props.errors.status)}
                                                    helperText={props.touched.status && props.errors.status}
                                                >
                                                    {status.map((res) => (
                                                        <MenuItem key={res} value={res}>
                                                            {res}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <DialogActions sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                            <Button
                                                variant="text"
                                                onClick={() =>
                                                    closeHandler(props.handleReset, props.setFieldValue)
                                                }
                                                color="primary"
                                            >
                                                Close
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Grid>

                </DialogContent>
            </Dialog>
        </>
    )
});

export default AddUser