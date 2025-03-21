import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export class FormatDate {
  static DDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy', { locale: ru });
  };
}
