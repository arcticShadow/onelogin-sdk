import { getAuthorization } from "../../../authorize.js";

import { client, handleErrors } from "../../../client.js";

export type ListRolesResponse = { id: number; name: string; apps: number[] }[];

export type ListRolesQueryParams = {
  name?: string;
  app_id?: number;
  app_name?: string;
  fields?: "apps" | "users" | "admins";
};

export default async (query?: ListRolesQueryParams) => {
  try {
    return await client(`2/roles`, {
      method: "GET",
      searchParams: query,
      context: {
        token: (await getAuthorization())?.access_token,
      },
    }).json<ListRolesResponse>();
  } catch (e: unknown) {
    handleErrors(e);
  }
};
