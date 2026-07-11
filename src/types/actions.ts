export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    fields?: Record<string, string[]>;
  };
};
