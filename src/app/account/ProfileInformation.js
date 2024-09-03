/* eslint-disable react/prop-types */
"use client";
import React, { useEffect, useState } from "react";
import { Alert, Button, Grid, InputAdornment, Snackbar, Stack, TextField, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Fahkwang } from "next/font/google";
import { CheckCircle } from "@mui/icons-material";
import axiosHttp from "../api/_api-interceptor";

// const fahkwang = Fahkwang({ subsets: ["latin"], weight: ["400"] });
const darkModeStyles = {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '100%',
};
const focusStyles = {
    border: '2px solid #e01fff',
};



function ProfileInformation({ userDetails, getUserDetails }) {
    const [isEditable, setIsEditable] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpCurrent, setOtpCurrent] = useState(""); // State for current email OTP
    const [otpNew, setOtpNew] = useState(""); // State for new email OTP
    const [otpTime, setOtpTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState({
        old: false,
        new: false,
        both: false
    });
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        type: 'success'
    });


    useEffect(() => {
        let data = {
            firstName: userDetails?.firstName ? userDetails?.firstName : "",
            lastName: userDetails?.lastName ? userDetails?.lastName : "",
            email: userDetails.email,
            mobileNumber: userDetails?.mobileNumber ? userDetails?.mobileNumber : "",
        };
        formik.setValues(data);

    }, [userDetails])

    const userData = {
        firstName: userDetails?.firstName ? userDetails?.firstName : "",
        lastName: userDetails?.lastName ? userDetails?.lastName : "",
        email: userDetails.email,
        mobileNumber: userDetails?.mobileNumber ? userDetails?.mobileNumber : "",
    };
    console.log(userDetails.firstName, 'nigga details');
    console.log(userData, 'nigga data');
    const formik = useFormik({
        initialValues: userData,
        validationSchema: Yup.object({
            firstName: Yup.string()
                .min(2, "First Name must be at least 2 characters")
                .required("First Name is required"),
            lastName: Yup.string()
                .min(2, "Last Name must be at least 2 characters")
                .required("Last Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            mobileNumber: Yup.string()
                .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits")
                .required("Mobile Number is required"),
        }),
        onSubmit: (values) => {

            let changedData = getChangedValues(userData, values)

            if (otpVerified.both) {
                saveChanges(changedData)
            }
            else if (formik.values.email !== userData.email) {

                setShowOTPInput(true);
                sendOtp(formik.values.email, true)
                sendOtp(userData.email, false)
            }
            else {
                saveChanges(changedData)
            }
            console.log("Form data:", values);
            // setIsEditable(false);
        },
    });


    const sendOtp = async (email, isNew) => {

        setIsLoading(true);
        try {
            let body = {
                email: email,
            }

            let response = await axiosHttp.post(`send-otp?new=${isNew}`, body);

            if (response.status == 200) {
                if (isNew) {
                    setOtpTime(30);
                    const intervalId = setInterval(() => {
                        setOtpTime((prev) => (prev - 1));
                    }, 1000);

                    setTimeout(() => {
                        clearInterval(intervalId);
                    }, 30000);
                }



                setSnackbarState((prev) => ({ message: response?.data?.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                }, 2500);
            }
        }
        catch (error) {
            setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);

    };

    const verifyOtp = async (email, otp, isNew) => {

        setIsLoading(true);
        try {
            let body = {
                email: email,
                otp: otp
            }

            let response = await axiosHttp.post(`/verify-otp?new=${isNew}`, body);

            if (response.status == 200) {
                if (isNew) {
                    setOtpVerified((prev) => ({ ...prev, new: true }))
                }
                else {
                    setOtpVerified((prev) => ({ ...prev, old: true }))
                }


            }
        }
        catch (error) {

            setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);
    };

    const getChangedValues = (initialValues, currentValues) => {

        const changedValues = {};


        for (const key in initialValues) {
            if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
                // Checking if the value has changed
                if (initialValues[key] !== currentValues[key]) {
                    changedValues[key] = currentValues[key];
                }
            }
        }

        return changedValues;
    };



    const saveChanges = async (values) => {
        setIsLoading(true);
        try {
            let payload = { ...values, mobileNumber: '+91' + values.mobileNumber }
            let response = await axiosHttp.patch('/users/profile', values)
            console.log(response, 'nigga response')
            setSnackbarState((prev) => ({ message: response?.data?.message, open: true, type: 'success' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
            getUserDetails()
            toggleEditMode();
        }
        catch (error) {
            setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 3000);
        }
        setIsLoading(false);

    }



    const toggleEditMode = () => {
        setIsEditable(!isEditable);
        setShowOTPInput(false);
        setOtpVerified({
            old: false,
            new: false,
            both: false
        })
        formik.setValues(userData)
    };

    const handleEmailChange = (e) => {
        formik.handleChange(e);
    };

    const handleVerifyBothOtp = async () => {
        // Handling OTP verification here
        await verifyOtp(userData.email, otpCurrent, false);
        await verifyOtp(formik.values.email, otpNew, true);

    };

    useEffect(() => {
        if (otpVerified.new && otpVerified.old && !otpVerified.both) {
            setOtpVerified((prev) => ({ ...prev, both: true }))
            setSnackbarState((prev) => ({ message: "Both Email Verified Successfully, click on save to update the changes", open: true, type: 'success' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ open: false }))
            }, 5500);
            setOtpCurrent('')
            setOtpNew('')
            setShowOTPInput(false);
        }
    }, [otpVerified.new, otpVerified.old])


    return (
        <Grid
            sx={{
                pl: { md: 5, sm: 5 },
                pt: 1,
            }}
        >
            <Stack gap={2}>
                <Stack direction={"row"} gap={3} mb={4}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "Futura Medium",
                        }}
                    >
                        Profile Information
                    </Typography>
                    <Button sx={{ color: "#e01fff" }} onClick={toggleEditMode}>
                        {isEditable ? "Cancel" : "Edit"}
                    </Button>
                </Stack>
                <form onSubmit={formik.handleSubmit}>
                    <Stack gap={2}>
                        <Stack direction={"row"} gap={3}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                variant="standard"
                                disabled={!isEditable}
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                                sx={{
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "#e01fff",
                                    },
                                    "& .MuiInputLabel-root:after": {
                                        color: "white",
                                    },
                                }}
                            />
                            <TextField
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                variant="standard"
                                disabled={!isEditable}
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                                sx={{
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "#e01fff",
                                    },
                                    "& .MuiInputLabel-root:after": {
                                        color: "white",
                                    },
                                }}
                            />
                        </Stack>

                        <Stack gap={3} mt={9}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: "Futura Medium",
                                }}
                            >
                                Email Address
                            </Typography>
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                variant="standard"
                                disabled={!isEditable || showOTPInput}
                                value={formik.values.email}
                                onChange={handleEmailChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                sx={{
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "#e01fff",
                                    },
                                    "& .MuiInputLabel-root:after": {
                                        color: "white",
                                    },
                                    width: { md: "270px", sm: "210px", xs: "195px" },
                                }}
                                InputProps={{
                                    endAdornment: otpVerified.both && (
                                        <InputAdornment position="end">
                                            <CheckCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {showOTPInput && (
                                <Stack gap={3} sx={{ width: { md: "270px", sm: "210px", xs: "195px" } }}>
                                    <Stack gap={1}>
                                        <Typography variant="caption" color={'#b3b3b3'} sx={{ fontFamily: "Futura Medium" }}>
                                            OTP sent on {userData.email}
                                        </Typography>
                                        <OTPInput
                                            value={otpCurrent}
                                            onChange={(newValue) => setOtpCurrent(newValue)}
                                            numInputs={6}
                                            renderSeparator={<span style={{ margin: '0 5px' }}></span>}
                                            isInputNum
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        ...darkModeStyles,
                                                        ...(props.focused ? focusStyles : {})
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    <Stack gap={1}>
                                        <Typography variant="caption" color={'#b3b3b3'} sx={{ fontFamily: "Futura Medium" }}>
                                            OTP sent on {formik.values.email}
                                        </Typography>
                                        <OTPInput
                                            value={otpNew}
                                            onChange={(newValue) => setOtpNew(newValue)}
                                            numInputs={6}
                                            renderSeparator={<span style={{ margin: '0 5px' }}></span>}
                                            isInputNum
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    style={{
                                                        ...darkModeStyles,
                                                        ...(props.focused ? focusStyles : {})
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                    <Stack direction={'row'} justifyContent={'space-between'}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                bgcolor: "#e01fff",
                                                "&:hover": {
                                                    bgcolor: "#e01fff",
                                                    color: "black",
                                                },
                                                width: "150px",
                                                // height: "48px",
                                            }}
                                            onClick={handleVerifyBothOtp}
                                            disabled={!otpCurrent || !otpNew}
                                        >
                                            Verify
                                        </Button>
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                fontSize: '16px',
                                                // textDecoration: 'underline',
                                                cursor: otpTime === 0 && 'pointer',
                                                fontFamily: 'Futura light',
                                                textAlign: 'right',
                                                color: otpTime !== 0 ? '#b3b3b3' : 'white',

                                            }}
                                            onClick={() => {
                                                if (otpTime === 0) {
                                                    sendOtp(formik.values.email, true)
                                                    sendOtp(userData.email, false)
                                                    setOtpCurrent('')
                                                    setOtpNew('')
                                                }
                                            }}
                                        >
                                            {otpTime === 0 ? "Resend OTP" : `Resend OTP in ${otpTime} seconds`}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>

                        <Stack gap={3} mt={9}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: "Futura Medium",
                                }}
                            >
                                Mobile Number
                            </Typography>
                            <TextField
                                id="mobileNumber"
                                name="mobileNumber"
                                label="Mobile Number"
                                type="number"
                                variant="standard"
                                disabled={!isEditable}
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                                sx={{
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "#e01fff",
                                    },
                                    "& .MuiInputLabel-root:after": {
                                        color: "white",
                                    },
                                    "& input[type=number]": {
                                        "-moz-appearance": "textfield",
                                        "&::-webkit-outer-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                        "&::-webkit-inner-spin-button": {
                                            "-webkit-appearance": "none",
                                            margin: 0,
                                        },
                                    },
                                    width: { md: "270px", sm: "210px", xs: "195px" },
                                }}
                            />
                        </Stack>

                        {isEditable && (
                            <Stack mt={6}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#e01fff",
                                        "&:hover": {
                                            bgcolor: "#e01fff",
                                            color: "black",
                                        },
                                        width: "150px",
                                        height: "48px",
                                    }}
                                    disabled={
                                        (formik.values.firstName === userData.firstName &&
                                            formik.values.lastName === userData.lastName &&
                                            formik.values.email === userData.email &&
                                            formik.values.mobileNumber == userData.mobileNumber) ||
                                        showOTPInput
                                    }
                                >
                                    Save
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </form>
            </Stack>
            <Snackbar
                open={snackbarState.open}
                autoHideDuration={4000}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert severity={snackbarState.type} sx={{ width: '100%' }}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
}

export default ProfileInformation;
