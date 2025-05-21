import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const MOVE_SPEED = 2;
const HEIGHT_MULTIPLIER = 2.4;

const PlatformerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight * HEIGHT_MULTIPLIER,
      background: '#000000',
      antialias: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    const playerSize = 40;
    const groundThickness = 10;
    const ladderWidth = 20;

    const groundYs: number[] = [];
    const ladderXs: number[] = [];
    const ladderDirs: ('right' | 'left')[] = ['right', 'left', 'right'];

    const grounds: PIXI.Graphics[] = [];
    const ladders: PIXI.Graphics[] = [];

    const computeLayout = () => {
      const h = window.innerHeight;
      groundYs.length = 0;
      for (let i = 0; i < 4; i++) {
        groundYs.push(h * (0.4 + i * 0.5));
      }

      ladderXs[0] = app.screen.width - ladderWidth * 2;
      ladderXs[1] = app.screen.width / 3;
      ladderXs[2] = app.screen.width - ladderWidth * 2;
    };

    computeLayout();

    for (let i = 0; i < 4; i++) {
      grounds[i] = new PIXI.Graphics();
      app.stage.addChild(grounds[i]);
      if (i < 3) {
        ladders[i] = new PIXI.Graphics();
        app.stage.addChild(ladders[i]);
      }
    }

    const drawScene = () => {
      computeLayout();
      for (let i = 0; i < grounds.length; i++) {
        const g = grounds[i];
        g.clear();
        g.beginFill(0x444444);
        g.drawRect(0, groundYs[i], app.screen.width, groundThickness);
        g.endFill();
      }

      for (let i = 0; i < ladders.length; i++) {
        const l = ladders[i];
        l.clear();
        l.beginFill(0x888888);
        l.drawRect(ladderXs[i], groundYs[i], ladderWidth, groundYs[i + 1] - groundYs[i]);
        l.endFill();
      }
    };

    drawScene();

    const player = new PIXI.Graphics();
    player.beginFill(0xff0000);
    player.drawRect(0, 0, playerSize, playerSize);
    player.endFill();
    player.x = 50;
    player.y = groundYs[0] - playerSize;
    app.stage.addChild(player);

    type Mode = 'walking' | 'climbing';
    let mode: Mode = 'walking';
    let direction: 'right' | 'left' = 'right';
    let currentLadder: number | null = null;
    let currentGround = 0;

    app.ticker.add(() => {
      if (mode === 'walking') {
        if (direction === 'right') {
          player.x += MOVE_SPEED;
          if (
            ladderDirs[currentGround] === 'right' &&
            player.x + playerSize >= ladderXs[currentGround]
          ) {
            mode = 'climbing';
            currentLadder = currentGround;
            player.x = ladderXs[currentGround];
          }
        } else {
          player.x -= MOVE_SPEED;
          if (
            ladderDirs[currentGround] === 'left' &&
            player.x <= ladderXs[currentGround]
          ) {
            mode = 'climbing';
            currentLadder = currentGround;
            player.x = ladderXs[currentGround];
          }
        }
      } else if (mode === 'climbing') {
        const startY = groundYs[currentLadder!];
        const endY = groundYs[currentLadder! + 1];
        if (endY > startY) {
          player.y += MOVE_SPEED;
          if (player.y >= endY - playerSize) {
            player.y = endY - playerSize;
            mode = 'walking';
            currentGround += 1;
            direction = ladderDirs[currentLadder!] === 'right' ? 'left' : 'right';
            currentLadder = null;
          }
        } else {
          player.y -= MOVE_SPEED;
          if (player.y <= endY - playerSize) {
            player.y = endY - playerSize;
            mode = 'walking';
            currentGround += 1;
            direction = ladderDirs[currentLadder!] === 'right' ? 'left' : 'right';
            currentLadder = null;
          }
        }
      }
    });

    const resize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight * HEIGHT_MULTIPLIER);
      drawScene();
      if (mode === 'walking') {
        player.y = groundYs[currentGround] - playerSize;
      } else if (mode === 'climbing' && currentLadder !== null) {
        player.x = ladderXs[currentLadder];
      }
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${HEIGHT_MULTIPLIER * 100}vh` }}
    />
  );
};

export default PlatformerCanvas;
