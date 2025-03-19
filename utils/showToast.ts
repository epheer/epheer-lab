interface ToastOptions {
  summary: string;
  detail: string;
  group: string;
}

export default class ShowToast {
  private static toast: any;

  public static initialize(toastInstance: any) {
    this.toast = toastInstance;
  }

  public static success(options: ToastOptions) {
    this.toast.add({
      severity: 'success',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group,
    });
  }

  public static error(options: ToastOptions) {
    this.toast.add({
      severity: 'error',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group,
    });
  }

  public static warning(options: ToastOptions) {
    this.toast.add({
      severity: 'warn',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group,
    });
  }

  public static info(options: ToastOptions) {
    this.toast.add({
      severity: 'info',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group,
    });
  }
}
