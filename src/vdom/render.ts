import { IElementNode } from "../ts";

function renderElement({ tagName, attrs, children }: IElementNode) {
  const $element = document.createElement(tagName);

  Object.entries(attrs).forEach(([k, v]) => {
    $element.setAttribute(k, String(v));
    if (k === "textContent") $element.textContent = String(v);
  });

  (children as IElementNode[]).forEach(child => {
    $element.appendChild(render(child));
  });

  return $element;
}

export function render(vNode: IElementNode | string) {
  if (typeof vNode === "string") 
    return document.createTextNode(vNode);

  return renderElement(vNode);
}

