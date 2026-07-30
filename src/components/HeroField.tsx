'use client';

import {useEffect, useRef} from 'react';
import {useReducedMotion} from '@/components/motion/useReducedMotion';

/**
 * The hero's background: a drifting field of nodes that draw lines to each
 * other, and lean toward the pointer as it passes.
 *
 * It is a network, which is what the Assembly is — fifty associations reaching
 * one another through a centre. The gate band already says that with a static
 * dot grid; this is the same idea where the page opens, and the one place on
 * the site that answers the reader directly.
 *
 * Everything is drawn from the element's own `color`, so it follows the theme
 * without being told about it: `text-brand` on the canvas is the whole palette.
 *
 * It costs nothing when it is not being looked at. The loop runs only while the
 * hero is on screen and the tab is visible, stops entirely for reduced motion
 * after one static frame, and never intercepts a click — the canvas is
 * `pointer-events-none` and the pointer is read from the window.
 */

/** One node per this many square pixels, up to MAX_NODES. */
const AREA_PER_NODE = 15000;
const MAX_NODES = 90;
/** Nodes closer than this are joined; the line fades out toward the limit. */
const LINK_DISTANCE = 130;
/** How far the pointer reaches, and how hard it pulls at the centre of that. */
const POINTER_RADIUS = 190;
const POINTER_PULL = 0.35;
const DRIFT = 0.16;

type Node = {x: number; y: number; vx: number; vy: number};

export default function HeroField({className = ''}: {className?: string}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;

    // The pointer lives in a ref-like local rather than state: it changes on
    // every mouse move, and re-rendering the tree for that would be absurd.
    const pointer = {x: -1, y: -1, active: false};

    /** Read once per resize and per theme change, not per frame. */
    let ink = 'rgb(79, 70, 229)';
    const readInk = () => {
      ink = getComputedStyle(canvas).color;
    };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      // Cap the backing store at 2× — beyond that the cost is real and the
      // difference on a field of soft dots is not.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(MAX_NODES, Math.round((width * height) / AREA_PER_NODE));
      nodes = Array.from({length: Math.max(target, 0)}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT,
        vy: (Math.random() - 0.5) * DRIFT,
      }));
      readInk();
    }

    /** `rgb(a, b, c)` / `rgb(a b c)` from getComputedStyle, plus an alpha. */
    function withAlpha(colour: string, alpha: number) {
      const parts = colour.match(/[\d.]+/g);
      if (!parts || parts.length < 3) return colour;
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const node of nodes) {
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = withAlpha(ink, 0.55);
        ctx!.fill();
      }

      // Pairs, once each. At this node count the quadratic is a few thousand
      // comparisons a frame, which is cheaper than any structure to avoid it.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;
          ctx!.beginPath();
          ctx!.moveTo(nodes[i].x, nodes[i].y);
          ctx!.lineTo(nodes[j].x, nodes[j].y);
          ctx!.strokeStyle = withAlpha(ink, 0.22 * (1 - distance / LINK_DISTANCE));
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }

      // The pointer joins the field as a node of its own, brighter than the
      // rest, so the reader can see that it answers them.
      if (pointer.active) {
        for (const node of nodes) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance > POINTER_RADIUS) continue;
          ctx!.beginPath();
          ctx!.moveTo(pointer.x, pointer.y);
          ctx!.lineTo(node.x, node.y);
          ctx!.strokeStyle = withAlpha(ink, 0.5 * (1 - distance / POINTER_RADIUS));
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }
    }

    function step() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap rather than bounce: a bounce collects nodes along the edges.
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;

        if (!pointer.active) continue;
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const distance = Math.hypot(dx, dy);
        if (distance > POINTER_RADIUS || distance < 1) continue;
        // Eased by distance, so the field bends toward the cursor rather than
        // snapping to it.
        const pull = (1 - distance / POINTER_RADIUS) * POINTER_PULL;
        node.x += (dx / distance) * pull;
        node.y += (dy / distance) * pull;
      }

      draw();
      frame = requestAnimationFrame(step);
    }

    function start() {
      if (running || reducedMotion) return;
      running = true;
      frame = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // A coarse pointer has no hover to speak of; leave the field drifting.
      pointer.active =
        event.pointerType === 'mouse' && x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    resize();
    draw();

    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, {passive: true});
    document.addEventListener('pointerleave', onPointerLeave);

    // Follows the theme: ThemeToggle writes a class on <html>, and the canvas's
    // own `color` resolves differently after it.
    const themeWatcher = new MutationObserver(() => {
      readInk();
      draw();
    });
    themeWatcher.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});

    // Off screen or in a background tab, the loop is pure waste.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      {threshold: 0},
    );
    visibility.observe(canvas);

    const onVisibilityChange = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      themeWatcher.disconnect();
      visibility.disconnect();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // `text-brand` is the palette: everything is drawn from this colour.
      className={`pointer-events-none absolute inset-0 h-full w-full text-brand ${className}`}
    />
  );
}
