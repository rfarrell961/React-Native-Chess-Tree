import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import TreeNode from '../Classes/TreeNode';

type TreesState = { trees: TreeNode[] };

const emptyTreeList: TreeNode[] = [];
const initialState: TreesState = { trees: emptyTreeList};

export const treesSlice = createSlice({
    name: 'trees',
    initialState,
    reducers: {
        // action.payload is a new tree (root node)
        addTree: (state, action: PayloadAction <TreeNode> ) => {
            state.trees.push(action.payload);
        }
    }
});

// Action creators are generated for each case reducer function
export const { addTree } = treesSlice.actions;

export default treesSlice.reducer;