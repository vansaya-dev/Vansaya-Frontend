
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './page';

const ClientNavbar = () => {
  const pathname = usePathname(); 

  // Defining the paths where we don't want the Navbar to be shown
  const noNavbarRoutes = ['/login'];

  // Conditionally rendering the Navbar based on the current path
  if (noNavbarRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar  />;
};

export default ClientNavbar;
