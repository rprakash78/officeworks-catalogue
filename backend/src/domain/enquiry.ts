import type { Enquiry } from "../types.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEnquiry(body: unknown): Enquiry {
  if (!body || typeof body !== "object") {
    throw validationError("Request body must be a JSON object");
  }
  const input = body as Record<string, unknown>;
  const productId = Number(input.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    throw validationError("productId must be a positive integer");
  }
  const name = requiredString(input.name, "name", 1, 100);
  const email = requiredString(input.email, "email", 3, 254);
  if (!EMAIL_PATTERN.test(email)) {
    throw validationError("email must be a valid address");
  }
  const message = requiredString(input.message, "message", 1, 2000);
  const phone =
    input.phone === undefined || input.phone === ""
      ? undefined
      : requiredString(input.phone, "phone", 5, 40);

  return { productId, name, email, phone, message };
}

function requiredString(
  value: unknown,
  field: string,
  min: number,
  max: number,
): string {
  if (typeof value !== "string") {
    throw validationError(`${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw validationError(`${field} must be between ${min} and ${max} characters`);
  }
  return trimmed;
}

function validationError(message: string): Error {
  return Object.assign(new Error(message), { status: 400 });
}
