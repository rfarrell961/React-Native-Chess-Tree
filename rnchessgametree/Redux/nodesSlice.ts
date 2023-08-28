import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import ITreeNode from '../Interfaces/treeNode';

interface updateArgs {
    id: number,
    node: ITreeNode
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
            if (newNode.parent == null)
                return;

            for (let i = 0; i < state.nodes.length; i++)
            {
                if (state.nodes[i].id === newNode.parent)
                    state.nodes[i].children.push(newNode.id);
            }
        },
        // Pass ID
        deleteNode: (state, action: PayloadAction <number>) => {

            const deleteNode = (id: number) => {

                for (let i = 0; i < state.nodes.length; i++)
                {
                    if (state.nodes[i].id == action.payload)
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
            },
            prepare(id: number, node: ITreeNode) {
                return {
                    payload: {
                        id: id,
                        node: node
                    }
                }
            }
        }
    }
});

// Action creators are generated for each case reducer function
export const { addNode, deleteNode, updateNode } = nodesSlice.actions;

export default nodesSlice.reducer;