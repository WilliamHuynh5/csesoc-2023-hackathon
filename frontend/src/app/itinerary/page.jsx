"use client";

import Dropdown from "@/components/Dropdown";
import { MinusIcon, ListBulletIcon } from "@heroicons/react/24/outline"
import { useState, useMemo, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { get } from "@/utils/request";

export default function Itinerary() {
  const [expanded, setExpanded] = useState(true);
  const [marker, setMarker] = useState({ lat: 0, lng: 0 });
  const [plan, setPlan] = useState();
  const [map, setMap] = useState();

  useEffect(() => {
    const getPlan = async () => {
      try {
        const { plan } = await get(`http://localhost:49152/itinerary/${localStorage.getItem("itineraryId")}`, {}, true);
        setPlan(plan);
        setMarker({ lat: plan.day1[0].latitude, lng: plan.day1[0].longitude })
      } catch (err) {
        console.log(err);
      }
    }
    getPlan();
  }, []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD_jpgmxhZegGWW22RYateI93HH-JQu7io",
  });

  useEffect(() => {
    if (map) {
      map.panTo(marker);
    }
  }, [marker]);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute left-0 visible w-full h-full">
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={marker}
            zoom={10}
            options={{
              fullscreenControl: false
            }}
            onLoad={map => setMap(map)}
          >
            <Marker position={marker} />
          </GoogleMap>
        )}
      </div>
      {expanded ? 
        <div className="p-8 space-y-4 bg-white shadow-lg min-w-[320px] w-1/3 absolute right-0 top-0 h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Itinerary</h1>
            <MinusIcon className="w-4 h-4 cursor-pointer" onClick={() => setExpanded(prev => !prev)} />
          </div>
          <p>Here is a generated itinerary list that we created for you :D</p>
          {plan && Object.keys(plan).map((day) => (
            <Dropdown heading={day} visits={plan[day]} setMarker={setMarker} />
          ))}
        </div>
      : 
        <div className="p-[6px] space-y-4 bg-white drop-shadow-md rounded-sm absolute right-[10px] top-4 cursor-pointer" onClick={() => setExpanded(prev => !prev)}>
          <ListBulletIcon className="w-7 h-7" />
        </div>
      }
    </div>
    );
}