import { 
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView
} from "react-native";
import styles from "../Styles/styles";
import ITreeNode, {getNextId} from "../Interfaces/treeNode";
import { updateNode, addNode } from "../Redux/nodesSlice";
import { useEffect, useRef, useState } from "react";
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import { useIsFocused } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../Redux/hooks';

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Pass in id to route.params?
export default function NodeView({ navigation, route })
{
    const getNode = (id: number, nodes: ITreeNode[]): ITreeNode => {

        for (let i = 0; i < nodes.length; i++)
        {
            if (nodes[i].id === id)
                return nodes[i];
        }
    
        return null;
    }

    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const [id, setId] = useState<number | undefined>(route.params.id);
    const [node, setNode] = useState<ITreeNode | undefined>(getNode(id, nodes));
    const chessboardRef = useRef<ChessboardRef>(null);

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);

    }, [node])

    const onMove = () => {

        let state = chessboardRef.current.getState();

        let newTree: ITreeNode = {
            position: state.fen,
            parent: node.id,
            children: [],
            name: "",
            id: getNextId(nodes)
        }

        dispatch(addNode(newTree));
        navigation.push("NodeView", {id: newTree.id});
    }

    const Item = ({item}) => (
        <TouchableOpacity style={styles.listItem} onPress={() => (navigation.push("NodeView", {id: item.id}))}>
            <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Edit "{node.name}" tree</Text>
            <Chessboard ref={chessboardRef} onMove={onMove}/>
            <ScrollView style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    nodes.map((item, index) => {
                        if (node.children.includes(item.id))
                            return <Item item={item} key={index}/>
                    })
                }
            </ScrollView>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}