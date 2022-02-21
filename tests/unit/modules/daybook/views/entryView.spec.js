import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import Swal from "sweetalert2";

import journal from "@/modules/daybook/store/journal";
import EntryView from "@/modules/daybook/views/EntryView.vue";
import { journalState } from "../../../mock-data/test-journal-state";

const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });
//mock de la librería sweetalert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe("pruebas en el EntryView", () => {
  const store = createVuexStore(journalState);
  store.dispatch = jest.fn()  //evitar que el dispatch (o la acción) se ejecute de verdad en la bd, se mockea con un jest.fn
  const mockRouter = {
    push: jest.fn(),
  };
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks(); //para que limpie las pruebas cada vez que termine cada prueba
    wrapper = shallowMount(EntryView, {
      props: {
        id: "-Mvv17qG_ZsgYZpwMu-X",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });
  });

  test("debe de sacar al usuario porque el id no existe", () => {
    const wrapper = shallowMount(EntryView, {
      props: {
        id: "este id no existe en el store",
      },
      global: {
        mocks: {
          $router: mockRouter,
        },
        plugins: [store],
      },
    });
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "no-entry" }); //evaluar que al pasarle un id que no existe, lo saque a la vista no-entry
  });

  test("debe de mostrar la entrada correctamente", () => {
    //aca se verifica que como el id montado en en el wrapper del before each existe, muestre la entrada correctamente
    expect(wrapper.html()).toMatchSnapshot();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("debe de borrar la entrada y salir", (done) => {
    Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true })); //aca fingimos que en la ventana del sweetalert le damos click a si, para eliminar la entrada
    wrapper.find(".btn-danger").trigger("click");
    expect(Swal.fire).toHaveBeenCalledWith({
      title: "¿Está seguro?",
      text: "Una vez borrado, no se puede recuperar",
      showDenyButton: true,
      confirmButtonText: "Sí, estoy seguro",
    });
    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalledWith("journal/deleteEntry", "-Mvv17qG_ZsgYZpwMu-X")
      expect(mockRouter.push).toHaveBeenCalled();
      done();
    }, 2); //para esperar 1 milisegundo para que se termine de hacer las validaciones en el hilo
  });

});
