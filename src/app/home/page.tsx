'use client';
import Link from "next/link";
import { withAuth } from "@/components/hoc/withAuth";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";

function Home() {
  const getGreeting = (): string => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const formatRole = (role: string | undefined): string => {
    if (!role) return ''; // Handle undefined or empty roles gracefully
    return role
      .split('_') // Split the string by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join them back with spaces
  };

  const { me } = useAuthMemberStore();

  console.log(me?.data?.firstname, 'this is me');

  if (!me) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex flex-col justify-start items-start gap-10">
      <div className="bg-white p-4 w-full flex flex-row justify-between items-center rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-black font-medium text-xl">{getGreeting()}, {me?.data?.firstname}</h2>
         <p className="text-gray-300 text-sm">This is an overview of everything under your trust</p>
        </div>
        <div>
        <span className="text-green-800 border border-green-800 bg-green-300 px-4 py-2 rounded-full font-medium font-Poppins text-sm">
            {formatRole(me?.data?.role)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="bg-white p-4 w-full flex flex-col justify-between items-center rounded-lg">
          <div className="flex flex-row justify-between items-center w-full">
             <h3 className="text-gray-600">Zones</h3>
             <button>
              <Link href="">See all</Link>
             </button>
             </div>
        </div>
        <div className="bg-white p-4 w-full flex flex-col justify-between items-center rounded-lg">
          <div className="flex flex-row justify-between items-center w-full">
             <h3 className="text-gray-600">Fellowships</h3>
             <button>
              <Link href="">See all</Link>
             </button>
             </div>
        </div>
        <div className="bg-white p-4 w-full flex flex-col justify-between items-center rounded-lg">
          <div className="flex flex-row justify-between items-center w-full">
             <h3 className="text-gray-600">Cells</h3>
             <button>
              <Link href="">See all</Link>
             </button>
             </div>
        </div>
        <div className="bg-white p-4 w-full flex flex-col justify-between items-center rounded-lg">
          <div className="flex flex-row justify-between items-center w-full">
             <h3 className="text-gray-600">Members</h3>
             <button>
              <Link href="">See all</Link>
             </button>
             </div>
        </div>
      </div>
      <div className="bg-white p-4 w-full flex flex-col justify-between items-start rounded-lg">
        <h3 className="text-black">Analytics</h3>
        </div >
    </div>
  );
}

export default withAuth(Home);
