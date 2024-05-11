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
import { useCallback, useRef, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./DropDownMenu/DropDownMenu";
import { RiMenu3Fill } from "react-icons/ri";
import { useTheme } from "@/hooks/useTheme";

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "editable-edge",
  style: { strokeWidth: 2 },
};

const Flow = () => {
  const diagram = useDiagram();
  const { toast } = useToast();
  const { getSnapshotJson, takeSnapshot } = useUndoRedo();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [width] = useWindowSize();
  const themeHook = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        diagram.uploadJson(json);
      };
      reader.readAsText(file);
    }
  };

  const Menu = () => {
    return (
      <div className="gap-0 cursor-pointer flex">
        <AboutButton
          onClick={() => {
            toggleLeftSidebar();
          }}
        />
        <ThemeToggle
          onClick={themeHook.darkModeToggle}
          isDarkMode={themeHook.theme === "dark"}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row gap-2 justify-center items-center p-1 pl-2 rounded-md hover:bg-slate-200 hover:dark:bg-slate-700 dark:bg-slate-800">
            Menu
            <RiMenu3Fill />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-black text-black dark:text-white">
            <DropdownMenuLabel className="w-full justify-start">
              <button
                onClick={() => {
                  diagram.deselectAll();
                  toast({
                    title: "Save successful!",
                    description:
                      "The latest changes to your DiagramX have been saved. You can download them as an image or Json file.",
                  });
                }}
                className="w-full font-normal dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
              >
                Save
                <IoSync />
              </button>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <DownloadImageButton useDiagram={diagram} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadJsonButton useDiagram={diagram} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UploadJsonButton
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => toggleRightSidebar()}
                className="w-full dark:text-white dark:hover:bg-slate-800 hover:bg-gray-200 rounded-md p-1 flex flex-row gap-1 justify-between items-center"
              >
                {isRightSidebarOpen ? "Hide" : "Show"} Json
                <VscJson />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json"
          onInput={onFileChange}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <PanelGroup direction="horizontal">
        {isLeftSidebarOpen ? (
          <ResizablePanel
            order={1}
            className="bg-white dark:bg-black"
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
                className={themeHook.theme || "light"}
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
                panOnScroll={true}
                onDrop={diagram.onDrop}
                snapToGrid={false}
                snapGrid={[10, 10]}
                onDragOver={diagram.onDragOver}
                zoomOnDoubleClick={false}
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
                <Background
                  color="grey"
                  bgColor={themeHook.theme === "dark" ? "black" : "white"}
                />
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
                <Panel position="top-right">
                  <Menu />
                </Panel>
                <Controls className="" showInteractive={false}>
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
