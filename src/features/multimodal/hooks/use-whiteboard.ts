'use client';

import * as React from 'react';
import type { WhiteboardData, WhiteboardElement, WhiteboardTool } from '../types/multimodal.types';

export function useWhiteboard() {
  const [whiteboardData, setWhiteboardData] = React.useState<WhiteboardData>({
    elements: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    backgroundColor: '#0f172a',
  });

  const [activeTool, setActiveTool] = React.useState<WhiteboardTool>('pen');
  const [currentColor, setCurrentColor] = React.useState('#a855f7'); // purple
  const [currentStrokeWidth, setCurrentStrokeWidth] = React.useState(3);

  const addElement = React.useCallback((element: WhiteboardElement) => {
    setWhiteboardData((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
  }, []);

  const updateElement = React.useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    setWhiteboardData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }));
  }, []);

  const clearCanvas = React.useCallback(() => {
    setWhiteboardData((prev) => ({
      ...prev,
      elements: [],
    }));
  }, []);

  const zoomIn = React.useCallback(() => {
    setWhiteboardData((prev) => ({
      ...prev,
      zoom: Math.min(2.5, Number((prev.zoom + 0.1).toFixed(1))),
    }));
  }, []);

  const zoomOut = React.useCallback(() => {
    setWhiteboardData((prev) => ({
      ...prev,
      zoom: Math.max(0.5, Number((prev.zoom - 0.1).toFixed(1))),
    }));
  }, []);

  return {
    whiteboardData,
    activeTool,
    setActiveTool,
    currentColor,
    setCurrentColor,
    currentStrokeWidth,
    setCurrentStrokeWidth,
    addElement,
    updateElement,
    clearCanvas,
    zoomIn,
    zoomOut,
  };
}
