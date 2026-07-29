'use client';

import * as React from 'react';

type KeyCombo = string; // e.g. 'mod+k', 'mod+i', 'escape'

export function useKeybindings(keyMap: Record<KeyCombo, () => void>) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      for (const [combo, handler] of Object.entries(keyMap)) {
        const parts = combo.toLowerCase().split('+');
        const requiresMod =
          parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd');
        const targetKey = parts[parts.length - 1];

        if (requiresMod && !isMod) continue;
        if (key === targetKey) {
          event.preventDefault();
          handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap]);
}
