import { ApiResponse } from "../../../api-types.js";
import { getAuthorization } from "../../../authorize.js";

import { client, handleErrors } from "../../../client.js";
import { OLUser, OLUsers } from "./_types.js";

type UpdateUserByIdPayload = Partial<
  Omit<
    OLUser,
    | "activated_at"
    | "created_at"
    | "id"
    | "invitation_sent_at"
    | "last_login"
    | "locked_until"
    | "comment"
    | "preferred_locale_code"
    | "password_changed_at"
    | "updated_at"
    | "role_id"
    | "trusted_idp_id"
  >
>;

export type UpdateUserByIdResponse = ApiResponse<OLUsers>;

export default async (id: OLUser["id"], payload: UpdateUserByIdPayload) => {
  try {
    const apiResponse = await client(`1/users/${id}`, {
      method: "PUT",
      //   searchParams: query,
      context: {
        token: (await getAuthorization())?.access_token,
      },
      json: payload,
    }).json<UpdateUserByIdResponse>();

    return apiResponse.data;
  } catch (e: unknown) {
    handleErrors(e);
  }
};
