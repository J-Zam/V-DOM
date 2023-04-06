export interface IAttributes {
  id?: string;
  src?: string;
}
export interface IElementNode extends IAttributes {
  tagName: string;
  attrs: IAttributes;
  children?: IElementNode[] | string;
}
