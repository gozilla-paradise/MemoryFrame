import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PhotoTransform } from '../types/frame';

interface UseCanvasInteractionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  transform: PhotoTransform;
  onTransformChange: (transform: PhotoTransform) => void;
  canvasScale?: number; // visual scale of canvas
  enabled?: boolean;
}

interface PointerCoord {
  x: number;
  y: number;
}

export function useCanvasInteraction({
  canvasRef,
  transform,
  onTransformChange,
  canvasScale = 1,
  enabled = true,
}: UseCanvasInteractionProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Latest transform reference so event handlers can read current state without compounding
  const transformRef = useRef<PhotoTransform>(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Active pointers map (supports 1-finger drag and 2-finger pinch/pan)
  const activePointersRef = useRef<Map<number, PointerCoord>>(new Map());

  // Frozen state when gesture started
  const dragStartCoordRef = useRef<PointerCoord>({ x: 0, y: 0 });
  const startTransformRef = useRef<PhotoTransform>(transform);

  // Pinch-zoom tracking
  const pinchStartDistRef = useRef<number>(1);
  const pinchStartCenterRef = useRef<PointerCoord>({ x: 0, y: 0 });
  const pinchStartTransformRef = useRef<PhotoTransform>(transform);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!enabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if setPointerCapture is unsupported
      }

      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      setIsDragging(true);

      const pointerCount = activePointersRef.current.size;

      if (pointerCount === 1) {
        // Single pointer drag start
        dragStartCoordRef.current = { x: e.clientX, y: e.clientY };
        startTransformRef.current = { ...transformRef.current };
      } else if (pointerCount === 2) {
        // Pinch zoom & 2-finger pan start
        const pts = Array.from<PointerCoord>(activePointersRef.current.values());
        pinchStartDistRef.current = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
        pinchStartCenterRef.current = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };
        pinchStartTransformRef.current = { ...transformRef.current };
      }
    },
    [enabled, canvasRef]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!enabled || !activePointersRef.current.has(e.pointerId)) return;

      // Update this pointer's position in the map
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const scale = canvasScale > 0 ? canvasScale : 1;
      const pointerCount = activePointersRef.current.size;

      if (pointerCount === 1) {
        // 1-finger / 1-mouse smooth drag
        const deltaX = (e.clientX - dragStartCoordRef.current.x) / scale;
        const deltaY = (e.clientY - dragStartCoordRef.current.y) / scale;

        onTransformChange({
          ...startTransformRef.current,
          x: Math.round(startTransformRef.current.x + deltaX),
          y: Math.round(startTransformRef.current.y + deltaY),
        });
      } else if (pointerCount === 2) {
        // 2-finger pinch to zoom + pan
        const pts = Array.from<PointerCoord>(activePointersRef.current.values());
        const currentDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
        const distRatio = currentDist / pinchStartDistRef.current;

        const currentCenter: PointerCoord = {
          x: (pts[0].x + pts[1].x) / 2,
          y: (pts[0].y + pts[1].y) / 2,
        };

        const deltaX = (currentCenter.x - pinchStartCenterRef.current.x) / scale;
        const deltaY = (currentCenter.y - pinchStartCenterRef.current.y) / scale;

        const newScale = Math.min(
          5.0,
          Math.max(0.1, pinchStartTransformRef.current.scale * distRatio)
        );

        onTransformChange({
          ...pinchStartTransformRef.current,
          scale: Number(newScale.toFixed(3)),
          x: Math.round(pinchStartTransformRef.current.x + deltaX),
          y: Math.round(pinchStartTransformRef.current.y + deltaY),
        });
      }
    },
    [enabled, canvasScale, onTransformChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      activePointersRef.current.delete(e.pointerId);

      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Already released
      }

      if (activePointersRef.current.size === 0) {
        setIsDragging(false);
      } else if (activePointersRef.current.size === 1) {
        // Smooth transition if one finger was released while another is still down
        const remaining = Array.from<PointerCoord>(activePointersRef.current.values())[0];
        dragStartCoordRef.current = { x: remaining.x, y: remaining.y };
        startTransformRef.current = { ...transformRef.current };
      }
    },
    [canvasRef]
  );

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      if (!enabled) return;
      e.preventDefault();

      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const currentScale = transformRef.current.scale;
      const newScale = Math.min(5.0, Math.max(0.1, currentScale * zoomFactor));

      onTransformChange({
        ...transformRef.current,
        scale: Number(newScale.toFixed(3)),
      });
    },
    [enabled, onTransformChange]
  );

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
  };
}
