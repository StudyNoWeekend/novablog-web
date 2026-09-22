export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  trace_id?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly msg: string,
    public readonly httpCode: number
  ) {
    super(msg);
    this.name = "ApiError";
  }
}
