import { shallowMount } from "@vue/test-utils";
import Navbar from "@/modules/daybook/components/NavBar.vue";
import createVuexStore from "../../../mock-data/mock-store";

describe("Pruebas en el navbar component", () => {
  const store = createVuexStore({
    user: {
      name: "Paulis",
      email: "paulis@gmail.com",
    },
    status: "authenticated",
    idToken: "ABC",
    refreshToken: "XZY",
  });

  test("debe de mostrar el componente correctamente ", () => {
    const wrapper = shallowMount(Navbar, {
      global: {
        plugins: [store],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("click en logout debe de cerrar sesión y redireccionar", async () => {
    const wrapper = shallowMount(Navbar, {
      global: {
        plugins: [store],
      },
    });
    await wrapper.find("button").trigger("click");

    expect(wrapper.router.push).toHaveBeenCalledWith({"name": "login"})  //con la libreria instalada vue-router-mock sirve este codigo
    expect(store.state.auth).toEqual({
      user: null,
      status: "not-authenticated",
      idToken: null,
      refreshToken: null,
    });
    //para que el router funcione en el composition api en la parte del testing usaremos una librería de tercero llamada vue-router-mock
  });
});
