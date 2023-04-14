### [V-DOM]

An experimental project that aims to showcase the concepts of virtual DOM rendering and diffing. V-DOM aims to efficiently compute and apply only the necessary changes to the DOM, minimizing unnecessary updates and improving overall rendering performance [[demo]](https://v-dom.vercel.app/).

![ezgif com-video-to-gif (1)](https://user-images.githubusercontent.com/51100407/232135393-1c19e609-2518-46df-a7b4-6898f361bc23.gif)

The following functions are the key components of a basic virtual DOM and their roles in the rendering process:

## `Create` function

Virtual DOM creation is the initial step in the Virtual DOM process. The purpose of this function is to create a virtual element object that represents an HTML element in a virtual DOM (Document Object Model).


``` typescript
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
```

## `Render` function

In summary, the renderElement() function takes a virtual element node object, creates a corresponding DOM element, sets its attributes and text content, appends its child nodes, and returns the rendered DOM element. 

``` typescript
function renderElement({ tagName, attrs, children }: IElementNode) {
  const $element = document.createElement(tagName);

  // Loop through attributes and set them on the element
  for (const [k, v] of Object.entries(attrs)) {
    $element.setAttribute(k, v);

    if (k === "textContent")
      $element.textContent = v; 
  }

  // Loop through children and append them to the parent element
  for (const child of children!) {
    $element.appendChild(render(child)); // Recursively call render for child elements
  }

  return $element; // Return the rendered element
}

// Main render function that can render either an element node or a text node
export function render(vNode: IElementNode | string) {
  if (typeof vNode === "string") 
    return document.createTextNode(vNode); // Create and return a text node if input is a string

  return renderElement(vNode); // Call renderElement to render element node and return it
}

```

## `Diffing` function

The process of diffing involves efficiently comparing the two versions of the `Virtual DOM` to determine which parts of the UI need to be updated, added, or removed in order to reflect the changes in the application's state.

In summary, diff function compares the attributes and children of oldNode and newNode and generates patch functions for updating the real `DOM efficiently`. diffAttrs handles attribute updates, while diffChildren handles updates to the children of the DOM element.

``` typescript
export default function diff(
    oldNode: IElementNode, 
    newNode: IElementNode | undefined 
  ) {
    if (newNode === undefined) { 
      // Return a patch function that removes the corresponding DOM node and returns undefined
      return ($node: HTMLElement | Text) => {
        $node.remove();
        return undefined;
      };
    }
  
    if (typeof oldNode === "string" || typeof newNode === "string") { /
      if (oldNode !== newNode) { 
        // Return patch function to replace DOM node with new virtual DOM node and return new DOM node
        return ($node: HTMLElement | Text) => {
          const $newNode = render(newNode);
          $node.replaceWith($newNode);
          return $newNode;
        };
      } else {
        // Return a patch function that returns the existing DOM node unchanged
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
  
    // Get the patch function for updating attributes and children of the DOM node
    const patchAttrs = diffAttrs(oldNode.attrs, newNode.attrs); 
    const patchChildren = diffChildren(
      oldNode.children as IElementNode[], 
      newNode.children as IElementNode[] 
    ); 
  
    return ($node: HTMLElement) => {
      // Apply the patch function for updating attributes and children on the DOM node
      patchAttrs($node); 
      patchChildren($node); 
      return $node; 
    };
  }
  
  function diffAttrs() {
    ...
  }
  
  function diffChildren() {
    ...
  }
```

## `DiffAttrs` function

This function compares the attributes of the oldNode and the newNode and generates a patch function that updates the attributes of the corresponding real `DOM element`. It iterates through the attributes of the newNode and creates patches for setting or updating the attributes.

It also iterates through the attributes of the oldNode and creates patches for removing any attributes that are not present in the newNode.

``` typescript
function diffAttrs(oldAttrs: IAttributes, newAttrs: IAttributes) {
    const patches: AttributePatch[] = []; // Array to store patches for attribute changes
  
    // Loop through newAttrs and create patches for setting and updating attributes
    for (const [k, v] of Object.entries(newAttrs)) {
      patches.push(($node: HTMLElement) => {
        $node.setAttribute(k, v); 
        if (k === "textContent") $node.textContent = v; 
        return $node;
      });
    }
  
    // Loop through oldAttrs and create patches for removing attributes
    for (const k in oldAttrs) {
      if (!(k in newAttrs)) {
        patches.push(($node: HTMLElement) => {
          $node.removeAttribute(k); 
          return $node;
        });
      }
    }
  
    // Return a function that applies all the patches to the given HTML element
    return ($node: HTMLElement) => {
      for (const patch of patches) {
        patch($node);
      }
      return $node;
    };
  }
  
```

## `DiffChildren` function

This function compares the children of the oldNode and the newNode and generates a patch function that updates the children of the corresponding real `DOM element`. 

It iterates through the children of the oldNode and generates patch functions by recursively calling the diff function on each child, passing the corresponding child from newNode as the second parameter. It also generates patch functions for adding any additional children in the newNode that are not present in the oldNode.

``` typescript
function diffChildren(
    oldVChildren: IElementNode[] | string,
    newVChildren: IElementNode[] | string
  ) {

    // Arrays to store patch functions for updating existing children and adding new children
    const childPatches: ((node: HTMLElement) => void)[] = [];
    const additionalPatches: ((node: HTMLElement) => HTMLElement)[] = []; 
  
    // Loop through old virtual element children and create patch functions for each pair of old and new children
    (oldVChildren as IElementNode[]).forEach(
      (oldVChild: IElementNode, i: number) => {
        childPatches.push(diff(oldVChild, newVChildren[i] as IElementNode));
      }
    );
  
    // Loop through new virtual element children that are additional to old children and create patch functions for adding them
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
      additionalPatches.push(($node: HTMLElement) => {
        $node.appendChild(render(additionalVChild)); 
        return $node; // Return the parent element after the update
      });
    }
  
    // Return a function that takes an HTMLElement parent node as input and applies
    // the necessary patches to update its children 
    return ($parent: HTMLElement) => {
      $parent.childNodes.forEach(($child, i) => {
        if (
          ($child instanceof HTMLElement || $child.nodeType === Node.TEXT_NODE) &&
          i < childPatches.length &&
          typeof childPatches[i] === "function"
        ) {
          childPatches[i]($child as HTMLElement); // Apply the patch function for updating existing children
        }
      });
  
      for (const patch of additionalPatches) {
        patch($parent); // Apply the patch function for adding new children
      }
      return $parent; // Return the updated parent element
    };
  }

```
For further information on the `virtual DOM`, you can refer to:

- [[Official React Documentation]](https://legacy.reactjs.org/docs/reconciliation.html) 
- [[The virtual dom comprehensive guide]](https://javascript.plainenglish.io/react-the-virtual-dom-comprehensive-guide-acd19c5e327a)

