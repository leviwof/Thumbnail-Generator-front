import { useMutation, useQueryClient } from "@tanstack/react-query";

import { selectThumbnail } from "../api/videos";

export function useSelectThumbnail(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (thumbnailId) => selectThumbnail(videoId, thumbnailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  });
}

