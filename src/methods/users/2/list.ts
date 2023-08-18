import { ApiResponse } from "../../../api-types.js";
import { getAuthorization } from "../../../authorize.js";
import { getCache, setCache } from "../../../cache.js";
import { client, handleErrors } from "../../../client.js";
import { OLUser, OLUsers } from "../1/_types.js";

export type UsersListResponse = OLUsers;

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
    const apiResponse = await client("2/users", {
      searchParams: query,
      context: {
        token: (await getAuthorization())?.access_token,
      },
    }).json<UsersListResponse>();

    await setCache(cacheKey, apiResponse);
    return apiResponse;
  } catch (e: unknown) {
    handleErrors(e);
  }
};
