'use client';

import { checkSessionAction } from "@/app/actions/auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlipWords } from "../ui/flip-words";

export function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithAuth(props: T) {
    const router = useRouter();
    const { execute, result, status } = useAction(checkSessionAction);
    const [isLoading, setIsLoading] = useState(true);

    const words = ["Online"];
    
    useEffect(() => {
      const checkSession = async () => {
        if (status === 'idle') {
           execute();
        }
      };

      checkSession();
    }, [execute, status]);

    useEffect(() => {
      if (status === 'hasSucceeded') {
        if (result.data?.statusCode === 401) {
          router.push('/auth');
        } else {
          setIsLoading(false);
        }
      } else if (status === 'hasErrored') {
        console.error('Authentication check failed:', result);
        setTimeout(() => {
          router.push('/auth');
        }, 3000);
      }
    }, [result, status, router]);

    if (!isLoading && result.data && result.data.statusCode !== 401) {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="flex justify-center items-center h-screen font-bold text-purple-900 text-3xl">
        <Image src="/gifs/loader.gif" alt="loading" width={100} height={100} /> Mystic <FlipWords words={words} />
      </div>
    );
  };
}