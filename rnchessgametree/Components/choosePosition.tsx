import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList,
    ScrollView,
    Button
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import getStyles from '../Styles/styles';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { addNode } from '../Redux/nodesSlice';
import ITreeNode, { getNextId } from '../Interfaces/treeNode';

export default function ChoosePosition({ navigation, route })
{
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const [ name, setName ] = useState(route.params.name);
    const chessboardRef = useRef<ChessboardRef>(null);
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);

    const complete = () => {
        let chessboardState = chessboardRef.current.getState();

        let newTree: ITreeNode = {
            position: chessboardState.fen,
            parent: null,
            children: [],
            name: name,
            id: getNextId(nodes)
        };

        dispatch(addNode(newTree));
        navigation.navigate("NodeView", {id: newTree.id});
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.headingText, {margin: 20}]}>Please Select a Starting Position</Text>
            <View style={{alignSelf: 'center'}}>
                <Chessboard ref={chessboardRef}/>
            </View>
            
            <TouchableOpacity style={styles.buttonStyle} onPress={() => {chessboardRef.current.resetBoard()}}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={complete}>
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};