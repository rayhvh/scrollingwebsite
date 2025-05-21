import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const MOVE_SPEED = 2;

const PlatformerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      resizeTo: window,
      background: '#000000',
      antialias: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    const playerSize = 40;
    const groundThickness = 10;
    const ladderWidth = 20;

    let topGroundY = app.screen.height * 0.4;
    let bottomGroundY = app.screen.height * 0.9;
    let ladderX = app.screen.width - ladderWidth * 2;

    const topGround = new PIXI.Graphics();
    const bottomGround = new PIXI.Graphics();
    const ladder = new PIXI.Graphics();

    const drawScene = () => {
      topGround.clear();
      topGround.beginFill(0x444444);
      topGround.drawRect(0, topGroundY, app.screen.width, groundThickness);
      topGround.endFill();

      bottomGround.clear();
      bottomGround.beginFill(0x444444);
      bottomGround.drawRect(0, bottomGroundY, app.screen.width, app.screen.height - bottomGroundY);
      bottomGround.endFill();

      ladder.clear();
      ladder.beginFill(0x888888);
      ladder.drawRect(ladderX, topGroundY, ladderWidth, bottomGroundY - topGroundY);
      ladder.endFill();
    };

    drawScene();

    app.stage.addChild(topGround);
    app.stage.addChild(bottomGround);
    app.stage.addChild(ladder);

    const player = new PIXI.Graphics();
    player.beginFill(0xff0000);
    player.drawRect(0, 0, playerSize, playerSize);
    player.endFill();
    player.x = 50;
    player.y = topGroundY - playerSize;
    app.stage.addChild(player);

    let mode: 'walking' | 'climbing' | 'idle' = 'walking';

    app.ticker.add(() => {
      if (mode === 'walking') {
        player.x += MOVE_SPEED;
        if (player.x + playerSize >= ladderX) {
          mode = 'climbing';
          player.x = ladderX;
        }
      } else if (mode === 'climbing') {
        player.y += MOVE_SPEED;
        if (player.y >= bottomGroundY - playerSize) {
          player.y = bottomGroundY - playerSize;
          mode = 'idle';
        }
      }
    });

    const resize = () => {
      topGroundY = app.screen.height * 0.4;
      bottomGroundY = app.screen.height * 0.9;
      ladderX = app.screen.width - ladderWidth * 2;
      drawScene();
      if (mode === 'walking') {
        player.y = topGroundY - playerSize;
      } else if (mode === 'climbing') {
        player.x = ladderX;
      } else if (mode === 'idle') {
        player.y = bottomGroundY - playerSize;
      }
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default PlatformerCanvas;
