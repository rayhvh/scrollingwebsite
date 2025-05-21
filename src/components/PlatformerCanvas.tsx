import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const WIDTH = 400;
const HEIGHT = 200;
const GROUND_Y = 180;
const MOVE_SPEED = 2;


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

    app.ticker.add(() => {
      player.x += MOVE_SPEED;
      if (player.x > WIDTH) {
        player.x = -20; // loop when exiting the screen
      }
    });
    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef} className="platformer-canvas"></div>;
};

export default PlatformerCanvas;
