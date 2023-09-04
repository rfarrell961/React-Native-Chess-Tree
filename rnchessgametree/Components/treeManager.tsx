import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    //TouchableOpacity, 
    FlatList,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import ITreeNode from '../Interfaces/treeNode';
// import Chessboard from "react-native-chessboard";
import Chessboard from './chessboard';
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteNode, updateNode, setNodes } from '../Redux/nodesSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getNode } from '../Utility/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InsetShadow from 'react-native-inset-shadow';
import NodeList from './nodeList';

export default function TreeManager({ navigation })
{   
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const styles = useAppSelector((state) => state.settings.styles);
    const colors = useAppSelector((state) => state.settings.colors);
    const [isLoading, setIsLoading] = useState(true);

    // Get local storage when app loads
    // Not sure if thsi is the best way to do it
    useEffect(() => {
      
        const getData = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('nodes');
            // console.log("Loaded", (JSON.stringify((JSON.parse(jsonValue)), null, 2)));
            dispatch(setNodes(jsonValue != null ? JSON.parse(jsonValue) : []));
          } catch (e) {
            console.log("Get Data Error:", e)
            dispatch(setNodes([]));
          }
        };
        
        getData();
        setIsLoading(false);
    
    }, [])

    const listNavigate = (item) => {
        navigation.navigate("NodeView", {id: item.id});
    }

    return (

        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Create")}>
                <Text style={styles.buttonText}>Create a New Game Tree!</Text>
            </TouchableOpacity>

            <Text style={[styles.headingText, {margin: 20}]}>Your Trees:</Text>
            { isLoading ?
            <ActivityIndicator size={50}/> :
            <InsetShadow
                containerStyle={{
                    flex: 1, 
                }}
            >
                <NodeList 
                    onClick={listNavigate}
                    styles={styles}
                    colors={colors}
                    nodes={nodes}
                    parent={null}
                />
            </InsetShadow>
            }    
        </SafeAreaView>
    );
}