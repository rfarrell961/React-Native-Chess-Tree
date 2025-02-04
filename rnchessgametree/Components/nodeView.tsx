import { 
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Alert
} from "react-native";
import ITreeNode, {getNextId} from "../Interfaces/treeNode";
import { addNode, updateNode } from "../Redux/nodesSlice";
import { useEffect, useRef, useState } from "react";
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { getNode, sleep } from "../Utility/helper";
import InsetShadow from 'react-native-inset-shadow';
import NodeList from "./nodeList";
import { Icon } from "react-native-elements";
import { init, read, write } from "react-native-stockfish";
import AsyncAlert from "../Utility/asyncAlert";

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

    //const [whiteToMove, setWhiteToMove] = useState(true);
    const [advantageWhite, setAdvantageWhite] = useState(true);
    const [mateIn, setMateIn] = useState(-1);
    const [evaluation, setEvaluation] = useState(0);

    useEffect(() => {
        if (settings.isProVersion)
        {
            init();
            sleep(500);            
        }
    }, [])

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);

    }, [node])


    useEffect(() => {

        let fen = chessboardRef.current.getState().fen;
        let whiteToMove = fen.split(" ")[1] == "w";

        console.log(whiteToMove);
        if (mateIn > 0)
        {
            if ((mateIn > 0 && whiteToMove) || (mateIn < 0 && !whiteToMove))
                setAdvantageWhite(true); 
            else if ((mateIn > 0 && !whiteToMove) || (mateIn < 0 && whiteToMove))
                setAdvantageWhite(false);  
        }
        else
        {
            if ((evaluation > 0 && whiteToMove) || (evaluation < 0 && !whiteToMove))
                setAdvantageWhite(true); 
            else if ((evaluation > 0 && !whiteToMove) || (evaluation < 0 && whiteToMove))
                setAdvantageWhite(false);
        }
          
    }, [evaluation, mateIn])

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
        let flip = !flipped;

        setFlipped(flip);

        let newNode = {...node};
        newNode.flipped = flip;

        dispatch(updateNode(newNode.id, newNode))
    }

    const onMove = ({ move, state }) => {
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

    const evalNode = async () => {
        let fen = chessboardRef.current.getState().fen;
        await read();
        write("stop");
        sleep(500);
        write("position fen " + fen);
        sleep(500);
        write("go depth 22");

        let response : string = "";
        do
        {
            await AsyncAlert("Read2", response);//Alert.alert(response);
            response = await read();    
            let responses = response.split("\r\n");
            console.log(responses);
        }
        while(response !== "")

        Alert.alert("Done!");
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.headingText, {marginHorizontal: 20, marginTop: 20}]}>Tree: {root.name} </Text>
            {(node.parent && node.parent > 0) && <Text style={[styles.subHeadingText, {marginHorizontal: 20}]}>Branch: {node.name}</Text>}
            <View style={{marginTop: 20, alignSelf: 'center'}}>
                {advantageWhite && settings.isProVersion &&
                <View style={{display:'flex', flexDirection:'row', borderColor:'black', borderWidth:1, height: 10}}>
                    <View style={{backgroundColor: 'white', flex: 5 + Math.abs(evaluation)}}/>
                    <View style={{backgroundColor: 'black', flex: 5}}/>
                </View>
                }
                {!advantageWhite && settings.isProVersion &&
                <View style={{display:'flex', flexDirection:'row', borderColor:'black', borderWidth:1, height: 10}}>
                    <View style={{backgroundColor: 'white', flex: 5}}/>
                    <View style={{backgroundColor: 'black', flex: 5 + Math.abs(evaluation)}}/>
                </View>
                }
                
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

                {settings.isProVersion && <Icon name='saved-search' type='material-icons' size={30} color={settings.colors.text} onPress={evalNode}/>}

                <Icon name='swap-vert' type='material-icons' size={30} color={settings.colors.text} onPress={flipBoard}/>
            </View> 
        </SafeAreaView>
    );
}