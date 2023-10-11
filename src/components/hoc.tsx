'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { userStore } from '../store';


const HOComponent = (Component: React.FC) => {
    const ProtectedPage = (props: any) => {
        const route = useRouter();
        const access = localStorage.getItem("AUTH_TOKEN");
          if (!access) {
            route.push("/login");
          }
        return <Component {...props} token={access} />;
      };
      return ProtectedPage;
}

export default HOComponent