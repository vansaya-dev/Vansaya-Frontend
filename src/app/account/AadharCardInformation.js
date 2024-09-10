import React, { useEffect, useReducer, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Grid,
    Typography,
    Stack,
    Snackbar,
    Alert,
} from '@mui/material';
import axiosHttp from "../api/_api-interceptor";
import Checkbox from '@mui/material/Checkbox';

function AadharCardInformation({ userDetails, getUserDetails }) {
    const [selectedOption, setSelectedOption] = useState('aadhar');
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        type: 'success'
    });


    const formik = useFormik({
        initialValues: {
            fullName: '',
            panId: '',
            aadharId: '',
            selectedOption: 'aadhar',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                // .required('Full Name is required')
                .min(3, 'Full Name must be at least 3 characters')
                .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces are allowed'),

            aadharId: Yup.string()
                .length(12, 'Aadhar number is Invalid')
                .matches(/^\d{12}$/, 'Invalid Aadhar format')
                .required("Aadhar Number is required")
            ,

        }),
        onSubmit: (values) => {
            console.log(values, 'nigga alues')
            handleSubmit(values)
        },
    });

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            let payload = { aadhar: values.aadharId }
            let response = await axiosHttp.patch('/users/profile', payload)

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
        // formik.setFieldValue('aadharId', userDetails?.aadhar || '')
    };

    useEffect(() => {
        if (userDetails?.aadhar) {
            formik.setFieldValue('aadharId', userDetails?.aadhar || '')
            setIsAccepted(true)
        }
    }, [userDetails, isEditable])

    return (
        <Grid container spacing={2} sx={{ pl: { md: 5, sm: 5 }, pt: 1 }}>
            <Grid item xs={12}>
                <Stack direction={"row"} gap={3} mb={4}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "Futura Medium",
                        }}
                    >
                        Aadhar Card Information
                    </Typography>
                    <Button sx={{ color: "#e01fff" }} onClick={toggleEditMode}>
                        {isEditable ? "Cancel" : "Edit"}
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={8} md={10}>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>

                        {/* ID Type Selection (PAN / Aadhar) */}
                        {/* <Grid item xs={12}>
                            <FormControl component="fieldset" fullWidth>
                                <Typography
                                    variant="subtitle2"
                                    color="#b3b3b3"
                                    mb={1}
                                    fontFamily="Futura Medium"
                                >
                                    Select ID Type (You can submit any one of them)
                                </Typography>
                                <RadioGroup
                                    aria-label="idType"
                                    name="selectedOption"
                                    value={formik.values.selectedOption}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        setSelectedOption(e.target.value);
                                    }}
                                    row
                                >
                                    <FormControlLabel
                                        value="pan"
                                        control={<Radio sx={{ '&.Mui-checked': { color: '#e01fff' } }} />}
                                        label={<Typography fontFamily="Futura Medium">PAN Card</Typography>}
                                    />
                                    <FormControlLabel
                                        value="aadhar"
                                        control={<Radio sx={{ '&.Mui-checked': { color: '#e01fff' } }} />}
                                        label={<Typography fontFamily="Futura Medium">Aadhar Card</Typography>}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid> */}

                        {/* PAN or Aadhar Field Conditionally Rendered */}
                        <Grid item xs={12} md={4}>
                            {selectedOption === 'pan' ? (
                                <TextField
                                    fullWidth
                                    name="panId"
                                    label={<Typography fontFamily="Futura Medium">PAN Card Number</Typography>}
                                    variant="standard"
                                    sx={{
                                        "& .MuiInput-underline:after": {
                                            borderBottomColor: "#e01fff",
                                        },
                                        "& .MuiInputLabel-root:after": {
                                            color: "white",
                                        },
                                    }}
                                    value={formik.values.panId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.panId && Boolean(formik.errors.panId)}
                                    helperText={formik.touched.panId && formik.errors.panId}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    name="aadharId"
                                    disabled={!isEditable}
                                    label={<Typography fontFamily="Futura Medium">Aadhar Card Number</Typography>}
                                    variant="standard"
                                    sx={{
                                        "& .MuiInput-underline:after": {
                                            borderBottomColor: "#e01fff",
                                        },
                                        "& .MuiInputLabel-root:after": {
                                            color: "white",
                                        },
                                    }}
                                    value={formik.values.aadharId}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.aadharId && Boolean(formik.errors.aadharId)
                                    }
                                    helperText={formik.touched.aadharId && formik.errors.aadharId}
                                />
                            )}
                        </Grid>

                        {/* Full Name Field (Always Below the ID Field) */}
                        {/* <Grid item xs={12} md={7}>
                            <TextField
                                fullWidth
                                name="fullName"
                                label={<Typography fontFamily="Futura Medium">Full Name </Typography>}
                                variant="standard"
                                sx={{
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: "#e01fff",
                                    },
                                    "& .MuiInputLabel-root:after": {
                                        color: "white",
                                    },
                                }}
                                placeholder={"(Exactly as mentioned on your Id )"}
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                helperText={formik.touched.fullName && formik.errors.fullName}
                            />
                        </Grid> */}

                        {/* Submit Button  and terms condition */}
                        <Stack direction={'row'} alignItems={'start'} gap={2} mt={3}  >

                            <Checkbox
                               sx={{
                                '&.Mui-checked': { color: '#e01fff' }, 
                                '&.Mui-disabled': { color: '#b3b3b3' }  
                            }}
                                checked={isAccepted}
                                disabled={!isEditable}
                                onClick={() => {
                                    setIsAccepted(!isAccepted)
                                }}

                            />
                            <Typography 
                            color="#b3b3b3"
                            variant='subtitle2'
                            fontFamily={'Futura Light'}
                            >I do hereby declare that Aadhar Number furnished/stated above is correct and belongs to me, registered as an account holder with vansaya.in . I further declare that I shall solely be held responsible for the consequences, in case of any false Aadhar Number declaration.</Typography>
                        </Stack>
                        <Grid item xs={12} md={4}>


                            {isEditable && <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isAccepted}
                                fullWidth
                                sx={{
                                    mt: 3,
                                    fontFamily: "Futura Medium",
                                    bgcolor: "#e01fff",
                                    color: 'whitesmoke',
                                    "&:hover": {
                                        bgcolor: "#e01fff",
                                        color: "whitesmoke",
                                    },
                                }}

                            >
                                Submit
                            </Button>
                            }
                        </Grid>
                    </Grid>
                </form>
            </Grid>
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

export default AadharCardInformation;
