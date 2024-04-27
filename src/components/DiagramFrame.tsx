import {
  Background,
  ConnectionLineType,
  ConnectionMode,
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
import { useControls } from "leva";
import { useDiagram } from "@/hooks/useDiagram";

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
        elevateEdgesOnSelect
        elevateNodesOnSelect
      >
        <Background />
        <Panel position="top-left">
          <Sidebar />
        </Panel>
        <Controls />
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
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default DiagramFrame;
