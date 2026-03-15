import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateThumbnails } from "../api/videos";

/**
 * Hook for generating thumbnails for a specific video.
 *
 * The backend endpoint is now synchronous — it waits for ffmpeg to
 * finish and returns the full list of generated thumbnails, so no
 * polling is needed. We just invalidate the react-query caches after
 * a successful call so the UI refreshes with the new data.
 */
export function useGenerateThumbnails(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetVideoId) => generateThumbnails(targetVideoId || videoId),
    onSuccess: (_data, targetVideoId) => {
      const resolvedVideoId = targetVideoId || videoId;

      // Invalidate caches so the gallery and video detail pages
      // immediately show the freshly generated thumbnails.
      queryClient.invalidateQueries({ queryKey: ["video", resolvedVideoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  });
}
