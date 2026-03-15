import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadVideo } from "../api/videos";

export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  });
}

