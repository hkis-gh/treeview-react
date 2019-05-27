/*
  flatten function to flat tree nodes
*/

export const flatten = (nodes, flatNodes = {}) => {
	nodes.forEach(node => {
		flatNodes[node.value] = { ...node, isParent: node.children.length > 0 };
		flatten(node.children, flatNodes);
	});
	return flatNodes;
}

/*
  unflatten function with dynamic keys for reusable purpose only for Tree Nodes
*/

export const unflatten = (nodes, allData, mainKey, parentkey, nameKey) => {
	let data = [];
	nodes.forEach(node => {
		const children = allData.filter(sub => sub[parentkey] === node[mainKey]);
		data.push({
			value: node[mainKey],
			label: node[nameKey],
			checked: false,
			expanded: false,
			checkState: false,
			children: unflatten(children, allData, mainKey, parentkey, nameKey)
		});
	});
	return data;
}

/*
  identifyNodeCheckState function for determine check state of tree node
*/
export const identifyNodeCheckState = (flatNodes, node) => {
	const flatNode = flatNodes[node.value];

	if (!flatNode.isParent) {
		return flatNode.checked ? 1 : 0;
	}

	if (isEveryChildChecked(flatNodes, node)) {
		return 1;
	}

	return 0;
}

/*
  isEveryChildChecked function for check every childnode get selected or not
*/
export const isEveryChildChecked = (flatNodes, node) => {
	return node.children.every(child => flatNodes[child.value].checkState === 1);
}

/*
 toggleChecked function for make checked all child tree nodes
*/
export const toogleChecked = (flatNodes, node, checked) => {
	let flatNode = flatNodes[node.value];

	if (!flatNode.isParent) {
		// apply checked state if no children present in tree nodes
		flatNode.checked = checked;
		return;
	}

	// toogle checked for tree node children
	flatNode.children.forEach((child) => {
		toogleChecked(flatNodes, child, checked);
	});
}

/*
  identifyNodeCheckState function for determine check state of tree node
*/
export const retriveFilteredNodes = (flatNodes, node, filterText) => {
	const flatNode = flatNodes[node.value];

	if (flatNode.label.toLowerCase().indexOf(filterText) > -1) {
		return true;
	}

	if (isFilteredNodeFound(flatNodes, node, filterText)) {
		return true;
	}

	return false;
}

/*
  isEveryChildChecked function for check every childnode get selected or not
*/
export const isFilteredNodeFound = (flatNodes, node, filterText) => {
	return node.children.some(child => flatNodes[child.value].label.toLowerCase().indexOf(filterText) > -1);
}