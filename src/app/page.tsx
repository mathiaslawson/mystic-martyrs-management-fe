
'use client'
import React from "react";
import { withAuth } from "@/components/hoc/withAuth";

function Home() {
  return (
    <>
      <div>Landing Page</div>
    </>
  );
}


export default withAuth(Home)