export interface IManager {
  id: 'string';
  role: 'root' | 'manager';
  surname: 'string';
  firstname: 'string';
  patronymic: 'string';
  contact: 'string';
}

export type ManagersList = IManager[];
