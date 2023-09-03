import ITreeNode from "../Interfaces/treeNode";

const getNode = (id: number, nodes: ITreeNode[]): ITreeNode => {

    for (let i = 0; i < nodes.length; i++)
    {
        if (nodes[i].id === id)
            return nodes[i];
    }

    return null;
}

const flipFen = (fen: string): string => {
    let newFen: string = "";
    
    let idx = fen.indexOf(" ");
    let fen1 = fen.slice(0, idx);
    let fen2 = fen.slice(idx)

    for (let i = fen1.length - 1; i >= 0; i--)
    {
        newFen += fen1[i];
    }

    newFen += fen2;

    return newFen;
}

export { getNode, flipFen }