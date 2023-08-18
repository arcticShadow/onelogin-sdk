import { ApiResponse } from "../../../api-types.js";
import { getAuthorization } from "../../../authorize.js";
import { getCache, setCache } from "../../../cache.js";
import { client, handleErrors } from "../../../client.js";
import { OLUser, OLUsers } from "./_types.js";

export type UsersListResponse = ApiResponse<OLUsers>;

type CustomAttributeKey = `custom_attributes.${string}`;
export type UsersQueryParams = {
  directory_id?: string;
  email?: string;
  external_id?: string;
  firstname?: string;
  lastname?: string;
  id?: string;
  manager_ad_id?: string;
  role_id?: string;
  samaccountname?: string;
  since?: string;
  until?: string;
  username?: string;
  userprincipalname?: string;
  [key: CustomAttributeKey]: string;
  /**
   * the fields to return in the response
   */
  fields?: keyof OLUser;
};

export default async (query: UsersQueryParams) => {
  const cacheKey = { name: "listUsers", ...query };
  const cacheData = await getCache<OLUsers>(cacheKey);
  if (cacheData) {
    return cacheData;
  }

  try {
    let apiResponse: UsersListResponse;
    const sp = new URLSearchParams(query);
    const users: OLUsers = [];
    do {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (apiResponse && apiResponse.pagination.after_cursor) {
        sp.set("after_cursor", apiResponse.pagination.after_cursor);
      }
      apiResponse = await client("1/users", {
        searchParams: sp,
        context: {
          token: (await getAuthorization())?.access_token,
        },
      }).json<UsersListResponse>();

      users.push(...apiResponse.data);
    } while (apiResponse.pagination.after_cursor);

    await setCache(cacheKey, users);
    return users;
  } catch (e: unknown) {
    handleErrors(e);
  }
};
