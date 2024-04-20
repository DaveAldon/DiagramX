import { useCallback, useEffect, useRef, useState } from "react";
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import useUndoable from "use-undoable";
import { NodeBase } from "@xyflow/system";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;

let id = 1;
const getId = () => `${id++}`;

export const useDiagram = () => {
  const reactFlowInstance = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [elements, setElements, { undo, redo, reset }] = useUndoable({
    nodes: initialNodes,
    edges: initialEdges,
  });
  const [draggingElements, setDraggingElements] = useState<NodeBase[]>(
    elements.nodes
  );
  const connectingNodeId = useRef(null);
  const reactFlowWrapper = useRef(null);

  const triggerUpdate = useCallback(
    (t: any, v: any) => {
      setElements((e) => ({
        nodes: t === "nodes" ? v : e.nodes,
        edges: t === "edges" ? v : e.edges,
      }));
    },
    [setElements]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setDraggingElements(applyNodeChanges(changes, draggingElements));
    },
    [draggingElements]
  );

  const onNodeDragStop = useCallback(
    (event: any, node: { id: string; position: any }) => {
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
    },
    [setElements, elements.nodes]
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
      console.log("onEdgeUpdate", oldEdge, newConnection);
      setElements((els) => {
        const updatedEdges = els.edges.map((edge) => {
          if (edge.id === oldEdge.id) {
            return { ...edge, ...newConnection };
          }
          return edge;
        });
        return { ...els, edges: updatedEdges };
      });
    },
    [setElements]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      connectingNodeId.current = null;
      setElements((els) => {
        const newEdge = {
          id: "edge-" + Math.random(),
          source: params.source,
          target: params.target,
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

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Element)?.classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane) {
        const id = getNodeId();
        const position = reactFlowInstance.screenToFlowPosition({
          x: "clientX" in event ? event.clientX : event.touches[0].clientX,
          y: "clientY" in event ? event.clientY : event.touches[0].clientY,
        });
        const newNode = {
          id: getNodeId(),
          data: { label: "Added node" },
          position,
        };

        setElements((els) => {
          const currentNode = els.nodes.find(
            (node) => node.id === connectingNodeId.current
          );

          return {
            ...els,
            nodes: els.nodes.concat(newNode),
            edges: els.edges.concat({
              id: id.toString(),
              source:
                currentNode && position.y < currentNode.position.y
                  ? id.toString()
                  : connectingNodeId.current || "",
              target:
                currentNode && position.y < currentNode.position.y
                  ? connectingNodeId.current || ""
                  : id.toString(),
            }),
          };
        });
      }
    },
    [reactFlowInstance, setElements]
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
        reactFlowInstance.setViewport({ ...flow.transform, ...flow.zoom });
      }
    };

    restoreFlow();
  }, [reactFlowInstance, setElements]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: "Added node" },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
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
  };
};
