import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteVideo } from "../api/videos";

export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: (_data, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.removeQueries({ queryKey: ["video", videoId] });
    }
  });
}
