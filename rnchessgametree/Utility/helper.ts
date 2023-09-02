import ITreeNode from "../Interfaces/treeNode";

const getNode = (id: number, nodes: ITreeNode[]): ITreeNode => {

    for (let i = 0; i < nodes.length; i++)
    {
        if (nodes[i].id === id)
            return nodes[i];
    }

    return null;
}

export { getNode }