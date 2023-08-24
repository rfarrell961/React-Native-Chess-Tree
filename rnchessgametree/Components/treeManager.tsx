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
import { useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import TreeNode from '../Classes/treeNode';
import styles from '../Styles/styles';

// Item for trees flatlist
const Item = ({item, navigation}) => (
    <TouchableOpacity style={styles.listItem} onPress={(navigation.navigate("EditTree", {root: item}))}>
        <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
);

export default function TreeManager({ navigation })
{   
    // console.log(data.trees[0].name)
    const treesRaw: string[] = useAppSelector((state) => state.trees.trees);
    const [trees, setTrees] = useState<TreeNode[] | undefined>([]);
    const dispatch = useAppDispatch();
    //const [trees, setTrees] = useState();

    useEffect(() => {
        setTrees(deserializeTrees(treesRaw));
    }, [treesRaw])

    const deserializeTrees = (input: string[]) : TreeNode[] => {

        let tempTrees: TreeNode[] = [];

        for (let raw of input)
        {
            let obj = JSON.parse(raw);
            tempTrees.push(TreeNode.fromJSON(obj));
        }

        return tempTrees
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headingText}>Your Trees:</Text>

            <ScrollView style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    trees.map((item, index) => <Item item={item} navigation={navigation} key={index}/>)
                }
            </ScrollView>
            
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.push("Create")}>
                <Text style={styles.buttonText}>Create a New Game Tree!</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}