import { 
    ScrollView ,
    TouchableOpacity,
    View,
    Text,
    Alert
} from "react-native"
import { Swipeable } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import Chessboard from "./chessboard";
import { useAppDispatch } from "../Redux/hooks";
import { deleteNode, updateNode } from "../Redux/nodesSlice";
import ITreeNode from "../Interfaces/treeNode";
import { getNode } from "../Utility/helper";

export default function NodeList({ onClick, styles, colors, nodes, parent })
{
    const dispatch = useAppDispatch(); 

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
            <TouchableOpacity style={styles.listItem} onPress={() => onClick(item)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{marginLeft: 10, marginRight: 50, borderWidth:.5}}>
                        <Chessboard fen={item.position} size={75}/>
                    </View>
                    <Text style={[styles.listItemText, {marginRight: 10}]}>{item.name}</Text>
    
                    <Icon style={{marginRight: 20}} name='edit' type='material-icons' color={colors.text} onPress={() => EditName(item.id)}/>
                </View>
    
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon style={{marginRight: 20}} name='arrow-forward-ios' type='material-icons' color={colors.text}/>
                </View>
    
            </TouchableOpacity>
        </Swipeable>
    );


    return (
        <ScrollView bounces={false} style={{flexGrow: 0}}>
        {
            // Only show parent == null (roots)
            nodes.map((item, index) => {
                if (item.parent == parent)
                {
                    return <Item item={item} key={index}/>
                }
            })
        }
        </ScrollView>
    )
}