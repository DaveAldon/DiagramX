import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { findIndex, toNumber } from "lodash";
import { debounce } from "lodash/fp";
import { RefObject, useEffect, useRef } from "react";

gsap.registerPlugin(Draggable);
type Point = { x: number; y: number };

const EDGE_DIVIDER = 100;
const INITIAL_EDGE_POSITION = EDGE_DIVIDER / 2;
const FLOATING_POINT_LIMIT = 2;

const getPoint = (edgePathRef: SVGPathElement, n: number) => {
  const point = edgePathRef.getPointAtLength(n);
  return {
    x: toNumber(point.x.toFixed(FLOATING_POINT_LIMIT)),
    y: toNumber(point.y.toFixed(FLOATING_POINT_LIMIT)),
  } as Point;
};

const setLabelPosition = (
  draggableEdgeLabelRef: RefObject<HTMLDivElement>,
  edgePathRef: RefObject<SVGPathElement>,
  edgeText: React.MutableRefObject<{
    index: number;
  }>
) => {
  if (draggableEdgeLabelRef?.current && edgePathRef?.current) {
    draggableEdgeLabelRef.current.style.translate = "-50% -50%";
    const edgeLength = edgePathRef.current.getTotalLength();
    const edgePoint = (edgeLength / EDGE_DIVIDER) * edgeText.current.index;
    const point = getPoint(edgePathRef.current, edgePoint);
    draggableEdgeLabelRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0px)`;
  }
};

const normalDebounce = debounce(500);

const useDraggableEdgeLabel = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  labelPosition?: number
): [RefObject<SVGPathElement>, RefObject<HTMLDivElement>] => {
  const edgePathRef = useRef<SVGPathElement>(null);
  const dragInstance = useRef<Draggable[] | null>(null);
  const draggableEdgeLabelRef = useRef<HTMLDivElement>(null);
  const edgeText = useRef({ index: labelPosition ?? INITIAL_EDGE_POSITION });
  const debounceFunc = useRef(normalDebounce((fn) => fn())).current;

  useEffect(() => {
    if (draggableEdgeLabelRef.current && edgePathRef.current) {
      setLabelPosition(draggableEdgeLabelRef, edgePathRef, edgeText);
    }
    debounceFunc(() => {
      if (edgePathRef.current && draggableEdgeLabelRef.current) {
        const edgeLength = edgePathRef.current.getTotalLength();
        const points: Point[] = [];
        for (let p = 0; p < edgeLength; p += edgeLength / EDGE_DIVIDER) {
          points.push(getPoint(edgePathRef.current, p));
        }
        if (dragInstance.current) {
          dragInstance.current[0].kill();
          dragInstance.current = null;
        }
        dragInstance.current = Draggable.create(draggableEdgeLabelRef.current, {
          liveSnap: {
            points,
          },
          onDragEnd: () => {
            if (draggableEdgeLabelRef.current) {
              const style = window.getComputedStyle(
                draggableEdgeLabelRef.current
              );
              const matrix = new DOMMatrixReadOnly(style.transform);
              const transform = {
                x: toNumber(matrix.m41.toFixed(FLOATING_POINT_LIMIT)),
                y: toNumber(matrix.m42.toFixed(FLOATING_POINT_LIMIT)),
              };
              edgeText.current.index = Math.abs(
                findIndex(
                  points,
                  (point: Point) =>
                    point.x === transform.x && point.y === transform.y
                )
              );
              console.log(
                "🚀 ~  Updated Edge Label Position is:",
                edgeText.current.index
              );
            }
          },
          onClick: () =>
            setLabelPosition(draggableEdgeLabelRef, edgePathRef, edgeText),
          onPress: () =>
            setLabelPosition(draggableEdgeLabelRef, edgePathRef, edgeText),
        });
      }
    });
    return () => {
      debounceFunc.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceX, sourceY, targetX, targetY]);

  return [edgePathRef, draggableEdgeLabelRef];
};

export default useDraggableEdgeLabel;
