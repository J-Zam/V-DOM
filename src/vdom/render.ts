import { IElementNode } from "../ts";

function renderElement({ tagName, attrs, children}: IElementNode) {
    const $element = document.createElement(tagName)

    for (const [k, v] of Object.entries(attrs)) {
        $element.setAttribute(k,v)
    }

    for (const child of children!) {
        $element.appendChild(render(child as IElementNode))
    }

    return $element
}

export function render(vNode: IElementNode) {
    if (typeof vNode === "string")  
        return document.createTextNode(vNode)

    return renderElement(vNode)
}