import { 
    SafeAreaView,
    Switch
 } from "react-native";
import getStyles from "../Styles/styles"
import { useAppSelector, useAppDispatch } from "../Redux/hooks"
import { useState } from "react";
import { changePalette } from "../Redux/settingsSlice";

export default function SettingsPage()
{
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);

     return (
        <SafeAreaView style={styles.container}>
            <Switch
                value={(settings.paletteMode == 2)}
                onValueChange={() => {
                    if (settings.paletteMode == 1)
                        dispatch(changePalette(2));
                    else
                        dispatch(changePalette(1));
                }}
            />
        </SafeAreaView>
     )
}