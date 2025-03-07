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

const baseUrl = `https://mystic-be.vercel.app/api/v1`;

const token = getServerSideCookie({ cookieName: "access_token" });

export const createExamination = actionClient
  .schema(createExaminationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { cell_id, title, created_by_id, date } }) => {
    try {
      const response = await fetch(`${baseUrl}/cells/mitosis/divide`, {
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
      });

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
      try {
        const response = await fetch(
          `${baseUrl}/cells/examinations/record-result`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${(await token).cookie}`,
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

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to Divide Cell");
        }

        return data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    }
  );

export const getExamResultsDashboard = actionClient
  .schema(examResultsSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { exam_id } }) => {
    const response = await fetch(
      `${baseUrl}/cells/examinations/exams-result-list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
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
    const response = await fetch(
      `${baseUrl}/cells/examinations/get-all-examinations`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${(await token).cookie}`,
        },
        body: JSON.stringify({
          cell_id,
        }),
      }
    );

    console.log(response);
    return await response.json();
  });
