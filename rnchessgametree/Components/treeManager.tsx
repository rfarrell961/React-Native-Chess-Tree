import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    //TouchableOpacity, 
    FlatList,
    ScrollView,
    Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as data from '../testData/userData.json';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import ITreeNode from '../Interfaces/treeNode';
import getStyles from '../Styles/styles';
import Chessboard from "react-native-chessboard";
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteNode, updateNode } from '../Redux/nodesSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getNode } from '../Utility/helper';


export default function TreeManager({ navigation })
{   
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);

    const RenderRightSwipe = () => {
        return (
            <View style={{justifyContent: 'center', backgroundColor: 'pink'}}>
                <Icon style={{marginHorizontal: 20}} size={35} name='delete' type='material-icons' />
            </View>
        );
    }

    const DeleteRow = (id: number, swipeable: Swipeable) => {
        Alert.alert(
            "Are you sure?",
            "",
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        dispatch(deleteNode(id));
                        swipeable.close();
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        swipeable.close();
                    },
                }
            ],
            {cancelable: false}
        );
    }

    const EditName = (id: number) => {

        let node: ITreeNode = {...getNode(id, nodes)};

        Alert.prompt(
            "Edit Name",
            "",
            [   
                {
                    text: 'Ok',
                    onPress: (newName) => { 
                        node.name = newName;
                        dispatch(updateNode(id, node));
                    }
                },
                {
                    text: 'Cancel',
                }
            ],
            "plain-text",
        );
    }

    const Item = ({item}) => (
        <Swipeable 
            renderRightActions={RenderRightSwipe}
            onSwipeableOpen={(d, Swipeable) => DeleteRow(item.id, Swipeable)}
            >
            <TouchableOpacity style={styles.listItem} onPress={() => (navigation.navigate("NodeView", {id: item.id}))}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{marginLeft: 10, marginRight: 50, borderWidth:.5}}>
                        <Chessboard fen={item.position} boardSize={75}/>
                    </View>
                    <Text style={[styles.listItemText, {marginRight: 10}]}>{item.name}</Text>

                    <TouchableOpacity onPress={() => EditName(item.id)}>
                        <Icon style={{marginRight: 20}} name='edit' type='material-icons'/>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon style={{marginRight: 20}} name='arrow-forward-ios' type='material-icons' />
                </View>

            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <SafeAreaView style={styles.container}>

            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Create")}>
                <Text style={styles.buttonText}>Create a New Game Tree!</Text>
            </TouchableOpacity>

            <Text style={[styles.headingText, {margin: 20}]}>Your Trees:</Text>

            <ScrollView bounces={false} style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    // Only show parent == null (roots)
                    nodes.map((item, index) => {
                        if (item.parent == null)
                            return <Item item={item} key={index}/>
                    })
                }
            </ScrollView>
        </SafeAreaView>
    );
}