import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getStyles from "../Styles/styles";
import getColors from "../Styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const saveData = async (settings) => {
    try {

        // Clear and reset nodes
        try {  
            AsyncStorage.removeItem('settings');
        }
        catch (e)
        {
            console.log("Save Data Error 3:", e);
        }
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem('settings', jsonValue);

    } catch (e) {
        console.log("Save Data Error 4:", e)
    }
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

            saveData(state);
        },
        setProVersion: (state, action: PayloadAction <boolean>) => {
            state.isProVersion = action.payload;

            saveData(state);
        },
        setSettings: (state, action: PayloadAction <ISettingsState>) => {
            // console.log(JSON.stringify(action.payload, null, 2))
            if (action.payload == null)
                state = initialState;
            else
            {
                state.isProVersion = action.payload.isProVersion;
                state.paletteMode = action.payload.paletteMode;
                state.styles = getStyles(state.paletteMode);
                state.colors = getColors(state.paletteMode);
            }

        }
    }
});

// Action creators are generated for each case reducer function
export const { changePalette, setProVersion, setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;