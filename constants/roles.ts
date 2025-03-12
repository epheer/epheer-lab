export interface IFullRole {
  value: UserRole;
  label: string;
}

export enum UserRole {
  ROOT = "root",
  MANAGER = "manager",
  ARTIST = "artist",
}

export const rolesList = (t: (key: string) => string): IFullRole[] => [
  { value: UserRole.ARTIST, label: t("roles.artist") },
  { value: UserRole.MANAGER, label: t("roles.manager") },
  { value: UserRole.ROOT, label: t("roles.root") },
];
