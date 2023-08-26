"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function OtherItinerariesModal({ children, label }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-4 w-full cursor-pointer rounded-lg duration-150 border outline-none border-1 border-black/20 bg-slate-100/25 hover:bg-slate-100/50"
        >
          {label}
        </button>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative isolate z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform space-y-6 overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-black"
                    >
                      Other Itineraries
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-black-bg text-gray-400 hover:text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
