import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActionTextsState {
  [key: string]: { actionWord: string; pastActionWord: string, upperText: string };
}

const initialState: ActionTextsState = {
  activate: { actionWord: "activer", pastActionWord: "activé", upperText: "Activer" },
  deactivate: { actionWord: "désactiver", pastActionWord: "désactivé", upperText: "Désactiver" },
  create: { actionWord: "créer", pastActionWord: "créé", upperText: "Créer" },
  delete: { actionWord: "supprimer", pastActionWord: "supprimé", upperText: "Supprimer" },
  edit: { actionWord: "modifier", pastActionWord: "modifié", upperText: "Modifier" },
  addRegion: { actionWord: "ajouter région", pastActionWord: "ajoté région", upperText: "Ajouter région" },
};

const actionTextsSlice = createSlice({
  name: "actionTexts",
  initialState,
  reducers: {
    setActionWords(state, action: PayloadAction<{ key: string }>) {
      // Tu peux étendre pour changer le texte dynamiquement si besoin
      // Par exemple ici, on pourrait set un texte custom dans le state
    },
  },
});

export const { setActionWords } = actionTextsSlice.actions;
export default actionTextsSlice.reducer;
