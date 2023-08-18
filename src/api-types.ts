export type ApiResponse<T> = {
  data: T;
  pagination: {
    before_cursor: null | string;
    after_cursor: null | string;
    previous_link: null | string;
    next_link: null | string;
  };
  status: { error: boolean; code: number; type: string; message: string };
};
