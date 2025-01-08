"use client"
import { useEffect } from "react";
import Link from "next/link";
import { withAuth } from "@/components/hoc/withAuth";
import { useAuthMemberStore } from "@/utils/stores/AuthMember/AuthMemberStore";
import { useAction } from "next-safe-action/hooks";
import { getAllZones } from "../actions/zones";
import { getAllFellowships } from "../actions/fellowships";
import { getAllCells } from "../actions/cells";

interface Zone {
  zone_id: string;
  zone_name: string;
  zone_leader?: {
    firstname?: string;
    lastname?: string;
  };
  zone_location?: string;
  fellowships?: Fellowship[];
}

interface Fellowship {
  fellowship_name: string;
  cells?: Cell[];
  members?: Member[];
}

interface Cell {
  cell_name: string;
  fellowship_name?: string;
}

interface Member {
  member_id: string;
}

function Home() {
  const getGreeting = (): string => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Get All Zones, Fellowships, and Cells
  const { execute: getZones, result: zones, status: zonesStatus } = useAction(getAllZones);
  const { execute: getFellowships, result: fellowships, status: fellowshipsStatus } = useAction(getAllFellowships);
  const { execute: getCells, result: cells, status: cellStatus } = useAction(getAllCells);

  useEffect(() => {
    getZones();
    getFellowships();
    getCells();
  }, [getZones, getFellowships, getCells]);

  const formatRole = (role: string | undefined): string => {
    if (!role) return ""; // Handle undefined or empty roles gracefully
    return role
      .split("_") // Split the string by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join them back with spaces
  };

  const { me } = useAuthMemberStore();

  if (!me) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-start items-start gap-10">
      <div className="bg-white p-4 w-full flex flex-row justify-between items-center rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-black font-medium text-xl">
            {getGreeting()}, {me?.data?.firstname}
          </h2>
          <p className="text-gray-300 text-sm">
            This is an overview of everything under your trust
          </p>
        </div>
        <div>
          <span className="text-green-800 border border-green-800 bg-green-300 px-4 py-2 rounded-full font-medium font-Poppins text-sm">
            {formatRole(me?.data?.role)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 w-full">
        {/* Zones Section */}
        <div className="bg-white p-4 w-full flex flex-col justify-between items-start rounded-lg">
          <div className="flex flex-row justify-between items-center w-full mb-4">
            <h3 className="text-gray-600">Zones</h3>
            <button className="bg-purple-500 px-4 py-2 rounded-full text-white">
              <Link href="">See all</Link>
            </button>
          </div>
          <div className="w-full">
            {zonesStatus === "executing" ? (
              <div>Loading zones...</div>
            ) : zones?.data?.data ? (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-gray-600">Zone Name</th>
                    <th className="px-4 py-2 text-left text-gray-600">Zone Leader</th>
                    <th className="px-4 py-2 text-left text-gray-600">Location</th>
                    <th className="px-4 py-2 text-left text-gray-600">Fellowships</th>
                    <th className="px-4 py-2 text-left text-gray-600">Cells</th>
                    <th className="px-4 py-2 text-left text-gray-600">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.data.data.map((zone: Zone) => {
                    // Calculate counts
                    const fellowshipCount = zone.fellowships?.length || 0;
                    const cellCount = zone.fellowships
                      ? zone.fellowships.reduce(
                          (count, fellowship) => count + (fellowship.cells?.length || 0),
                          0
                        )
                      : 0;
                    const memberCount = zone.fellowships
                      ? zone.fellowships.reduce(
                          (count, fellowship) => count + (fellowship.members?.length || 0),
                          0
                        )
                      : 0;

                    return (
                      <tr key={zone.zone_id} className="border-b border-gray-300">
                        <td className="px-4 py-2">
                          <Link href={`/zones/${zone.zone_id}`} className="text-blue-600 underline">
                            {zone.zone_name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          {zone.zone_leader
                            ? `${zone.zone_leader.firstname || "N/A"} ${zone.zone_leader.lastname || ""}`
                            : "No leader assigned"}
                        </td>
                        <td className="px-4 py-2">{zone.zone_location || "N/A"}</td>
                        <td className="px-4 py-2">{fellowshipCount}</td>
                        <td className="px-4 py-2">{cellCount}</td>
                        <td className="px-4 py-2">{memberCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div>No zones available</div>
            )}
          </div>
        </div>

        {/* Fellowships Section */}
        <div className="bg-white p-4 w-full flex flex-col justify-between items-start rounded-lg">
          <div className="flex flex-row justify-between items-center w-full mb-4">
            <h3 className="text-gray-600">Fellowships</h3>
            <button className="bg-purple-500 px-4 py-2 rounded-full text-white">
              <Link href="">See all</Link>
            </button>
          </div>
          <div className="w-full">
            {fellowshipsStatus === "executing" ? (
              <div>Loading fellowships...</div>
            ) : fellowships?.data?.data ? (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-gray-600">Fellowship Name</th>
                    <th className="px-4 py-2 text-left text-gray-600">Cells</th>
                    <th className="px-4 py-2 text-left text-gray-600">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {fellowships.data.data.map((fellowship: Fellowship, index: number) => {
                    const cellCount = fellowship.cells?.length || 0;
                    const memberCount = fellowship.members?.length || 0;

                    return (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="px-4 py-2">
                          <Link href={`/fellowships/${fellowship.fellowship_name}`} className="text-blue-600 underline">
                            {fellowship.fellowship_name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{cellCount}</td>
                        <td className="px-4 py-2">{memberCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div>No fellowships available</div>
            )}
          </div>
        </div>

        {/* Cells Section */}
        <div className="bg-white p-4 w-full flex flex-col justify-between items-start rounded-lg">
          <div className="flex flex-row justify-between items-center w-full mb-4">
            <h3 className="text-gray-600">Cells</h3>
            <button className="bg-purple-500 px-4 py-2 rounded-full text-white">
              <Link href="">See all</Link>
            </button>
          </div>
          <div className="w-full">
            {cellStatus === "executing" ? (
              <div>Loading cells...</div>
            ) : cells?.data?.data ? (
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-gray-600">Cell Name</th>
                    <th className="px-4 py-2 text-left text-gray-600">Fellowship</th>
                    <th className="px-4 py-2 text-left text-gray-600">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {cells.data.data.map((cell: Cell, index: number) => {
                    // Calculate fellowship and member counts
                    const fellowshipName = cell.fellowship_name || "N/A";
                    const memberCount = cell.members?.length || 0;

                    return (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="px-4 py-2">
                          <Link href={`/cells/${cell.cell_name}`} className="text-blue-600 underline">
                            {cell.cell_name}
                          </Link>
                        </td>
                        <td className="px-4 py-2">{fellowshipName}</td>
                        <td className="px-4 py-2">{memberCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div>No cells available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
