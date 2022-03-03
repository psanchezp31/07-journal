import { shallowMount } from "@vue/test-utils";
import Login from "@/modules/auth/views/Login.vue";
import createVuexStore from "../../../mock-data/mock-store";
import Swal from "sweetalert2";
import { textChangeRangeIsUnchanged } from "typescript";

//mock del swal:
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe("Pruebas en el login component", () => {
  const store = createVuexStore({
    status: "not-authenticated",
    user: null,
    idToken: null,
    refreshToken: null,
  });

  store.dispatch = jest.fn(); //mock del dispatch

  beforeEach(() => jest.clearAllMocks());

  test("debe de hacer match con el snapshot ", () => {
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("Credenciales incorrectas, disparan el error de Sweetalert", async () => {
    store.dispatch.mockReturnValueOnce({
      //hacer un mock de la respuesta que quiero
      ok: false,
      message: "Error en credenciales",
    });
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [store],
      },
    });

    await wrapper.find("form").trigger("submit");
    expect(store.dispatch).toHaveBeenCalledWith("auth/signInUser", {
      email: "",
      password: "",
    });
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error",
      "Error en credenciales",
      "error"
    );
  });

  test("debe de redirigir a la ruta no-entry- credenciales correctas", async () => {
    store.dispatch.mockReturnValueOnce({
      //hacer un mock de la respuesta que quiero
      ok: true,
    });
    const wrapper = shallowMount(Login, {
      global: {
        plugins: [store],
      },
    });

    const [txtEmail, txtPassword] = wrapper.findAll("input");
    await txtEmail.setValue("paula@gmail.com");
    await txtPassword.setValue("123456");

    await wrapper.find("form").trigger("submit");

    expect(store.dispatch).toBeCalledWith("auth/signInUser", {
      email: "paula@gmail.com",
      password: "123456",
    });
    expect(wrapper.router.push).toHaveBeenCalledWith({"name": "no-entry"})
    
  });
});
