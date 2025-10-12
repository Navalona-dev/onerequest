import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TextPerLang {
  actionWord: string;
  pastActionWord: string;
  upperText: string;
}

interface ActionTextsState {
  [key: string]: {
    fr: TextPerLang;
    en: TextPerLang;
  };
}

const initialState: ActionTextsState = {
  activate: {
    fr: { actionWord: "activer", pastActionWord: "activé", upperText: "Activer" },
    en: { actionWord: "activate", pastActionWord: "activated", upperText: "Activate" },
  },
  deactivate: {
    fr: { actionWord: "désactiver", pastActionWord: "désactivé", upperText: "Désactiver" },
    en: { actionWord: "deactivate", pastActionWord: "deactivated", upperText: "Deactivate" },
  },
  create: {
    fr: { actionWord: "créer", pastActionWord: "créé", upperText: "Créer" },
    en: { actionWord: "create", pastActionWord: "created", upperText: "Create" },
  },
  delete: {
    fr: { actionWord: "supprimer", pastActionWord: "supprimé", upperText: "Supprimer" },
    en: { actionWord: "delete", pastActionWord: "deleted", upperText: "Delete" },
  },
  edit: {
    fr: { actionWord: "modifier", pastActionWord: "modifié", upperText: "Modifier" },
    en: { actionWord: "edit", pastActionWord: "edited", upperText: "Edit" },
  },
  save: {
    fr: { actionWord: "enregistrer", pastActionWord: "enregistré", upperText: "Enregistrer" },
    en: { actionWord: "save", pastActionWord: "saved", upperText: "Save" },
  },
  addRegion: {
    fr: { actionWord: "ajouter région", pastActionWord: "ajouté région", upperText: "Ajouter région" },
    en: { actionWord: "add region", pastActionWord: "region added", upperText: "Add Region" },
  },
  fileText: {
    fr: { actionWord: "voir le fichier", pastActionWord: "vu", upperText: "Voir le fichier" },
    en: { actionWord: "view file", pastActionWord: "viewed", upperText: "View File" },
  },
  dissocie: {
    fr: { actionWord: "dissocier", pastActionWord: "dissocié", upperText: "Dissocier" },
    en: { actionWord: "dissociate", pastActionWord: "dissociated", upperText: "Dissociate" },
  },
  send: {
    en: { actionWord: "send", pastActionWord: "send", upperText: "Send" },
    fr: { actionWord: "envoyer", pastActionWord: "envoyer", upperText: "Envoyer" },
  },
};

const actionTextsSlice = createSlice({
  name: "actionTexts",
  initialState,
  reducers: {
    setActionWords(state, action: PayloadAction<{ key: string }>) {
      // extension future
    },
  },
});

export const { setActionWords } = actionTextsSlice.actions;
export default actionTextsSlice.reducer;
