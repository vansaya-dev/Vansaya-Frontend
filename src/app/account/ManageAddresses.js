"use client";
import React, { useState } from 'react';
import {
  Box, Button, Container, Grid, TextField, Typography, Paper, Stack
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';

const ManageAddresses = () => {
  const [showForm, setShowForm] = useState(false);

  // Formik configuration for the form
  const formik = useFormik({
    initialValues: {
      name: '',
      mobileNumber: '',
      pinCode: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      alternatePhoneNumber: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      mobileNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
        .required('Mobile number is required'),
      pinCode: Yup.string()
        .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
        .required('Pin Code is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      alternatePhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be exactly 10 digits'),
    }),
    onSubmit: (values) => {
      console.log(values); // Print form values to the console
      formik.resetForm(); // Reset the form after submission
      setShowForm(false); // Hide form after saving
    },
  });

  return (
    <Grid sx={{
      pl: { md: 5, sm: 5 },
      pt: 1,
    }}>
      {/* Title */}
      <Typography variant="h5" gutterBottom>Manage Addresses</Typography>

      {/* "Add New Address" bar */}
      <Button
        sx={{
          p: 2,
          mb: 3,
          mt: 3,
          fontFamily: "Futura Medium",
        }}
        startIcon={<AddIcon />}
        onClick={() => setShowForm(!showForm)}
      >
        <Typography variant="body1" sx={{ fontFamily: "Futura Medium", }} >Add New Address</Typography>
      </Button>

      {/* Address Form (Shown when "Add New Address" is clicked) */}
      {showForm && (
        <form onSubmit={formik.handleSubmit}>
          {/* <Grid container spacing={4} sx={{bgcolor:'rgba(255, 255, 255, 0.1)', paddingBottom:3 }} > */}
          <Grid container spacing={4} sx={{ paddingBottom:3 }} >
            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="mobileNumber"
                name="mobileNumber"
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
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              />
            </Grid>

            <Grid item xs={12}  sm={4} >
              <TextField
                fullWidth
                id="pinCode"
                name="pinCode"
                label="Pin Code"
                value={formik.values.pinCode}
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
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
              />
            </Grid>

           

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                multiline
                rows={3}
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6} >
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
            <Button variant="contained" color="primary" type="submit">Save</Button>
            <Button
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                setShowForm(false); // Hide form on cancel
              }}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      )}
    </Grid>
  );
};

export default ManageAddresses;
