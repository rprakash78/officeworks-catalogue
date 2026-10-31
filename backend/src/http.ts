export function httpError(status: number, message: string): Error {
  return Object.assign(new Error(message), { status });
}

export function errorStatus(err: unknown): number {
  if (
    err &&
    typeof err === "object" &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
  ) {
    return (err as { status: number }).status;
  }
  return 500;
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}
