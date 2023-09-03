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
import getStyles from '../Styles/styles';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { addNode } from '../Redux/nodesSlice';
import ITreeNode, { getNextId } from '../Interfaces/treeNode';

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function CreateTree({ navigation })
{
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);
    const colors = useAppSelector((state) => state.settings.colors);

    const CreateFromStart = () => {

        let newTree: ITreeNode = {
            position: startFen,
            parent: null,
            children: [],
            name: name,
            id: getNextId(nodes)
        }

        dispatch(addNode(newTree));
        navigation.navigate("NodeView", {id: newTree.id});
    }

    const CreateFromPosition = () => {
        navigation.navigate("ChooseStart", {name: name});
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.headingText, {margin: 20}]}>New Tree:</Text>
            <TextInput 
                style={styles.input} 
                placeholder='Name' 
                maxLength={35} 
                onChangeText={text => setName(text)}
                placeholderTextColor={colors.text2}
                
            />
            <TouchableOpacity style={styles.buttonStyle} onPress={CreateFromStart}>
                <Text style={styles.buttonText}>From Starting Position</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={CreateFromPosition}>
                <Text style={styles.buttonText}>From Custom Position</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyleRed} onPress={() => {navigation.popToTop()}}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};