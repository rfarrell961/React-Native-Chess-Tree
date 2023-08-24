import { 
    View,
    TouchableOpacity,
    Text,
    SafeAreaView,
} from "react-native";
import styles from "../Styles/styles";
import TreeNode from "../Classes/treeNode";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import Chessboard, { ChessboardRef } from "react-native-chessboard";

type propsType = {
    navigation: any,
    node: TreeNode
};

export default function NodeView({ navigation, node}: propsType)
{
    const dispatch = useDispatch();
    const [fen, setFen] = useState(node.position);
    const chessboardRef = useRef<ChessboardRef>(null);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Please Select a Starting Position</Text>
            <Chessboard ref={chessboardRef}/>
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.popToTop()}>
                <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}