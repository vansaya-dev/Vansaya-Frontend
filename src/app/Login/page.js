"use client"
import { Alert, Button, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Field, FormikProvider, useFormik } from 'formik';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as Yup from 'yup';
import { Cookie, Fahkwang } from 'next/font/google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OTPInput from 'react-otp-input';
import { useRouter } from 'next/navigation';
import axiosHttp from '../api/_api-interceptor';
import Cookies from 'js-cookie';

const fahkwang = Fahkwang({ subsets: ['latin'], weight: ['400'] });

/* .................theme defined for otp box..................*/
const darkModeStyles = {
    backgroundColor: '#333',   // Dark background color
    color: '#fff',             // Light text color
    border: '1px solid #555',  // Dark border
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    width: '100%',             // Ensure full width
};

const focusStyles = {
    borderColor: '#777',       // Lighter border on focus
    outline: 'none',
};
/* ...............................................................*/


/* .................theme defined for mui input and buttons..................*/
const theme = createTheme({
    palette: {
        mode: 'dark', // This sets the dark mode
        primary: {
            main: '#90caf9', // Example primary color
        },
        secondary: {
            main: '#f48fb1', // Example secondary color
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    // Custom styles for TextField
                    '& .MuiInputBase-root': {
                        color: 'white', // Text color
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)', // Label color
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#e01fff', // Border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#e01fff', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#e01fff', // Border color when focused
                        },
                    },
                },
            },
        },
    },
});
/* ...........................................................*/
function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [otpTime, setOtpTime] = useState(0);
    const [newPassword, setNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        type: 'success'
    });
    const [state, setState] = useState({
        sendOtp: false,
        phone: false,
        registerOtp: false,
        forgotPassword: false //forget password check
    })

    const validationSchemaEmail = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                'Password must contain at least one special character, one letter, and one number'
            ),
        email: Yup.string().email('Invalid email address').required('Email is required')
    });
    const validationSchemaPhone = Yup.object().shape({
        password: Yup.string().required('Password is required'),
        phone: Yup.string().required('Phone number is required')
            .matches(/^\d+$/, 'Phone number is not valid')
            .min(10, 'Phone number must be at least 10 digits')
            .max(12, 'Phone number must be at most 12 digits'),
    });
    const formik = useFormik({
        initialValues: {
            email: '',
            phone: '',
            password: '',
            otp: '',
            signup: false, //signup or login flag

        },
        validationSchema: state.phone ? validationSchemaPhone : validationSchemaEmail,
        onSubmit: (values) => {

            if (state.registerOtp) {
                verifyRegisterOtp(values)
            }
            else if (formik.values.signup) {
                sendForRegisterOtp(values);
            }
            else {
                handleLogin(values);
            }

        },
    });

    const forgotSchema = Yup.object().shape({
        forgottedEmail: Yup.string().email('Invalid email address').required('Email is required')
    });

    const formikForgot = useFormik({
        initialValues: {
            forgottedPhone: '',
            otp: '',
            forgottedEmail: '',
        },
        validationSchema: forgotSchema,
        onSubmit: (values) => {
            if (state.sendOtp) {
                handleValidateForgetOtp(values);
            }
            else {
                handleSendForgetOtp(values);
            }

        },
    });
    const newPasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm password is required')
    });

    const formikNewPassword = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: "",
        },
        validationSchema: newPasswordSchema,
        onSubmit: (values) => {
            handleResetPassword(values);
        },
    });
    const handleResetPassword = async () => {
        setSnackbarState((prev) => ({ message: 'New Password Created Successfully!', open: true, type: 'success' }))
        setTimeout(() => {
            setSnackbarState((prev) => ({ open: false }))
        }, 2500);
        setNewPassword(false);
        formik.resetForm();
        formikForgot.resetForm();
        formikNewPassword.resetForm();
        formik.setFieldValue('signup', false)
    }

    const verifyRegisterOtp = async (values) => {

        setIsLoading(true);
        try {
            let body = {
                email: values.email,
                otp: values.otp
            }

            let response = await axiosHttp.post('/verify-otp?new=true', body);

            if (response.status == 200) {

                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                }, 2500);
                await registerUser(values);

            }
        }
        catch (error) {

            setSnackbarState((prev) => ({ message: error.response.data.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);
    };


    const registerUser = async (values) => {

        setIsLoading(true);
        try {
            let body = {
                email: values.email,
                password: values.password
            }

            let response = await axiosHttp.post('/register', body);

            if (response.status >= 200 && response.status <= 399) {
                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                    router.back();
                }, 2500);

            }
        }
        catch (error) {

            setSnackbarState((prev) => ({ message: error.response.data.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 3500);
        }
        setIsLoading(false);

    }

    const sendForRegisterOtp = async (values) => {

        setIsLoading(true);
        try {
            let body = {
                email: values.email,
            }

            let response = await axiosHttp.post('/send-otp?new=true', body);

            if (response.status == 200) {

                setState((prev) => ({ ...prev, registerOtp: true }))

                setOtpTime(10);
                const intervalId = setInterval(() => {
                    setOtpTime((prev) => (prev - 1));
                }, 1000);

                setTimeout(() => {
                    clearInterval(intervalId);
                }, 10000);


                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                }, 2500);
            }
        }
        catch (error) {
            setSnackbarState((prev) => ({ message: error.response.data.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);

    };


    const handleLogin = async (values) => {

        setIsLoading(true);
        try {
            let body = {
                email: values.email,
                password: values.password
            }

            let response = await axiosHttp.post('/login', body);
            if (response.data.statusCode === 200) {
                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                    router.back();
                }, 2500);

                Cookies.set('token', response.data.data, { expires: 7 });
                formik.resetForm();

            }
        }
        catch (error) {

            setSnackbarState((prev) => ({ message: error.response.data.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }

        setIsLoading(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };



    const handleSendForgetOtp = async (values) => {

        setIsLoading(true);
        try {
            let body = {
                email: values.forgottedEmail,
            }

            let response = await axiosHttp.post('/send-otp?new=false', body);

            if (response.status >= 200 && response.status <= 399) {

                setState((prev) => ({ ...prev, sendOtp: true }));

                setOtpTime(10);
                const intervalId = setInterval(() => {
                    setOtpTime((prev) => (prev - 1));
                }, 1000);

                setTimeout(() => {
                    clearInterval(intervalId);
                }, 10000);

                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))

                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                }, 2500);
            }
        }
        catch (error) {
            setSnackbarState((prev) => ({ message: error.response.data.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);
    }


    const handleValidateForgetOtp = async (values) => {


        setIsLoading(true);
        try {
            let body = {
                email: values.forgottedEmail,
                otp: values.otp
            }

            let response = await axiosHttp.post('/verify-otp?new=false', body);

            if (response.status >= 200 && response.status <= 399) {

                setSnackbarState((prev) => ({ message: response.data.message, open: true, type: 'success' }))
                setTimeout(() => {
                    setSnackbarState((prev) => ({ open: false }))
                }, 2500);
                setState({
                    sendOtp: false,
                    phone: false,
                    registerOtp: false,
                    forgotPassword: false
                })

                setNewPassword(true)
            }
        }
        catch (error) {
            setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
        setIsLoading(false);

    }



    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">

            {!state.forgotPassword && !newPassword ?
                <Stack m={2}>


                    <Stack gap={2} alignItems={'center'}>
                        {formik.values.signup ?
                            <Typography
                                variant='h3'
                                sx={{
                                    fontFamily: fahkwang.style.fontFamily,

                                }}
                                textAlign={'center'}
                            >
                                Sign Up
                            </Typography>
                            :
                            <Typography
                                variant='h3'
                                sx={{
                                    fontFamily: fahkwang.style.fontFamily,

                                }}
                                textAlign={'center'}
                            >
                                Log In
                            </Typography>
                        }
                        {formik.values.signup ?
                            <Stack direction={'row'}>
                                <Typography sx={{
                                    fontSize: '18px',
                                    fontFamily: 'Futura Medium',
                                }} >Already a member?</Typography>
                                <Typography
                                    sx={{
                                        color: '#e01fff',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontFamily: 'Futura Medium',
                                    }}
                                    onClick={() => {
                                        formik.setFieldValue('signup', false)
                                        setState({
                                            sendOtp: false,
                                            phone: false,
                                            registerOtp: false,
                                            forgotPassword: false
                                        })
                                    }}
                                >Log In</Typography>
                            </Stack>
                            :
                            <Stack direction={'row'}>
                                <Typography sx={{
                                    fontSize: '18px',
                                    fontFamily: 'Futura Medium',
                                }} >New to this site?</Typography>
                                <Typography
                                    sx={{
                                        color: '#e01fff',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontFamily: 'Futura Medium',
                                    }}
                                    onClick={() => {
                                        formik.setFieldValue('signup', true);
                                        setState({
                                            sendOtp: false,
                                            phone: false,
                                            registerOtp: false,
                                            forgotPassword: false
                                        })
                                    }}
                                >Sign Up</Typography>
                            </Stack>
                        }
                    </Stack>

                    <Stack mt={4} gap={1} width={'320px'}>
                        <FormikProvider value={formik}>
                            <ThemeProvider theme={theme}>
                                {state.phone ?
                                    <Field name="phone">
                                        {({ field }) => (
                                            <TextField
                                                {...field}
                                                required
                                                id="standard-basic"
                                                label="Phone"
                                                disabled={state.registerOtp}
                                                type='number'
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomColor: '#e01fff', // Color of the underline on focus
                                                    },
                                                    '& .MuiInputLabel-root:after': {
                                                        color: 'white',
                                                    },
                                                    '& input[type=number]': {
                                                        '-moz-appearance': 'textfield', // Firefox
                                                        '&::-webkit-outer-spin-button': {
                                                            '-webkit-appearance': 'none', // Chrome, Safari, Edge, Opera
                                                            margin: 0,
                                                        },
                                                        '&::-webkit-inner-spin-button': {
                                                            '-webkit-appearance': 'none', // Chrome, Safari, Edge, Opera
                                                            margin: 0,
                                                        },
                                                    },
                                                }}
                                                error={Boolean(formik.errors.phone && formik.touched.phone)}
                                                helperText={formik.touched.phone && formik.errors.phone}
                                            />
                                        )}
                                    </Field>
                                    :

                                    <Field name="email">
                                        {({ field }) => (
                                            <TextField
                                                {...field}
                                                required
                                                disabled={state.registerOtp}
                                                id="standard-basic"
                                                label="Email"
                                                type='email'
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInput-underline:after': {
                                                        borderBottomColor: '#e01fff', // Color of the underline on focus
                                                    },
                                                    '& .MuiInputLabel-root:after': {
                                                        color: 'white',
                                                    },
                                                }}
                                                error={Boolean(formik.errors.email && formik.touched.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        )}
                                    </Field>
                                }
                                {/* {state.phone ?
                                    <Typography
                                        variant='caption'
                                        sx={{
                                            textAlign: 'end',
                                            cursor: !state.registerOtp && 'pointer',
                                            color: '#b3b3b3',
                                            '&:hover': {
                                                color: !state.registerOtp && 'white'
                                            },
                                        }}
                                        onClick={() => { !state.registerOtp && setState((prev) => ({ ...prev, phone: false })) }}
                                    >Email instead?
                                    </Typography>
                                    :

                                    <Typography
                                        variant='caption'
                                        sx={{
                                            textAlign: 'end',
                                            cursor: !state.registerOtp && 'pointer',
                                            color: '#b3b3b3',
                                            '&:hover': {
                                                color: !state.registerOtp && 'white'
                                            },
                                        }}
                                        onClick={() => { !state.registerOtp && setState((prev) => ({ ...prev, phone: true })) }}
                                    >Phone number instead?
                                    </Typography>} */}
                                <Field name="password">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            disabled={state.registerOtp}
                                            id="standard-basic"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomColor: '#e01fff', // Color of the underline on focus
                                                },
                                                '& .MuiInputLabel-root:after': {
                                                    color: 'white',
                                                },
                                                mt: 3
                                            }}
                                            error={Boolean(formik.errors.password && formik.touched.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{
                                                                mr: 0
                                                            }}
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                </Field>
                                {state.registerOtp &&
                                    <Stack mt={2} gap={1}>
                                        <Typography
                                            variant='caption'
                                            sx={{ color: '#b3b3b3' }}
                                        >
                                            Enter OTP(sent on email):
                                        </Typography>
                                        <OTPInput
                                            value={formik.values.otp}
                                            onChange={(newValue) => {
                                                formik.setFieldValue('otp', newValue)
                                            }}
                                            numInputs={6}
                                            renderSeparator={<span style={{ margin: '0 5px' }}></span>}
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
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                fontSize: '16px',
                                                // textDecoration: 'underline',
                                                cursor: otpTime === 0 && 'pointer',
                                                fontFamily: 'Futura light',
                                                textAlign: 'right',
                                                color: otpTime !== 0 ? '#b3b3b3' : 'white'
                                            }}
                                            onClick={() => {
                                                if (otpTime === 0) {
                                                    sendForRegisterOtp(formik.values)
                                                }
                                            }}
                                        >
                                            {otpTime===0?"Resend OTP": `Resend OTP in ${otpTime} seconds`}
                                        </Typography>
                                    </Stack>
                                }
                            </ThemeProvider>
                        </FormikProvider>
                    </Stack>


                    <Stack mt={state.registerOtp ? 4 : 7} gap={1} width={'320px'}>

                        {!formik.values.signup && <Typography
                            sx={{
                                fontSize: '16px',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontFamily: 'Futura light',
                            }}
                            onClick={() => { setState((prev) => ({ ...prev, forgotPassword: true })) }}
                        >Forgot password?
                        </Typography>
                        }
                        {!state.registerOtp ? <Button
                            variant='contained'
                            sx={{
                                height: '48px',
                                bgcolor: "#e01fff",
                                '&:hover': {
                                    bgcolor: "#e01fff",
                                    color: 'black'
                                },
                            }}
                            onClick={formik.handleSubmit}
                        >
                            {formik.values.signup ? "Sign Up" : "Log In"}
                        </Button>
                            :
                            <Button
                                variant='contained'
                                sx={{
                                    height: '48px',
                                    bgcolor: "#e01fff",
                                    '&:hover': {
                                        bgcolor: "#e01fff",
                                        color: 'black'
                                    },
                                }}
                                onClick={formik.handleSubmit}
                            >
                                Verify OTP
                            </Button>
                        }
                    </Stack>

                </Stack>
                :
                !newPassword && <Stack m={2} alignItems={'center'}>
                    <Stack gap={2.5} alignItems={'center'} >
                        <Typography
                            variant='h3'
                            sx={{
                                fontFamily: fahkwang.style.fontFamily,

                            }}
                            textAlign={'center'}
                        >
                            Reset password
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '18px',
                                textAlign: 'center',
                                width: '320px',
                                fontFamily: 'Futura Medium',
                            }}

                        >Enter your login email and we’ll send you an OTP  to reset your password.
                        </Typography>
                    </Stack>
                    <Stack mt={5} width={'320px'} gap={3}>
                        <FormikProvider value={formikForgot}>
                            <ThemeProvider theme={theme}>
                                <Field name="forgottedEmail">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            disabled={state.sendOtp}
                                            id="standard-basic"
                                            label="Email"
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomColor: '#e01fff', // Color of the underline on focus
                                                },
                                                '& .MuiInputLabel-root:after': {
                                                    color: 'white',
                                                },
                                            }}
                                            error={Boolean(formikForgot.errors.forgottedEmail && formikForgot.touched.forgottedEmail)}
                                            helperText={formikForgot.touched.forgottedEmail && formikForgot.errors.forgottedEmail}
                                        />
                                    )}
                                </Field>
                                {state.sendOtp &&
                                    <Stack mt={2} gap={1}>
                                        <Typography
                                            variant='caption'
                                            sx={{ color: '#b3b3b3' }}
                                        >
                                            Enter OTP(sent on email):
                                        </Typography>
                                        <OTPInput
                                            value={formikForgot.values.otp}
                                            onChange={(newValue) => {
                                                formikForgot.setFieldValue('otp', newValue)
                                            }}
                                            numInputs={6}
                                            renderSeparator={<span style={{ margin: '0 5px' }}></span>}
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
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                fontSize: '16px',
                                                // textDecoration: 'underline',
                                                cursor: otpTime === 0 && 'pointer',
                                                fontFamily: 'Futura light',
                                                textAlign: 'right',
                                                color: otpTime !== 0 ? '#b3b3b3' : 'white'
                                            }}
                                            onClick={() => {
                                                if (otpTime === 0) {
                                                    handleSendForgetOtp(formikForgot.values)
                                                }
                                            }}
                                        >
                                           {otpTime===0?"Resend OTP": `Resend OTP in ${otpTime} seconds`}
                                        </Typography>
                                    </Stack>
                                }
                            </ThemeProvider>
                        </FormikProvider>
                    </Stack>

                    <Stack mt={state.sendOtp ? 4 : 7} gap={1} width={'320px'}>
                        <Button
                            variant='contained'
                            sx={{
                                height: '48px',
                                bgcolor: "#e01fff",
                                '&:hover': {
                                    bgcolor: "#e01fff",
                                    color: 'black'
                                },
                            }}
                            onClick={formikForgot.handleSubmit}

                        >
                            {state.sendOtp ? "Verify OTP" : "Send OTP"}
                        </Button>
                    </Stack>
                </Stack>
            }

            {/* new password stack */}
            {newPassword &&
                <Stack m={2} alignItems={'center'}>
                    <Stack gap={3.1} alignItems={'center'} >
                        <Typography
                            variant='h3'
                            sx={{
                                fontFamily: fahkwang.style.fontFamily,

                            }}
                            textAlign={'center'}
                        >
                            Reset password
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '18px',
                                textAlign: 'center',
                                width: '320px',
                                fontFamily: 'Futura Medium',
                            }}

                        >Enter your new password below
                        </Typography>
                    </Stack>

                    <Stack mt={4} gap={2} width={'320px'}>

                        <FormikProvider value={formikNewPassword}>
                            <ThemeProvider theme={theme}>

                                <Field name="newPassword">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            // disabled={state.registerOtp}
                                            id="standard-basic"
                                            label="New Password"
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomColor: '#e01fff', // Color of the underline on focus
                                                },
                                                '& .MuiInputLabel-root:after': {
                                                    color: 'white',
                                                },
                                            }}
                                            error={Boolean(formikNewPassword.errors.newPassword && formikNewPassword.touched.newPassword)}
                                            helperText={formikNewPassword.touched.newPassword && formikNewPassword.errors.newPassword}
                                        />
                                    )}
                                </Field>
                                <Field name="confirmPassword">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            id="standard-basic"
                                            label="Confirm New Password"
                                            variant="standard"
                                            sx={{
                                                '& .MuiInput-underline:after': {
                                                    borderBottomColor: '#e01fff', // Color of the underline on focus
                                                },
                                                '& .MuiInputLabel-root:after': {
                                                    color: 'white',
                                                },
                                            }}
                                            error={Boolean(formikNewPassword.errors.confirmPassword && formikNewPassword.touched.confirmPassword)}
                                            helperText={formikNewPassword.touched.confirmPassword && formikNewPassword.errors.confirmPassword}
                                        />
                                    )}
                                </Field>

                            </ThemeProvider>
                        </FormikProvider>


                    </Stack>

                    <Stack mt={6} gap={1} width={'320px'}>
                        <Button
                            variant='contained'
                            sx={{
                                height: '48px',
                                bgcolor: "#e01fff",
                                '&:hover': {
                                    bgcolor: "#e01fff",
                                    color: 'black'
                                },
                            }}
                            onClick={formikNewPassword.handleSubmit}

                        >
                            Reset Password
                        </Button>
                    </Stack>

                </Stack>
            }


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
        </main>
    );
}

export default SignUp;
