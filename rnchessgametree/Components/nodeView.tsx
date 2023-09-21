import { 
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Alert,
    Dimensions
} from "react-native";
import ITreeNode, {getNextId} from "../Interfaces/treeNode";
import { addNode, updateNode } from "../Redux/nodesSlice";
import { useEffect, useRef, useState } from "react";
import Chessboard, { ChessboardRef } from "react-native-chessboard";
import { useAppSelector, useAppDispatch } from '../Redux/hooks';
import { getNode } from "../Utility/helper";
import InsetShadow from 'react-native-inset-shadow';
import NodeList from "./nodeList";
import { Icon } from "react-native-elements";
import { Thread } from 'react-native-threads';

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
    const [mateIn, setMateIn] = useState(-1);
    const [evaluator, setEvaluator] = useState(null);
    const [evaluation, setEvaluation] = useState<any | undefined>(0);

    useEffect(() => {

        if (node == null)
            return;

        chessboardRef.current.resetBoard(node.position);

        if (evaluator == null)
            return;

        evaluator.postMessage("stop");
        setEvaluator(null);

    }, [node])

    const loadEngine = () => {
        // let engine = new Worker("js/stockfish.js");

        const engine = new Thread('Stockfish/stockfish.js');

        engine.onmessage = function(event){
            let result: any = "";
            if (event && typeof event === "object") result = event.data;
            else result = event;
          
            let words = result.split(" ");

            for (let i = 0; i < words.length; i++)
            {
                if (words[i].trim().toLowerCase() === "score")
                {
                    
                    // next word should be cp, actual score is in two words
                    if (words[i + 1].trim().toLowerCase() === "mate")
                    {
                        let matein = Number(words[i + 2])
                        let score = "Mate in " + Math.abs(matein) ;

                        setEvaluation(score);
                        setMateIn(matein);
                    }
                    else
                    {
                        let score = Number(words[i + 2]) / 100;

                        setEvaluation(score);
                        setMateIn(-1);
                    }
                }
            }
        }

        engine.postMessage("uci")
        engine.postMessage("ucinewgame");
        engine.postMessage("setoption name Use NNUE value true");

        setEvaluator(engine);
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

    const evaluateClick = () => {
        loadEngine();
        computeEval();
    }

    const computeEval = () => {

        if (evaluator == null)
            return;

        evaluator.postMessage("stop");
        evaluator.postMessage("position " + node.position);
        evaluator.postMessage("go depth 22");
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <Text style={[styles.headingText, {marginHorizontal: 20, marginTop: 20}]}>Tree: {root.name} </Text>
            {(node.parent && node.parent > 0) && <Text style={[styles.subHeadingText, {marginHorizontal: 20}]}>Branch: {node.name}</Text>}
            <View style={{marginTop: 20, alignSelf: 'center', borderWidth: 3, borderColor: settings.colors.background2}}>
                <Chessboard ref={chessboardRef} onMove={onMove} flipped={ flipped } boardSize={Dimensions.get('window').width * .9}/>
            </View>
            <Text>{evaluation}</Text>
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

                {settings.isProVersion && <Icon name='saved-search' type='material-icons' size={30} color={settings.colors.text} onPress={evaluateClick}/>}

                <Icon name='call-split' type='material-icons' size={30} color={settings.colors.text} onPress={splitTree}/>

                <Icon name='swap-vert' type='material-icons' size={30} color={settings.colors.text} onPress={flipBoard}/>
            </View> 
        </SafeAreaView>
    );
}