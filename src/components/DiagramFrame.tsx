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
  Panel,
  ReactFlow,
  ReactFlowProvider,
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

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

interface FlowProps {
  theme?: string;
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
}

const Flow = ({
  theme = "dark",
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: FlowProps) => {
  const diagram = useDiagram();

  return (
    <div className="w-full h-full">
      <ReactFlow
        className={theme}
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
        panOnScroll={panOnScroll}
        onDrop={diagram.onDrop}
        snapToGrid={snapToGrid}
        snapGrid={[10, 10]}
        onDragOver={diagram.onDragOver}
        zoomOnDoubleClick={zoomOnDoubleClick}
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
        <Controls showInteractive={false} className="bg-red-400">
          <ControlButton
            onClick={() => diagram.undo()}
            title="Undo"
            className="bg-red-500"
          >
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
    </div>
  );
};

const DiagramFrame = () => {
  const props = useControls({
    theme: { options: ["dark", "light"] },
    snapToGrid: false,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });
  return (
    <ReactFlowProvider>
      <Leva hidden />
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default DiagramFrame;
