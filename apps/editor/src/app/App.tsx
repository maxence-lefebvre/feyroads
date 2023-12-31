import { css } from '@emotion/react';
import { Layer, Stage } from 'react-konva';
import { DrawPoint } from './graph/DrawPoint';
import { DrawSegment } from './graph/DrawSegment';
import { useGraphEditor } from './graph/useGraphEditor';
import { useCallback, useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { DrawPolygon } from './graph/DrawPolygon';
import { Envelope } from '@feyroads/math/graph';
import { useViewport } from './graph/useViewport';
import { useGraphState } from './graph/useGraphState';

export const App = () => {
  const graphState = useGraphState();
  const viewport = useViewport({ graphState });

  const {
    creatingSegment,
    onClickCanvas,
    onContextMenuCanvas,
    onMouseMoveCanvas,
    onWheelCanvas,
    onDragStartPoint,
    onDragMovePoint,
    onDragEndPoint,
  } = useGraphEditor({ graphState, viewport });

  const [isHoveringPoint, setIsHoveringPoint] = useState(false);

  const { segments, points } = graphState.graph;

  const onMouseEnterPoint = useCallback(() => setIsHoveringPoint(true), []);
  const onMouseLeavePoint = useCallback(() => setIsHoveringPoint(false), []);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 20px;

        align-items: center;
      `}
    >
      <Stage
        draggable={viewport.isStageDraggable}
        x={viewport.origin.x}
        y={viewport.origin.y}
        scale={viewport.scale}
        width={600}
        height={600}
        css={[
          css`
            width: 600px;
            height: 600px;
            background-color: #2a5;
          `,
          isHoveringPoint &&
            css`
              cursor: move;
            `,
        ]}
        onClick={onClickCanvas}
        onContextMenu={onContextMenuCanvas}
        onDragEnd={viewport.onDragEndCanvas}
        onMouseMove={onMouseMoveCanvas}
        onWheel={onWheelCanvas}
      >
        <Layer>
          {segments.map((segment) => (
            <DrawSegment key={segment.key()} segment={segment} />
          ))}

          {creatingSegment && <DrawSegment dashed segment={creatingSegment} />}

          <DrawPolygon
            polygon={
              new Envelope(segments[0], { width: 80, roundness: 20 }).polygon
            }
          />

          {points.map((point, index) => (
            <DrawPoint
              key={index}
              point={point}
              isSelected={!!graphState.selectedPoint?.equals(point)}
              isHovered={!!graphState.hoveredPoint?.equals(point)}
              draggable={!graphState.selectedPoint}
              onDragStart={onDragStartPoint}
              onDragMove={onDragMovePoint}
              onDragEnd={onDragEndPoint}
              onMouseEnter={onMouseEnterPoint}
              onMouseLeave={onMouseLeavePoint}
            />
          ))}
        </Layer>
      </Stage>
      <div
        css={css`
          display: flex;
          gap: 20px;
        `}
      >
        <button onClick={graphState.saveGraph}>
          <IconDeviceFloppy />
        </button>
        <button onClick={graphState.disposeGraph}>
          <IconTrash />
        </button>
      </div>
    </div>
  );
};
