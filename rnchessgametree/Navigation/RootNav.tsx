import TreeManager from '../Components/treeManager';
import {  NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateTree from '../Components/createTree';
import ChoosePosition from '../Components/choosePosition';
import NodeView from '../Components/nodeView';
import HomeHeader from '../Components/homeHeader';
import SettingsPage from '../Components/settings';
import { useAppSelector } from '../Redux/hooks';
import { useState } from 'react';
import getColors from '../Styles/colors';
import getStyles from '../Styles/styles';

const Stack = createNativeStackNavigator();

export default function RootNav() {

    const settings = useAppSelector((state) => state.settings);
    const [colors, setColors] = useState(getColors(settings.paletteMode));
    const [styles, setStyles] = useState(getStyles(settings.paletteMode));

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name="Home"
                    component={TreeManager}
                    options={{
                        header: HomeHeader,
                    }}
                />
                <Stack.Screen
                    name="Create" 
                    component={CreateTree}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ChooseStart"
                    component={ChoosePosition}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="NodeView"
                    component={NodeView}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsPage}
                    options={{
                        headerStyle: {
                            backgroundColor: colors.background
                        },
                        headerTitleStyle: styles.headingText
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};