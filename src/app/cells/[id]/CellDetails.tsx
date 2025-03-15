"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { withAuth } from "@/components/hoc/withAuth";
import {
  deleteCell,
  getCellsByID,
  updateCell,
} from "@/components/@Global/actions/cells";
import CellInfoCard from "./cards/cell-info-card";

import FellowshipInfoCard from "./cards/fellowship-info-card";
import CellLeadersCard from "./cards/cell-leaders-card";
import CellMembersCard from "./cards/cell-members-card";
import CellMitosisHistoryCard from "./cards/cell-mitosis-history";
import EditCellDialog from "./dialogs/EditCellDialog";
import DeleteCellDialog from "./dialogs/DeleteCellDialog";
import MitosisCellDialog from "./dialogs/MitosisCellDialog";
import CellHeader from "./CellHeader";
import CellTransferHistory from "./cards/cell-transfer-history";
import CellPerformanceAnalytics from "./performance";

const CellDetail = ({
  data,
}: {
  data: { cell_id: string; cell_name: string; cell_leader_id: string };
}) => {
  const router = useRouter();

  const [view, setView] = useState("bio");

  const {
    execute: getDetails,
    result: details,
    isExecuting: isLoadingDetails,
  } = useAction(getCellsByID);
  const {
    execute: updateDetails,
    isExecuting: isUpdating,
    result: updateResult,
  } = useAction(updateCell);
  const {
    execute: deleteDetails,
    isExecuting: isDeleting,
    result: deleteResult,
  } = useAction(deleteCell);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMitosisOpen, setIsMitosisOpen] = useState(false);
  const [editData, setEditData] = useState({
    cell_name: "",
    cell_leader_id: "",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    getDetails({ id: data?.cell_id });
    setIsRefreshing(false);
  }, [getDetails, data?.cell_id]);

  useEffect(() => {
    getDetails({ id: data?.cell_id });
  }, [getDetails, data?.cell_id]);

  useEffect(() => {
    if (
      updateResult?.data?.statusCode === 409 ||
      updateResult?.data?.statusCode === 500
    ) {
      toast.error(updateResult.data.message);
      setIsEditOpen(false);
    }
    if (updateResult?.data?.success === true) {
      refreshData();
      toast.success("Cell Updated Successfully");
      setIsEditOpen(false);
    }
  }, [updateResult, refreshData]);

  useEffect(() => {
    if (deleteResult?.data?.statusCode === 404) {
      toast.error(deleteResult.data.message);
      setIsDeleteOpen(false);
    }
    if (deleteResult?.data?.success === true) {
      setIsDeleteOpen(false);
      toast.success("Cell Deleted Successfully");
      router.push("/cells");
    }
  }, [deleteResult, router]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetails({
      id: cellData?.cell?.cell_id,
      cell_name: editData.cell_name || details?.data?.data?.cell_name,
    });
  };

  const handleDeleteConfirm = () => {
    deleteDetails({ id: details?.data?.data?.cell_id });
  };

  if (isLoadingDetails) {
    return (
      <div className="col-span-full flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const cellData = details?.data?.data;

  if (!cellData) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen xl:mt-[-0.5rem] mt-10">
      <div className="max-w-7xl mx-auto">
        <CellHeader
          refreshData={refreshData}
          isRefreshing={isRefreshing}
          setIsEditOpen={setIsEditOpen}
          setIsMitosisOpen={setIsMitosisOpen}
        />
        <h1 className="text-2xl font-bold mb-8 text-neutral-900">
          {cellData?.cell?.cell_name}
        </h1>

        <div className="border border-1 border-neutral-400 mt-3 mb-10 flex flex-row gap-1 rounded-md p-1 w-max transition-all">
          <div
            className={`p-1 px-3 rounded-md cursor-pointer ${
              view === "bio" && "bg-green-600 text-white"
            } `}
            onClick={() => setView("bio")}
          >
            Bio Data
          </div>
          <div
            onClick={() => setView("mitosis")}
            className={`p-1 px-3 rounded-md cursor-pointer ${
              view === "mitosis" && "bg-green-600 text-white"
            } `}
          >
            Mitosis
          </div>
          <div
            onClick={() => setView("members")}
            className={`p-1 px-3 rounded-md cursor-pointer ${
              view === "members" && "bg-green-600 text-white"
            } `}
          >
            Member Management
          </div>
          <div
            onClick={() => setView("transfer")}
            className={`p-1 px-3 rounded-md cursor-pointer ${
              view === "transfer" && "bg-green-600 text-white"
            } `}
          >
            Transfer History
          </div>
           <div
            onClick={() => setView("overall")}
            className={`p-1 px-3 rounded-md cursor-pointer ${
              view === "overall" && "bg-green-600 text-white"
            } `}
          >
            Overall Cell Performance
          </div>
        </div>

        <div className="">
          {view === "bio" ? (
            <>
              <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-3 mb-8">
                <CellInfoCard cellData={cellData} />
                <FellowshipInfoCard cellData={cellData} />
                <CellLeadersCard cellData={cellData} />
              </div>
            </>
          ) : view === "members" ? (
            <>
              {" "}
              <div>
                <CellMembersCard
                  cellData={cellData}
                  refreshData={refreshData}
                />
              </div>
            </>
          ) : view === "mitosis" ? (
            <>
              <CellMitosisHistoryCard cellData={cellData} />
            </>
          ) : view === "transfer" ? (
            <>
              <CellTransferHistory cellData={cellData} />
            </>
          ) 
          : view === "overall" ? (
            <>
              <CellPerformanceAnalytics cellData={cellData} />
            </>
          ) :
          (
            <>{setView("bio")}</>
          )}
        </div>

        <EditCellDialog
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          cellData={cellData}
          editData={editData}
          setEditData={setEditData}
          handleSubmit={handleEditSubmit}
          isUpdating={isUpdating}
        />

        <DeleteCellDialog
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          handleConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />

        <MitosisCellDialog
          isOpen={isMitosisOpen}
          setIsOpen={setIsMitosisOpen}
          cellData={cellData}
        />
      </div>
    </div>
  );
};

export default withAuth(CellDetail);
