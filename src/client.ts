import got, { RequestError } from "got";

export const handleErrors = (e: unknown) => {
  if (e instanceof RequestError) {
    // console.log(e);
    const { message, code, cause, name, response } = e;
    console.log({
      message,
      code,
      cause,
      name,
      response: response?.body,
      request: { url: e.request?.requestUrl, body: e.request?.options.body },
    });
  }
};

export const client = got.extend({
  prefixUrl: "https://ecomi.onelogin.com/api/",
  headers: {},
  responseType: "json",
  context: {
    token: process.env.OL_TOKEN,
  },
  hooks: {
    init: [
      (raw, options) => {
        if (typeof options.url === "string" && options.url.startsWith("/")) {
          options.url = options.url.slice(1);
        }

        if ("token" in raw) {
          options.context.token = raw.token;
          delete raw.token;
        } else {
          //do nothing
        }
      },
    ],
  },
  handlers: [
    (options, next) => {
      // TODO: This should be fixed in Got
      // TODO: This doesn't seem to have any effect.
      if (typeof options.url === "string" && options.url.startsWith("/")) {
        options.url = options.url.slice(1);
      }

      // Authorization
      const { token } = options.context;
      if (token && !options.headers.authorization) {
        options.headers.authorization = `bearer: ${token}`;
      }

      // Don't touch streams
      if (options.isStream) {
        return next(options);
      }

      return next(options);
    },
  ],
});
