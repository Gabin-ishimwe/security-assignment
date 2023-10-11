'use client'
import Link from 'next/link'
import React from 'react'
import { z } from "Zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userStore } from '@/src/store';
import { userLogin } from '@/src/utils/user';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const loginSchema = z
  .object({
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" })
  });
  type Login = z.infer<typeof loginSchema>;
const Login = () => {
    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Login>({
        resolver: zodResolver(loginSchema),
      });
      const navigate = useRouter()
      const loadingState = userStore((state:any) => state.loading)
      const setLoadingState = userStore((state:any) => state.loadingState)
      const setError = userStore((state:any) => state.errorApi)
      const setUser = userStore((state:any) => state.setUser)
    //   const setToken = userStore((state: any) => state.setToken)
      const user = userStore((state:any) => state.user)
      // console.log(user)
      const onSubmit: SubmitHandler<Login> = async (data) => {
        try {
            const request = {
                email: data.email,
                password: data.password
            }
            setLoadingState(true)
            const res = await userLogin(request)
            setLoadingState(false)
            // console.log(res)
            if(res.code === 200) {
                setUser({token: res.token})
                // console.log("new token ", user)
                toast.success('Login successful', {position: 'top-right'})
                reset()
                localStorage.setItem('AUTH_TOKEN', res.token)
                navigate.push('/dashboard')
            } else {
                toast.error(res.message, {position: 'top-right'})
            }
            
        } catch (error) {
            setLoadingState(false)
            setError(error)
            toast.error("Sign up error", {position: 'top-right'})
            return error
        }
      }
  return (
    <>
    <div className='flex h-full items-center py-16'>
        <div className="w-full max-w-md mx-auto p-6">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 sm:p-7">
                <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account yet?
                    <Link className="text-blue-600 decoration-2 hover:underline font-medium" href="/signup">
                    Sign up here
                    </Link>
                </p>
                </div>

                <div className="mt-5">

                <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">Or</div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-y-4">
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

                    <button type="submit" disabled={loadingState} className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">Sign in</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>

    </div>
    </>
  )
}

export default Login