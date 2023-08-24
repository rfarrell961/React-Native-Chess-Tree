import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList,
    ScrollView,
    Button,
    TextInput
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Chessboard, {ChessboardRef} from "react-native-chessboard";
import styles from '../Styles/styles';
import TreeNode from '../Classes/treeNode';
import { useDispatch, useSelector } from 'react-redux';
import { addTree } from '../Redux/treesSlice';

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function CreateTree({ navigation })
{
    const dispatch = useDispatch();
    const [name, setName] = useState("");

    const CreateFromStart = () => {
        const root: TreeNode = new TreeNode(startFen, null, name);
        dispatch(addTree(JSON.stringify(root.toJSON())));
        navigation.navigate("NodeView", {node: root});
    }

    const CreateFromPosition = () => {
        navigation.navigate("ChooseStart", {name: name});
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>New Tree:</Text>
            <TextInput 
                style={styles.input} 
                placeholder='Name' 
                maxLength={35} 
                onChangeText={text => setName(text)}
            />
            <TouchableOpacity style={styles.buttonStyle} onPress={CreateFromStart}>
                <Text style={styles.buttonText}>From Starting Position</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={CreateFromPosition}>
                <Text style={styles.buttonText}>From Custom Position</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};