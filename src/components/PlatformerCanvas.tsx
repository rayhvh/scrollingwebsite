import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const WIDTH = 400;
const HEIGHT = 200;
const GROUND_Y = 180;
const GRAVITY = 0.5;
const MOVE_SPEED = 2;
const JUMP_SPEED = -10;

const PlatformerCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      background: '#000000',
    });

    if (containerRef.current) {
      containerRef.current.appendChild(app.view as HTMLCanvasElement);
    }

    const ground = new PIXI.Graphics();
    ground.beginFill(0x444444);
    ground.drawRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
    ground.endFill();
    app.stage.addChild(ground);

    const player = new PIXI.Graphics();
    player.beginFill(0xff0000);
    player.drawRect(0, 0, 20, 20);
    player.endFill();
    player.x = 50;
    player.y = GROUND_Y - 20;
    app.stage.addChild(player);

    let vy = 0;
    const keys: Record<string, boolean> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    app.ticker.add(() => {
      if (keys['ArrowLeft']) player.x -= MOVE_SPEED;
      if (keys['ArrowRight']) player.x += MOVE_SPEED;
      if (keys['Space'] && player.y >= GROUND_Y - 20) {
        vy = JUMP_SPEED;
      }

      vy += GRAVITY;
      player.y += vy;
      if (player.y >= GROUND_Y - 20) {
        player.y = GROUND_Y - 20;
        vy = 0;
      }
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef} className="platformer-canvas"></div>;
};

export default PlatformerCanvas;
