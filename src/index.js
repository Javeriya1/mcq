import Phaser from "phaser";

import PlayScene from './scenes/Play';

const WIDTH = 540;
const HEIGHT = 700;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT
};

const Scenes = [ PlayScene ];
const createScene = Scene => new Scene(SHARED_CONFIG);

const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
