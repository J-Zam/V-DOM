import { render } from "./render";
import { IElementNode } from "../ts";
import { IAttributes } from "../ts";

export default function diff(oldVTree: IElementNode, newVTree: IElementNode) {
  if (newVTree === undefined) {
    return ($node: HTMLElement | Text) => {
      $node.remove();
      return undefined;
    };
  }

  if (typeof oldVTree === "string" || typeof newVTree === "string") {
    if (oldVTree !== newVTree) {
      return ($node: HTMLElement | Text) => {
        const $newNode = render(newVTree);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node: HTMLElement | Text) => $node;
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    return ($node: HTMLElement | Text) => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
  const patchChildren = diffChildren(oldVTree.children!, newVTree.children!);

  return ($node: HTMLElement) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
}

function diffAttrs(oldAttrs: IAttributes, newAttrs: IAttributes) {
  const patches: any = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
        patches.push(($node: HTMLElement) => {
            $node.removeAttribute(k)
            return $node
        })
    }
  }

  return ($node: HTMLElement) => {
    for (const patch of patches) {
        patch($node)
    }
    return $node;
  };
}

function diffChildren(
  oldVChildren: IElementNode[] | string,
  newVChildren: IElementNode[] | string
) {
  return ($node: HTMLElement) => {
    return $node;
  };
}
