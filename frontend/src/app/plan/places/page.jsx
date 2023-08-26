"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import LocationList from "@/components/LocationList";
import Wave from '@/components/FunniWave/FunniWave';
import { useContextHook, Context } from "src/app/context";
import { post } from "@/utils/request";

export default function Places() {
  const [locations, setLocations] = useState([]);
  const router = useRouter();
  const { getters, setters } = useContextHook(Context);

  // Refs
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // Autocomplete options
  const options = {
    fields: ["place_id", "formatted_address", "name"]
  };

  // Functions

  const generateItinerary = async () => {
    setters.setPlaces(locations);
    try {
      const res = await post("http://localhost:49152/itinerary/generate", {
        plan: {
          startDate: getters.startDate,
          endDate: getters.endDate,
          accomodation: getters.accomodation,
          places: locations
        }
      }, true);
      localStorage.setItem('itineraryId', res.itineraryId);
      router.push('/itinerary', undefined, { shallow: true });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Initialize autocomplete search bar
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    // Add place to array
    autoCompleteRef.current.addListener("place_changed", async () => {
      const place = await autoCompleteRef.current.getPlace();
      setLocations((prevLocations) => 
        [...prevLocations, { ...place, hours: 1 }]
      );
    });
  }, []);

  return (
    <div className="h-screen relative flex flex-col gap-8 justify-center items-center overflow-hidden">
      <h1 className="font-bold">ITINERARY COOKER</h1>
      <div className="w-2/5 space-y-8">
        <div className="[&>*]:block text-center space-y-8">
          <label
            className="font-bold text-black/75 text-4xl dynamic-txts"
            htmlFor="locations-input"
          >
            What are your places of interests?
          </label>
          <input
            className="w-full p-2 border outline-none border-1 border-black/20 rounded-lg"
            id="locations-input"
            ref={inputRef}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {locations.map((location, index) => (
            <LocationList index={index} location={location} setLocations={setLocations} />
          ))}
        </div>
        <button
          className="p-4 bg-slate-100 w-full rounded-lg duration-150 hover:bg-slate-200"
          type="button"
          onClick={() => generateItinerary()}
          
        >
          Create Itinerary
        </button>
      </div>
      <div className="absolute bottom-0 h-fit opacity-20">
        <Wave />
      </div>
    </div>
  );
}