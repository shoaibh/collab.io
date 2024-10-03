import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type RequestType = { id: Id<"channels"> };
type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useRemoveChannel = () => {
  const mutation = useMutation(api.channels.remove);

  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<"success" | "error" | "loading" | "settled" | null>(null);

  const isLoading = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = useCallback(async (values: RequestType, options: Options) => {
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
      options?.onError?.(error as Error);
      if (options?.throwError) throw error;
    } finally {
      options.onSettled?.();
      setStatus("settled");
    }
  }, []);

  return { mutate, isLoading, isSuccess, isError, isSettled, data, error };
};