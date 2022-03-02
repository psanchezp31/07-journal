import axios from "axios";

const journalApi = axios.create({
  baseURL: "https://vue-learning-96ff9-default-rtdb.firebaseio.com",
});

journalApi.interceptors.request.use((config) => { //interceptors es de axios
  config.params = {
    auth: localStorage.getItem("idToken"), //este param lo pide que sea enviado firebase, para que el sepa si el idToken es válido
  };

  return config;
});

// console.log(process.env.NODE_ENV)  //PARA VER EN QUE ENTORNO SE ESTÁ

export default journalApi;
