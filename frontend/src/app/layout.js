"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { createContext, useContext } from "react";
import { React, useState, useEffect } from "react";
import { Context } from "./context";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userToken, setUserToken] = useState(undefined);
  const [toLocation, setToLocation] = useState(undefined);
  const [fromLocation, setFromLocation] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [accomodation, setAccomodation] = useState(undefined);
  const [places, setPlaces] = useState(undefined);


  const pathname = usePathname();

  const getters = {
    userToken,
    toLocation,
    fromLocation,
    startDate,
    endDate,
    accomodation,
    places
  };
  const setters = {
    setUserToken,
    setToLocation,
    setFromLocation,
    setStartDate,
    setEndDate,
    setAccomodation,
    setPlaces
  };

  // Page transition animation setting
  const variants = {
    out: {
      y: 5,
      opacity: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
    in: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Context.Provider value={{ getters, setters }}>
      <html lang="en">
        <AnimatePresence initial={false} mode="wait">
          <motion.body
            key={pathname}
            variants={variants}
            animate="in"
            initial="out"
            className="font-poppins"
          >
            {children}
          </motion.body>
        </AnimatePresence>
        <script
          src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyD_jpgmxhZegGWW22RYateI93HH-JQu7io"
          async
        ></script>
      </html>
    </Context.Provider>
  );
}
