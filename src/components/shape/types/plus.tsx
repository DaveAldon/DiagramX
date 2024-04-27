import { type ShapeProps } from '.';
import { generatePath } from './utils';

function Plus({ width, height, ...svgAttributes }: ShapeProps) {
  const plusPath = generatePath([
    [width / 3, 0],
    [width * (2 / 3), 0],
    [width * (2 / 3), height / 3],
    [width, height / 3],
    [width, height * (2 / 3)],
    [width, height * (2 / 3)],
    [width * (2 / 3), height * (2 / 3)],
    [width * (2 / 3), height],
    [width * (2 / 3), height],
    [width / 3, height],
    [width / 3, height * (2 / 3)],
    [0, height * (2 / 3)],
    [0, height / 3],
    [width / 3, height / 3],
  ]);

  return <path d={plusPath} {...svgAttributes} />;
}

export default Plus;
