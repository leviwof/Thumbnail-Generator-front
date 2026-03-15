const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export function resolveAssetUrl(assetUrl) {
  if (!assetUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(assetUrl)) {
    return assetUrl;
  }

  return `${API_BASE_URL}${assetUrl.startsWith("/") ? assetUrl : `/${assetUrl}`}`;
}
