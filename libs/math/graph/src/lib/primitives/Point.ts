export class Point {
  public isDragging = false;

  public constructor(public readonly x: number, public readonly y: number) {}

  key() {
    return `${this.x}-${this.y}`;
  }

  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  distanceTo(point: Point) {
    return Math.hypot(this.x - point.x, this.y - point.y);
  }
}