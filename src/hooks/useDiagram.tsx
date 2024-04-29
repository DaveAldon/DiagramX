import { useHelperLines } from "@/hooks/useHelperLines";
import {
  Edge,
  OnConnect,
  OnEdgesDelete,
  OnNodeDrag,
  OnNodesChange,
  OnNodesDelete,
  SelectionDragHandler,
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
import useUndoRedo from "./useUndoRedo";
import { useAppStore } from "@/components/store";
import { DEFAULT_ALGORITHM } from "@/components/edges/EditableEdge/constants";
import { ControlPointData } from "@/components/edges/EditableEdge";

export const useDiagram = () => {
  const { screenToFlowPosition, setNodes, setEdges, getNode, getEdges } =
    useReactFlow();
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
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
    takeSnapshot();
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
      takeSnapshot();
      const { connectionLinePath } = useAppStore.getState();
      const edge = {
        ...connection,
        id: `${Date.now()}-${connection.source}-${connection.target}`,
        type: "editable-edge",
        selected: true,
        animated: true,
        data: {
          algorithm: DEFAULT_ALGORITHM,
          points: connectionLinePath.map(
            (point, i) =>
              ({
                ...point,
                id: window.crypto.randomUUID(),
                prev: i === 0 ? undefined : connectionLinePath[i - 1],
                active: true,
              } as ControlPointData)
          ),
        },
      };
      setEdges((edges) => addEdge({ ...edge, type: "editable-edge" }, edges));
    },
    [setEdges, takeSnapshot]
  );

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;
      takeSnapshot();
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

        /* const newEdge = {
          id: `${connectingNodeId.current}-${newNode.id}`,
          source: connectingNodeId.current,
          target: newNode.id,
          animated: true,
        }; */
        const { connectionLinePath } = useAppStore.getState();

        const edge = {
          id: `${Date.now()}-${connectingNodeId.current}-${newNode.id}`,
          source: connectingNodeId.current,
          target: newNode.id,
          type: "editable-edge",
          selected: false,
          data: {
            algorithm: DEFAULT_ALGORITHM,
            points: connectionLinePath.map(
              (point, i) =>
                ({
                  ...point,
                  id: window.crypto.randomUUID(),
                  prev: i === 0 ? undefined : connectionLinePath[i - 1],
                  active: true,
                } as ControlPointData)
            ),
          },
        };
        setEdges((edges) => addEdge({ ...edge, type: "editable-edge" }, edges));
        setSelectedNodeId(newNode.id);
      }
    },
    [screenToFlowPosition, setEdges, setNodes, takeSnapshot]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
      setEditingEdgeId(edge.id);
    },
    []
  );

  const onNodeDragStart: OnNodeDrag = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodesDelete: OnNodesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onEdgesDelete: OnEdgesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(undefined);
    setEditingEdgeId(null);
  }, []);

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
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
    undo,
    redo,
    canRedo,
    canUndo,
    onEdgeClick,
    editingEdgeId,
    onPaneClick,
  };
};
