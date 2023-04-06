import { render } from "./render";
import { IElementNode } from "../ts";
import { IAttributes, AttributePatch } from "../ts";

export default function diff(
  oldVTree: IElementNode,
  newVTree: IElementNode | undefined
) {
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
  // TODO: Confirm that the children types are being validated correctly
  const patchChildren = diffChildren(
    oldVTree.children as IElementNode[],
    newVTree.children as IElementNode[]
  );

  return ($node: HTMLElement) => {
    patchAttrs($node);
    patchChildren($node);
    return $node;
  };
}

function diffAttrs(oldAttrs: IAttributes, newAttrs: IAttributes) {
  const patches: AttributePatch[] = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: HTMLElement) => {
      $node.setAttribute(k, v);
      return $node;
    });
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node: HTMLElement) => {
        $node.removeAttribute(k);
        return $node;
      });
    }
  }

  return ($node: HTMLElement) => {
    for (const patch of patches) {
      patch($node);
    }
    return $node;
  };
}

function diffChildren(
  oldVChildren: IElementNode[] | string,
  newVChildren: IElementNode[] | string
) {
  const childPatches: ((node: HTMLElement) => void)[] = [];

  (oldVChildren as IElementNode[]).forEach((oldVChild: IElementNode, i: number) => {
    childPatches.push(diff(oldVChild, newVChildren[i] as IElementNode));
  });

  const additionalPatches: ((node: HTMLElement) => HTMLElement)[]  = [];

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node: HTMLElement) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return ($parent: HTMLElement) => {
    $parent.childNodes.forEach(($child, i) => {
      if (($child instanceof HTMLElement || $child.nodeType === Node.TEXT_NODE) && i < childPatches.length && typeof childPatches[i] === 'function') {
        childPatches[i]($child as HTMLElement);
      }
    });

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
}
