const PENDING_AUTH_ACTION_KEY = "video-gallery.pending-auth-action";

export function rememberPendingAuthAction(action) {
  try {
    window.sessionStorage.setItem(PENDING_AUTH_ACTION_KEY, action);
  } catch (_error) {
    // Ignore storage issues and continue without auth success toasts.
  }
}

export function consumePendingAuthAction() {
  try {
    const action = window.sessionStorage.getItem(PENDING_AUTH_ACTION_KEY);

    window.sessionStorage.removeItem(PENDING_AUTH_ACTION_KEY);

    return action;
  } catch (_error) {
    return "";
  }
}
