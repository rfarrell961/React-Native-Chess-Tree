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
import { Icon } from "react-native-elements";

export default function ChoosePosition({ navigation, route })
{
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const [ name, setName ] = useState(route.params.name);
    const chessboardRef = useRef<ChessboardRef>(null);
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);
    const [flipped, setFlipped] = useState(false);

    const complete = () => {
        let chessboardState = chessboardRef.current.getState();

        let newTree: ITreeNode = {
            position: chessboardState.fen,
            parent: null,
            children: [],
            name: name,
            id: getNextId(nodes),
            flipped: flipped
        };


        dispatch(addNode(newTree));
        navigation.navigate("NodeView", {id: newTree.id});
    }

    const flip = () => {
        setFlipped(!flipped);
    }

    const reset = () => {
        chessboardRef.current.resetBoard()
        // setFlipped(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.headingText, {margin: 20}]}>Select a Starting Position</Text>
            <View style={{alignSelf: 'center'}}>
                <Chessboard ref={chessboardRef} flipped={flipped}/>
            </View>
            
            <View style={{flexDirection: "row", justifyContent: 'center', height: "10%", alignItems: 'center'}}>
                {/* <TouchableOpacity style={[styles.buttonStyle, {width: '30%'}]} onPress={reset}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.buttonStyle, {width: '30%'}]} onPress={flip}>
                    <Text style={styles.buttonText}>Flip</Text>
                </TouchableOpacity> */}
                <Icon name='refresh' type='material-icons' style={{marginRight: 30}} size={30} color={settings.colors.text} onPress={reset}/>
                <Icon name='swap-vert' type='material-icons' style={{marginLeft: 30}} size={30} color={settings.colors.text} onPress={flip}/>
            </View>

            <TouchableOpacity style={styles.buttonStyle} onPress={complete}>
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonStyleRed} onPress={() => {navigation.popToTop()}}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};