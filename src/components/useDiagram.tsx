import { useCallback, useEffect, useRef, useState } from "react";
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  OnConnect,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
import useUndoable from "use-undoable";
import { NodeBase } from "@xyflow/system";
import { NodeType } from "./Nodes";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "1" },
    type: NodeType.Rectangle,
    style: { width: 180, height: 100 },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "2" },
    type: NodeType.Rectangle,
    style: { width: 180, height: 100 },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;

export const useDiagram = () => {
  const reactFlowInstance = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [elements, setElements, { undo, redo, reset }] = useUndoable({
    nodes: initialNodes,
    edges: initialEdges,
  });
  const [draggingElements, setDraggingElements] = useState<NodeBase[]>(
    elements.nodes
  );
  const connectingNodeId = useRef(null);

  // Node picker modal control
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const triggerUpdate = useCallback(
    (t: any, v: any) => {
      setElements((e) => ({
        nodes: t === "nodes" ? v : e.nodes,
        edges: t === "edges" ? v : e.edges,
      }));
    },
    [setElements]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      const zoom = rfInstance.getZoom();
      const transform = rfInstance.getViewport();

      localStorage.setItem(
        flowKey,
        JSON.stringify({ ...flow, transform, zoom })
      );
    }
  }, [rfInstance]);

  const viewSave = useCallback(() => {
    const flow = JSON.parse(localStorage.getItem(flowKey) as string);
    console.log(flow);
  }, []);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) as string);
      if (flow) {
        setElements({
          nodes: flow.nodes,
          edges: flow.edges,
        });
        reactFlowInstance.setViewport(
          { ...flow.transform, ...flow.zoom },
          { duration: 800 }
        );
      }
    };

    restoreFlow();
    elements.nodes.forEach((node) => {
      updateNodeInternals(node.id);
    });
  }, [elements.nodes, reactFlowInstance, setElements, updateNodeInternals]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setDraggingElements(applyNodeChanges(changes, draggingElements));
    },
    [draggingElements]
  );

  const onNodeDragStop = useCallback(
    (_event: any, node: { id: string; position: any }) => {
      setElements((els) => {
        const index = els.nodes.findIndex((e) => e.id === node.id);
        if (index === -1) {
          return els;
        }

        const newEls = {
          ...els,
          nodes: [...els.nodes],
          edges: els.edges,
        };
        newEls.nodes[index] = {
          ...newEls.nodes[index],
          position: node.position,
        };
        return newEls;
      });
      setDraggingElements(elements.nodes);
      onSave();
      onRestore();
    },
    [setElements, elements.nodes, onSave, onRestore]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setElements((els) => ({
        nodes: els.nodes,
        edges: applyEdgeChanges(changes, els.edges),
      }));
    },
    [setElements]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (newConnection.target === null) {
        setModalPosition(modalPosition);
        setShowModal(true);
      } else {
        setElements((els) => {
          const updatedEdges = els.edges.map((edge) => {
            if (edge.id === oldEdge.id) {
              return { ...edge, ...newConnection };
            }
            return edge;
          });
          return { ...els, edges: updatedEdges };
        });
      }
    },
    [setElements, modalPosition]
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      connectingNodeId.current = null;
      setElements((els) => {
        const newEdge = {
          id: "edge-" + Math.random(),
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          animated: true,
          arrowHeadType: "arrowclosed",
        };
        return {
          ...els,
          edges: addEdge(newEdge, els.edges),
        };
      });
    },
    [setElements]
  );

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onNodeTypeSelect = useCallback(
    (nodeType: string) => {
      setShowModal(false);

      if (rfInstance) {
        const flowPosition = rfInstance.screenToFlowPosition(modalPosition);

        const id = getNodeId();
        const newNode = {
          id,
          data: { label: `Node` },
          type: nodeType,
          position: flowPosition,
          style: { width: 180, height: 100 },
        };

        setElements((els) => ({
          ...els,
          nodes: els.nodes.concat({
            ...newNode,
            type: nodeType as NodeType,
          }),
          edges: els.edges.concat({
            id: id.toString(),
            source: connectingNodeId.current || "",
            target: id.toString(),
          }),
        }));
      }
    },
    [rfInstance, modalPosition, setElements]
  );

  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    if (!connectingNodeId.current) return;

    const targetIsPane = (event.target as Element)?.classList.contains(
      "react-flow__pane"
    );

    const targetIsHandle = (event.target as Element)?.classList.contains(
      "react-flow__handle"
    );

    if (targetIsPane && !targetIsHandle) {
      setModalPosition({
        x: "clientX" in event ? event.clientX : event.touches[0].clientX,
        y: "clientY" in event ? event.clientY : event.touches[0].clientY,
      });
      setShowModal(true);
    }
  }, []);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: "Added node" },
      type: NodeType.Rectangle,
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
      style: { width: 180, height: 100 },
    };
    triggerUpdate("nodes", (elements.nodes || []).concat(newNode));
  }, [triggerUpdate, elements.nodes]);

  useEffect(() => {
    setDraggingElements(elements.nodes);
  }, [elements.nodes]);

  return {
    elements,
    setElements,
    draggingElements,
    setDraggingElements,
    onNodesChange,
    onEdgeUpdate,
    onEdgesChange,
    onNodeDragStop,
    onAdd,
    onSave,
    onRestore,
    viewSave,
    undo,
    redo,
    reset,
    rfInstance,
    setRfInstance,
    onConnect,
    onConnectStart,
    onConnectEnd,
    showModal,
    setShowModal,
    modalPosition,
    onNodeTypeSelect,
  };
};
