import { Point, Polygon } from '@feyroads/math/graph';
import { defaultsDeep } from 'lodash';
import { linearInterpolation } from '@feyroads/math/core';
import { WithBasePolygon } from './types';

export type TreeGraphicOptions = {
  size: number;
  heightCoefficient: number;
  levelCount: number;
};

export const defaultTreeGraphicOptions = {
  size: 160,
  heightCoefficient: 0.1,
  levelCount: 7,
};

export type TreeLevel = {
  color: string;
  polygon: Polygon;
};

export class Tree implements WithBasePolygon {
  public readonly graphicOptions: TreeGraphicOptions;

  public readonly base: Polygon;

  constructor(
    public readonly center: Point,
    graphicOptions?: Partial<TreeGraphicOptions>,
  ) {
    this.graphicOptions = defaultsDeep(
      graphicOptions,
      defaultTreeGraphicOptions,
    );

    this.base = this.generateLevelPolygon(
      this.center,
      this.graphicOptions.size,
    );
  }

  public hash() {
    return this.center.hash();
  }

  public getTreeTop(viewportCenter: Point) {
    return this.center.isomorph(
      viewportCenter,
      this.graphicOptions.heightCoefficient,
    );
  }

  public getTreeLevels(viewportCenter: Point) {
    const { levelCount, size: treeSize } = this.graphicOptions;
    const levels: TreeLevel[] = [
      { color: 'rgb(30, 50, 70)', polygon: this.base },
    ];

    const treeTop = this.getTreeTop(viewportCenter);

    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const center = this.center.linearInterpolation(
        treeTop,
        level / (levelCount - 1),
      );

      const color = `rgb(30, ${linearInterpolation(50, 200, t)}, 70)`;
      const size = linearInterpolation(treeSize, 40, t);

      levels.push({
        color,
        polygon: this.generateLevelPolygon(center, size),
      });
    }

    return levels;
  }

  public generateLevelPolygon(point: Point, size: number) {
    const points = [];
    const radius = size / 2;

    for (let a = 0; a < 2 * Math.PI; a += Math.PI / 16) {
      const noisyRadius = radius * linearInterpolation(0.5, 1, Math.random());
      points.push(point.translate(a, noisyRadius));
    }

    return new Polygon(points);
  }
}
