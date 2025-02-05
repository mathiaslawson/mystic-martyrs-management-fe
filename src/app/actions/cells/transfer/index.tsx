"use server"
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import { CreateTransfer, getTransferHistoryTypes , ChangeMemberStatus,TransferHistoryByMemberId} from "@/schemas/transfer";


const baseUrl = `https://mystic-be.vercel.app/`;


//Create a transfer
const token =  getServerSideCookie({cookieName: "access_token"});



export const transferMember = actionClient.schema(
    CreateTransfer,
    {
        handleValidationErrorsShape:(ve)=>
            flattenValidationErrors(ve).fieldErrors,
    }
).action(async({parsedInput : {member_id,new_cell_id,new_status,remarks}}) =>
{
    const response = await fetch(`${baseUrl}cells`,
        {
            method: "POST",
           headers:{
            Authorization : `Bearer ${(await token).cookie}`
           },
           body:JSON.stringify({
            member_id,
            new_cell_id,
            new_status,
            remarks,
        })
        }
    );

    console.log(response, "This is the transfer data")
    
})


export const getTransferHistory = actionClient.schema(
getTransferHistoryTypes,
{
    handleValidationErrorsShape:(ve)=>
        flattenValidationErrors(ve).fieldErrors,
}
).action(async({parsedInput: {member_id, start_date, end_date, cell_id}})=>
{
    const response  = await fetch(`${baseUrl}cells/transfer/transfer-history`,
        {
            method: "GET",
            headers:{
                Authorization:  `Bearer ${(await token).cookie}`
            },
            body:JSON.stringify({
                member_id,
                start_date,
                end_date,
                cell_id
            })
        }
    );

    console.log(response)

});

export  const changeMemberStatus = actionClient.schema(
    ChangeMemberStatus,
    {
        handleValidationErrorsShape:(ve)=>
            flattenValidationErrors(ve).fieldErrors,
    }

).action(async({parsedInput: {member_id,remarks,new_status}})=>
{
 const response = await fetch(`${baseUrl}cells/transfer/change-member-status`,
    {
        method: "POST",
        headers: {
            Authorization: `Bearer ${(await token).cookie
            }`
        },
        body:JSON.stringify({
            member_id,
            remarks,
            new_status
    })
});
console.log(response)
})


export const transferHistoryByMemberId = actionClient.schema(
TransferHistoryByMemberId,
{
    handleValidationErrorsShape:(ve)=>
        flattenValidationErrors(ve).fieldErrors,
}
).action(async({parsedInput : {member_id}})=>
{
    const response  = await fetch(`${baseUrl}cells/transfer/member-transfer-history`,
        {
            method:"POST",
            headers:{
                Authorization: `Bearer ${(await token).cookie}`
            },
            body:JSON.stringify({
                member_id
            })
        }
    );

    console.log(response)
})