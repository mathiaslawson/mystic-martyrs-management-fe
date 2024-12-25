"use client";
import { withAuth } from "@/components/hoc/withAuth";
import React, { useState } from "react";
import { toast } from "sonner"

const Invitation = () => {
  enum UserRole {
    MEMBER = "MEMBER",
    FELLOWSHIP_LEADER = "FELLOWSHIP_LEADER",
    ZONE_LEADER = "ZONE_LEADER",
    CELL_LEADER = "CELL_LEADER",
    ADMIN = "ADMIN",
  }

  const roles = [
    { id: UserRole.MEMBER, label: "Member" },
    { id: UserRole.FELLOWSHIP_LEADER, label: "Fellowship Leader" },
    { id: UserRole.ZONE_LEADER, label: "Zone Leader" },
    { id: UserRole.CELL_LEADER, label: "Cell Leader" },
    { id: UserRole.ADMIN, label: "Admin" },
  ];

  const tokens = {
    [UserRole.ADMIN]: process.env.NEXT_PUBLIC_ADMINTOKEN,
    [UserRole.ZONE_LEADER]: process.env.NEXT_PUBLIC_ZONETOKEN,
    [UserRole.FELLOWSHIP_LEADER]: process.env.NEXT_PUBLIC_FELLOWSHIPTOKEN,
    [UserRole.CELL_LEADER]: process.env.NEXT_PUBLIC_CELLTOKEN,
    [UserRole.MEMBER]: process.env.NEXT_PUBLIC_MEMBERTOKEN,
  };

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN); // Mock current user role
  const [role, setRole] = useState<UserRole | "">("");
  const [invitationTarget, setInvitationTarget] = useState<string | "">("");
  const [loading, setLoading] = useState<boolean>(false);

  const roleHierarchy = [
    UserRole.MEMBER,
    UserRole.CELL_LEADER,
    UserRole.FELLOWSHIP_LEADER,
    UserRole.ZONE_LEADER,
    UserRole.ADMIN,
  ];
  const canGenerateInvitation = role && roleHierarchy.indexOf(role) < roleHierarchy.indexOf(currentUserRole);

  const generateInvitationLink = async () => {
    if (!invitationTarget || !role) return;

    const token = tokens[role as UserRole];
    const baseUrl = "https://mystic-be.vercel.app/api/v1/auth/invite";
    const finalUrl = `${baseUrl}/${token}`;

    try {
      setLoading(true);
      await navigator.clipboard.writeText(finalUrl);
      setLoading(false);
      toast.success("Invitation link generated and copied to clipboard!");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to copy the invitation link. Please try again.");
    }
  };

  const renderConditionalContent = () => {
    if (role === UserRole.MEMBER || role === UserRole.CELL_LEADER) {
      return (
        <div className="flex flex-col justify-start items-start w-full">
          <label htmlFor="cell">Cell of Invitation</label>
          <select
            name="cell"
            id="cell"
            className="p-2 mt-2 border-2 border-gray-300 rounded-lg w-full"
            value={invitationTarget}
            onChange={(e) => setInvitationTarget(e.target.value)}
          >
            <option value="">Select a Cell</option>
            <option value="Cell A">Cell A</option>
            <option value="Cell B">Cell B</option>
          </select>
        </div>
      );
    } else if (role === UserRole.FELLOWSHIP_LEADER) {
      return (
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="fellowship">Fellowship of Invitation</label>
          <select
            name="fellowship"
            id="fellowship"
            className="p-2 mt-2 border-2 border-gray-300 rounded-lg w-full"
            value={invitationTarget}
            onChange={(e) => setInvitationTarget(e.target.value)}
          >
            <option value="">Select a Fellowship</option>
            <option value="Fellowship A">Fellowship A</option>
            <option value="Fellowship B">Fellowship B</option>
          </select>
        </div>
      );
    } else if (role === UserRole.ZONE_LEADER) {
      return (
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="zone">Zone of Invitation</label>
          <select
            name="zone"
            id="zone"
            className="p-2 mt-2 border-2 border-gray-300 rounded-lg w-full"
            value={invitationTarget}
            onChange={(e) => setInvitationTarget(e.target.value)}
          >
            <option value="">Select a Zone</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
          </select>
        </div>
      );
    } else if (role === UserRole.ADMIN) {
      return <p>You are inviting an admin to the organization.</p>;
    }
  };

  return (
    <main className="h-screen w-full px-24 bg-white flex flex-col justify-center items-start ">
      <h1 className="text-3xl font-semibold">Invitation</h1>
      <p className="font-DMSans md:w-3/4 text-justify">
        Please select the appropriate parameters for the invite you want to generate.
      </p>
      <form className="w-full">
        <div className="flex flex-col justify-center items-start mt-8">

      
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="role">Please select the role of your guest</label>
          <select
            name="role"
            id="role"
            className="p-2 mt-2 border-2 border-gray-300 rounded-lg w-full"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="">Select a Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <div className="my-4 w-full">{renderConditionalContent()}</div>
        <span className="font-Poppins text-sm text-gray-500">Please ensure that the user being invited has a Google account</span>
        </div>
        <div className=" w-full flex flex-row justify-end items-end">
        <button
          type="button"
          className="font-Poppins w-full px-32 py-3 bg-purple-600 hover:bg-purple-800 hover:cursor-pointer text-white text-sm rounded-lg mt-12"
          disabled={loading || !invitationTarget || !canGenerateInvitation}
          onClick={generateInvitationLink}
        >
          {loading ?
          (
            <span className="loader"></span>
          ) : "Generate Invitation Link"}
        </button>
        </div>
      </form>
    </main>
  );
};

export default withAuth(Invitation) ;
