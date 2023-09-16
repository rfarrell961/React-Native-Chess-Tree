import { useAppSelector } from "../Redux/hooks";

export default interface ITreeNode { 
    position: string,
    parent: number | null, // Parent ID
    children: number[], // Array of child IDs
    name: string,
    id?: number,
    flipped: boolean
}

export function getNextId(nodes: ITreeNode[])
{
    // Generate ID for new node
    let maxIdx = 0;
    for (let i = 0; i < nodes.length; i++)
    {
        if (nodes[i].id > maxIdx)
            maxIdx = nodes[i].id;
    }

    return  maxIdx + 1;
}
