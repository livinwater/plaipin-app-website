import { useEffect } from 'react';
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function BuddyModel() {
  useEffect(() => {
    const modelViewer = document.querySelector('model-viewer');
    if (modelViewer) {
      (modelViewer as any).autoRotate = true;
    }
  }, []);

  return (
    <model-viewer
      src="/models/pinkrabbit_2.glb"
      alt="Buddy - Your AI Companion"
      auto-rotate
      rotation-per-second="30deg"
      camera-controls
      data-testid="canvas-buddy-model"
      style={{
        width: '256px',
        height: '256px',
      }}
    />
  );
}
