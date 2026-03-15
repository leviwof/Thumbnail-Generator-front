import http from "./http";

export async function fetchVideos(params) {
  const { data } = await http.get("/api/videos", { params });
  return data;
}

export async function fetchVideoById(id) {
  const { data } = await http.get(`/api/videos/${id}`);
  return data;
}

export async function uploadVideo(payload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description || "");
  formData.append("tags", payload.tags || "");
  formData.append("video", payload.videoFile);

  const { data } = await http.post("/api/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    // Upload can be large — allow up to 5 minutes.
    timeout: 300_000
  });

  return data;
}

/**
 * Synchronous thumbnail generation.
 * The server waits for ffmpeg to finish and returns the full thumbnail
 * list, so no polling is needed.
 */
export async function generateThumbnails(videoId) {
  const { data } = await http.post(
    `/api/videos/${videoId}/thumbnails/generate`,
    null,
    {
      // Thumbnail generation involves ffmpeg processing and can take
      // 30–60 s for large files. Use a generous timeout.
      timeout: 120_000
    }
  );

  return data;
}

export async function selectThumbnail(videoId, thumbnailId) {
  const { data } = await http.post(`/api/videos/${videoId}/thumbnails/select`, {
    thumbnailId
  });

  return data;
}

export async function deleteVideo(videoId) {
  const { data } = await http.delete(`/api/videos/${videoId}`);
  return data;
}
