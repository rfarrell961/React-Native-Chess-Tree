

export default class TreeNode { 

    public position: String;
    public parent: TreeNode | null;
    public children: TreeNode[] = [];
    
    constructor (position: string, parent: TreeNode | null)  {

        this.position = position;
        this.parent = parent;
        if (this.parent) this.parent.children.push(this);

    }
}