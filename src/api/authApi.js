import axios from "axios";

const authApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts",
  params: {
    key: "AIzaSyAbnPMLyFGINfDngYhOKjQz8q5Mc-CQKjk",
  },
});

// console.log(process.env.NODE_ENV)  //PARA VER EN QUE ENTORNO SE ESTÁ

export default authApi;
