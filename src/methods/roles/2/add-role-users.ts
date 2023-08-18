import { getAuthorization } from "../../../authorize.js";

import { client, handleErrors } from "../../../client.js";

export type AddRoleUsersResponse = { id: number }[];

export default async (roleId: number, userIds: number[]) => {
  try {
    return await client(`2/roles/${roleId}/users`, {
      method: "POST",
      context: {
        token: (await getAuthorization())?.access_token,
      },
      json: userIds,
    }).json<AddRoleUsersResponse>();
  } catch (e: unknown) {
    handleErrors(e);
  }
};
