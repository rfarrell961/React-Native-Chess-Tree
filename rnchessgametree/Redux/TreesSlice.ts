import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TreesState = { trees: string[] };

const emptyTreeList: string[] = [];
const initialState: TreesState = { trees: emptyTreeList};

export const treesSlice = createSlice({
    name: 'trees',
    initialState,
    reducers: {
        // action.payload is an ALREADY SERIALIZED tree (root node)
        addTree: (state, action: PayloadAction <string> ) => {
            state.trees.push(action.payload);
        }
    }
});

// Action creators are generated for each case reducer function
export const { addTree } = treesSlice.actions;

export default treesSlice.reducer;