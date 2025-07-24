import * as THREE from 'three';
import Sizes from './size';
import Environment from './environment';
import Player from './player';
import Renderer from './render';
import {EventEmitter} from 'events';
import {cache} from '@/Game/utils/model';
import {disposeNode} from './utils/dispose';
import { GameScene } from './scene';
import Camera from './camera';
import Time from './time';

export default class Game extends EventEmitter {
    static instance: Game;
    canvas: HTMLElement | undefined;
    sizes!: Sizes;
    time!: Time;
    renderer!: Renderer;
    scene!: THREE.Scene;
    camera!: Camera;
    environment: Environment | undefined;
    player: Player | undefined;
    clock: THREE.Clock = new THREE.Clock();
    windowResizeFn!: (e: Event) => void;
    isPaused: boolean = false;
    constructor(canvas?: HTMLElement) {
        super();
        if (Game.instance) {
            return Game.instance;
        }
        Game.instance = this;
        this.canvas = canvas;
        // Size related
        this.sizes = new Sizes();
        // Listen for window changes
        this.sizes.on("resize", () => {
            this.resize();
        })
        this.time = new Time();
        // Update actions for each frame
        this.time.on("update", () => {
            this.update();
        })
        // Scene
        this.scene = new GameScene().scene;
        // Camera
        this.camera = new Camera();
        // Canvas
        this.renderer = new Renderer();
        // Environment
        this.environment = new Environment();
        this.player = new Player();
        this.resize();
        this.resource();
    }
    update() {
        if (this.isPaused) return;
        
        const delta = this.time.delta / 1000;
        this.renderer.update();
        this.player?.update && this.player.update(delta);
    }

    pause() {
        this.isPaused = true;
        this.emit('gamePaused', true);
    }

    resume() {
        this.isPaused = false;
        this.emit('gamePaused', false);
    }

    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    restart() {
        console.log('Game restart initiated');
        if (this.player) {
            this.player.restartGame();
        }
    }
    resource() {
        THREE.DefaultLoadingManager.onLoad = () => {
            this.emit('progress', {type: 'successLoad'});
        };

        THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.emit('progress', {type: 'onProgress', url: url, itemsLoaded: itemsLoaded, itemsTotal: itemsTotal});
        };

        THREE.DefaultLoadingManager.onError = () => {
            this.emit('progress', {type: 'error'});
        };
    }
    removelistener() {
        window.removeEventListener('resize', this.windowResizeFn);
    }
    resize() {
        this.renderer.resize();
        this.camera.resize();
    }
    disposeGame() {
        cache?.clearCacheData();
        this.removelistener();
        disposeNode(this.scene);
        this.scene.clear();
        this.renderer.dispose();
        // this.renderer = null;
    }
}
