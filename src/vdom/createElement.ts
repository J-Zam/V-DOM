import { IElementNode } from "../ts";

export default (
  { tagName, attrs = {}, children = [] }: IElementNode
) => {
  const virtualElement = Object.create(null);

  Object.assign(virtualElement, {
    tagName,
    attrs,
    children,
  });

  return virtualElement;
};
