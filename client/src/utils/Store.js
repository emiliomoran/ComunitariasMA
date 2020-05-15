import decode from "jwt-decode";

export default class Store {
  static setToken = (token) => {
    localStorage.setItem("token", token);
  };

  static getToken = () => {
    return localStorage.getItem("token") ? localStorage.getItem("token") : "";
  };

  static removeToken = () => {
    localStorage.removeItem("token");
  };

  static getUsername = () => {
    const user = decode(this.getToken());
    return user ? user.username : "annonymous";
  };
}
