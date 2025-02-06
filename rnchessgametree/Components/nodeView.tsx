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
import { parse } from "@babel/core";

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
    const [mateIn, setMateIn] = useState(0);
    const [evaluation, setEvaluation] = useState(0);
    const [runEval, setRunEval] = useState(false);

    useEffect(() => {

        if (settings.isProVersion)
        {
            init();       
        }

    }, [])

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);
        
        if (settings.isProVersion)
        {
            setRunEval(false);
        }

    }, [node])


    useEffect(() => {

        let fen = chessboardRef.current.getState().fen;
        let whiteToMove = fen.split(" ")[1] == "w";

        if (mateIn != 0)
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

    // Read Loop
    useEffect(() => {

        if (!settings.isProVersion)
        {
            return;
        }

        let timeout, response, responsesArr;
        if (runEval) 
        {

            sendEval();
            const loopFunction = async () => {

                response = await read();    
                responsesArr = response.split("\r\n");
                
                for (const val of responsesArr)
                {
                    if (val === "") continue; 

                    parseResponse(val);
                }

                timeout = setTimeout(loopFunction, 200);
            };
            loopFunction();
        }
        else
        {
            write("stop")
        }
    
        return () => clearTimeout(timeout);
    }, [runEval]);

    const sendEval = async () => {
        
        let fen = chessboardRef.current.getState().fen;

        // Clear read buffer
        await read();

        write("stop");
        sleep(100);
        write("position fen " + fen);
        sleep(100);
        write("go depth 22");

    }

    const parseResponse = (response) => {

        let words = response.split(" ");
        for (let i = 0; i < words.length; i++)
            {
                if (words[i].trim().toLowerCase() === "score")
                {
                    
                    // next word should be cp, actual score is in two words
                    if (words[i + 1].trim().toLowerCase() === "mate")
                    {
                        let matein = Number(words[i + 2])
                        setMateIn(matein);
                    }
                    else
                    {
                        let score = Number(words[i + 2]) / 100;

                        setEvaluation(score);
                        setMateIn(0);
                    }
                }
            }
    }

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

        if (runEval)
        {
            setRunEval(false);
            return;
        }

        setRunEval(true);
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.headingText, {marginHorizontal: 20, marginTop: 20}]}>Tree: {root.name} </Text>
            {(node.parent && node.parent > 0) && <Text style={[styles.subHeadingText, {marginHorizontal: 20}]}>Branch: {node.name}</Text>}
            <View style={{marginTop: 20, alignSelf: 'center'}}>
                {settings.isProVersion && runEval &&
                <View>
                    {mateIn != 0 && 
                    <View>
                        <Text style={[styles.subHeadingText]}>{"Mate In " + mateIn + (advantageWhite ? " White" : " Black")}</Text>
                        <View style={{display:'flex', flexDirection:'row', borderColor:'black', borderWidth:1, height: 10}}>
                            <View style={{backgroundColor: advantageWhite ? "white" : "black", flex: 1}}/>
                        </View>
                    </View>
                    }
                    {mateIn == 0 && 
                    <View>
                        <Text style={[styles.subHeadingText]}>{"+" + Math.abs(evaluation) + (advantageWhite ? " White" : " Black")}</Text>
                        {advantageWhite &&
                        <View style={{display:'flex', flexDirection:'row', borderColor:'black', borderWidth:1, height: 10}}>
                            <View style={{backgroundColor: 'white', flex: 5 + Math.abs(evaluation)}}/>
                            <View style={{backgroundColor: 'black', flex: 5}}/>
                        </View>
                        }
                        {!advantageWhite &&
                        <View style={{display:'flex', flexDirection:'row', borderColor:'black', borderWidth:1, height: 10}}>
                            <View style={{backgroundColor: 'white', flex: 5}}/>
                            <View style={{backgroundColor: 'black', flex: 5 + Math.abs(evaluation)}}/>
                        </View>
                        }
                    </View>
                    }
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