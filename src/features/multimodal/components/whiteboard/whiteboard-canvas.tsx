'use client';

import * as React from 'react';
import { Pencil, Square, Circle as CircleIcon, Type, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import type {
  WhiteboardData,
  WhiteboardTool,
  WhiteboardElement,
} from '../../types/multimodal.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhiteboardCanvasProps {
  whiteboardData: WhiteboardData;
  activeTool: WhiteboardTool;
  currentColor: string;
  currentStrokeWidth: number;
  onSelectTool: (tool: WhiteboardTool) => void;
  onChangeColor: (color: string) => void;
  onAddElement: (element: WhiteboardElement) => void;
  onClearCanvas: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function WhiteboardCanvas({
  whiteboardData,
  activeTool,
  currentColor,
  currentStrokeWidth,
  onSelectTool,
  onChangeColor,
  onAddElement,
  onClearCanvas,
  onZoomIn,
  onZoomOut,
}: WhiteboardCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = React.useRef(false);
  const currentPointsRef = React.useRef<number[]>([]);

  // Render elements onto Canvas
  const redrawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(whiteboardData.zoom, whiteboardData.zoom);

    whiteboardData.elements.forEach((el) => {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.strokeWidth;
      ctx.fillStyle = el.color;

      if (el.type === 'pen' && el.points && el.points.length >= 4) {
        ctx.beginPath();
        ctx.moveTo(el.points[0], el.points[1]);
        for (let i = 2; i < el.points.length; i += 2) {
          ctx.lineTo(el.points[i], el.points[i + 1]);
        }
        ctx.stroke();
      } else if (el.type === 'rectangle' && el.x !== undefined && el.y !== undefined) {
        ctx.strokeRect(el.x, el.y, el.width || 100, el.height || 60);
      } else if (el.type === 'circle' && el.x !== undefined && el.y !== undefined) {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius || 40, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (el.type === 'text' && el.x !== undefined && el.y !== undefined && el.text) {
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(el.text, el.x, el.y);
      }
    });

    ctx.restore();
  }, [whiteboardData]);

  React.useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / whiteboardData.zoom;
    const y = (e.clientY - rect.top) / whiteboardData.zoom;

    if (activeTool === 'pen') {
      isDrawingRef.current = true;
      currentPointsRef.current = [x, y];
    } else if (activeTool === 'rectangle') {
      onAddElement({
        id: `rect-${Date.now()}`,
        type: 'rectangle',
        x,
        y,
        width: 120,
        height: 70,
        color: currentColor,
        strokeWidth: currentStrokeWidth,
      });
    } else if (activeTool === 'circle') {
      onAddElement({
        id: `circle-${Date.now()}`,
        type: 'circle',
        x,
        y,
        radius: 45,
        color: currentColor,
        strokeWidth: currentStrokeWidth,
      });
    } else if (activeTool === 'text') {
      const text = prompt('Enter Architecture Label:', 'Microservice Node');
      if (text) {
        onAddElement({
          id: `text-${Date.now()}`,
          type: 'text',
          x,
          y,
          text,
          color: currentColor,
          strokeWidth: currentStrokeWidth,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / whiteboardData.zoom;
    const y = (e.clientY - rect.top) / whiteboardData.zoom;

    currentPointsRef.current.push(x, y);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentStrokeWidth;
      const pts = currentPointsRef.current;
      if (pts.length >= 4) {
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 4], pts[pts.length - 3]);
        ctx.lineTo(pts[pts.length - 2], pts[pts.length - 1]);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      if (currentPointsRef.current.length >= 4) {
        onAddElement({
          id: `pen-${Date.now()}`,
          type: 'pen',
          points: [...currentPointsRef.current],
          color: currentColor,
          strokeWidth: currentStrokeWidth,
        });
      }
      currentPointsRef.current = [];
    }
  };

  return (
    <div
      id="whiteboard-canvas-container"
      className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#0f172a] shadow-xl"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-xs">
        <div className="flex items-center space-x-1.5">
          {[
            { id: 'pen', icon: Pencil, label: 'Pen' },
            { id: 'rectangle', icon: Square, label: 'Rect' },
            { id: 'circle', icon: CircleIcon, label: 'Circle' },
            { id: 'text', icon: Type, label: 'Text' },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id as WhiteboardTool)}
                className={cn(
                  'flex items-center space-x-1 rounded-lg px-2.5 py-1 font-semibold transition-all',
                  activeTool === tool.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Color Palette & Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChangeColor(color)}
                className={cn(
                  'h-5 w-5 rounded-full border transition-all',
                  currentColor === color
                    ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900'
                    : 'opacity-70'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              type="button"
              onClick={onZoomOut}
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="font-mono text-[10px] text-slate-400">
              {Math.round(whiteboardData.zoom * 100)}%
            </span>
            <Button
              type="button"
              onClick={onZoomIn}
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              onClick={onClearCanvas}
              variant="outline"
              size="sm"
              className="h-7 p-2 text-rose-400 hover:bg-rose-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 cursor-crosshair overflow-hidden bg-slate-950">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
