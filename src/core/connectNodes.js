export const connectNodes = nodes => {
  // Map nodes object to an array ordered by node position
  const nodeArray = Object.values(nodes).sort(
    (a, b) => a.position > b.position
  );
  // Build audio node graph
  nodeArray.forEach((node, index) => {
    // Remove any existing output connections
    if (node.instance.numberOfOutputs > 0) {
      node.instance.disconnect();
    }
    // Skip bypassed nodes
    if (!node.bypass) {
      // Skip last node
      if (!(index === nodeArray.length - 1)) {
        // Find the next non-bypassed node and connect this node to it
        const nextNode = nodeArray.find(({ bypass, position }) => {
          return !bypass && position > node.position;
        });
        node.instance.connect(nextNode.instance);
      }
    }
  });
};
