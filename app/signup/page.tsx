'use client'
import Link from 'next/link'
import React from 'react'
import { z } from "Zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from 'clsx'
import { userStore } from '@/src/store';
import { userSignUp } from '@/src/utils/user';
import toast from 'react-hot-toast'

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Full names are required" }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    password: z
      .string()
    //   .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    //   .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    //   .regex(new RegExp(".*\d.*"), "One digit character")
    //   .regex(new RegExp(".*[!@#$%^&*].*"), "One special character")
      .min(8, { message: "Password must be atleast 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });
// extracting the type
type SignUp = z.infer<typeof signUpSchema>;

const SignUp = () => {
    const [requirementsMet, setRequirementsMet] = React.useState({
        uppercase: false,
        lowercase: false,
        number: false,
        specialCharacter: false,
        length: false,
      });
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<SignUp>({
        resolver: zodResolver(signUpSchema),
      });
      const loadingState = userStore((state:any) => state.loading)
      const setLoadingState = userStore((state:any) => state.loadingState)
      const setError = userStore((state:any) => state.errorApi)
      const setUser = userStore((state:any) => state.setUser)
      const onSubmit: SubmitHandler<SignUp> = async (data) => {
        try {
            const request = {
                fullName: data.name,
                email: data.email,
                password: data.password
            }
            setLoadingState(true)
            const res = await userSignUp(request)
            setLoadingState(false)
            if(res.code === 201) {
                setUser({
                    email: res.user.email,
                    name: res.user.fullName,
                    token: res.token
                })
                toast.success(res.message, {position: "top-right"})
            } else {
                toast.error(res.message, {position: "top-right"})
            }
         
            return res
        } catch (error) {
            setLoadingState(false)
            setError(error)
            toast.error("Sign up error", {position: 'top-right'})
            return error
        }

      };

      const password = watch('password')
      React.useEffect(() => {
        const updateValidation = () => {
            const updatedRequirementsMet = {
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /\d/.test(password),
                specialCharacter: /[!@#$%^&*]/.test(password),
                length: password?.length >= 8,
              };
              setRequirementsMet(updatedRequirementsMet)
        }
        updateValidation()
      }, [password])

  return (
    <div className="flex h-full items-center py-16">
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <Link className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-y-4">
              <div>
                  <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Full name</label>
                  <div className="relative">
                    <input type="text" id="name" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" {...register('name')}/>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.name && (
                                      <p className="text-xs text-red-600 mt-2">{errors.name.message}</p>

                  )}                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                  <div className="relative">
                    <input type="email" id="email" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" {...register('email')}/>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.email && (
                                      <p className="text-xs text-red-600 mt-2">{errors.email.message}</p>

                  )}              </div>
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                  <div className="relative">
                    <input type="password" id="password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" {...register('password')}/>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.password && (
                                      <p className="text-xs text-red-600 mt-2">{errors.password.message}</p>

                  )}                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                  <div className="relative">
                    <input type="password" id="confirm-password" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" {...register('confirmPassword')}/>
                    <div className="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                      <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.confirmPassword && (
                                      <p className="text-xs text-red-600 mt-2">{errors.confirmPassword.message}</p>

                  )}
                </div>
                
                <div className={clsx(`${!errors.password && 'hidden'}`)}>
            <p className="text-sm flex gap-y-2">
              {requirementsMet.uppercase ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
              )}
              Should contain an uppercase character
            </p>
            <p className="text-sm flex">
              {requirementsMet.lowercase ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
              )}
              Should contain a lowercase character
            </p>
            <p className="text-sm flex">
              {requirementsMet.number ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
              )}
              Should contain at least one number
            </p>
            <p className="text-sm flex">
              {requirementsMet.specialCharacter ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
              )}
              Should contain a special character
            </p>
            <p className="text-sm flex">
              {requirementsMet.length ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

              )}
              Should be at least 8 characters long
            </p>
          </div>
                <button type="submit" disabled={loadingState} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">Sign up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SignUp