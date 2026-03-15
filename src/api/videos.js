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
    }
  });

  return data;
}

export async function generateThumbnails(videoId) {
  const { data } = await http.post(`/api/videos/${videoId}/thumbnails/generate`);
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
