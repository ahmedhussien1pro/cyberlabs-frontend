import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ParticlesBackgroundProps } from '../../../shared/components/common/landing/types';

export function ParticlesBackground({
  opacity = 0.5,
  particleColor = '#0d6efd',
  lineColor = '#0d6efd',
  particleCount = 90,
  className,
}: ParticlesBackgroundProps = {}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
    script.async = true;

    script.onload = () => {
      if (window.particlesJS && canvasRef.current) {
        window.particlesJS('particles-js', {
          particles: {
            number: {
              value: particleCount,
              density: { enable: true, value_area: 500 },
            },
            color: { value: particleColor },
            shape: {
              type: 'circle',
              stroke: { width: 0, color: particleColor },
              polygon: { nb_sides: 5 },
            },
            opacity: {
              value: opacity,
              random: false,
              anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
            },
            size: {
              value: 5,
              random: true,
              anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: lineColor,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 6,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              attract: { enable: false, rotateX: 600, rotateY: 1200 },
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: { distance: 200 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 },
            },
          },
          retina_detect: true,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Clear particles
      const canvas = document.querySelector('#particles-js canvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, [opacity, particleColor, lineColor, particleCount]);

  return (
    <div
      id='particles-js'
      ref={canvasRef}
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-auto',
        className,
      )}
    />
  );
}

// Type declaration for particles.js
declare global {
  interface Window {
    particlesJS: (id: string, config: any) => void;
  }
}
