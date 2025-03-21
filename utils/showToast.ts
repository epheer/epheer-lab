import { useNuxtApp } from '#app';

interface ToastOptions {
  summary?: string;
  detail?: string;
  group?: string;
}

export default class ShowToast {
  private static toast: any;

  public static initialize(toastInstance: any) {
    this.toast = toastInstance;
  }

  private static getI18n() {
    const { $i18n } = useNuxtApp();
    return $i18n;
  }

  public static success(options: ToastOptions) {
    const i18n = this.getI18n();
    this.toast.add({
      severity: 'success',
      summary: options.summary || i18n.t('success'),
      detail: options.detail,
      life: 3000,
      group: options.group || 'br',
    });
  }

  public static error(options: ToastOptions) {
    const i18n = this.getI18n();
    this.toast.add({
      severity: 'error',
      summary: options.summary || i18n.t('error'),
      detail: options.detail || i18n.t('errors.default'),
      life: 3000,
      group: options.group || 'br',
    });
  }

  public static warning(options: ToastOptions) {
    const i18n = this.getI18n();
    this.toast.add({
      severity: 'warn',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group || 'br',
    });
  }

  public static info(options: ToastOptions) {
    const i18n = this.getI18n();
    this.toast.add({
      severity: 'info',
      summary: options.summary,
      detail: options.detail,
      life: 3000,
      group: options.group || 'br',
    });
  }
}
