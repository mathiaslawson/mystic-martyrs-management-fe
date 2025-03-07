"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader } from 'lucide-react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { withAuth } from "@/components/hoc/withAuth";
import {
  deleteCell,
  getCellsByID,
  updateCell,
} from "@/components/@Global/actions/cells";
import CellInfoCard from "./cards/CellInfoCard";


import FellowshipInfoCard from "./cards/FellowshipInfoCard";
import CellLeadersCard from "./cards/CellLeadersCard";
import CellMembersCard from "./cards/CellMembersCard";
import CellMitosisHistoryCard from "./cards/CellMitosisHistory";
import EditCellDialog from "./dialogs/EditCellDialog";
import DeleteCellDialog from "./dialogs/DeleteCellDialog";
import MitosisCellDialog from "./dialogs/MitosisCellDialog";
import CellHeader from "./CellHeader";

const CellDetail = ({
  data,
}: {
  data: { cell_id: string; cell_name: string; cell_leader_id: string };
}) => {
  const router = useRouter();

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

        <div className="grid gap-8 md:grid-cols-12 lg:grid-cols-3 mb-8">
          <CellInfoCard cellData={cellData} />
          <FellowshipInfoCard cellData={cellData} />
          <CellLeadersCard cellData={cellData} />
          <CellMembersCard cellData={cellData} />
          <CellMitosisHistoryCard cellData={cellData} />
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
