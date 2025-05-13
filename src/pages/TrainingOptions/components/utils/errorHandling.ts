// utils/errorHandling.ts
export interface ErrorResponse {
  message: string;
  field?: string;
  code?: string;
}

export const handleFormError = (error: unknown): ErrorResponse => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "An unexpected error occurred" };
};
