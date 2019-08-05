/*
** Reset and connect all nodes in the node graph, skipping the bypassed nodes
*/
export const connectNodes = nodeGraph => {
  // Map node graph object to an array of nodes ordered by node position
  const nodeArray = Object.values(nodeGraph).sort(
    (a, b) => a.position > b.position
  );
  // Connect audio node graph
  nodeArray.forEach((node, index) => {
    // Disconnect from any existing outputs
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
