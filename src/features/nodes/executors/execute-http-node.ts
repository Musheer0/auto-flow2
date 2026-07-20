import { HttpRequestFormSchemaT, httpRequestSchema } from "@/features/editor/schemas/http-form.schema";
import { NodeData } from "@/features/editor/types";
import { NonRetriableError } from "inngest";
import handlebars from "@/features/nodes/lib/handlebar";
import { getCredentialById } from "@/trpc/utils/get-credential-by-id";
import { decrypt } from "@/lib/encrypt-decrypt";

const credentialPre = "credential-";

export const executeHttpNode = async (
  userId: string,
  node_data: any,
  context: any = {}
) => {
  const name = node_data?.config?.name;

  if (!name) {
    throw new NonRetriableError("HTTP node not configured");
  }

  const { data: http_data, error } = httpRequestSchema.safeParse(
    node_data.user_data
  );

  if (error) {
    throw new NonRetriableError("Node not configured properly");
  }

  const compile = (value: string) => handlebars.compile(value)(context);

  const url = compile(http_data.url);

  const headers: Record<string, string> = {};

  await Promise.all(
    http_data.headers.map(async (h) => {
      if (!h.key) return;

      let value = h.value;

      if (value.startsWith(credentialPre)) {
        const credentialId = value.slice(credentialPre.length);

        const credential = await getCredentialById(userId, credentialId);

        if (!credential) {
          throw new NonRetriableError(
            `Credential not found: ${credentialId}`
          );
        }

        value = decrypt(credential.data);
      } else {
        value = compile(value);
      }

      headers[h.key] = value;
    })
  );

  let body: BodyInit | undefined;

  if (
    http_data.method !== "GET" &&
    http_data.method !== "HEAD" &&
    http_data.body
  ) {
    body = compile(http_data.body);

    // Automatically set content-type if the body looks like JSON
    try {
      JSON.parse(body);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    } catch {
      // plain text / form body
    }
  }

  const req = await fetch(url, {
    method: http_data.method ?? "GET",
    headers,
    body,
  });
   const getbody =async()=>{
        try{
             const b = await req.json()
             return b
        }
    catch (error) {
         const b = await req.text()
             return b
    }
  }
const responseText = await req.text();

let response: unknown;

try {
  response = JSON.parse(responseText);
} catch {
  response = responseText;
}

return response;
};