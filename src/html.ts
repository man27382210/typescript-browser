import { Node, elem, text } from './dom.js';

export class Parser {
  pos: number = 0;
  input: string;

  constructor(input: string) {
    this.input = input;
  }

  parse(): Node {
    const nodes = this.parseNodes();
    if (nodes.length === 1) {
      return nodes[0];
    } else {
      return elem("html", new Map(), nodes);
    }
  }

  parseNodes(): Node[] {
    const nodes: Node[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.consumeWhitespace();
      if (this.eof() || this.startsWith("</")) {
        break;
      }
      nodes.push(this.parseNode());
    }
    return nodes;
  }

  parseNode(): Node {
    if (this.nextChar() === '<') {
      return this.parseElement();
    } else {
      return this.parseText();
    }
  }

  parseElement(): Node {
    // Opening tag.
    this.consumeChar(); // <
    const tagName = this.parseTagName();
    console.log('tagName: ', tagName);
    const attrs = this.parseAttributes();
    this.consumeChar(); // >

    // Contents.
    const children = this.parseNodes();

    // Closing tag.
    this.consumeChar(); // <
    this.consumeChar(); // /
    if (this.parseTagName() !== tagName) {
      throw new Error("Closing tag does not match opening tag");
    }
    this.consumeChar(); // >

    return elem(tagName, attrs, children);
  }

  parseTagName(): string {
    return this.consumeWhile(c => /[a-zA-Z0-9]/.test(c));
  }

  parseAttributes(): Map<string, string> {
    const attributes = new Map();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === '>') {
        break;
      }
      const [name, value] = this.parseAttr();
      attributes.set(name, value);
    }
    return attributes;
  }

  parseAttr(): [string, string] {
    const name = this.parseTagName();
    this.consumeChar(); // =
    const value = this.parseAttrValue();
    return [name, value];
  }

  parseAttrValue(): string {
    const openQuote = this.consumeChar(); // " or '
    const value = this.consumeWhile(c => c !== openQuote);
    this.consumeChar(); // " or '
    return value;
  }

  parseText(): Node {
    return text(this.consumeWhile(c => c !== '<'));
  }

  consumeWhitespace() {
    this.consumeWhile(c => /\s/.test(c));
  }

  consumeWhile(test: (char: string) => boolean): string {
    let result = '';
    while (!this.eof() && test(this.nextChar())) {
      result += this.consumeChar();
    }
    return result;
  }

  consumeChar(): string {
    return this.input[this.pos++];
  }

  nextChar(): string {
    return this.input[this.pos];
  }

  startsWith(s: string): boolean {
    return this.input.slice(this.pos).startsWith(s);
  }

  eof(): boolean {
    return this.pos >= this.input.length;
  }
}
