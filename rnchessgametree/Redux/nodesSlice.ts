import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import ITreeNode from '../Interfaces/treeNode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaViewBase } from 'react-native';

interface updateArgs {
    id: number,
    node: ITreeNode
}


const saveData = async (nodes) => {
    try {

        // Clear and reset nodes
        try {  
            AsyncStorage.removeItem('nodes');
        }
        catch (e)
        {
            console.log("Save Data Error 1:", e);
        }
        const jsonValue = JSON.stringify(nodes);
        await AsyncStorage.setItem('nodes', jsonValue);

    } catch (e) {
        console.log("Save Data Error 2:", e)
    }
}

export const nodesSlice = createSlice({
    name: 'nodes',
    initialState: {
        nodes: []
    },
    reducers: {
        // action.payload is a json object, not a TreeNode
        addNode: (state, action: PayloadAction <ITreeNode>) => {

            let newNode: ITreeNode = action.payload;

            state.nodes.push(newNode);

            // If parent isn't null, add to parents children array
            if (newNode.parent != null)
            {
                for (let i = 0; i < state.nodes.length; i++)
                {
                    if (state.nodes[i].id === newNode.parent)
                        state.nodes[i].children.push(newNode.id);
                }
            }

            saveData(state.nodes);
        },
        // Pass ID
        deleteNode: (state, action: PayloadAction <number>) => {

            const deleteNode = (id: number) => {

                for (let i = 0; i < state.nodes.length; i++)
                {
                    if (state.nodes[i].id == id)
                    {
                        // Delete all children nodes recursively
                        for (let j = 0; j < state.nodes[i].children.length; j++)
                            deleteNode(state.nodes[i].children[j]);

                        state.nodes.splice(i, 1);
                        i--; // Continue if somehow duplicate ID's
                    }
                }
            };

            deleteNode(action.payload);
            saveData(state.nodes);
        },
        //Pass ID
        updateNode: {
            reducer(state, action: PayloadAction<updateArgs>) {
                for (let i = 0; i < state.nodes.length; i++)
                {
                    if (state.nodes[i].id == action.payload.id)
                    {
                        state.nodes[i] = action.payload.node;
                    }
                }

                saveData(state.nodes);
            },
            prepare(id: number, node: ITreeNode) {
                return {
                    payload: {
                        id: id,
                        node: node
                    }
                }
            }
        },
        setNodes: (state, action: PayloadAction <ITreeNode[]>) => {
            state.nodes = action.payload
        }
    }
});

// Action creators are generated for each case reducer function
export const { addNode, deleteNode, updateNode, setNodes } = nodesSlice.actions;

export default nodesSlice.reducer;