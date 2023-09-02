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
import Chessboard from "react-native-chessboard";
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { deleteNode, updateNode, setNodes } from '../Redux/nodesSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getNode } from '../Utility/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TreeManager({ navigation })
{   
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);
    const [isLoading, setIsLoading] = useState(true);

    // Get local storage when app loads
    // Not sure if thsi is the best way to do it
    useEffect(() => {
      
        const getData = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('nodes');
            console.log("Loaded", (JSON.stringify((JSON.parse(jsonValue)), null, 2)));
            dispatch(setNodes(jsonValue != null ? JSON.parse(jsonValue) : []));
          } catch (e) {
            console.log("Get Data Error:", e)
            dispatch(setNodes([]));
          }
        };
        
        getData();
        setIsLoading(false);
    
      }, [])

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
            {(isLoading) ?
            <ActivityIndicator size={50}/> :
            <ScrollView bounces={false} style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    // Only show parent == null (roots)
                    nodes.map((item, index) => {
                        if (item.parent == null)
                            return <Item item={item} key={index}/>
                    })
                }
            </ScrollView>
            }    
        </SafeAreaView>
    );
}