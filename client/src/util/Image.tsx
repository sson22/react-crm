import axios from "axios";

function arrayBufferToBase64(buffer: Buffer): string {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}

const getProfileImage = (id: string): any => {
  return axios
    .get(process.env.REACT_APP_HOST_URL + "users/get-photo/" + id)
    .then((response) => {
      console.log(response.data.img);
      return response.data.img;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export { arrayBufferToBase64, getProfileImage };
