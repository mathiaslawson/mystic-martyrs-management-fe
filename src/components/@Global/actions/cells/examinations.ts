"use server";
import { actionClient } from "@/lib/safe-action";
import { getServerSideCookie } from "@/lib/get-cookie";
import { flattenValidationErrors } from "next-safe-action";
import {
  allExamsSchema,
  createExaminationSchema,
  examResultsSchema,
  recordUpdateExamsResultSchema,
} from "@/schemas/cells/examinations";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/`
    : `https://mystic-be.vercel.app/`;

const token = getServerSideCookie({ cookieName: "access_token" });

const getAuthHeader = async () => {
  const token = await getServerSideCookie({ cookieName: "access_token" });
  console.log("this is token", token.cookie);
  if (!token) {
    throw new Error("User not authenticated");
  }
  return `Bearer ${token.cookie}`;
};

export const createExamination = actionClient
  .schema(createExaminationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id, title, created_by_id, date } }) => {
    try {
      const response = await fetch(
        `${baseUrl}api/v1/cells/examinations/create-exam`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(await token).cookie}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cell_id,
            date,
            created_by_id,
            title,
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      // Check if the response indicates success
      if (!response.ok) {
        throw new Error(data.message || "Failed to Divide Cell");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  });

export const recordUpdateExamsResult = actionClient
  .schema(recordUpdateExamsResultSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { exam_id, remarks, score, recorded_by, member_id },
    }) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(
        `${baseUrl}api/v1/cells/examinations/record-result`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            remarks,
            exam_id,
            score,
            recorded_by,
            member_id,
          }),
        }
      );

      console.log(response);
      return await response.json();
    }
  );

export const getExamResultsDashboard = actionClient
  .schema(examResultsSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { exam_id } }) => {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `${baseUrl}api/v1/cells/examinations/exams-result-list`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam_id,
        }),
      }
    );

    console.log(response);
    return await response.json();
  });

export const getAllExaminations = actionClient
  .schema(allExamsSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id } }) => {
    const authHeader = await getAuthHeader();

    const response = await fetch(
      `${baseUrl}api/v1/cells/examinations/get-all-examinations`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cell_id,
        }),
      }
    );

    return response.json();
  });
