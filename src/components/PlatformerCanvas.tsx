import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const MOVE_SPEED = 4;
const HEIGHT_MULTIPLIER = 2.4;
const FLAG_WIDTH = 10;
const FLAG_HEIGHT = 60;

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

    const NUM_LADDERS = 5;
    const NUM_GROUNDS = NUM_LADDERS + 1;
    const groundYs: number[] = [];
    const ladderXs: number[] = [];
    const ladderDirs: ('right' | 'left')[] = [
      'right',
      'left',
      'right',
      'left',
      'right',
    ];

    const grounds: PIXI.Graphics[] = [];
    const ladders: PIXI.Graphics[] = [];
    const flag = new PIXI.Graphics();
    let flagX = 40;

    const computeLayout = () => {
      const h = window.innerHeight;
      groundYs.length = 0;
      const groundPositions = [0.4, 0.9, 1.3, 1.7, 2.1, 2.4];
      for (let i = 0; i < NUM_GROUNDS; i++) {
        groundYs.push(h * groundPositions[i]);
      }

      // Stagger ladder positions so each one is offset from the previous
      // while still alternating sides based on ladderDirs.
      ladderXs[0] = app.screen.width * 0.85 - ladderWidth;
      ladderXs[1] = app.screen.width * 0.15;
      ladderXs[2] = app.screen.width * 0.75 - ladderWidth;
      ladderXs[3] = app.screen.width * 0.25;
      ladderXs[4] = app.screen.width * 0.65 - ladderWidth;
    };

    computeLayout();

    for (let i = 0; i < NUM_GROUNDS; i++) {
      grounds[i] = new PIXI.Graphics();
      app.stage.addChild(grounds[i]);
      if (i < NUM_LADDERS) {
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

        let startX = 0;
        let endX = app.screen.width;
        if (i < NUM_LADDERS) {
          if (ladderDirs[i] === 'right') {
            endX = ladderXs[i] + ladderWidth;
          } else {
            startX = ladderXs[i];
          }
        }

        g.drawRect(startX, groundYs[i], endX - startX, groundThickness);
        g.endFill();
      }

      for (let i = 0; i < ladders.length; i++) {
        const l = ladders[i];
        l.clear();
        l.beginFill(0x888888);
        l.drawRect(ladderXs[i], groundYs[i], ladderWidth, groundYs[i + 1] - groundYs[i]);
        l.endFill();
      }

      flag.clear();
      flag.beginFill(0xffffff);
      flag.drawRect(0, -FLAG_HEIGHT, FLAG_WIDTH, FLAG_HEIGHT);
      flag.beginFill(0xffdd00);
      flag.drawRect(FLAG_WIDTH, -FLAG_HEIGHT, FLAG_WIDTH * 2, FLAG_WIDTH);
      flag.endFill();
      flag.x = flagX;
      flag.y = groundYs[groundYs.length - 1];
    };

    drawScene();
    app.stage.addChild(flag);

    const player = new PIXI.Graphics();
    player.beginFill(0xff0000);
    player.drawRect(0, 0, playerSize, playerSize);
    player.endFill();
    player.x = 50;
    player.y = groundYs[0] - playerSize;
    app.stage.addChild(player);

    type Mode = 'walking' | 'climbing' | 'celebrating';
    let mode: Mode = 'walking';
    let direction: 'right' | 'left' = 'right';
    let currentLadder: number | null = null;
    let currentGround = 0;
    let jumpCounter = 0;

    app.ticker.add(() => {
      if (mode === 'walking') {
        if (
          currentGround === groundYs.length - 1 &&
          direction === 'left' &&
          player.x <= flagX + FLAG_WIDTH * 3
        ) {
          player.x = flagX + FLAG_WIDTH * 3;
          mode = 'celebrating';
          jumpCounter = 0;
        } else if (direction === 'right') {
          player.x += MOVE_SPEED;
          if (
            currentGround < NUM_LADDERS &&
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
            currentGround < NUM_LADDERS &&
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
            direction =
              ladderDirs[currentLadder!] === 'right' ? 'left' : 'right';
            currentLadder = null;
          }
        } else {
          player.y -= MOVE_SPEED;
          if (player.y <= endY - playerSize) {
            player.y = endY - playerSize;
            mode = 'walking';
            currentGround += 1;
            direction =
              ladderDirs[currentLadder!] === 'right' ? 'left' : 'right';
            currentLadder = null;
          }
        }
      } else if (mode === 'celebrating') {
        jumpCounter += 0.1;
        player.y =
          groundYs[currentGround] -
          playerSize -
          Math.abs(Math.sin(jumpCounter)) * 20;
      }
    });

    const resize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight * HEIGHT_MULTIPLIER);
      drawScene();
      if (mode === 'walking') {
        player.y = groundYs[currentGround] - playerSize;
      } else if (mode === 'climbing' && currentLadder !== null) {
        player.x = ladderXs[currentLadder];
      } else if (mode === 'celebrating') {
        player.x = flagX + FLAG_WIDTH * 3;
        player.y =
          groundYs[currentGround] - playerSize - Math.abs(Math.sin(jumpCounter)) * 20;
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
