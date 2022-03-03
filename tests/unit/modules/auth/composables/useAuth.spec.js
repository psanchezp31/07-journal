import useAuth from "@/modules/auth/composables/useAuth";
import { useStore } from "vuex";

//crear el mockStore
const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  //los getters no son una función, es un objeto
  getters: {
    "auth/currentState": "authenticated",
    "auth/username": " Pau",
  },
};
jest.mock("vuex", () => ({
  //haciendo un mock de la librería vuex con las caracteristicas que yo le coloque
  useStore: () => mockStore,
  //no se llama la libería real
}));
describe("Pruebas en el useAuth", () => {
  beforeEach(() => jest.clearAllMocks());
  test("createUser exitoso ", async () => {
    const { createUser } = useAuth();
    const newUser = {
      name: "Pau",
      email: "paulis@gmail.com",
    };
    mockStore.dispatch.mockReturnValue({ ok: true }); //le decimos al mock dispatch que responder
    const resp = await createUser(newUser);
    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", {
      email: "paulis@gmail.com",
      name: "Pau",
    });
    expect(resp).toEqual({ ok: true });
  });

  test("createUser fallido, porque el email ya existe ", async () => {
    const { createUser } = useAuth();
    const newUser = {
      name: "Pau",
      email: "paulis@gmail.com",
    };
    mockStore.dispatch.mockReturnValue({ ok: false, message: "EMAIL_EXISTS" }); //le decimos al mock dispatch que responder
    const resp = await createUser(newUser);
    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", {
      email: "paulis@gmail.com",
      name: "Pau",
    });

    expect(resp).toEqual({ ok: false, message: "EMAIL_EXISTS" });
  });
  test("login exitoso", async () => {
    const { loginUser } = useAuth();
    const loginForm = {
      email: "paulis@gmail.com",
      password: "123456",
    };
    mockStore.dispatch.mockReturnValue({ ok: true }); //le decimos al mock dispatch que responder
    const resp = await loginUser(loginForm);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "auth/signInUser",
      loginForm
    );

    expect(resp).toEqual({ ok: true });
  });
  test("login fallido", async () => {
    const { loginUser } = useAuth();
    const loginForm = {
      email: "paulis@gmail.com",
      password: "123456",
    };
    mockStore.dispatch.mockReturnValue({
      ok: false,
      message: "EMAIL/PASSWORD dot not exists",
    }); //le decimos al mock dispatch que responder
    const resp = await loginUser(loginForm);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      "auth/signInUser",
      loginForm
    );

    expect(resp).toEqual({
      ok: false,
      message: "EMAIL/PASSWORD dot not exists",
    });
  });
  test("checkAuthStatus", async () => {
    const { checkAuthStatus } = useAuth();
    mockStore.dispatch.mockReturnValue({
      ok: true,
    }); //le decimos al mock dispatch que responder
    const resp = await checkAuthStatus();
    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication");
    expect(resp).toEqual({
      ok: true,
    });
  });
  test("logout", () => {
    const { logout } = useAuth();
    logout(); //se llama la función
    expect(mockStore.commit).toHaveBeenCalledWith("auth/logout");
    expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries");
  });
  test("authStatus, username getters", () => {
    const { authStatus, username } = useAuth();
    //los getter estan siendo llamados mediante propiedades computadas
    expect(username.value).toBe('authenticated')
    expect(authStatus.value).toBe('Pau')
  });
});
