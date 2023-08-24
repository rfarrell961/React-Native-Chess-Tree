
export default class TreeNode { 

    public position: String;
    public parent: TreeNode | null;
    public children: TreeNode[] = [];
    public name?: String;
    
    constructor (position: string, parent: TreeNode | null, name?: string)  {

        this.position = position;
        this.parent = parent;
        if (this.parent) this.parent.children.push(this);
        if (name != undefined) this.name = name;

    }

    toJSON() {

        let childrenJSON: object[] = [];

        for (let child of this.children)
        {
            childrenJSON.push(child.toJSON());
        }

        return {
            position: this.position,
            parent: (this.parent == null) ? null : this.parent.toJSON(),
            children: childrenJSON,
            name: this.name
        };
    }

    // Create TreeNode object from json object
    static fromJSON(obj: object): TreeNode {

        // Only required property
        if (!obj['position'])
            return null;

        let node: TreeNode = new TreeNode(obj['position'], obj['parent'], obj['name']);

        for (let child of obj['children'])
        {
            TreeNode.fromJSON(child); // Constructor will handle populating child array recursively
        }

        return node;
    }
}