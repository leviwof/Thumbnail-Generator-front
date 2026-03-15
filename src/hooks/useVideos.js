import { useQuery } from "@tanstack/react-query";

import { fetchVideos } from "../api/videos";

export function useVideos(search, tag) {
  return useQuery({
    queryKey: ["videos", search, tag],
    queryFn: () => fetchVideos({ search, tag })
  });
}

