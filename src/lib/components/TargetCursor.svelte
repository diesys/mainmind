<script lang="ts">
import { gsap } from 'gsap';

type Props = {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
};

let {
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = 'var(--color-text)',
  cursorColorOnTarget = 'var(--color-text)'
}: Props = $props();

let cursor: HTMLDivElement;
let dot: HTMLDivElement;

const isMobile = (() => {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const small = window.innerWidth <= 768;
  const ua = navigator.userAgent || navigator.vendor || '';
  const re = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return (hasTouch && small) || re.test(ua.toLowerCase());
})();

let dotColor = $state(cursorColor);
let cornerColor = $state(cursorColor);

$effect(() => {
  if (isMobile || !cursor) return;

  const corners = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');
  const constants = { borderWidth: 3, cornerSize: 12 };

  let activeTarget: Element | null = null;
  let currentLeaveHandler: (() => void) | null = null;
  let resumeTimeout: ReturnType<typeof setTimeout> | null = null;
  let targetCornerPositions: { x: number; y: number }[] | null = null;
  const activeStrength = { current: 0 };
  let tickerFn: (() => void) | null = null;
  let spinTl: gsap.core.Timeline;

  const originalCursor = document.body.style.cursor;
  if (hideDefaultCursor) document.body.style.cursor = 'none';

  const cleanupTarget = (target: Element) => {
    if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
    currentLeaveHandler = null;
  };

  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  const createSpin = () => {
    spinTl?.kill();
    spinTl = gsap.timeline({ repeat: -1 }).to(cursor, {
      rotation: '+=360',
      duration: spinDuration,
      ease: 'none'
    });
  };
  createSpin();

  tickerFn = () => {
    const positions = targetCornerPositions;
    if (!positions || !cursor) return;
    const strength = activeStrength.current;
    if (strength === 0) return;
    const cx = gsap.getProperty(cursor, 'x') as number;
    const cy = gsap.getProperty(cursor, 'y') as number;
    Array.from(corners).forEach((corner, i) => {
      const curX = gsap.getProperty(corner, 'x') as number;
      const curY = gsap.getProperty(corner, 'y') as number;
      const tx = positions[i].x - cx;
      const ty = positions[i].y - cy;
      const finalX = curX + (tx - curX) * strength;
      const finalY = curY + (ty - curY) * strength;
      const dur = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
      gsap.to(corner, {
        x: finalX,
        y: finalY,
        duration: dur,
        ease: dur === 0 ? 'none' : 'power1.out',
        overwrite: 'auto'
      });
    });
  };

  const moveHandler = (e: MouseEvent) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power3.out'
    });
  };
  window.addEventListener('mousemove', moveHandler);

  const scrollHandler = () => {
    if (!activeTarget || !cursor) return;
    const mx = gsap.getProperty(cursor, 'x') as number;
    const my = gsap.getProperty(cursor, 'y') as number;
    const under = document.elementFromPoint(mx, my);
    const still =
      under && (under === activeTarget || under.closest(targetSelector) === activeTarget);
    if (!still) currentLeaveHandler?.();
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  const mouseDown = () => {
    if (!dot) return;
    gsap.to(dot, { scale: 0.7, duration: 0.3 });
    gsap.to(cursor, { scale: 0.9, duration: 0.2 });
  };
  const mouseUp = () => {
    if (!dot) return;
    gsap.to(dot, { scale: 1, duration: 0.3 });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  };
  window.addEventListener('mousedown', mouseDown);
  window.addEventListener('mouseup', mouseUp);

  const enterHandler = (ev: MouseEvent) => {
    const direct = ev.target as Element;
    let target: Element | null = null;
    let cur: Element | null = direct;
    while (cur && cur !== document.body) {
      if (cur.matches(targetSelector)) {
        target = cur;
        break;
      }
      cur = cur.parentElement;
    }
    if (!target || !cursor) return;
    const lockedTarget = target;
    if (activeTarget === target) return;
    if (activeTarget) cleanupTarget(activeTarget);
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }
    activeTarget = target;

    const targetColor = (target as HTMLElement).style.backgroundColor;
    dotColor =
      targetColor && targetColor !== 'rgba(0, 0, 0, 0)' && targetColor !== 'transparent'
        ? targetColor
        : (cursorColorOnTarget ?? cursorColor);
    cornerColor = cursorColorOnTarget ?? cursorColor;

    Array.from(corners).forEach((c) => {
      gsap.killTweensOf(c);
    });
    gsap.killTweensOf(cursor, 'rotation');
    spinTl?.pause();
    gsap.set(cursor, { rotation: 0 });

    const rect = target.getBoundingClientRect();
    const { borderWidth, cornerSize } = constants;
    const cx = gsap.getProperty(cursor, 'x') as number;
    const cy = gsap.getProperty(cursor, 'y') as number;

    targetCornerPositions = [
      { x: rect.left - borderWidth, y: rect.top - borderWidth },
      { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
      {
        x: rect.right + borderWidth - cornerSize,
        y: rect.bottom + borderWidth - cornerSize
      },
      {
        x: rect.left - borderWidth,
        y: rect.bottom + borderWidth - cornerSize
      }
    ];

    const positions = targetCornerPositions;
    if (!positions || !tickerFn) return;

    gsap.ticker.add(tickerFn);
    gsap.to(activeStrength, {
      current: 1,
      duration: hoverDuration,
      ease: 'power2.out'
    });

    Array.from(corners).forEach((corner, i) => {
      gsap.to(corner, {
        x: positions[i].x - cx,
        y: positions[i].y - cy,
        duration: 0.2,
        ease: 'power2.out'
      });
    });

    const leaveHandler = () => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
      targetCornerPositions = null;
      gsap.set(activeStrength, { current: 0, overwrite: true });
      activeTarget = null;
      dotColor = cursorColor;
      cornerColor = cursorColor;
      const cs = Array.from(corners);
      gsap.killTweensOf(cs);
      const { cornerSize } = constants;
      const positions = [
        { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: cornerSize * 0.5 },
        { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
      ];
      const tl = gsap.timeline();
      cs.forEach((c, i) => {
        tl.to(
          c,
          {
            x: positions[i].x,
            y: positions[i].y,
            duration: 0.3,
            ease: 'power3.out'
          },
          0
        );
      });

      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursor && spinTl) {
          const r = gsap.getProperty(cursor, 'rotation') as number;
          const norm = r % 360;
          spinTl.kill();
          spinTl = gsap.timeline({ repeat: -1 }).to(cursor, {
            rotation: '+=360',
            duration: spinDuration,
            ease: 'none'
          });
          gsap.to(cursor, {
            rotation: norm + 360,
            duration: spinDuration * (1 - norm / 360),
            ease: 'none',
            onComplete: () => spinTl?.restart()
          });
        }
        resumeTimeout = null;
      }, 50);
      cleanupTarget(lockedTarget);
    };
    currentLeaveHandler = leaveHandler;
    lockedTarget.addEventListener('mouseleave', leaveHandler);
  };

  window.addEventListener('mouseover', enterHandler as EventListener);

  return () => {
    if (tickerFn) gsap.ticker.remove(tickerFn);
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseover', enterHandler as EventListener);
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('mousedown', mouseDown);
    window.removeEventListener('mouseup', mouseUp);
    if (activeTarget) cleanupTarget(activeTarget);
    spinTl?.kill();
    document.body.style.cursor = originalCursor;
  };
});
</script>

{#if !isMobile}
  <div bind:this={cursor} class="cursor" style="will-change: transform;">
    <div
      bind:this={dot}
      class="cursor-dot"
      style="background: {dotColor}; will-change: transform;"
    ></div>
    <div
      class="target-cursor-corner corner-tl"
      style="border-color: {cornerColor}; will-change: transform;"
    ></div>
    <div
      class="target-cursor-corner corner-tr"
      style="border-color: {cornerColor}; will-change: transform;"
    ></div>
    <div
      class="target-cursor-corner corner-br"
      style="border-color: {cornerColor}; will-change: transform;"
    ></div>
    <div
      class="target-cursor-corner corner-bl"
      style="border-color: {cornerColor}; will-change: transform;"
    ></div>
  </div>
{/if}

<style>
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .cursor-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    border-radius: 9999px;
    transform: translate(-50%, -50%);
  }

  .target-cursor-corner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    border: 3px solid;
    box-sizing: border-box;
  }

  .corner-tl {
    border-right: 0;
    border-bottom: 0;
    transform: translate(-150%, -150%);
  }

  .corner-tr {
    border-left: 0;
    border-bottom: 0;
    transform: translate(50%, -150%);
  }

  .corner-br {
    border-left: 0;
    border-top: 0;
    transform: translate(50%, 50%);
  }

  .corner-bl {
    border-right: 0;
    border-top: 0;
    transform: translate(-150%, 50%);
  }
</style>
