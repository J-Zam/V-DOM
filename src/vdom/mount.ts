
export default ($node: HTMLElement | Text, $target: HTMLElement) => {
    $target.replaceWith($node)
    return $node
}