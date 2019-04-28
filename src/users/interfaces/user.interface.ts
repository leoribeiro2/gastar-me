export interface UserInterface {
  name: string;
  email: string;
  password: string;
  roles: [RolesEnum];
}

enum RolesEnum {
  USER,
  ADMIN,
}
