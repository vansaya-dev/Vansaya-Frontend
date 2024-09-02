"use client";
import React, { useState } from "react";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Fahkwang } from "next/font/google";

const fahkwang = Fahkwang({ subsets: ["latin"], weight: ["400"] });
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

const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    mobileNumber: "1234567890",
};

function ProfileInformation() {
    const [isEditable, setIsEditable] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpCurrent, setOtpCurrent] = useState(""); // State for current email OTP
    const [otpNew, setOtpNew] = useState(""); // State for new email OTP
    const [otpTime, setOtpTime] = useState(9);

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
            setShowOTPInput(formik.values.email !== userData.email);
            console.log("Form data:", values);
            // setIsEditable(false);
        },
    });

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
        setShowOTPInput(false);
    };

    const handleEmailChange = (e) => {
        formik.handleChange(e);
    };

    const handleVerifyBothOtp = () => {
        // Handle OTP verification here
        console.log("Current Email OTP:", otpCurrent);
        console.log("New Email OTP:", otpNew);
        setOtpCurrent('')
        setOtpNew('')
        setShowOTPInput(false);
    };

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
                                disabled={!isEditable}
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
                            />
                            {showOTPInput && (
                                <Stack gap={3} sx={{ width: { md: "270px", sm: "210px", xs: "195px" } }}>
                                    <Stack gap={1}>
                                        <Typography variant="subtitle1" sx={{ fontFamily: "Futura Medium" }}>
                                            Current Email OTP
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
                                        <Typography variant="subtitle1" sx={{ fontFamily: "Futura Medium" }}>
                                            New Email OTP
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
                                    <Stack direction={'row'}  justifyContent={'space-between'}>
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
                                                    // sendForRegisterOtp(formik.values)
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
                                        formik.values.firstName === userData.firstName &&
                                        formik.values.lastName === userData.lastName &&
                                        formik.values.email === userData.email &&
                                        formik.values.mobileNumber === userData.mobileNumber
                                    } // Disable save button if no changes
                                >
                                    Save
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </form>
            </Stack>
        </Grid>
    );
}

export default ProfileInformation;
