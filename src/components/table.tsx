'use client'
import React, { useState } from 'react'
import RequestForm from './requestForm'
import RequestModal from './requestModal'
import { userStore } from '../store'
import { requestStore } from '../store/request'
import { senderRequests } from '../utils/request'
const Table = () => {
    const [openForm, setOpenForm] = useState(false)
    const user = userStore((state:any) => state.user)
    const role = user.role
    console.log('role ==> ', user.role)
    const fetchRequests = requestStore((state: any) => state.fetchRequests)
    const handleError = requestStore((state:any) => state.handleError)
    const loadingState = requestStore((state:any) => state.loadingState)
    const requests = requestStore((state:any) => state.requests)
    console.log('all requests ', requests)
    const handleOpenForm = () => {
        setOpenForm(true)
    }
    const handleCloseForm = () => {
        setOpenForm(false)
    }

    const [openRequest, setOpenRequest] = useState(false)
    const handleOpenRequest = () => {
        setOpenRequest(true)
    }
    const handleCloseRequest = () => {
        setOpenRequest(false)
    }
    React.useEffect(() => {
        const getRequests = async () => {
            try {
                loadingState(true)
                const res = await senderRequests({token: user.token})
                console.log("requests ==> ", res)
                loadingState(false)
                if(res.code === 200) fetchRequests(res.requests)
            } catch (error) {
                loadingState(false)
                handleError(error)
                return error
            }
        }
        getRequests()
    }, [user.token])
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
                    <p className="text-sm text-gray-600 ">
                      Send, edit and more.
                    </p>
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

                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50 ">
                    <tr>
                      <th scope="col" className="pl-6 py-3 text-left">
                        <label
                          htmlFor="hs-at-with-checkboxes-main"
                          className="flex"
                        >
                          <input
                            type="checkbox"
                            className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500"
                            id="hs-at-with-checkboxes-main"
                          />
                          <span className="sr-only">Checkbox</span>
                        </label>
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
                        <th scope="col" className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                            Type
                            </span>
                        </div>
                        </th>
                        {
                            role === "ADMINISTRATOR" && (<th scope="col" className="px-6 py-3 text-left">
                            <div className="flex items-center gap-x-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                                Sender
                                </span>
                            </div>
                            </th>)
                        }
        
                        
        
                        <th scope="col" className="px-6 py-3 text-left">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 ">
                            Recipient
                          </span>
                        </div>
                        </th>
    
        
                        <th scope="col" className="px-6 py-3 text-right"></th>
                    </tr>
                    </thead>
        
                    <tbody className="divide-y divide-gray-200 ">
                        {
                            requests && requests.map((req:any, key: number) => (

                            <tr key={key}>
                                <td className="h-px w-px whitespace-nowrap">
                                <div className="pl-6 py-3">
                                    <label htmlFor="hs-at-with-checkboxes-1" className="flex">
                                    <input type="checkbox" className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500    " id="hs-at-with-checkboxes-1"/>
                                    <span className="sr-only">Checkbox</span>
                                    </label>
                                </div>
                                </td>
                                <td className="h-px w-px whitespace-nowrap">
                                <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                    <div className="flex items-center gap-x-3">
                                    {/* <img className="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"/> */}
                                    <div className="grow">
                                        <span className="block text-sm font-semibold text-gray-800 ">{req.subject}</span>
                                        {/* <span className="block text-sm text-gray-500">christina@site.com</span> */}
                                    </div>
                                    </div>
                                </div>
                                </td>
                                <td className="h-px w-px whitespace-nowrap">
                                <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
                                    <div className="flex items-center gap-x-3">
                                    {/* <img className="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"/> */}
                                    <div className="grow">
                                        <span className="block text-sm font-semibold text-gray-800 ">{req.type}</span>
                                        {/* <span className="block text-sm text-gray-500">christina@site.com</span> */}
                                    </div>
                                    </div>
                                </div>
                                </td>
                                {
                                    role === 'ADMINISTRATOR' && (
                                        <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="block text-sm font-semibold text-gray-800 ">{req.senderId}</span>
                                    {/* <span className="block text-sm text-gray-500">Human resources</span> */}
                                </div>
                                </td>
                                    )
                                }
                                <td className="h-px w-px whitespace-nowrap">
                                <div className="px-6 py-3">
                                    <span className="text-sm text-gray-500">{req.receiverId}</span>
                                </div>
                                </td> 
                                <td className="h-px w-px whitespace-nowrap">
                                <div className="px-6 py-1.5">
                                    <button onClick={handleOpenRequest} className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium" >
                                    Open
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
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
        open={openRequest}
        handleClose={handleCloseRequest}
        handleOpen={handleOpenRequest}
      />
    </>
  );
};

export default Table;
