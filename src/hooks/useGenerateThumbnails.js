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
      //
      // Poll a bit more aggressively so thumbnails appear sooner after upload,
      // while still backing off to avoid hammering the server.
      const maxAttempts = 24;
      const initialDelayMs = 600;
      const maxDelayMs = 2000;

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
          const nextDelay = Math.min(initialDelayMs * Math.max(1, attempt + 1), maxDelayMs);

          setTimeout(() => {
            void poll(attempt + 1);
          }, nextDelay);
        } else {
          // Final refresh to ensure all dependent views see the latest data.
          queryClient.invalidateQueries({ queryKey: ["videos"] });
        }
      }

      void poll();
    }
  });
}
