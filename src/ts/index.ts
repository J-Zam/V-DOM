export interface IElementNode {
    tagName: string,
    attrs: object;
    children?: IElementNode[] | string;
  }