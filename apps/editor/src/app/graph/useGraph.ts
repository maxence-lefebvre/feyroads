import { Graph, Point, PointSearcher, Segment } from '@feyroads/math/graph';
import { useCallback, useMemo, useState } from 'react';
import { set } from 'lodash';
import { Simulate } from 'react-dom/test-utils';
import drag = Simulate.drag;

const initialPoints = [
  new Point(200, 200),
  new Point(500, 200),
  new Point(400, 400),
  new Point(100, 300),
];

const [p1, p2, p3, p4] = initialPoints;

const initialSegments = [
  new Segment(p1, p2),
  new Segment(p1, p3),
  new Segment(p1, p4),
  new Segment(p2, p3),
];

const SELECT_NEAREST_IF_DISTANCE_IS_LTE = 20;

export const useGraph = () => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);

  const [graph, setGraph] = useState<Graph>(
    () => new Graph(initialPoints, initialSegments)
  );

  const hoverNearestPointIfClose = useCallback(
    (point: Point) => {
      const nearestPoint = PointSearcher.findNearestPoint(point, graph);
      const isCloseEnough =
        point.distanceTo(nearestPoint) <= SELECT_NEAREST_IF_DISTANCE_IS_LTE;
      setHoveredPoint(isCloseEnough ? nearestPoint : null);
    },
    [graph]
  );

  const removeHoveredPointIfExist = useCallback(() => {
    if (hoveredPoint) {
      setGraph((prev) => prev.removePoint(hoveredPoint));
      setHoveredPoint(null);
      if (selectedPoint && hoveredPoint.equals(selectedPoint)) {
        setSelectedPoint(null);
      }
    }
  }, [hoveredPoint, selectedPoint]);

  const addOrSelectPoint = useCallback(
    (point: Point) => {
      if (hoveredPoint) {
        setSelectedPoint(hoveredPoint);
        return;
      }
      setGraph((prev) => prev.addPointIfNotExist(point));
      setSelectedPoint(point);
      setHoveredPoint(point);
    },
    [hoveredPoint]
  );

  const startDraggingPoint = useCallback(() => {
    if (hoveredPoint) {
      const draggedPoint = new Point(hoveredPoint.x, hoveredPoint.y);
      draggedPoint.isDragging = true;

      setGraph((prev) => prev.replacePoint(hoveredPoint, draggedPoint));
    }
  }, [hoveredPoint]);

  const moveDraggingPoint = useCallback(
    (newPosition: Point) => {
      newPosition.isDragging = true;
      const draggedPoint = graph.points.find((point) => point.isDragging);

      setGraph((prev) => {
        return draggedPoint
          ? prev.replacePoint(draggedPoint, newPosition)
          : prev;
      });

      setSelectedPoint((prev) =>
        draggedPoint && prev?.equals(draggedPoint) ? newPosition : prev
      );
    },
    [graph]
  );

  const dropDraggingPoint = useCallback((newPosition: Point) => {
    setGraph((prev) => {
      const draggedPoint = prev.points.find((point) => point.isDragging);
      return draggedPoint ? prev.replacePoint(draggedPoint, newPosition) : prev;
    });
  }, []);

  return {
    graph,
    selectedPoint,
    addOrSelectPoint,
    hoveredPoint,
    hoverNearestPointIfClose,
    removeHoveredPointIfExist,
    startDraggingPoint,
    moveDraggingPoint,
    dropDraggingPoint,
  };
};