import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { requestDetailsStore } from "../store/requestDetails";
import { requestStore, userStore } from "../store";
import { addComment, requestDetails } from "../utils/request";
import Spinner from 'react-spinner-material';
import { toast } from "react-hot-toast";

type Props = {
  open: boolean;
  id: string;
  handleOpen: () => void;
  handleClose: () => void;
};

export default function RequestModal(props: Props) {
  const [value, setValue] = React.useState("")
  const user = userStore((state: any) => state.user);

  const fetchRequest = requestDetailsStore((state: any) => state.fetchRequest);
  const handleError = requestDetailsStore((state: any) => state.handleError);
  const loadingState = requestDetailsStore((state: any) => state.loadingState);
  const request = requestDetailsStore((state: any) => state.req);
  const isLoading = requestDetailsStore((state: any) => state.loading);
  const update = requestStore((state:any) => state.updateRequest)
console.log("user token ==< ", user.token)
  const getRequests = async () => {
    try {
      loadingState(true);
      const res = await requestDetails({ token: user.token, id: props.id });
      console.log("requestsooo ==> ", res);
      loadingState(false);
      if (res.code === 200) {
        fetchRequest(res.request)
        update(res.request)
      };
    } catch (error) {
      loadingState(false);
      handleError(error);
      return error;
    }
  };
  const submitComment = async () => {
    try {
      console.log(value)
      const res = await addComment({token: user.token, id: props.id, comment: value})
      console.log('comment => ', res)
      if(res.code === 201) {
        toast.success(res.message, { position: "top-right" });
      } else {
        toast.error(res.message, { position: "top-right" });
      }
    } catch (error:any) {
      console.log(error)
      toast.error(error.message, { position: "top-right"} )
      return error
    }
  }

  useEffect(() => {
  if(props.open) {
    console.log("here ======")
    getRequests()
  }
  }, [props.open]);

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {isLoading ? (
                  <div className="min-w-full h-[20vh] flex justify-center items-center">
                    <Spinner
                      radius={50}
                      color="#3b82f6"
                      stroke={2}
                      visible={true}
                    />
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm  ">
                    <div className="p-4 sm:p-7">
                      <div className="">
                        <h2 className="block text-2xl font-bold text-gray-800 ">
                          Request Details
                        </h2> 
                      </div>

                      <div className="mt-5">
                        <p className="text-sm text-gray-600 ">hi</p>
                        <p className="text-sm text-gray-600 "></p>
                        <form>
                          <div className="grid gap-y-4">
                            <div>
                              <label
                                htmlFor="content"
                                className="block text-lg font-bold text-gray-800 my-2 "
                              >
                                Add a comment
                              </label>
                              <div className="relative flex gap-2">
                                <textarea
                                  name="content"
                                  id="content"
                                  // cols={30}
                                  value={value}
                                  onChange={(e) => setValue(e.target.value)}
                                  rows={2}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                                  required
                                  aria-describedby="content-error"
                                ></textarea>

                                <button
                                  onClick={submitComment}
                                  type="button"
                                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                >
                                  Send
                                </button>

                                <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                                  <svg
                                    className="h-5 w-5 text-red-500"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    aria-hidden="true"
                                  >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                  </svg>
                                </div>
                              </div>
                              <p
                                className="hidden text-xs text-red-600 mt-2"
                                id="content-error"
                              >
                                Please include a valid title address so we can
                                get back to you
                              </p>
                            </div>
                          </div>
                        </form>

                        <div>
                          <div className="py-8 first:pt-0 last:pb-0">
                            <div className="my-5">
                              <h3 className="md:text-sm font-semibold text-gray-800 ">
                                My team has credits. How do we use them?
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">
                                Once your team signs up for a subscription plan.
                                This is where we sit down, grab a cup of coffee
                                and dial in the details.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
