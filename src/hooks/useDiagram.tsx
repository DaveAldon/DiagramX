import { useHelperLines } from "@/components/HelperLines/useHelperLines";
import {
  OnConnect,
  OnNodesChange,
  addEdge,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useDiagram = () => {
  const { screenToFlowPosition, setNodes, setEdges, getNode } = useReactFlow();
  const connectingNodeId = useRef(null);
  const {
    HelperLines,
    handleHelperLines,
    helperLineHorizontal,
    helperLineVertical,
  } = useHelperLines();
  const onDragOver: DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };
  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (selectedNodeId) {
      const selectedNode = getNode(selectedNodeId);
      if (selectedNode) {
        timeoutId = setTimeout(() => {
          setNodes((nodes) =>
            nodes.map((node) =>
              node.id === selectedNodeId ? { ...node, selected: true } : node
            )
          );
        }, 0);
      }
    }

    // Clean up the timeout when the component unmounts or when selectedNodeId changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [getNode, selectedNodeId, setNodes]);

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData("application/reactflow");

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode = {
      id: Date.now().toString(),
      type: "shape",
      position,
      style: { width: 100, height: 100 },
      data: {
        type,
        color: "#3F8AE2",
      },
      selected: true,
    };

    setNodes((nodes) =>
      nodes.map((n) => ({ ...n, selected: false })).concat([newNode])
    );
    //setSelectedNodeId(newNode.id);
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) =>
        applyNodeChanges(handleHelperLines(changes, nodes), nodes)
      );
    },
    [setNodes, handleHelperLines]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      connectingNodeId.current = null;
      setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;
      event.preventDefault();
      const targetIsPane = (event.target as Element)?.classList.contains(
        "react-flow__pane"
      );

      const targetIsHandle = (event.target as Element)?.classList.contains(
        "react-flow__handle"
      );
      if (targetIsPane && !targetIsHandle) {
        const position = screenToFlowPosition({
          x: "clientX" in event ? event.clientX : event.touches[0].clientX,
          y: "clientY" in event ? event.clientY : event.touches[0].clientY,
        });

        const newNode = {
          id: Date.now().toString(),
          type: "shape",
          position,
          style: { width: 100, height: 100 },
          data: {
            type: "rectangle",
            color: "#3F8AE2",
          },
          selected: true,
        };

        setNodes((nodes) =>
          nodes.map((n) => ({ ...n, selected: false })).concat([{ ...newNode }])
        );

        const newEdge = {
          id: `${connectingNodeId.current}-${newNode.id}`,
          source: connectingNodeId.current,
          target: newNode.id,
          animated: true,
        };
        setEdges((edges) => edges.concat([newEdge]));
        setSelectedNodeId(newNode.id);
      }
    },
    [screenToFlowPosition, setEdges, setNodes]
  );

  return {
    onDragOver,
    onDrop,
    onNodesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    selectedNodeId,
    setSelectedNodeId,
    HelperLines,
    helperLineHorizontal,
    helperLineVertical,
  };
};
