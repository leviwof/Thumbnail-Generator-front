import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchVideoById, generateThumbnails } from "../api/videos";

export function useGenerateThumbnails(videoId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetVideoId) => generateThumbnails(targetVideoId || videoId),
    onSuccess: async (_data, targetVideoId) => {
      const resolvedVideoId = targetVideoId || videoId;

      // Immediately refresh caches once, so any quick jobs show up right away.
      queryClient.invalidateQueries({ queryKey: ["video", resolvedVideoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });

      // Light polling loop: keep refetching the video detail until thumbnails
      // are present or we hit a max number of attempts. This avoids forcing the
      // user to wait on the generate API itself while still updating the UI
      // shortly after the background job completes.
      const maxAttempts = 15;
      const delayMs = 1500;

      async function poll(attempt = 0) {
        if (!resolvedVideoId || attempt >= maxAttempts) {
          return;
        }

        const video = await queryClient.fetchQuery({
          queryKey: ["video", resolvedVideoId],
          queryFn: () => fetchVideoById(resolvedVideoId)
        });

        const hasThumbnails = Array.isArray(video?.thumbnails) && video.thumbnails.length > 0;

        if (!hasThumbnails) {
          setTimeout(() => {
            void poll(attempt + 1);
          }, delayMs);
        } else {
          // Final refresh to ensure all dependent views see the latest data.
          queryClient.invalidateQueries({ queryKey: ["videos"] });
        }
      }

      void poll();
    }
  });
}
