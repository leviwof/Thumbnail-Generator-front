import { resolveAssetUrl } from "./assetUrl";

export async function downloadAsset(assetUrl, fileName) {
  const resolvedAssetUrl = resolveAssetUrl(assetUrl);

  if (!resolvedAssetUrl) {
    throw new Error("The file URL is missing.");
  }

  const response = await fetch(resolvedAssetUrl);

  if (!response.ok) {
    throw new Error("The file could not be downloaded.");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
}
