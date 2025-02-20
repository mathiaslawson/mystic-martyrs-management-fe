import { getServerSideCookie } from "@/lib/get-cookie";
import  {actionClient} from "@/lib/safe-action";
import {createExamination} from "@/schemas/examination";
import {flattenValidationErrors} from "next-safe-action";

const getAuthHeader = async () => {
    const token = await getServerSideCookie({ cookieName: "access_token" });
    console.log("this is token", token.cookie);
    if (!token) {
      throw new Error("User not authenticated");
    }
    return `Bearer ${token.cookie}`;
  };

  //Create Examination
  export const createExams= actionClient
  .schema(createExamination, {
    handleValidationErrorsShape:(ve)=>
        flattenValidationErrors(ve).fieldErrors
  })
  .action(async({parsedInput: {cell_id, title, date, member_id}})=>
{
    const authHeader = await getAuthHeader();
    const response = await fetch(`https://mystic-be.vercel.app/api/v1/cells/examinations/create-exam`,
        {
              method: "POST",
                credentials: "include",
            headers:{
              Authorization:  authHeader,
              "Content-Type": "application/json",
            },
            body:JSON.stringify(
                {
                    cell_id,
                    title,
                    date,
                    member_id
                }
            )
        }
    )
    return await response.json();
})