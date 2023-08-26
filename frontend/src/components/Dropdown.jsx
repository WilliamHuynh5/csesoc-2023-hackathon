import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";


export default function Dropdown({ heading, visits, setMarker }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-1 border-black/20 rounded-lg">
      <div className={`flex items-center justify-between gap-2 border border-t-0 border-x-0 ${!expanded && "border-b-0"} border-black/20 p-4`} onClick={() => setExpanded((prev) => !prev)}>
        <h1 className="capitalize">{heading}</h1>
        <span>
          {expanded ? <ChevronUpIcon className="w-4 h-4 cursor-pointer" /> : <ChevronDownIcon className="w-4 h-4 cursor-pointer" /> }
        </span>
      </div>
      {expanded && visits.map((visit) => (
        <div className="flex gap-2 p-4">
          <div>{visit.startTime} - {visit.endTime}</div>
          <div className="hover:underline cursor-pointer" onClick={() => setMarker({ lat: visit.latitude, lng: visit.longitude })}>{visit.name}</div>
        </div>
      ))}
    </div>
  )
}