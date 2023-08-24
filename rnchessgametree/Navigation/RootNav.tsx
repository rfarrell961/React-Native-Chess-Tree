import TreeManager from '../Components/treeManager';
import {  NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateTree from '../Components/createTree';
import ChoosePosition from '../Components/choosePosition';
import NodeView from '../Components/nodeView';

const Stack = createNativeStackNavigator();

export default function RootNav() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name="Home"
                    component={TreeManager}
                    options={{headerShown: false}}
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
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};