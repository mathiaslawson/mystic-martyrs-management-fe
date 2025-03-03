"use client"
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, CheckCircleIcon } from "lucide-react";

export default function InviteCodeDialog({
  genRes,
  genStat,
}: {
  genRes: { inviteLink: string };
  genStat: string;
}) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (genStat === "hasSucceeded" && genRes?.inviteLink) {
      // Extract the invite code from the query parameter
      const match = genRes.inviteLink.match(/inviteCode=([\w-]+)/);
      const extractedCode = match ? match[1] : null;
  
      if (extractedCode) {
        // Construct the full invite URL
        setInviteCode(`https://mystic-be.vercel.app/api/v1/auth/invite/${extractedCode}`);
        setIsDialogOpen(true);
      } else {
        console.warn("Invite code not found in URL:", genRes.inviteLink);
      }
    }
  }, [genRes, genStat]);

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode).then(() => {
        console.log("Invite code copied to clipboard.");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); 
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Code</DialogTitle>
          <DialogDescription>
            Use the following invite code or copy it to share with others:
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start mt-4 space-y-4">
         
          <a
            href={inviteCode || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 break-all hover:text-neutral-700"
          >
            {inviteCode || "No code available"}
          </a>

         
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            {isCopied ? (
              <CheckCircleIcon className="w-4 h-4 text-green-500 animate-pulse" />
            ) : (
              <ClipboardIcon className="w-4 h-4" />
            )}
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
