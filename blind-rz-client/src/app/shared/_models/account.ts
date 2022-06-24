import { Role } from './role';

export class Account {
  constructor(
    public id: string,
    public title: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public role: Role,
    public jwtToken?: string
  ) {}
}

//export class Account {
//   public id: string;
//   public title: string;
//   public firstName: string;
//   public lastName: string;
//   public email: string;
//   public role: Role;
//   public jwtToken?: string;
// }
