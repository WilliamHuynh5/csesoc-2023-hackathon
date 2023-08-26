"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useContextHook, Context } from "src/app/context";
import { get } from "@/utils/request";
import Wave from "@/components/FunniWave/FunniWave";

export default function TravelFrom() {
  const [fromLocation, setFromLocation] = useState("");
  const { getters, setters } = useContextHook(Context);

  // Refs
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // Router
  const router = useRouter();

  // Autocomplete options
  const options = {
    fields: ["place_id", "formatted_address", "name"],
    types: ["(cities)"],
  };

  // Functions
  const redirectToTo = async () => {
    setters.setFromLocation(fromLocation);
    router.push("/plan/travel/to", undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize autocomplete search bar
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Display selected location
    autoCompleteRef.current.addListener("place_changed", async () => {
      const fromLocation = await autoCompleteRef.current.getPlace().name;
      setFromLocation(fromLocation);
    });
  }, []);

  return (
    <div className="h-screen relative flex flex-col gap-8 justify-center items-center overflow-hidden">
      <h1 className="font-bold">ITINERARY COOKER</h1>
      <div className="w-2/5 space-y-8">
        <div className="[&>*]:block text-center space-y-8">
          <label
            className="font-bold text-black/75 text-4xl dynamic-txts"
            htmlFor="from-input"
          >
            Where are you travelling from?
          </label>
          <input
            className="w-full p-2 border outline-none border-1 border-black/20 rounded-lg"
            id="from-input"
            ref={inputRef}
          />
        </div>
        <button
          className="p-4 bg-slate-100 w-full rounded-lg duration-150 hover:bg-slate-200"
          type="button"
          onClick={() => redirectToTo()}
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
