export const injectDeep = (injectee: any, injector: any) => {
  if (typeof injector !== "object" && !Array.isArray(injectee)) {
    return injector;
  } else {
    for (let key in injector) {
      let value = injector[key];
      if (injectee && injectee[key]) {
        injectee[key] = injectDeep(injectee[key], value);
      } else {
        injectee[key] = value;
      }
    }
  }
  return injectee;
};

export class TrieNode {
  isWord: boolean;
  word: string;
  key: string;
  parent: TrieNode;
  children: { [key: string]: TrieNode } = {};

  constructor(key?: string) {
    this.key = key;
    this.children = {};
    this.isWord = false;
    this.word = "";
  }

  printPath() {
    let path = this.key;
    let node = this.parent;
    while (node) {
      node = node.parent;
      if (node && node.key) path += node.key;
    }
    return path.split("").reverse().join("");
  }
}

export class Trie {
  root: TrieNode;
  words: string[] = [];

  constructor() {
    this.root = new TrieNode();
  }

  static buildTree(obj: object): Trie {
    let trie = new Trie();
    for (let key in obj) {
      trie.insert(key, obj[key]);
      trie.words.push(key);
    }
    return trie;
  }

  insert(word: string, value: string) {
    let node = this.root;
    let wordCpy = String(word).split("");
    let letter;

    while (wordCpy && wordCpy.length && (letter = wordCpy.shift())) {
      if (!node.children[letter]) {
        node.children[letter] = new TrieNode(letter);
        node.children[letter].parent = node;
      }

      node = node.children[letter];

      if (wordCpy.length === 0) {
        node.isWord = true;
        node.word = value;
      }
    }
  }

  contains(word: string) {
    let node = this.root;
    let wordCpy = String(word).split("");
    let letter;

    while (wordCpy && wordCpy.length && (letter = wordCpy.shift())) {
      if (node.children[letter]) {
        node = node.children[letter];
      } else {
        return false;
      }
    }

    return node.isWord;
  }

  find(word: string) {
    let node = this.root;
    let wordCpy = String(word).split("");
    let letter;

    while (wordCpy && wordCpy.length && (letter = wordCpy.shift())) {
      if (node.children[letter]) node = node.children[letter];
      else return "";
    }

    return node.isWord ? node.word : "";
  }

  toObject(obj = {}, root?: TrieNode): object {
    let objRef = obj;
    let node = root || this.root;
    let nodeCopy = node;

    if (nodeCopy.isWord) {
      return nodeCopy;
    }

    for (let key in node.children) {
      if (!objRef[key]) objRef[key] = {};
      let partialObject = this.toObject(objRef[key], node.children[key]);
      if (partialObject["word"]) {
        objRef[key] = partialObject["word"];
      }
    }

    return obj;
  }
}
