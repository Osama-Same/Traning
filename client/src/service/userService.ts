import { RegisteredUserType } from "../components/mainState";
import axios from "axios";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import httpService from "./httpService";
const url = "http://147.182.183.104/";

export async function registerUser(user: any) {
  try {
    const res = await axios.post(url + "api/users", user);
    const jwt: any = res.headers["x-auth-token"];
    localStorage.setItem("token", jwt);
    window.location.href = "/";
    toast(res.data);
  } catch (ex: any) {
    console.log("ex", ex);
    toast.error(ex.message);
  }
}
export async function loginUser(user: any) {
  try {
    const res = await axios.post(url + "api/auth", user);
    const jwt = res.data;
    localStorage.setItem("token", jwt);
    // window.location.href='/'
  } catch (ex: any) {
    toast.error(ex.response.data);
  }
}
export async function getCurrentUser() {
  let _user: any = null;
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) _user = jwtDecode(jwt);
  } catch (ex: any) {
    toast.error(ex.message);
  }
  if (_user) {
    const _allUsers: any[] = await httpService._get("users");
    const regUser: RegisteredUserType | undefined = _allUsers.find(
      (u) => u.id == _user.id
    );
    if (regUser) return regUser;
  }

  return null;
}
export function logOut() {
  localStorage.removeItem("token");
}
export function getToken() {
  return localStorage.getItem("token");
}
