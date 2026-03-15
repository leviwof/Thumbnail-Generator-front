import { useQuery } from "@tanstack/react-query";

import { fetchVideoById } from "../api/videos";

export function useVideoDetail(videoId) {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: () => fetchVideoById(videoId),
    enabled: Boolean(videoId)
  });
}

