import { 
    View,
    Text,
    SafeAreaView
 } from "react-native";
import getStyles from "../Styles/styles";
import { useAppSelector } from "../Redux/hooks";
import { useState } from "react";
import { Icon } from "react-native-elements";

export default function SettingsHeader ({ navigation })
{
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);
    const colors = useAppSelector((state) => state.settings.colors);


    return (
        <SafeAreaView style={[styles.headerContainer, {justifyContent: 'space-between'}]}>
            <View style={{width:50}}>
                <Icon style={{marginLeft: 10}} name='arrow-back' type='material-icons' color={colors.text} onPress={() => navigation.popToTop()}/>
            </View>
            
            <Text style={[styles.headingText, {}]}>Settings</Text>

            <View style={{width:50}}></View>
        </SafeAreaView>
    )
}