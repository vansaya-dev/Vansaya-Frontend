"use client";
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Container, Grid, TextField, Typography, Paper, Stack,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import axiosHttp from '../api/_api-interceptor';
import { DeleteOutline } from '@mui/icons-material';

const ManageAddresses = ({ userDetails, getUserDetails }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
  });
  const [dialogState, setDialogState] = useState({
    open: false,
    id: '',
  });
  const [addresses, setAddresses] = useState([]);

  // Formik configuration for the form
  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      zipCode: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      alternatePhoneNumber: '',
      street: '',
      houseNumber: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
        .required('Mobile number is required'),
      zipCode: Yup.string()
        .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
        .required('Pin Code is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      alternatePhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
    }),
    onSubmit: (values) => {

      createAddress(values)

    },
  });

  const createAddress = async (values) => {
    setIsLoading(true)
    try {


      const payload = {
        ...values,
        addressLine: values.address,
        address: null,
        phoneNumber: `+91${values.phoneNumber}`,
        alternatePhoneNumber: values.alternatePhoneNumber ? `+91${values.alternatePhoneNumber}` : ''
      }

      let response = await axiosHttp.post(`/users/address`, payload)
      if (response.status == 201) {
        formik.resetForm();
        setSnackbarState((prev) => ({ message: response?.data?.message, open: true, type: 'success' }))
        setTimeout(() => {
          setSnackbarState((prev) => ({ open: false }))
        }, 2500);
        getUserDetails();
        setShowForm(false);
      }


    }
    catch (error) {
      setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
      setTimeout(() => {
        setSnackbarState((prev) => ({ ...prev, open: false }))
      }, 2500);
    }
    setIsLoading(false)

  }

  const handleDelete = async (id) => {
    setIsLoading(true)
    try {

      let response = await axiosHttp.delete(`/users/address/${id}`)
      if (response.status >= 199 && response.status <= 399) {
        setSnackbarState((prev) => ({ message: response?.data?.message, open: true, type: 'success' }))
        setTimeout(() => {
          setSnackbarState((prev) => ({ open: false }))
        }, 2500);

        setDialogState((prev) => ({ ...prev, open: false, id: '' }))
        getUserDetails()

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


  useEffect(() => {
    if (userDetails.address.length) {
      setAddresses(userDetails.address?.map((item) => (
        {
          ...item,
          address: item.addressLine,
          id: item._id
        }
      )));
    }
    else {
      setAddresses([])
    }
  }, [userDetails.address])


  return (
    <Grid sx={{
      pl: { md: 5, sm: 5 },
      pt: 1,
    }}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontFamily: "Futura Medium", }} gutterBottom>Manage Addresses</Typography>

      {/* "Add New Address" bar */}
      {!showForm && <Button
        sx={{
          p: 2,
          mb: 3,
          mt: 3,
          fontFamily: "Futura Medium",
        }}
        startIcon={<AddIcon sx={{ color: '#e01fff' }} />}
        onClick={() => setShowForm(!showForm)}
      >
        <Typography variant="body1" sx={{ fontFamily: "Futura Medium", color: "#e01fff" }} >Add New Address</Typography>
      </Button>
      }
      {/* Address Form (Shown when "Add New Address" is clicked) */}
      {showForm && (
        <form onSubmit={formik.handleSubmit}>
          {/* <Grid container spacing={4} sx={{bgcolor:'rgba(255, 255, 255, 0.1)', paddingBottom:3 }} > */}
          <Grid container spacing={2} sx={{ paddingBottom: 3 }} >
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                label="Mobile Number"
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address Line"
                multiline
                // rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={6} sm={6} >
              <TextField
                fullWidth
                id="street"
                name="street"
                label="Street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.street && Boolean(formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
              />
            </Grid>
            <Grid item xs={6} sm={6} >
              <TextField
                fullWidth
                id="houseNumber"
                name="houseNumber"
                label="House Number"
                value={formik.values.houseNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.houseNumber && Boolean(formik.errors.houseNumber)}
                helperText={formik.touched.houseNumber && formik.errors.houseNumber}
              />
            </Grid>

            <Grid item xs={6} sm={4} >
              <TextField
                fullWidth
                id="zipCode"
                name="zipCode"
                label="Pin Code"
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                helperText={formik.touched.zipCode && formik.errors.zipCode}
              />
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={6} sm={4} >
              <TextField
                fullWidth
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="landmark"
                name="landmark"
                label="Landmark (Optional)"
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                value={formik.values.landmark}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                id="alternatePhoneNumber"
                name="alternatePhoneNumber"
                label="Alternate Phone Number (Optional)"
                value={formik.values.alternatePhoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant='standard'
                sx={{
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#e01fff",
                  },
                  "& .MuiInputLabel-root:after": {
                    color: "white",
                  },
                }}
                error={formik.touched.alternatePhoneNumber && Boolean(formik.errors.alternatePhoneNumber)}
                helperText={formik.touched.alternatePhoneNumber && formik.errors.alternatePhoneNumber}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>

            <Button
              variant="outlined"
              sx={{
                fontFamily: "Futura Medium",
                color: '#e01fff',
                borderColor: '#e01fff',
                "&:hover": {
                  color: "#e01fff",
                  borderColor: '#e01fff',
                },
              }}
              onClick={() => {
                formik.resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              sx={{
                fontFamily: "Futura Medium",
                bgcolor: "#e01fff",
                color: 'whitesmoke',
                "&:hover": {
                  bgcolor: "#e01fff",
                  color: "whitesmoke",
                },
              }}

            >Save</Button>
          </Stack>
        </form>
      )}

      <Divider sx={{ mt: 3 }} />
      {/* List of address */}
      {addresses.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" sx={{ fontFamily: "Futura Medium", mb: 2 }}>
            Available Addresses
          </Typography>
          <Grid container spacing={1}  >
            {addresses.map((address, index) => (
              <Grid item xs={12} key={index}>
                <Stack sx={{ padding: 2 }} gap={1} width={'100%'} border={'1px solid #999999'} borderRadius={'12px'} >
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Stack direction={'row'} gap={3}  >
                      <Typography variant="body1" alignContent={'center'} sx={{ fontFamily: "Futura Medium" }} fontWeight={600} >
                        {address.name}
                      </Typography>
                      <Typography variant="body1" alignContent={'center'} sx={{ fontFamily: "Futura Medium" }} fontWeight={600}> {address.phoneNumber}</Typography>
                    </Stack>
                    <IconButton
                      onClick={() => { setDialogState((prev) => ({ ...prev, open: true, id: address.id })) }}
                    >
                      <DeleteOutline sx={{ fontSize: 'large' }} />
                    </IconButton>

                  </Stack>
                  <Divider />
                  <Stack>
                    {(address.houseNumber || address.street) && <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} mb={1}>
                      {address.houseNumber && (
                        <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }} > House Number:  {address.houseNumber},</Typography>
                      )}
                      {address.street && (
                        <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }}> Street: {address.street},</Typography>
                      )}
                    </Stack>
                    }
                    <Stack direction={'row'} gap={1} pb={1} mb={1} borderBottom={'1px solid #1f1f1f'} >
                      <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }}>{address.address}</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={1}>
                      <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }}>{address.city}, {address.state}</Typography>
                      <Typography variant="subtitle2" fontWeight={700} >- {address.zipCode}</Typography>
                    </Stack>
                    {address.landmark && (
                      <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }}>Landmark: {address.landmark}</Typography>
                    )}
                    {address.alternatePhoneNumber && (
                      <Typography variant="subtitle2" sx={{ fontFamily: "Futura Medium" }}>Alternate Phone: {address.alternatePhoneNumber}</Typography>
                    )}
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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
      <Dialog
        open={dialogState.open}


      >
        <DialogTitle>
          <Typography sx={{ fontFamily: "Futura Medium" }} >Are you sure?</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack>
            <Typography sx={{ fontFamily: "Futura Medium" }}>Are you sure you want to delete?</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>

          <Button
            variant="outlined"
            sx={{
              fontFamily: "Futura Medium",
              color: '#e01fff',
              borderColor: '#e01fff',
              fontSize: '0.75rem',
              padding: '4px 8px',
              "&:hover": {
                color: "#e01fff",
                borderColor: '#e01fff',
              },
            }}
            onClick={() => {
              setDialogState({ open: false, id: '' })
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{
              fontFamily: "Futura Medium",
              bgcolor: "#e01fff",
              color: 'whitesmoke',
              fontSize: '0.75rem',
              padding: '4px 8px',
              "&:hover": {
                bgcolor: "#e01fff",
                color: "whitesmoke",
              },
              ml: '8px'
            }}
            onClick={() => { handleDelete(dialogState.id) }}

          >Delete</Button>
        </DialogActions>
      </Dialog>


    </Grid>
  );
};

export default ManageAddresses;
