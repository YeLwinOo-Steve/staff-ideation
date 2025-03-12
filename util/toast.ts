type ToastType = "success" | "error" | "warning" | "info";

export const showToast = (message: string, type: ToastType = "info") => {
  const toast = document.createElement("div");
  toast.className = `toast toast-end`;

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} animate-fade-left animate-duration-200`;
  alert.textContent = message;

  toast.appendChild(alert);
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
};
