import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getStyles from "../Styles/styles";
import getColors from "../Styles/colors";

interface ISettingsState {
    paletteMode: number,
    isProVersion: boolean,
    styles: any,
    colors: any,
}

const initialState: ISettingsState = {
    paletteMode: 1, // Color Palette (defaults 1 used in getStyls and get Colors)
    isProVersion: false, // Access to additional features
    styles: getStyles(1),
    colors: getColors(1),
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        changePalette: (state, action: PayloadAction <number>) => {
            let palette = action.payload;

            state.paletteMode = palette;
            state.styles = getStyles(palette);
            state.colors = getColors(palette);
        },
        setProVersion: (state, action: PayloadAction <boolean>) => {
            state.isProVersion = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const { changePalette, setProVersion } = settingsSlice.actions;

export default settingsSlice.reducer;