export function isDescendant(parent, child) {
	let node = child.parentNode

	while (node !== null) {
		if (node === parent) return true
		node = node.parentNode
	}

	return false
}

export function isEqualOrDescendant(parent, child) {
	if (child !== null) {
		return parent === child || isEqualOrDescendant(parent, child.parentNode)
	}
	return false
}
