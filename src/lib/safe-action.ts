import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { zodAdapter } from 'next-safe-action/adapters/zod'
import {z} from 'zod'

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  validationAdapter: zodAdapter(),
  handleServerError: (e) => {
    console.log(e.message, "action server error occured");

    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },

  // metadata_instance here

  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
}).use(async({next, metadata, clientInput, bindArgsClientInputs}) => {
  //logging middleware.
  const start = Date.now();

 
  const result = await next();

  const end = Date.now();

  const durationInMs = end - start;

  const logObject: Record<string, any> = { durationInMs };

  logObject.clientInput = clientInput;
  logObject.bindArgsClientInputs = bindArgsClientInputs;
  logObject.metadata = metadata;
  logObject.result = result;

  console.log("LOGGING FROM MIDDLEWARE:");
  console.dir(logObject, { depth: null });


  return result;
});
