import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { singleRequestStore } from "../store/request";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendRequest } from "../utils/request";
import { z } from "zod";
import { receiverStore, userStore } from "../store";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import React from "react";
import { getReceivers } from "../utils/user";
type Props = {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

enum requestType {
  ADMINISTRATIVE = "ADMINISTRATIVE",
  ACADEMIC = "ACADEMIC",
}

const sendRequestSchema = z.object({
  subject: z.string({ required_error: "Please enter the subject" }),
  message: z.string({ required_error: "Please enter the message" }),
  type: z.nativeEnum(requestType),
  receiverId: z.string({ required_error: "Please enter the subject" }),
});

type sendRequest = z.infer<typeof sendRequestSchema>;

export default function RequestForm(props: Props) {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<sendRequest>({
    resolver: zodResolver(sendRequestSchema),
  });

  const fetchReceivers = receiverStore((state: any) => state.fetchReceivers);
  const handleError = receiverStore((state: any) => state.handleError);
  const receiverLoadingState = receiverStore(
    (state: any) => state.loadingState
  );
  const receivers = receiverStore((state: any) => state.requests);

  const user = userStore((state: any) => state.user);
  const role = user.role;
  console.log("role ==> ", user.role);

  React.useEffect(() => {
    const getRequests = async () => {
      try {
        receiverLoadingState(true);
        const res = await getReceivers({ token: user.token });
        console.log("requests ==> ", res);
        receiverLoadingState(false);
        if (res.code === 200) fetchReceivers(res.receivers);
      } catch (error) {
        receiverLoadingState(false);
        handleError(error);
        return error;
      }
    };
    getRequests();
  }, [fetchReceivers, handleError, receiverLoadingState, user.token]);

  const loadingState = singleRequestStore((state: any) => state.loading);
  const setLoadingState = singleRequestStore(
    (state: any) => state.loadingState
  );
  const setError = singleRequestStore((state: any) => state.errorApi);

  const onSubmit: SubmitHandler<sendRequest> = async (data) => {
    try {
      const request = {
        subject: data.subject,
        message: data.message,
        type: data.type,
        receiverId: data.receiverId,
        senderId: userStore((state: any) => state.id),
      };

      setLoadingState(true);
      const res = await sendRequest(request);
      setLoadingState(false);
      if (res.code === 201) {
        toast.success(res.message, { position: "top-right" });
        reset();
        setOpen(false);
      }
    } catch (error) {
      setLoadingState(false);
      setError(error);
      toast.error("Sign up error", { position: "top-right" });
      return error;
    }
  };
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
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm  ">
                  <div className="p-4 sm:p-7">
                    <div className="text-center">
                      <h2 className="block text-2xl font-bold text-gray-800 ">
                        Submit a request
                      </h2>
                      {/* <p className="mt-2 text-sm text-gray-600 ">
                        Already have an account?
                        <a className="text-blue-600 decoration-2 hover:underline font-medium" href="../examples/html/modal-signin.html">
                            Sign in here
                        </a>
                        </p> */}
                    </div>

                    <div className="mt-5">
                      {/* <a className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm  dark:hover:bg-slate-800   dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
                        <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                            <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                            <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                            <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
                            <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
                        </svg>
                        Sign up with Google
                        </a> */}

                      {/* <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Or</div> */}

                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-y-4">
                          <div>
                            <label
                              htmlFor="subject"
                              className="block text-sm mb-2 "
                            >
                              Subject
                            </label>
                            <div className="relative">
                              <input
                                {...register("subject")}
                                type="text"
                                id="subject"
                                name="subject"
                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500   "
                                required
                                aria-describedby="subject-error"
                              />
                            </div>
                            {errors.subject && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.subject.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="receiverId"
                              className="block text-sm mb-2 "
                            >
                              Type of request
                            </label>
                            <div className="relative">
                              <select
                                {...register("subject")}
                                required
                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Choose facilitator"
                                name="type"
                                id="type"
                              >
                                <option value="" disabled selected>
                                  Choose the type of request
                                </option>
                                <option value={requestType.ACADEMIC}>
                                  {requestType.ACADEMIC.toString().toLowerCase()}
                                </option>
                                <option value={requestType.ADMINISTRATIVE}>
                                  {requestType.ADMINISTRATIVE.toString().toLowerCase()}
                                </option>
                              </select>
                            </div>
                            {errors.type && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.type.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="receiverId"
                              className="block text-sm mb-2 "
                            >
                              Choose facilitator
                            </label>
                            <div className="relative">
                              <select
                                {...register("receiverId")}
                                required
                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Choose facilitator"
                                name="receiverId"
                                id="receiverId"
                              >
                                <option value="" disabled selected>
                                  Choose a facilitator
                                </option>
                                {receivers && receivers.map((receiver: any, key: number) => (
                                  <option key={key} value={receiver.id}>
                                    {receiver.fullName}
                                  </option>
                                ))}

                                {/* <option value="2">Isaac</option> */}
                              </select>
                            </div>
                            {errors.receiverId && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.receiverId.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="content"
                              className="block text-sm mb-2 "
                            >
                              Message
                            </label>
                            <div className="relative">
                              <textarea
                                {...register("message")}
                                name="message"
                                id="message"
                                // cols={30}
                                rows={5}
                                className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                aria-describedby="message-error"
                              ></textarea>
                            </div>
                            {errors.message && (
                              <p className="text-xs text-red-600 mt-2">
                                {errors.message.message}
                              </p>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={loadingState}
                            className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                          >
                            Submit request
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
