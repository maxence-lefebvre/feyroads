import { css } from '@emotion/react';
import { useAppCanvasContext } from '@feyroads/canvas/state';
import { useGraphEditorContext } from '@feyroads/editor/graph/state';
import { useViewportContext } from '@feyroads/editor/viewport/state';
import { useGraphStateContext } from '@feyroads/math/state';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';

export type CanvasProps = {
  children: ReactNode;
};

export const Canvas = memo(function Canvas({ children }: CanvasProps) {
  const { selectedPoint, hoveredPoint } = useGraphStateContext();
  const { isHoveringPoint } = useAppCanvasContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    canvasRef,
    onDragEndCanvas,
    onDragMoveCanvas,
    origin,
    isStageDraggable,
    scale,
  } = useViewportContext();

  const {
    onMouseMoveCanvas,
    onWheelCanvas,
    onClickCanvas,
    onContextMenuCanvas,
  } = useGraphEditorContext();

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      css={css`
        flex: 1 0 auto;
        width: 100%;
      `}
    >
      {dimensions.width !== 0 && dimensions.height !== 0 && (
        <Stage
          ref={canvasRef}
          draggable={isStageDraggable}
          x={origin.x}
          y={origin.y}
          scale={scale}
          width={dimensions.width}
          height={dimensions.height}
          css={[
            css`
              width: 100%;
              height: 100%;
              background-color: #2a5;
            `,
            hoveredPoint &&
              (selectedPoint || !isHoveringPoint) &&
              css`
                cursor: pointer;
              `,
            !selectedPoint &&
              isHoveringPoint &&
              css`
                cursor: move;
              `,
          ]}
          onDragMove={onDragMoveCanvas}
          onDragEnd={onDragEndCanvas}
          onClick={onClickCanvas}
          onContextMenu={onContextMenuCanvas}
          onMouseMove={onMouseMoveCanvas}
          onWheel={onWheelCanvas}
        >
          {children}
        </Stage>
      )}
    </div>
  );
});
