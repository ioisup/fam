export interface User {
  uid:string;
  photoURL?:string;
  email?:string;
  displayName?:string;
  merged?:User[];
}
