import { useRef, useEffect } from "react";
import createGlobe from "cobe";

const markers = [
  { location: [37.78, -122.44], size: 0.03 },
  { location: [40.71, -74.01], size: 0.03 },
  { location: [35.68, 139.65], size: 0.03 },
  { location: [51.51, -0.13], size: 0.03 },
  { location: [-33.87, 151.21], size: 0.03 },
  { location: [25.2, 55.27], size: 0.03 },
  { location: [-23.55, -46.63], size: 0.03 },
  { location: [48.86, 2.35], size: 0.03 },
];

const arcs = [
  { from: [37.78, -122.44], to: [35.68, 139.65] },
  { from: [40.71, -74.01], to: [51.51, -0.13] },
];

export function GlobeLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    globeRef.current = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 256,
      height: 256,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.2, 0.4, 1],
      glowColor: [1, 1, 1],
      markers,
      arcColor: [0.3, 0.5, 1],
      arcWidth: 0.5,
      arcHeight: 0.3,
      arcs,
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
      width={256}
      height={256}
      className="h-10 w-10"
      aria-label="Animated globe"
    />
  );
}
