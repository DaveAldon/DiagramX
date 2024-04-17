import { useCallback, useEffect, useState } from "react";
import {
  Background,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useUndoable from "use-undoable";
import { NodeBase } from "@xyflow/system";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const Flow = () => {
  const [elements, setElements, { undo, redo, reset }] = useUndoable({
    nodes: initialNodes,
    edges: initialEdges,
  });
  const [draggingElements, setDraggingElements] = useState<NodeBase[]>(
    elements.nodes
  );
  const [edges, setEdges] = useEdgesState(initialEdges);

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
      triggerUpdate("edges", applyEdgeChanges(changes, elements.edges));
    },
    [triggerUpdate, elements.edges]
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setDraggingElements(elements.nodes);
  }, [elements.nodes]);

  return (
    <div className="w-full h-full">
      <button onClick={() => undo()}>undo</button>
      <button onClick={() => redo()}>redo</button>
      <ReactFlow
        nodes={draggingElements}
        edges={elements.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flow;
