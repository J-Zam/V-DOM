export interface IAttributes {
  id?: string;
  src?: string;
  dataCount?: number,
  width?: string
}
export interface IElementNode extends IAttributes {
  tagName: string;
  attrs: IAttributes;
  children?: IElementNode[] | string;
}

export type AttributePatch = (element: HTMLElement) => HTMLElement;
