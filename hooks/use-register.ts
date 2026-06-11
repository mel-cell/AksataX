import { useState } from "react";

import { RegisterRequest } from "@/types/auth";
import { registerService } from "@/lib/services/auth-services";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const register = async (payload: RegisterRequest) => {
    try {
      setLoading(true);
      setError("");
      setErrors({});

      const response = await registerService(payload);

      return response;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      setErrors(err.errors || {});

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    errors,
  };
}
