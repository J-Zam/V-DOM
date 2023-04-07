export interface IAttributes {
  id?: string;
  src?: string;
  dataCount?: number,
  width?: string,
  textContent?: string,
  href?: string
}
export interface IElementNode extends IAttributes {
  tagName: string;
  attrs: IAttributes;
  children?: IElementNode[] | string;
}

export type AttributePatch = (element: HTMLElement) => HTMLElement;

export interface IBand {
  bandName: string;
  songs: string[];
}