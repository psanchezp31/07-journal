// export const myMutation = (state) =>{
// }

export const setEntries = (state, entries) => {
  state.entries = [...state.entries, ...entries];
  state.isLoading = false;
};
export const updateEntry = (state, updatedEntry) => {
  const idx = state.entries.map((e) => e.id).indexOf(updatedEntry.id);
  state.entries[idx] = updatedEntry
};

export const addEntry = (state, createdEntry) => {
  // state.entries.push(createdEntry)
  state.entries = [createdEntry, ...state.entries] // en el nuevo arreglo, ahora irá 
  //la nueva entrada de primero y el resto van despues
};

export const deleteEntry = (state, id) =>{
  state.entries = state.entries.filter(entry => entry.id !== id)
}

export const clearEntries = (state) =>{
  state.entries = []
}
