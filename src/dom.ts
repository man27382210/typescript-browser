export type AttrMap = Map<string, string>;

export class Node {
    public children: Node[];

    public nodeType: NodeType;

    constructor(children: Node[] = [], nodeType: NodeType) {
        this.children = children;
        this.nodeType = nodeType;
    }
}

export type NodeType = ElementData | Text;

export class ElementData {
    public tagName: string;
    public attributes: AttrMap;

    constructor(tagName: string, attributes: AttrMap) {
        this.tagName = tagName;
        this.attributes = attributes;
    }

    public id(): string | undefined {
        return this.attributes.get("id");
    }

    public classes(): Set<string> {
        const classlist = this.attributes.get("class");
        return new Set(classlist ? classlist.split(' ') : []);
    }
}

export class Text {
    public value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export function text(data: string): Node {
    return new Node([], new Text(data));
}

export function elem(name: string, attrs: AttrMap, children: Node[]): Node {
    return new Node(children, new ElementData(name, attrs));
}
