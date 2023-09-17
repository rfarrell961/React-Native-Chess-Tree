import { 
    SafeAreaView,
    Switch,
    View,
    Text
 } from "react-native";
import getStyles from "../Styles/styles"
import { useAppSelector, useAppDispatch } from "../Redux/hooks"
import { useState } from "react";
import { changePalette, setProVersion } from "../Redux/settingsSlice";

export default function SettingsPage()
{
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);

     return (
        <SafeAreaView style={[styles.container, {alignItems: 'center'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 40}}>
                <Text style={[styles.subHeadingText, {marginRight: 10}]}>Dark Mode</Text>
                <Switch
                    value={(settings.paletteMode == 2)}
                    onValueChange={() => {
                        if (settings.paletteMode == 1)
                            dispatch(changePalette(2));
                        else
                            dispatch(changePalette(1));
                    }}
                />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 40}}>
                <Text style={[styles.subHeadingText, {marginRight: 10}]}>Pro Version</Text>
                <Switch
                    value={(settings.isProVersion)}
                    onValueChange={() => {
                        dispatch(setProVersion(!settings.isProVersion))
                    }}
                />
            </View>
            
        </SafeAreaView>
     )
}