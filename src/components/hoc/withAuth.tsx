'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { getAccountDataAction } from '@/app/actions/auth';
import { toast } from 'sonner';

export function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithAuth(props: T) {
    const router = useRouter();
   
    const { execute: getAccountData, status, result: accountData } = useAction(getAccountDataAction);

    useEffect(() => {
      const checkAuth = async () => {
        getAccountData();
      
      };
      
      checkAuth();
    }, []);

    useEffect(() => {
   
      if (accountData.serverError) {
        console.log('router call')
        toast.warning('Session Expired, Please Login Again!')
        router.replace('/auth');
       
      }
    }, [accountData, router]);

    if (status === 'executing') {
      return (
        <div className="flex flex-col justify-center items-center h-screen">
          <span className="loader-book"></span>
          <h1 className="text-center font-bold text-3xl">Mystic-Martyrs-Management</h1>
        </div>
      );
    }

    return accountData ? <WrappedComponent {...props} /> : null;
  };
}