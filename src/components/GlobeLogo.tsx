import { useRef, useEffect } from "react";
import ReactCobe from "cobe";

export function GlobeLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof ReactCobe> | null>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    globeRef.current = ReactCobe(canvas, {
      devicePixelRatio: 2,
      width: 128,
      height: 128,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 8000,
      mapBrightness: 4,
      baseColor: [0.25, 0.25, 0.28],
      markerColor: [0.4, 0.4, 1],
      glowColor: [0.35, 0.35, 0.4],
      offset: [0, 0],
      markers: [],
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.005;
      },
    });

    return () => {
      globeRef.current?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      className="h-10 w-10"
      aria-label="Animated globe"
    />
  );
}
