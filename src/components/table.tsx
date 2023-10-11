"use client";
import React, { useState } from "react";
import RequestForm from "./requestForm";
import RequestModal from "./requestModal";
import { userStore } from "../store";
import { fetchAllRequests } from "../utils/request";
import { requestStore, singleRequestStore } from "../store/request";
import formatDate from "../utils/date";
import Spinner from "react-spinner-material";

const Table = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const user = userStore((state: any) => state.user);
  const role = user.role;
  console.log("role ==> ", user.role);
  const fetchRequests = requestStore((state: any) => state.fetchRequests);
  const handleError = requestStore((state: any) => state.handleError);
  const loadingState = requestStore((state: any) => state.loadingState);
  const requests = requestStore((state: any) => state.requests);
  const isLoading = requestStore((state: any) => state.loading);
  const newRequest = singleRequestStore((state:any) => state.singleRequest)
  // console.log("all requests ", requests);
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const [openRequest, setOpenRequest] = useState(false);
  const handleOpenRequest = () => {
    setOpenRequest(true);
  };
  const handleCloseRequest = () => {
    setOpenRequest(false);
  };
  React.useEffect(() => {
    const getRequests = async () => {
      try {
        loadingState(true);
        const res = await fetchAllRequests({ token: user.token });
        // console.log("requests ==> ", res);
        // const res = await senderRequests({ token: user.token });
        console.log("requests ==> ", res);
        loadingState(false);
        if (res.code === 200) fetchRequests(res.requests);
      } catch (error) {
        loadingState(false);
        handleError(error);
        return error;
      }
    };
    getRequests();
  }, [user.token]);
  return (
    <>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden  ">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 ">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 ">
                      Requests
                    </h2>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      {/* <a className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm " href="#">
                        View all
                        </a>
         */}
                      <button
                        onClick={handleOpenForm}
                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                      >
                        <svg
                          className="w-3 h-3"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M2.63452 7.50001L13.6345 7.5M8.13452 13V2"
                            stroke="currentColor"
                            strokeWidth="2"
                            stroke-linecap="round"
                          />
                        </svg>
                        New request
                      </button>
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <div className="min-w-full h-[20vh] flex justify-center items-center">
                    <Spinner
                      radius={80}
                      color="#3b82f6"
                      stroke={2}
                      visible={true}
                    />
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50 ">
                      <tr>
                        <th scope="col" className="pl-6 py-3 text-left"></th>
                        <th
                          scope="col"
                          className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3 text-left"
                        >
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                              Date sent
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3 text-left"
                        >
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                              Title
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3 text-left"
                        >
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                              Type
                            </span>
                          </div>
                        </th>
                        {(role === "ADMINISTRATOR" ||
                          role === "FACILITATOR") && (
                          <th scope="col" className="px-6 py-3 text-left">
                            <div className="flex items-center gap-x-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                                Sender
                              </span>
                            </div>
                          </th>
                        )}

                        {(role === "ADMINISTRATOR" || role === "STUDENT") && (
                          <th scope="col" className="px-6 py-3 text-left">
                            <div className="flex items-center gap-x-2">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                                Recipient
                              </span>
                            </div>
                          </th>
                        )}

                        <th scope="col" className="px-6 py-3 text-right"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 ">
                      {requests &&
                        requests.map((req: any, key: number) => (
                          <tr key={key}>
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="pl-6 py-3">
                                <label
                                  htmlFor="hs-at-with-checkboxes-1"
                                  className="flex"
                                >
                                  <input
                                    type="checkbox"
                                    className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500    "
                                    id="hs-at-with-checkboxes-1"
                                  />
                                  <span className="sr-only">Checkbox</span>
                                </label>
                              </div>
                            </td>
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                <div className="flex items-center gap-x-3">
                                  <div className="grow">
                                    <span className="block text-sm font-semibold text-gray-800 ">
                                      {formatDate(req.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                <div className="flex items-center gap-x-3">
                                  {/* <img className="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"/> */}
                                  <div className="grow">
                                    <span className="block text-sm font-semibold text-gray-800 ">
                                      {req.subject}
                                    </span>
                                    {/* <span className="block text-sm text-gray-500">christina@site.com</span> */}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                <div className="flex items-center gap-x-3">
                                  <div className="grow">
                                    {req.type === "ACADEMIC" && (
                                      <div className="bg-[#005B41] py-1 px-2 rounded-md flex justify-center items-center w-fit shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                                        <p className="text-xs font-semibold text-white">
                                          {req.type}
                                        </p>
                                      </div>
                                    )}
                                    {req.type === "ADMINISTRATIVE" && (
                                      <div className="bg-[#26577C] py-1 px-2 rounded-md flex justify-center items-center w-fit shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                                        <p className="text-xs font-semibold text-white">
                                          {req.type}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {role === "ADMINISTRATOR" && (
                              <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3">
                                  <span className="block text-sm font-semibold text-gray-800 ">
                                    {req.sender.email}
                                  </span>
                                  {/* <span className="block text-sm text-gray-500">Human resources</span> */}
                                </div>
                              </td>
                            )}
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="px-6 py-3">
                                <span className="text-sm text-gray-500">
                                  {req.receiver.email}
                                </span>
                              </div>
                            </td>
                            <td className="h-px w-px whitespace-nowrap">
                              <div className="px-6 py-1.5">
                                <button
                                  onClick={() => {
                                    handleOpenRequest();
                                    setSelectedId(req.id);
                                  }}
                                  className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium"
                                >
                                  Open
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <RequestForm
        open={openForm}
        handleClose={handleCloseForm}
        handleOpen={handleOpenForm}
      />
      <RequestModal
        id={selectedId}
        open={openRequest}
        handleClose={handleCloseRequest}
        handleOpen={handleOpenRequest}
      />
    </>
  );
};

export default Table;
