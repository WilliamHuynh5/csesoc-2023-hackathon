import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LocationList({ index, location, setLocations }) {
  const [editTime, setEditTime] = useState(false);

  const changeHours = (index, hours) => {
    setLocations((prevLocations) => {
      const newLocations = [...prevLocations];
      newLocations[index].hours = hours;
      return newLocations;
    });
  }

  const removeLocation = (index) => {
    setLocations((prevLocations) => {
      const prev = [...prevLocations];
      prev.splice(index, 1);
      return prev;
    });
  }

  return (
    <div key={index} className="flex gap-2 justify-between items-center p-4 duration-150 rounded-lg hover:bg-slate-50">
      <div className="flex gap-4">
        <div>
          {editTime ? 
            <input className="w-10 truncate text-black/50 outline-none" defaultValue={1} value={location.hours} type="number" min={1} max={24} onChange={(event) => changeHours(index, event.target.value)} onBlur={() => setEditTime((prev) => !prev)} />
            :
            <span className="w-10 truncate text-black/50" onClick={() => setEditTime((prev) => !prev)}>{location.hours}h</span>
          }
        </div>
        <span>{location.name}</span>
      </div>
      <div className="flex gap-2">
        <span className="cursor-pointer" onClick={() => removeLocation(index)}>
          <TrashIcon className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
}