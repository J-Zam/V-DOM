import { render } from "./render";
import { IElementNode } from "../ts";
import { IAttributes, AttributePatch } from "../ts";

export default function diff(
  oldNode: IElementNode,
  newNode: IElementNode | undefined
) {
  if (newNode === undefined) {
    return ($node: HTMLElement | Text) => {
      $node.remove();
      return undefined;
    };
  }

  if (typeof oldNode === "string" || typeof newNode === "string") {
    if (oldNode !== newNode) {
      return ($node: HTMLElement | Text) => {
        const $newNode = render(newNode);
        $node.replaceWith($newNode);
        return $newNode;
      };
    } else {
      return ($node: HTMLElement | Text) => $node;
    }
  }

  if (oldNode.tagName !== newNode.tagName) {
    return ($node: HTMLElement | Text) => {
      const $newNode = render(newNode);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchAttrs = diffAttrs(oldNode.attrs, newNode.attrs);
  const patchChildren = diffChildren(
    oldNode.children as IElementNode[],
    newNode.children as IElementNode[]
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
      if (k === "textContent") {
        $node.setAttribute(k, v);
        $node.textContent = v;
      } else {
        $node.setAttribute(k, v);
      }
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

  (oldVChildren as IElementNode[]).forEach(
    (oldVChild: IElementNode, i: number) => {
      childPatches.push(diff(oldVChild, newVChildren[i] as IElementNode));
    }
  );

  const additionalPatches: ((node: HTMLElement) => HTMLElement)[] = [];

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node: HTMLElement) => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return ($parent: HTMLElement) => {
    $parent.childNodes.forEach(($child, i) => {
      if (
        ($child instanceof HTMLElement || $child.nodeType === Node.TEXT_NODE) &&
        i < childPatches.length &&
        typeof childPatches[i] === "function"
      ) {
        childPatches[i]($child as HTMLElement);
      }
    });

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
}
