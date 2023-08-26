"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useContextHook, Context } from "src/app/context";
import Wave from "@/components/FunniWave/FunniWave";
import OtherItinerariesModal from "@/components/OtherItinerariesModal";
import { get } from "@/utils/request";
import Dropdown from "@/components/Dropdown";
import OtherItinerariesDropdown from "@/components/OtherItinerariesDropdown";
import Itinerary from "@/app/itinerary/page";

export default function TravelTo() {
  const [toLocation, setToLocation] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { getters, setters } = useContextHook(Context);
  const [itineraries, setItineraries] = useState([]);

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
  const redirectToDuration = async () => {
    setters.setToLocation(toLocation);
    router.push("/plan/travel/duration", undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize autocomplete search bar
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Display selected location
    autoCompleteRef.current.addListener("place_changed", async () => {
      const toLocation = await autoCompleteRef.current.getPlace().name;
      setToLocation(toLocation);
    });
  }, []);

  useEffect(() => {
    const getItineraries = async () => {
      try {
        const { itineraries } = await get(
          `http://localhost:49152/itinerary/view/location/itineraries?dest=${toLocation}`,
          {},
          true
        );
        setItineraries(itineraries);
      } catch (err) {
        setItineraries([]);
      }
    };
    getItineraries();
  }, [toLocation]);

  return (
    <div className="h-screen relative flex flex-col gap-8 justify-center items-center overflow-hidden">
      <h1 className="font-bold">ITINERARY COOKER</h1>
      <div className="w-2/5 space-y-8">
        <div className="[&>*]:block text-center space-y-8">
          <label
            className="font-bold text-black/75 text-4xl dynamic-txts"
            htmlFor="to-input"
          >
            Where are you travelling to?
          </label>
          <input
            className="w-full p-2 border outline-none border-1 border-black/20 rounded-lg"
            id="to-input"
            ref={inputRef}
          />
        </div>
        <button
          className="p-4 bg-slate-100 w-full rounded-lg duration-150 hover:bg-slate-200"
          type="button"
          onClick={() => redirectToDuration()}
        >
          Continue
        </button>
        <hr></hr>
        {toLocation && (
          <OtherItinerariesModal label="Look at other itineraries of this location?">
            {!itineraries.length ? (
              <p>No itineraries for this location yet</p>
            ) : (
              <>
                {itineraries.map((itinerary, index) => (
                  <OtherItinerariesDropdown
                    itinerary={itinerary}
                    index={index}
                  />
                ))}
              </>
            )}
          </OtherItinerariesModal>
        )}
      </div>
      <div className="absolute bottom-0 h-fit opacity-20">
        <Wave />
      </div>
    </div>
  );
}
