import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateThumbnails } from "../api/videos";

export function useGenerateThumbnails(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetVideoId) => generateThumbnails(targetVideoId || videoId),
    onSuccess: (_data, targetVideoId) => {
      const resolvedVideoId = targetVideoId || videoId;

      queryClient.invalidateQueries({ queryKey: ["video", resolvedVideoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  });
}
