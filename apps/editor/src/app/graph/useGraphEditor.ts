import { useCallback, useMemo } from 'react';
import { Point, Segment } from '@feyroads/math/graph';
import { KonvaNodeEvents } from 'react-konva/ReactKonvaCore';
import { GraphState, Viewport } from './types';

export const useGraphEditor = ({
  graphState,
  viewport,
}: {
  graphState: GraphState;
  viewport: Viewport;
}) => {
  const onClickCanvas: NonNullable<KonvaNodeEvents['onClick']> = useCallback(
    ({ evt }) => {
      if (evt.button === 2) {
        // right click
        graphState.unselectIfExistElseRemoveHoveredPoint();
        return;
      }
      const position = viewport.getMousePositionOnViewport(evt);

      graphState.addOrSelectPoint(position);
    },
    [
      graphState.addOrSelectPoint,
      graphState.unselectIfExistElseRemoveHoveredPoint,
      viewport.getMousePositionOnViewport,
    ],
  );

  const onContextMenuCanvas: NonNullable<KonvaNodeEvents['onContextMenu']> =
    useCallback(({ evt }) => {
      evt.preventDefault();
    }, []);

  const onMouseMoveCanvas: NonNullable<KonvaNodeEvents['onMouseMove']> =
    useCallback(
      ({ evt }) => {
        const position = viewport.getMousePositionOnViewport(evt);
        graphState.hoverNearestPointIfClose(position);
        viewport.setMousePosition(position);
      },
      [
        graphState.hoverNearestPointIfClose,
        viewport.setMousePosition,
        viewport.getMousePositionOnViewport,
      ],
    );

  const onWheelCanvas: NonNullable<KonvaNodeEvents['onWheel']> = useCallback(
    ({ evt }) => {
      const direction = Math.sign(evt.deltaY);
      viewport.setZoom(viewport.zoom + direction);
    },
    [viewport.zoom, viewport.setZoom],
  );

  const onDragMovePoint: NonNullable<KonvaNodeEvents['onDragMove']> =
    useCallback(
      ({ target }) => {
        graphState.moveDraggingPoint(new Point(target.x(), target.y()));
      },
      [graphState.moveDraggingPoint],
    );

  const onDragEndPoint: NonNullable<KonvaNodeEvents['onDragEnd']> = useCallback(
    ({ evt, target }) => {
      graphState.dropDraggingPoint(new Point(target.x(), target.y()));
    },
    [graphState.dropDraggingPoint],
  );

  const creatingSegment = useMemo(
    () =>
      graphState.selectedPoint &&
      viewport.mousePosition &&
      new Segment(
        graphState.selectedPoint,
        graphState.hoveredPoint ?? viewport.mousePosition,
      ),
    [graphState.selectedPoint, graphState.hoveredPoint, viewport.mousePosition],
  );

  return {
    creatingSegment,
    onClickCanvas,
    onContextMenuCanvas,
    onMouseMoveCanvas,
    onWheelCanvas,
    onDragStartPoint: graphState.startDraggingPoint,
    onDragMovePoint,
    onDragEndPoint,
  };
};
