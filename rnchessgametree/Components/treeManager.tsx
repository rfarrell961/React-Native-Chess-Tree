import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList,
    ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import * as data from '../testData/userData.json';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import ITreeNode from '../Interfaces/treeNode';
import styles from '../Styles/styles';

export default function TreeManager({ navigation })
{   
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();

    const Item = ({item}) => (
        <TouchableOpacity style={styles.listItem} onPress={() => (navigation.navigate("NodeView", {id: item.id}))}>
            <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headingText}>Your Trees:</Text>

            <ScrollView style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    // Only show parent == null (roots)
                    nodes.map((item, index) => {
                        if (item.parent == null)
                            return <Item item={item} key={index}/>
                    })
                }
            </ScrollView>
            
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Create")}>
                <Text style={styles.buttonText}>Create a New Game Tree!</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}