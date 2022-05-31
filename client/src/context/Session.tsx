import axios from "axios";
import "dotenv/config";

const logOut = (): any => {
  return axios
    .get(process.env.REACT_APP_HOST_URL + "users/logout", { withCredentials: true })
    .then((response) => {
      console.log("logOut response: ");
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const isLoggedIn = (): any => {
  return axios
    .get(process.env.REACT_APP_HOST_URL + "users/checkLogin", { withCredentials: true })
    .then((response: any) => {
      console.log("isLoggedIn response: " + response.data);
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
    });
};

const isAdmin = (): any => {
  return axios
    .get(process.env.REACT_APP_HOST_URL + "users/checkAdmin", { withCredentials: true })
    .then((response: any) => {
      console.log("isAdmin response: " + response.data);
      return response.data;
    })
    .catch((error: any) => {
      console.log(error);
    });
};

const getLoggedUserInfo = (): any => {
  return axios
    .get(process.env.REACT_APP_HOST_URL + "users/user-info", { withCredentials: true })
    .then((response) => {
      console.log("getLoggedUserInfo response: " + response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export { isLoggedIn, isAdmin, logOut, getLoggedUserInfo };
