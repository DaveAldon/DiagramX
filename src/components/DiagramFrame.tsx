import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  ControlButton,
  Controls,
  DefaultEdgeOptions,
  MiniMap,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  EdgeTypes,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./nodeStyles.css";
import ShapeNode from "./shape-node";
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
const JsonViewer = dynamic(() => import("./JsonViewer/JsonViewer"), {
  ssr: false,
});
import { useCallback, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import dynamic from "next/dynamic";
import { EditableEdge } from "./edges/EditableEdge";
import EdgeToolbar from "./EdgeToolbar/EdgeToolbar";
import { ConnectionLine } from "./edges/ConnectionLine";
import savedDiagramJson from "../json-diagrams/DiagramX.json";
import DownloadImageButton from "./Downloads/DownloadImage";
import DownloadJsonButton from "./Downloads/DownloadJson";
import UploadJsonButton from "./Downloads/UploadJson";
import { IoSync } from "react-icons/io5";
import { VscJson } from "react-icons/vsc";
import AboutButton from "./Downloads/AboutButton";
import { useToast } from "./Toast/useToast";
import { About } from "./About";
import ThemeToggle from "./Downloads/ThemeToggle";

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "editable-edge",
  /* markerStart: "some-arrow",
  markerEnd: "some-arrow", */
  style: { strokeWidth: 2 },
};

const Flow = () => {
  const diagram = useDiagram();
  const { toast } = useToast();
  const { getSnapshotJson, takeSnapshot } = useUndoRedo();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [width] = useWindowSize();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const controls = useControls({
    theme: { options: ["light", "dark"] },
    snapToGrid: false,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  const darkModeToggle = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const getDefaultSize = (w: number) => {
    if (w < 1024) {
      return 33;
    } else return 20;
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const EditableEdgeWrapper = useCallback(
    (props: EdgeProps) => {
      return <EditableEdge {...props} useDiagram={diagram} />;
    },
    [diagram]
  );
  const edgeTypes: EdgeTypes = {
    "editable-edge": EditableEdgeWrapper,
  };

  return (
    <div className="w-full h-full">
      <Leva hidden />
      <PanelGroup direction="horizontal">
        {isLeftSidebarOpen ? (
          <ResizablePanel
            order={1}
            className="bg-white"
            defaultSize={getDefaultSize(width)}
            minSize={getDefaultSize(width)}
          >
            <About onClick={toggleLeftSidebar} />
          </ResizablePanel>
        ) : null}
        <PanelResizeHandle
          className={`w-1 cursor-col-resize ${
            isLeftSidebarOpen === true
              ? "bg-stone-600 visible"
              : "bg-transparent hidden"
          }`}
        />
        <ResizablePanel order={2}>
          <PanelGroup direction="horizontal">
            <ResizablePanel minSize={30} order={1}>
              <ReactFlow
                className={theme}
                onConnect={diagram.onConnect}
                onConnectStart={diagram.onConnectStart}
                //onConnectEnd={diagram.onConnectEnd}
                connectionLineComponent={ConnectionLine}
                proOptions={{ hideAttribution: true }}
                onPaneClick={diagram.onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultNodes={savedDiagramJson.nodes}
                defaultEdges={savedDiagramJson.edges}
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
                onNodeClick={diagram.onNodeClick}
                onEdgesDelete={diagram.onEdgesDelete}
                onEdgeClick={diagram.onEdgeClick}
                //onEdgesChange={diagram.onEdgesChange}
                elevateEdgesOnSelect
                elevateNodesOnSelect
                maxZoom={10}
                minZoom={0.1}
                multiSelectionKeyCode={["Meta", "Control"]}
              >
                <Background color="grey" bgColor="white" />
                <Panel position="top-left">
                  <Sidebar />
                </Panel>
                {diagram.editingEdgeId ? (
                  <Panel position="top-center">
                    <EdgeToolbar
                      takeSnapshot={takeSnapshot}
                      useDiagram={diagram}
                    />
                  </Panel>
                ) : null}
                <Panel
                  className="cursor-pointer gap-1 flex"
                  position="top-right"
                >
                  <AboutButton
                    onClick={() => {
                      toggleLeftSidebar();
                    }}
                  />
                  <ThemeToggle
                    onClick={darkModeToggle}
                    isDarkMode={theme === "dark"}
                  />
                  <button
                    onClick={() => {
                      diagram.deselectAll();
                      toast({
                        title: "Save successful!",
                        description:
                          "The latest changes to your DiagramX have been saved. You can download them as an image or Json file.",
                      });
                    }}
                    className="text-black dark:text-white bg-gray-100 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
                  >
                    Save
                    <IoSync />
                  </button>
                  <DownloadImageButton useDiagram={diagram} />
                  <DownloadJsonButton useDiagram={diagram} />
                  <UploadJsonButton useDiagram={diagram} />
                  <button
                    onClick={() => toggleRightSidebar()}
                    className="text-black bg-gray-100 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-center items-center"
                  >
                    {isRightSidebarOpen ? "Hide" : "Show"} <VscJson />
                  </button>
                </Panel>
                <Controls className="text-black" showInteractive={false}>
                  <ControlButton onClick={() => diagram.undo()} title="Undo">
                    <CornerUpLeft fillOpacity={0} />
                  </ControlButton>
                  <ControlButton onClick={() => diagram.redo()} title="Redo">
                    <CornerUpRight fillOpacity={0} />
                  </ControlButton>
                </Controls>
                <MiniMap
                  zoomable
                  pannable
                  draggable
                  nodeComponent={MiniMapNode}
                />
                <diagram.HelperLines
                  horizontal={diagram.helperLineHorizontal}
                  vertical={diagram.helperLineVertical}
                />
                <diagram.Markers />
              </ReactFlow>
            </ResizablePanel>
            <PanelResizeHandle
              className={`w-1 cursor-col-resize ${
                isRightSidebarOpen === true
                  ? "bg-stone-600 visible"
                  : "bg-transparent hidden"
              }`}
            />
            {isRightSidebarOpen ? (
              <ResizablePanel
                order={2}
                defaultSize={getDefaultSize(width)}
                minSize={getDefaultSize(width)}
              >
                <JsonViewer jsonString={getSnapshotJson()} />
              </ResizablePanel>
            ) : null}
          </PanelGroup>
        </ResizablePanel>
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
