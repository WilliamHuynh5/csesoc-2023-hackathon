"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MultiInputDateRangeField } from "@mui/x-date-pickers-pro/MultiInputDateRangeField";
import Wave from "@/components/FunniWave/FunniWave";
import { useContextHook, Context } from "src/app/context";

export default function TravelDurationPage() {
  const [dateRange, setDateRange] = useState([null, null]);
  const { getters, setters } = useContextHook(Context);

  //Router
  const router = useRouter();

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
  };

  // Functions
  const redirectToAccomodation = async () => {
    setters.setStartDate(dateRange[0]);
    setters.setEndDate(dateRange[1]);
    router.push("/plan/travel/accomodation", undefined, { shallow: true });
  };

  return (
    <div className="h-screen relative flex flex-col gap-8 justify-center items-center overflow-hidden">
      <h1 className="font-bold">ITINERARY COOKER</h1>
      <div className="w-2/5 space-y-8">
        <div className="[&>*]:block text-center space-y-8">
          <label
            className="font-bold text-black/75 text-4xl dynamic-txts"
            htmlFor="duration-input"
          >
            How long are you travelling for?
          </label>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={[
              "MultiInputDateRangeField",
              "SingleInputDateRangeField",
            ]}
          >
            <MultiInputDateRangeField
              value={dateRange}
              onChange={handleDateRangeChange}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </DemoContainer>
        </LocalizationProvider>
        <button
          className="p-4 bg-slate-100 w-full rounded-lg duration-150 hover:bg-slate-200"
          type="button"
          onClick={() => redirectToAccomodation()}
        >
          Continue
        </button>
      </div>
      <div className="absolute bottom-0 h-fit opacity-20">
        <Wave />
      </div>
    </div>
  );
}
