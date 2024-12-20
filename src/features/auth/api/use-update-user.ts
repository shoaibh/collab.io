import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

type RequestType = {
  image: Id<"_storage">;
  id: Id<"users">;
  removeImg: boolean;
};
type ResponseType = Id<"users"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateUser = () => {
  const mutation = useMutation(api.users.update);

  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<"success" | "error" | "loading" | "settled" | null>(null);

  const isLoading = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("loading");
        const response = await mutation(values);
        options?.onSuccess?.(response);
        setData(response);
        return response;
      } catch (error) {
        setStatus("error");
        toast.error("Error happened");
        options?.onError?.(error as Error);
        if (options?.throwError) throw error;
      } finally {
        options.onSettled?.();
        setStatus("settled");
      }
    },
    [mutation],
  );

  return { mutate, isLoading, isSuccess, isError, isSettled, data, error };
};
