import { RegisterRequest, RegisterResponse } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerService(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/api/v1/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: RegisterResponse = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
