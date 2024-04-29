import { Node, NodePositionChange, XYPosition } from "@xyflow/react";

type GetHelperLinesResult = {
  horizontal?: number;
  vertical?: number;
  snapPosition: Partial<XYPosition & { centerX?: number; centerY?: number }>;
};

// this utility function can be called with a position change (inside onNodesChange)
// it checks all other nodes and calculated the helper line positions and the position where the current node should snap to
export function getHelperLines(
  change: NodePositionChange,
  nodes: Node[],
  distance = 5
): GetHelperLinesResult {
  const defaultResult = {
    horizontal: undefined,
    vertical: undefined,
    snapPosition: {
      x: undefined,
      y: undefined,
      centerX: undefined,
      centerY: undefined,
    },
  };
  const nodeA = nodes.find((node) => node.id === change.id);

  if (!nodeA || !change.position) {
    return defaultResult;
  }
  if (!nodeA.measured) {
    return defaultResult;
  }

  const nodeABounds = {
    left: change.position.x,
    right: change.position.x + (nodeA.measured.width ?? 0),
    top: change.position.y,
    bottom: change.position.y + (nodeA.measured.height ?? 0),
    width: nodeA.measured.width ?? 0,
    height: nodeA.measured.height ?? 0,
  };

  let horizontalDistance = distance;
  let verticalDistance = distance;

  return nodes
    .filter((node) => node.id !== nodeA.id)
    .reduce<GetHelperLinesResult>((result, nodeB) => {
      if (!nodeB.position || !nodeB.measured) {
        return result;
      }
      const nodeBBounds = {
        left: nodeB.position.x,
        right: nodeB.position.x + (nodeB.measured.width ?? 0),
        top: nodeB.position.y,
        bottom: nodeB.position.y + (nodeB.measured.height ?? 0),
        width: nodeB.measured.width ?? 0,
        height: nodeB.measured.height ?? 0,
      };

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //  |
      //  |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left);

      if (distanceLeftLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceLeftLeft;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //              |
      //              |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceRightRight = Math.abs(
        nodeABounds.right - nodeBBounds.right
      );

      if (distanceRightRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceRightRight;
      }

      //              |‾‾‾‾‾‾‾‾‾‾‾|
      //              |     A     |
      //              |___________|
      //              |
      //              |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right);
      if (distanceLeftRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceLeftRight;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //              |
      //              |
      //              |‾‾‾‾‾‾‾‾‾‾‾|
      //              |     B     |
      //              |___________|
      const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left);

      if (distanceRightLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceRightLeft;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|‾‾‾‾‾|‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |     |     B     |
      //  |___________|     |___________|
      const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top);

      if (distanceTopTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceTopTop;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|_________________
      //                    |           |
      //                    |     B     |
      //                    |___________|
      const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top);

      if (distanceBottomTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceBottomTop;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|     |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |     |     B     |
      //  |___________|_____|___________|
      const distanceBottomBottom = Math.abs(
        nodeABounds.bottom - nodeBBounds.bottom
      );

      if (distanceBottomBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceBottomBottom;
      }

      //                    |‾‾‾‾‾‾‾‾‾‾‾|
      //                    |     B     |
      //                    |           |
      //  |‾‾‾‾‾‾‾‾‾‾‾|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
      //  |     A     |
      //  |___________|
      const distanceTopBottom = Math.abs(nodeABounds.top - nodeBBounds.bottom);

      if (distanceTopBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceTopBottom;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|     |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |-----|     B     |
      //  |___________|     |___________|
      // Add these two new distance variables
      let horizontalCenterDistance = distance;
      let verticalCenterDistance = distance;

      // Add these two new properties to the default result
      defaultResult.snapPosition.centerX = undefined;
      defaultResult.snapPosition.centerY = undefined;

      // Calculate the center of nodeA
      const nodeACenter = {
        x: nodeABounds.left + nodeABounds.width / 2,
        y: nodeABounds.top + nodeABounds.height / 2,
      };

      // Inside the reduce function, calculate the center of nodeB
      const nodeBCenter = {
        x: nodeBBounds.left + nodeBBounds.width / 2,
        y: nodeBBounds.top + nodeBBounds.height / 2,
      };

      // Check if the centers are within the snap distance
      const distanceCenterX = Math.abs(nodeACenter.x - nodeBCenter.x);
      const distanceCenterY = Math.abs(nodeACenter.y - nodeBCenter.y);

      // If they are, adjust the snap position and set the helper lines
      if (distanceCenterX < verticalCenterDistance) {
        result.snapPosition.centerX = nodeBCenter.x - nodeABounds.width / 2;
        result.vertical = nodeBCenter.x;
        verticalCenterDistance = distanceCenterX;
      }

      if (distanceCenterY < horizontalCenterDistance) {
        result.snapPosition.centerY = nodeBCenter.y - nodeABounds.height / 2;
        result.horizontal = nodeBCenter.y;
        horizontalCenterDistance = distanceCenterY;
      }

      // At the end of the function, use the centerX and centerY snap positions if they were set
      if (result.snapPosition.centerX !== undefined) {
        result.snapPosition.x = result.snapPosition.centerX;
      }

      if (result.snapPosition.centerY !== undefined) {
        result.snapPosition.y = result.snapPosition.centerY;
      }

      return result;
    }, defaultResult);
}
