/* Add an 'email' and 'admin' attribute to session storage */
import "express-session";
declare module "express-session" {
  interface SessionData {
    email: string;
    admin: boolean;
  }
}
