"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Wave from '@/components/FunniWave/FunniWave';
import { useContextHook, Context } from 'src/app/context';

export default function Places() {
  const [accomodation, setAccomodation] = useState({});
  const { getters, setters } = useContextHook(Context);

  // Refs
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  // Router
  const router = useRouter();

  // Autocomplete options
  const options = {
    fields: ["place_id", "formatted_address", "name"],
  };

  // Functions
  const redirectToPlaces = async () => {
    setters.setAccomodation(accomodation);
    router.push('/plan/places', undefined, { shallow: true });
  }

  useEffect(() => {
    // Initialize autocomplete search bar
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    
    // autoCompleteRef.setTypes(['(cities)']);
    // Display selected location
    autoCompleteRef.current.addListener("place_changed", async () => {
      const accomodation = await autoCompleteRef.current.getPlace();
      setAccomodation(accomodation);
    });
  }, []);

  return (
    <div className="h-screen relative flex flex-col gap-8 justify-center items-center overflow-hidden">
      <h1 className="font-bold">ITINERARY COOKER</h1>
      <div className="w-2/5 space-y-8">
        <div className="[&>*]:block text-center space-y-8">
          <label
            className="font-bold text-black/75 text-4xl dynamic-txts"
            htmlFor="accom-input"
          >
            Where do you want to stay?
          </label>
          <input
            className="w-full p-2 border outline-none border-1 border-black/20 rounded-lg"
            id="accom-input"
            ref={inputRef}
          />
        </div>
        <button
          className="p-4 bg-slate-100 w-full rounded-lg duration-150 hover:bg-slate-200"
          type="button"
          onClick={() => redirectToPlaces()}
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