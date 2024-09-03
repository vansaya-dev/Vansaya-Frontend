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
import { Avatar, Divider, useMediaQuery } from "@mui/material";
import axiosHttp from "../api/_api-interceptor";

function Page() {
    const [selectedComponent, setSelectedComponent] = useState("Profile Information");
    const [flagForData, setFlagForData] = useState(false);
    // const [userDetails, setUserDetails] = useState({});
    const accountOptions = ["Profile Information", "Manage Addresses", "PAN Card Information"];
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    let userDetails = {}
    const data = localStorage.getItem('loggedInUserDetails');
    userDetails = JSON.parse(data);
    useEffect(() => {
        const data = localStorage.getItem('loggedInUserDetails');
        userDetails = JSON.parse(data); 
        // setUserDetails(userDetails)
    }, [flagForData])
    // Function to render the selected component
    const renderComponent = () => {
        switch (selectedComponent) {
            case "Profile Information":
                return <ProfileInformation userDetails={userDetails} getUserDetails={getUserDetails} />;
            case "Manage Addresses":
                return <ManageAddresses />;
            case "PAN Card Information":
                return <PanCardInformation />;
            default:
                return <ProfileInformation />;
        }
    };

    const getUserDetails = async () => {
        try {

            let response = await axiosHttp.get(`/users/profile`)
            localStorage.setItem('loggedInUserDetails', JSON.stringify(response.data.data))
            setFlagForData(!flagForData)
        }
        catch (error) {
            console.log(error)
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
        </Box>
    );
}

export default Page;
