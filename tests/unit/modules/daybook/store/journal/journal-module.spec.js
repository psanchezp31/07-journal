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
    const store = createVuexStore(journalState);
    const { isLoading, entries } = store.state.journal;
    expect(isLoading).toBeFalsy();
    expect(entries).toEqual(journalState.entries);
  });

  //mutations

  test("mutation: setEntries", () => {
    const store = createVuexStore({ isLoading: true, entries: [] });
    store.commit("journal/setEntries", journalState.entries);
    expect(store.state.journal.entries.length).toBe(2);
    expect(store.state.journal.isLoading).toBeFalsy();
  });

  test("mutation: updateEntry", () => {
    //create store
    const store = createVuexStore(journalState);
    //updatedEntry
    const updatedEntry = {
      id: "-MvajsUxM2jFxNG7N2_V",
      date: 1644548809952,
      text: "hola desde pruebas",
    };
    //commit mutación
    store.commit("journal/updateEntry", updatedEntry);
    //expects
    //entries.lenght === 2
    const storeEntries = store.state.journal.entries;
    expect(storeEntries.length).toBe(2);
    //en los entries tiene que existir el updated Entry con el toEqual
    expect(storeEntries.find((entry) => entry.id === updatedEntry.id)).toEqual(
      updatedEntry
    );
  });

  test("mutation: addEntry y deleteEntry", () => {
    //crear store
    const store = createVuexStore(journalState);
    //addEntry {id: 'ABC-123', text: 'hola mundo'}
    const createdEntry = { id: "ABC-123", text: "hola mundo" };
    store.commit("journal/addEntry", createdEntry);
    //expects
    //q las entradas sean 3
    const storeEntries = store.state.journal.entries;
    expect(storeEntries.length).toBe(3);
    //entrada con el id ABC-123 que exista
    expect(
      storeEntries.find((entry) => entry.id === createdEntry.id)
    ).toBeTruthy();
    //delete entry. 'ABC-123'
    store.commit("journal/deleteEntry", createdEntry.id);
    //Expects
    //entradas deben de ser 2
    expect(store.state.journal.entries.length).toBe(2);
    //no debe existir la entrada 'ABC-123'
    expect(
      store.state.journal.entries.find((entry) => entry.id === createdEntry.id)
    ).toBeFalsy();
  });

  //getters

  test("getters: getEntriesByTerm y getEntryById ", () => {
    const store = createVuexStore(journalState);
    const [entry1, entry2] = journalState.entries;
    //getEntriesByTerm
    expect(store.getters["journal/getEntriesByTerm"]("").length).toBe(2);
    expect(store.getters["journal/getEntriesByTerm"]("Mannyto").length).toBe(1);
    expect(store.getters["journal/getEntriesByTerm"]("Mannyto")).toEqual([
      entry2,
    ]);

    //getEntryById
    console.log(entry1);
    expect(
      store.getters["journal/getEntryById"]("-MvajsUxM2jFxNG7N2_V")
    ).toEqual(entry1);
  });

  //actions
  test("actions: loadEntries", async () => {
    const store = createVuexStore({ isLoading: true, entries: [] });
    await store.dispatch("journal/loadEntries"); //el resultado del dispatch no es síncrono, hay que esperar que termine el procedimiento por eso el async await
    // expect(store.state.journal.entries.length).toBe(3);
  });

  test("actions: updateEntry", async () => {
    const store = createVuexStore(journalState);
    const updatedEntry = {
      id: "-MvajsUxM2jFxNG7N2_V",
      date: 1644548809952,
      text: "Estoy aprendiendo vue con Fernando.",
    };
    await store.dispatch("journal/updateEntry", updatedEntry);
    expect(store.state.journal.entries.length).toBe(2);
    expect(
      store.state.journal.entries.find((e) => e.id === updatedEntry.id)
    ).toEqual({
      id: "-MvajsUxM2jFxNG7N2_V",
      date: 1644548809952,
      text: "Estoy aprendiendo vue con Fernando.",
    });
  });

  test("actions: createEntry, deleteEntry ", async () => {
    //createStore
    const store = createVuexStore(journalState);
    //newEntry = {date: 1644635156374, text:'Nueva entrada desde las pruebas'}
    const newEntry = {
      date: 1644635156374,
      text: "Nueva entrada desde las pruebas",
    };
    //dispatch de la acción createEntry
    //obtener el id de la nueva entrada, id del firebase
    const id = await store.dispatch("journal/createEntry", newEntry);

    // el id debe de ser un string
    expect(typeof id).toBe("string");
    //la nueva entrada debe de existir en el state.journal.entries..
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeTruthy();
    //Dispatch deleteEntry
    await store.dispatch("journal/deleteEntry", id);
    //la nueva entrada  no debe de existir en el state.journal.entries..
    expect(store.state.journal.entries.find((e) => e.id === id)).toBeFalsy();
  });
});
