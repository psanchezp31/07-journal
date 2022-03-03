import axios from "axios";
import createVuexStore from "../../../mock-data/mock-store";

describe("vuex: pruebas en el auth-module", () => {
  test("estado inicial", () => {
    const store = createVuexStore({
      status: "authenticating",
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe("authenticating");
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
  });

  //Mutations
  test("Mutation: loginUser", () => {
    const store = createVuexStore({
      status: "authenticating",
      user: null,
      idToken: null,
      refreshToken: null,
    });
    const payload = {
      user: {
        name: "Paula",
        email: "paula@gmail.com",
      },
      idToken: "ABC-123",
      refreshToken: "ABC-123",
    };
    store.commit("auth/loginUser", payload);

    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe("authenticated");
    expect(user).toEqual({
      name: "Paula",
      email: "paula@gmail.com",
    });
    expect(idToken).toBe("ABC-123");
    expect(refreshToken).toBe("ABC-123");
  });

  test("Mutation: logout", () => {
    //SE ESTABLECE EL LOCAL STORAGE
    localStorage.setItem("idToken", "ABC-123");
    localStorage.setItem("refreshToken", "XYZ-123");

    const store = createVuexStore({
      status: "authenticating",
      user: {
        name: "Paula",
        email: "paula@gmail.com",
      },
      idToken: "erer",
      refreshToken: "adf",
    });
    store.commit("auth/logout");
    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe("not-authenticated");
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
    //evaluar que del localStorage tambien se borren el idTOken y el refreshToken
    expect(localStorage.getItem("idToken")).toBeFalsy();
    expect(localStorage.getItem("refreshToken")).toBeFalsy();
  });

  //getters

  test("Getter: username, currentState", () => {
    const store = createVuexStore({
      status: "authenticated",
      user: {
        name: "Paula",
        email: "paula@gmail.com",
      },
      idToken: "erer",
      refreshToken: "adf",
    });

    expect(store.getters["auth/currentState"]).toBe("authenticated");
    expect(store.getters["auth/username"]).toBe("Paula");
  });

  //actions
  test("actions: createUser - Error usuario ya existe ", async () => {
    const store = createVuexStore({
      status: "not-authenticated",
      user: null,
      idToken: null,
      refreshToken: null,
    });

    const newUser = {
      name: "Test user",
      email: "test@test.com",
      password: "123456",
    };

    const resp = await store.dispatch("auth/createUser", newUser);
    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe("not-authenticated");
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);
  });

  test("Actions: createUser, signInUser  - crea el usuario ", async () => {
    const store = createVuexStore({
      status: "not-authenticated",
      user: null,
      idToken: null,
      refreshToken: null,
    });

    //sign in del usuario
    const newUser = {
      name: "Test User",
      email: "test2@test.com",
      password: "123456",
    };
    await store.dispatch("auth/signInUser", newUser);
    const { idToken } = store.state.auth;

    //Borrar el usuario
    const deleteResp = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=
      AIzaSyAbnPMLyFGINfDngYhOKjQz8q5Mc-CQKjk`,
      { idToken }
    );
    //crear el usuario
    const resp = await store.dispatch("auth/createUser", newUser);
    expect(resp).toEqual({ ok: true });
    const { status, user, idToken: token, refreshToken } = store.state.auth;
    expect(status).toBe("authenticated");
    expect(user).toMatchObject(newUser);
    expect(typeof token).toBe("string");
    expect(typeof refreshToken).toBe("string");
  });

  test("Actions: checkAuthentication - positiva ", async () => {
    const store = createVuexStore({
      status: "not-authenticated",
      user: null,
      idToken: null,
      refreshToken: null,
    });

    //Sign in
    const signInResp = await store.dispatch("auth/signInUser", {
      email: "test@test.com",
      password: "123456",
    });

    const { idToken } = store.state.auth;
    store.commit("auth/logout");
    localStorage.setItem("idToken", idToken); //purgar el storage
    const checkResp = await store.dispatch("auth/checkAuthentication");
    expect(checkResp).toEqual({ ok: true });

    const { status, user, idToken: token } = store.state.auth;
    expect(status).toBe("authenticated");
    expect(user).toMatchObject({ name: "User Test", email: "test@test.com" });
    expect(typeof token).toBe("string");
  });

  test("Actions: checkAuthentication - negativa ", async () => {
    const store = createVuexStore({
      status: "authenticating",
      user: null,
      idToken: null,
      refreshToken: null,
    });

    localStorage.removeItem("idToken");

    const checkResp1 = await store.dispatch("auth/checkAuthentication");

    expect(checkResp1).toEqual({ ok: false, message: "No hay token" });
    expect(store.state.auth.user).toBeFalsy();
    expect(store.state.auth.idToken).toBeFalsy();
    expect(store.state.auth.status).toBe("not-authenticated");

    //respuesta negativa
    localStorage.setItem("idToken", "ABC-123"); //SE LE PONE UN IDTOKEN QUE NO EXISTE PARA QUE RECHACE EL LOGIN
    const checkResp2 = await store.dispatch("auth/checkAuthentication");
    expect(checkResp2).toEqual({ ok: false, message: "INVALID_ID_TOKEN" });
    expect(store.state.auth.status).toBe("not-authenticated");
  });
});
