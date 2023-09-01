import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettingsState {
    paletteMode: number,
    isProVersion: boolean,
}

const initialState: ISettingsState = {
    paletteMode: 1,
    isProVersion: false,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        changePalette: (state, action: PayloadAction <number>) => {
            state.paletteMode = action.payload;
        },
        setProVersion: (state, action: PayloadAction <boolean>) => {
            state.isProVersion = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { changePalette, setProVersion } = settingsSlice.actions;

export default settingsSlice.reducer;