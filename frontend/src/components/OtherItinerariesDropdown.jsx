import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function OtherItinerariesDropdown({ itinerary, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-1 border-black/20 rounded-lg">
      <div
        className={`flex items-center justify-between gap-2 border border-t-0 border-x-0 ${
          !expanded && "border-b-0"
        } border-black/20 p-4`}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <h4>{new Date(itinerary.dateCreated).toLocaleDateString()} - Plan #{index + 1}</h4>
        <span>
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4 cursor-pointer" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 cursor-pointer" />
          )}
        </span>
      </div>
      {expanded &&
        Object.keys(itinerary.plan).map((day) => {
          return (
            <div className="p-4 space-y-2">
              <h5 className="capitalize font-bold">{day}</h5>
              {itinerary.plan[day].map((visit) => (
                <p>{visit.name}</p>
              ))}
            </div>
          );
        })}
    </div>
  );
}
