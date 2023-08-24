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
import React, {useState, useEffect, useRef} from 'react';
import Chessboard, {ChessboardRef} from "react-native-chessboard";
import styles from '../Styles/styles';
import { useDispatch } from 'react-redux';
import { addTree } from '../Redux/treesSlice';
import TreeNode from '../Classes/treeNode';

export default function ChoosePosition({ navigation, name })
{
    const dispatch = useDispatch();
    const chessboardRef = useRef<ChessboardRef>(null);

    const complete = () => {

        if (chessboardRef == null)
            return;

        const state = chessboardRef.current?.getState();
        //setFen(state.fen);

        const root: TreeNode = new TreeNode(state.fen, null, name);
        dispatch(addTree(JSON.stringify(root.toJSON())));
        navigation.navigate("NodeView", {node: root});

    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Please Select a Starting Position</Text>
            <Chessboard ref={chessboardRef}/>
            <TouchableOpacity style={styles.buttonStyle} onPress={complete}>
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};