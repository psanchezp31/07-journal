const { createStore } = require("vuex");
import journal from "@/modules/daybook/store/journal";
import { journalState } from "../../../../mock-data/test-journal-state";

//simulando crear el store
const createVuexStore = (initialState) =>
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

describe("Vuex - pruebas en el journal module", () => {
  test("este es el estado inicial, debe tener el estado inicial", () => {
      //se crea un mock de data state inicial, en la carpeta mock-data
      const store = createVuexStore(journalState)
      const {isLoading, entries} = store.state.journal
      expect(isLoading).toBeFalsy()
      expect(entries).toEqual(journalState.entries)
  });
});
