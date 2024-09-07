"use client";
import React, { useEffect, useState } from "react";
import ProfileInformation from "./ProfileInformation";
import ManageAddresses from "./ManageAddresses";
import PanCardInformation from "./PanCardInformation";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
import { Alert, Avatar, Divider, Snackbar, useMediaQuery } from "@mui/material";
import axiosHttp from "../api/_api-interceptor";

function Page() {
    const [selectedComponent, setSelectedComponent] = useState("Profile Information");
    const [flagForData, setFlagForData] = useState(false);
    const [userState, setUserState] = useState()
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
    });
    const [userDetails, setUserDetails] = useState({});
    const accountOptions = ["Profile Information", "Manage Addresses", "PAN Card Information"];
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    useEffect(() => {

        const data = localStorage.getItem('loggedInUserDetails');
        if (data) {
            setUserDetails(JSON.parse(data));
        }
    }, [flagForData]);
    // Function to render the selected component
    const renderComponent = () => {
        switch (selectedComponent) {
            case "Profile Information":
                return <ProfileInformation userDetails={userDetails} getUserDetails={getUserDetails} />;
            case "Manage Addresses":
                return <ManageAddresses userDetails={userState} getUserDetails={getUserDetails} />;
            case "PAN Card Information":
                return <PanCardInformation />;
            default:
                return <ProfileInformation />;
        }
    };

    useEffect(() => { getUserDetails() }, [])

    const getUserDetails = async () => {
        try {

            let response = await axiosHttp.get(`/users/profile?auth=${true}`)
            localStorage.setItem('loggedInUserDetails', JSON.stringify(response.data.data))
            setUserState(response.data.data)
            setFlagForData(!flagForData)
            // setSnackbarState((prev) => ({ message: response?.data?.message, open: true, type: 'success' }))
            // setTimeout(() => {
            //     setSnackbarState((prev) => ({ ...prev, open: false }))
            // }, 2500);
        }
        catch (error) {
            console.log(error)
            setSnackbarState((prev) => ({ message: error?.response?.data?.message, open: true, type: 'error' }))
            setTimeout(() => {
                setSnackbarState((prev) => ({ ...prev, open: false }))
            }, 2500);
        }
    }



    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "black", color: "white", p: 2 }}>
            <Grid container spacing={2}>
                {/* Sidebar */}
                <Grid
                    item
                    xs={12}
                    md={2.5}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        alignItems: "center",
                        justifyContent: { xs: "space-around", md: "flex-start" },
                    }}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            width: "100%",
                            alignItems: { xs: "center", md: "flex-start" },
                        }}
                    >
                        {/* User Card */}
                        <Card
                            sx={{
                                width: { xs: "100%", md: "100%" },
                                bgcolor: "#1f2937",
                                color: "white",
                            }}
                        >
                            <CardContent>
                                <Stack direction={"row"} gap={3}>
                                    <Avatar></Avatar>
                                    {userDetails?.firstName ? <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "Futura Medium",
                                        }}
                                        alignContent={"center"}
                                    >
                                        {userDetails?.firstName + " " + userDetails?.lastName}
                                    </Typography>
                                        :
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: "Futura Medium",
                                            }}
                                            alignContent={"center"}
                                        >
                                            {"Your Name"}
                                        </Typography>
                                    }
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Navigation Links */}
                        <List
                            component="nav"
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "row", md: "column" },
                                width: "100%",
                            }}
                        >
                            {accountOptions.map((text) => (
                                <ListItem key={text} disablePadding={isSmallScreen} sx={{ width: "auto" }}>
                                    <ListItemButton
                                        selected={selectedComponent === text}
                                        onClick={() => setSelectedComponent(text)}
                                        sx={{
                                            "&.Mui-selected": {
                                                bgcolor: "#1f2937",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        <Typography sx={{ fontFamily: "Futura Medium" }}>{text}</Typography>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </Grid>

                {/* Divider */}
                <Grid item xs={12} md={0.5} sx={{ display: { xs: "none", md: "block" } }}>
                    <Divider
                        orientation="vertical"
                        sx={{
                            height: '60%',
                            mt: 12
                        }}
                    />
                </Grid>

                {/* Main Content Area */}
                <Grid item xs={12} md={9}>
                    {renderComponent()}
                </Grid>
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
        </Box>
    );
}

export default Page;
