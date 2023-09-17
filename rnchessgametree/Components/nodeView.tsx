import { 
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Alert
} from "react-native";
import ITreeNode, {getNextId} from "../Interfaces/treeNode";
import { addNode } from "../Redux/nodesSlice";
import { useEffect, useRef, useState } from "react";
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { getNode, flipFen } from "../Utility/helper";
import InsetShadow from 'react-native-inset-shadow';
import NodeList from "./nodeList";
import { Icon } from "react-native-elements";

const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Pass in id to route.params?
export default function NodeView({ navigation, route })
{
    const nodes: ITreeNode[] = useAppSelector((state) => state.nodes.nodes);
    const dispatch = useAppDispatch();
    const [id, setId] = useState<number | undefined>(route.params.id);
    const [root, setRoot] = useState<ITreeNode | undefined>(getNode(id, nodes));
    const [node, setNode] = useState<ITreeNode | undefined>(root);
    const chessboardRef = useRef<ChessboardRef>(null);
    const settings = useAppSelector((state) => state.settings);
    const styles = useAppSelector((state) => state.settings.styles);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);

    }, [node])

    const splitTree = () => {
        Alert.prompt(
            "Enter New Tree Name",
            "Create a new tree from the current position",
            [   
                {
                    text: 'Ok',
                    onPress: (newName) => { 
                        let newTree: ITreeNode = {
                            position: node.position,
                            parent: null,
                            children: [],
                            name: newName,
                            id: getNextId(nodes),
                            flipped: node.flipped
                        }
                
                        dispatch(addNode(newTree));
                        navigation.popToTop();
                        navigation.navigate("NodeView", {id: newTree.id});
                    }
                },
                {
                    text: 'Cancel',
                }
            ],
            "plain-text",
        );
    }

    const flipBoard = () => {
        setFlipped(!flipped);
    }

    const onMove = ({ move, state }) => {

        //let state = chessboardRef.current.getState();

        let newNode: ITreeNode = {
            position: state.fen,
            parent: node.id,
            children: [],
            name: move.from + " to " + move.to,
            id: getNextId(nodes),
            flipped: node.flipped
        }

        dispatch(addNode(newNode));
        setNode(newNode);
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.headingText, {marginHorizontal: 20, marginTop: 20}]}>Tree: {root.name} </Text>
            {(node.parent && node.parent > 0) && <Text style={[styles.subHeadingText, {marginHorizontal: 20}]}>Branch: {node.name}</Text>}
            <View style={{marginTop: 20, alignSelf: 'center'}}>
                <Chessboard ref={chessboardRef} onMove={onMove} flipped={ flipped }/>
            </View>
            <InsetShadow
                containerStyle={{
                    flex: 1, 
                }}
            >
                <NodeList 
                    onClick={(item) => (setNode(item))}
                    styles={styles}
                    colors={settings.colors}
                    nodes={nodes}
                    parent={node.id}
                />
            </InsetShadow>  
            
            <View style={{
                paddingHorizontal: 40,
                paddingVertical: 30,
                width: '100%', 
                flexDirection: 'row', 
                alignSelf: 'flex-end', 
                justifyContent: "space-between", 
                backgroundColor: settings.colors.background2,
                alignItems: 'center'
            }}>
                {(node.parent && node.parent > 0) && 
                <Icon name='arrow-back' type='material-icons' size={30} color={settings.colors.text} onPress={() => setNode(getNode(node.parent, nodes))}/>}

                <Icon name='home' type='material-icons' size={30} color={settings.colors.text} onPress={() => navigation.navigate("Home")}/>

                <Icon name='call-split' type='material-icons' size={30} color={settings.colors.text} onPress={splitTree}/>

                <Icon name='swap-vert' type='material-icons' size={30} color={settings.colors.text} onPress={flipBoard}/>
            </View> 
        </SafeAreaView>
    );
}