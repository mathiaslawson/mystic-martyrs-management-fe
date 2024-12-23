'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Use js-cookie for client-side cookie management

export function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithAuth(props: T) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    // Check if access_token exists in cookies
    useEffect(() => {
      const accessToken = Cookies.get('access_token'); // Retrieve token using js-cookie
      if (accessToken) {
        setIsLoading(false); // User is authenticated, stop loading
      } else {
        // No access token, redirect to the OAuth login page
        router.push('/auth')
      }
    }, []);

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen font-bold text-black-900 text-3xl px-5 md:px-10">
          <span className="loader-book"></span>
          <h1 className="text-center">Mystic-Martyrs-Management</h1>
        </div>
      );
    }

    // If authenticated, render the WrappedComponent
    return <WrappedComponent {...props} />;
  };
}
