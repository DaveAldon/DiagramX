import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  ControlButton,
  Controls,
  DefaultEdgeOptions,
  MarkerType,
  MiniMap,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./nodeStyles.css";
import ShapeNode from "./shape-node";
import { defaultEdges, defaultNodes } from "./initial-elements";
import Sidebar from "./Sidebar/Sidebar";
import MiniMapNode from "./minimap-node";
import { Leva, useControls } from "leva";
import { useDiagram } from "@/hooks/useDiagram";
import { CornerUpLeft, CornerUpRight } from "react-feather";
import useUndoRedo from "@/hooks/useUndoRedo";
import {
  PanelGroup,
  PanelResizeHandle,
  Panel as ResizablePanel,
} from "react-resizable-panels";
import JsonViewer from "./JsonViewer/JsonViewer";
import { useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const Flow = () => {
  const diagram = useDiagram();
  const { getSnapshotJson } = useUndoRedo();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const controls = useControls({
    theme: { options: ["dark", "light"] },
    snapToGrid: false,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });
  const [width] = useWindowSize();

  const getDefaultSize = (w: number) => {
    if (w < 1024) {
      return 33;
    } else return 20;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-full">
      <Leva hidden />
      <PanelGroup direction="horizontal">
        <ResizablePanel minSize={30}>
          <ReactFlow
            className={controls.theme}
            onConnect={diagram.onConnect}
            onConnectStart={diagram.onConnectStart}
            onConnectEnd={diagram.onConnectEnd}
            proOptions={{ hideAttribution: true }}
            nodeTypes={nodeTypes}
            defaultNodes={defaultNodes}
            defaultEdges={defaultEdges}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
            connectionMode={ConnectionMode.Loose}
            panOnScroll={controls.panOnScroll}
            onDrop={diagram.onDrop}
            snapToGrid={controls.snapToGrid}
            snapGrid={[10, 10]}
            onDragOver={diagram.onDragOver}
            zoomOnDoubleClick={controls.zoomOnDoubleClick}
            onNodesChange={diagram.onNodesChange}
            onNodeDragStart={diagram.onNodeDragStart}
            onSelectionDragStart={diagram.onSelectionDragStart}
            onNodesDelete={diagram.onNodesDelete}
            onEdgesDelete={diagram.onEdgesDelete}
            elevateEdgesOnSelect
            elevateNodesOnSelect
          >
            <Background />
            <Panel position="top-left">
              <Sidebar />
            </Panel>
            <Panel
              className="cursor-pointer"
              position="top-right"
              onClick={() => toggleSidebar()}
            >
              <button>{isSidebarOpen ? "Hide" : "Show"} JSON</button>
            </Panel>
            <Controls showInteractive={false} className="bg-red-400">
              <ControlButton onClick={() => diagram.undo()} title="Undo">
                <CornerUpLeft fillOpacity={0} />
              </ControlButton>
              <ControlButton onClick={() => diagram.redo()} title="Redo">
                <CornerUpRight fillOpacity={0} />
              </ControlButton>
            </Controls>
            <MiniMap zoomable draggable nodeComponent={MiniMapNode} />
            <diagram.HelperLines
              horizontal={diagram.helperLineHorizontal}
              vertical={diagram.helperLineVertical}
            />
          </ReactFlow>
        </ResizablePanel>
        <PanelResizeHandle
          className={`w-1 cursor-col-resize ${
            isSidebarOpen === true ? "bg-stone-600" : "bg-transparent"
          }`}
        />
        {isSidebarOpen ? (
          <ResizablePanel
            defaultSize={getDefaultSize(width)}
            minSize={getDefaultSize(width)}
          >
            <JsonViewer jsonString={getSnapshotJson()} />
          </ResizablePanel>
        ) : null}
      </PanelGroup>
    </div>
  );
};

const DiagramFrame = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default DiagramFrame;
