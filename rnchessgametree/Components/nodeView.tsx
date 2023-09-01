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
    const [root, setRoot] = useState<ITreeNode | undefined>(getNode(id, nodes));
    const [node, setNode] = useState<ITreeNode | undefined>(root);
    const chessboardRef = useRef<ChessboardRef>(null);

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);

    }, [node])

    const onMove = ({ move, state }) => {

        //let state = chessboardRef.current.getState();

        let newTree: ITreeNode = {
            position: state.fen,
            parent: node.id,
            children: [],
            name: move.to,
            id: getNextId(nodes)
        }

        dispatch(addNode(newTree));
        setNode(newTree);
    }

    const Item = ({item}) => (
        <TouchableOpacity style={styles.listItem} onPress={() => (setNode(item))}>
            <Text style={styles.buttonText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.headingText, {marginHorizontal: 20, marginTop: 20}]}>Tree: {root.name} </Text>
            {(node.parent && node.parent > 0) && <Text style={[styles.subHeadingText, {marginHorizontal: 20}]}>Branch: {node.name}</Text>}
            <View style={{marginTop: 20, alignSelf: 'center'}}>
                <Chessboard ref={chessboardRef} onMove={onMove}/>
            </View>
            <ScrollView style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    nodes.map((item, index) => {
                        if (node.children.includes(item.id))
                            return <Item item={item} key={index}/>
                    })
                }
            </ScrollView>
            
            {(node.parent && node.parent > 0) && 
            <TouchableOpacity style={[styles.buttonStyle, {marginBottom: 5}]} onPress={() => setNode(getNode(node.parent, nodes))}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>}

            <TouchableOpacity style={[styles.buttonStyle, {marginTop: 5}]} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, {marginTop: 5}]} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.buttonText}>Save as new tree</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}