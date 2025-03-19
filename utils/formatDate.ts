export class FormatDate {
  static DDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}