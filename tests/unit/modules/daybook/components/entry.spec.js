import { shallowMount } from "@vue/test-utils";
import Entry from "@/modules/daybook/components/Entry.vue";
import { journalState } from "../../../mock-data/test-journal-state";

describe("Pruebas en el entry component", () => {
  // mockrouter
  const mockRouter = {
    push: jest.fn(), //mock a function
  };
  const wrapper = shallowMount(Entry, {
    props: {
      entry: journalState.entries[1], //simulamos que esta es la nueva entry
    },
    global: {
      mocks: {
        $router: mockRouter, // se hace un obj mock para simular los objetos globales como $router y que apunte a la funcion mockiada
      },
    },
  });

  test("debe de hacer match con el snapshot ", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("debe de redireccionar al hacer click en el entry-container", () => {
    wrapper.find(".entry-container").trigger("click");
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "entry",
      params: { id: journalState.entries[1].id }, //verificar que haya sido llamado con este param
    });
  });

  test("pruebas en las propiedades computadas", () => {
    //wrapper.vm. .<--. ver las prop computadas
    //verificar day, month, yearDay
    expect(wrapper.vm.day).toBe(14);
    expect(wrapper.vm.month).toBe("Febrero");
    expect(wrapper.vm.yearDay).toBe("2022, Lunes");
  });
});
