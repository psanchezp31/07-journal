import { computed } from "vue";
import { useStore } from "vuex";

const useAuth = () => {
  const store = useStore();
  const createUser = async (user) => {
    const resp = await store.dispatch("auth/createUser", user);
    return resp;
  };
  const loginUser = async (user) => {
    const resp = await store.dispatch("auth/signInUser", user);
    return resp;
  };
  const checkAuthStatus = async () => {
    const resp = await store.dispatch("auth/checkAuthentication");
    return resp;
  };
  const logout = () => {
    store.commit("auth/logout");
    //limpiar las entradas (entries):
    store.commit("journal/clearEntries");
  };

  return {
    authStatus: computed(() => store.getters["auth/currentState"]),
    checkAuthStatus,
    createUser,
    loginUser,
    logout,
    username: computed(() => store.getters["auth/username"]),
  };
};

export default useAuth;
