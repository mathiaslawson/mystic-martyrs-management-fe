"use client";

import { withAuth } from "@/components/hoc/withAuth";
import { MemberTable } from "./modules/member-table";
import { CellStats } from "./modules/cell-stats";

function CellMemberStats() {
  return (
    <div className="mx-auto mt-[20px]">
      {/* Notify */}
      <div className="border-2 border-green-600 p-4 rounded-md bg-gradient-to-r from-green-500 to-green-700 shadow-lg mb-10">
        <div className="flex items-center justify-between h-[20svh]">
          <div className="flex items-center space-x-4 text-green-200">
            <div>
              <h2 className="text-3xl font-bold text-white">Cell Members Attendance Performance</h2>
              <p className="font-light text-md mb-11">View and capture attendance statistics of designated cell members.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <CellStats />
      </div>

      <div>
        <MemberTable />
      </div>
    </div>
  );
}

export default withAuth(CellMemberStats);
