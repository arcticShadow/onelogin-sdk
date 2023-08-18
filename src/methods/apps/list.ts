import { ApiResponse } from "../../api-types.js";
import { getAuthorization } from "../../authorize.js";
import { client } from "../../client.js";

enum AuthMethod {
  Password = 0,
  OpenId = 1,
  SAML = 2,
  API = 3,
  Google = 4,
  FormsBasedApp = 6,
  WSFED = 7,
  OpenIdConnect = 8,
}

export type Apps = ApiResponse<
  [
    {
      id: number;
      connector_id: number;
      auth_method: AuthMethod;
      auth_method_description: string;
      name: string;
      description: string;
      updated_at: string;
      created_at: string;
      visible: boolean;
    },
  ]
>;

export type AppsQueryParams = {
  /**
   * The name or partial name of the app to search for. When using a partial name you must append a wildcard `*`
   */
  name?: string;
  /**
   * Returns all apps based off a specific connector. See List Connectors for a complete list of Connector IDs.
   */
  connector_id?: number;

  auth_method?: AuthMethod;
};

export default async (query: AppsQueryParams) => {
  const { data: users } = await client("2/apps", {
    searchParams: query,
    context: {
      token: (await getAuthorization())?.access_token,
    },
  }).json<Apps>();

  return users;
};
