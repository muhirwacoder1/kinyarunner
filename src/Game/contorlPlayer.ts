import Game from '.';
import {GAME_STATUS, Obstacal, playerStatus} from './const';
import Environment, {roadLength, roadWidth} from './environment';
// import {SceneOctree} from './octree';
import * as THREE from 'three';
import {EventEmitter} from 'events';
import Player from './player';
// @ts-ignore
import showToast from '../components/Toast/index.js';
enum Side {
    FRONT,
    BACK,
    LEFT,
    RIGHT,
    DOWN,
    FRONTDOWN,
    UP
}
export class ControlPlayer extends EventEmitter {
    model: THREE.Group;
    mixer: THREE.AnimationMixer;
    status!: string;
    renderer!: THREE.WebGLRenderer;
    score: number = 0;
    coin: number = 0;
    allAnimate: Record<string, THREE.AnimationAction>;
    // velocity = new THREE.Vector3(0, 0, 0);
    runVelocity: number;
    jumpHight: number;
    targetPosition!: number;
    // Current track
    way!: number;
    lastPosition!: number;
    // sceneOctree!: SceneOctree;
    isJumping: boolean = false;
    capsule!: THREE.Mesh<THREE.CapsuleGeometry, THREE.MeshNormalMaterial>;
    game: Game;
    player: Player;
    scene: THREE.Scene = new THREE.Scene();
    smallMistake!: number;
    far: number;
    key!: string;
    // Original track
    originLocation!: THREE.Vector3;
    // Store single left-right collision
    removeHandle: boolean = true;
    lastAnimation!: string;
    // Whether executing rolling action
    roll!: boolean;
    // Whether executing look back action
    runlookback!: boolean;
    // Player running distance
    playerRunDistance!: number;
    environement: Environment = new Environment();
    // Current floor block
    currentPlane: number = -1;
    // Whether to add floor
    isAddPlane: boolean = false;
    fallingSpeed: number = 0; // Falling speed
    downCollide: boolean = false; // Whether character is grounded

    gameStatus: GAME_STATUS = GAME_STATUS.READY; // Game status
    gameStart: boolean = false;
    raycasterDown: THREE.Raycaster;
    raycasterFrontDown: THREE.Raycaster;
    raycasterFront: THREE.Raycaster;
    raycasterRight: THREE.Raycaster;
    raycasterLeft: THREE.Raycaster;
    frontCollide: boolean;
    firstFrontCollide: Record<string, any> = {isCollide: true, collideInfo: null};
    frontCollideInfo: any;
    leftCollide: boolean;
    rightCollide: boolean;
    upCollide: boolean;
    constructor(
        model: THREE.Group,
        mixer: THREE.AnimationMixer,
        currentAction: string = 'run',
        allAnimate: Record<string, THREE.AnimationAction>
    ) {
        super();
        this.model = model;
        this.mixer = mixer;
        this.game = new Game();
        this.player = new Player();
        this.scene = this.game.scene;
        this.allAnimate = allAnimate;
        // Running speed
        this.runVelocity = 20;
        // Jump height
        this.jumpHight = 3.3;
        this.gameStart = false;
        this.far = 2.5; // Character height
        this.raycasterDown = new THREE.Raycaster();
        this.raycasterFrontDown = new THREE.Raycaster();
        this.raycasterFront = new THREE.Raycaster();
        this.raycasterRight = new THREE.Raycaster();
        this.raycasterLeft = new THREE.Raycaster();
        this.frontCollide = false;
        this.leftCollide = false;
        this.rightCollide = false;
        this.downCollide = true;
        this.upCollide = false;
        this.isJumping = false;
        this.startGame(currentAction, model);
        this.addAnimationListener();
        this.initRaycaster();
    }
    // Start game initialization
    startGame(currentAction: string, model: THREE.Group) {
        this.status = currentAction;
        this.allAnimate[currentAction].play();
        this.lastAnimation = currentAction;
        // Current road
        this.way = 2;
        // Whether rolling
        this.roll = false;
        // Whether looking back
        this.runlookback = false;
        this.playerRunDistance = model.position.z;
        this.smallMistake = 0;
        this.key = '';
        this.originLocation = model.position;
        this.lastPosition = model.position.x;
        this.targetPosition = 0;
    }

    initRaycaster() {
        // Create initial direction, pointing to Z-axis
        const initialDirection = new THREE.Vector3(0, -1, 0);
        // Use Quaternion for rotation, create 30-degree rotation
        const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 6); // 30 degrees in radians
        // Rotate initial direction by about 30 degrees
        const direction = initialDirection.clone().applyQuaternion(rotation).normalize();
        this.raycasterFrontDown.ray.direction = new THREE.Vector3(0, 1, 0);
        // Diagonal downward ray
        this.raycasterDown.ray.direction = new THREE.Vector3(0, -1, 0);
        this.raycasterFrontDown.ray.direction = direction;
        this.raycasterLeft.ray.direction = new THREE.Vector3(-1, 0, 0);
        this.raycasterRight.ray.direction = new THREE.Vector3(1, 0, 0);

        this.raycasterDown.far = 5.8;
        this.raycasterFrontDown.far = 3;
    }
    // Touch/swipe properties for mobile controls
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchEndX: number = 0;
    private touchEndY: number = 0;
    private minSwipeDistance: number = 50;

    // @ts-ignore
    addAnimationListener() {
        // Keyboard controls for desktop
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            
            // Start game - P key or Space
            if (key === 'p' || key === ' ') {
                this.startGameSession();
            }
            // Jump - W key or Up Arrow
            else if ((key === 'w' || key === 'arrowup') && this.canJump()) {
                this.jump();
            }
            // Slide down - S key or Down Arrow
            else if ((key === 's' || key === 'arrowdown') && this.canSlide()) {
                this.slide();
            }
            // Move left - A key or Left Arrow
            else if (key === 'a' || key === 'arrowleft') {
                this.moveLeft();
            }
            // Move right - D key or Right Arrow
            else if (key === 'd' || key === 'arrowright') {
                this.moveRight();
            }
            // Restart game - R key
            else if (key === 'r') {
                this.restartGame();
            }
        });

        // Touch controls for mobile
        const canvas = this.game.canvas;
        if (canvas) {
            // Touch start
            canvas.addEventListener('touchstart', (e: TouchEvent) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
            }, { passive: false });

            // Touch end - detect swipe direction
            canvas.addEventListener('touchend', (e: TouchEvent) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                this.touchEndX = touch.clientX;
                this.touchEndY = touch.clientY;
                this.handleSwipe();
            }, { passive: false });

            // Tap to start game
            canvas.addEventListener('touchstart', (e: TouchEvent) => {
                if (!this.gameStart && e.touches.length === 1) {
                    this.startGameSession();
                }
            }, { passive: false });
        }

        // Mouse controls as fallback
        window.addEventListener('click', () => {
            if (!this.gameStart) {
                this.startGameSession();
            }
        });
    }

    private startGameSession() {
        if (!this.gameStart) {
            this.gameStart = true;
            this.gameStatus = GAME_STATUS.START;
            this.game.emit('gameStatus', this.gameStatus);
        }
    }

    private canJump(): boolean {
        const canJump = this.gameStart && 
                       this.status !== playerStatus.DIE &&
                       this.downCollide && 
                       !this.isJumping;
        
        console.log('Can jump?', canJump, {
            gameStart: this.gameStart,
            status: this.status,
            downCollide: this.downCollide,
            isJumping: this.isJumping,
            positionY: this.model.position.y
        }); // Debug log
        
        return canJump;
    }

    private jump() {
        if (!this.canJump()) return;
        
        console.log('Jump initiated!'); // Debug log
        
        this.key = 'jump';
        this.downCollide = false; // Player leaves ground
        this.isJumping = true;
        
        // Set strong upward velocity
        this.fallingSpeed = 8.0; // Simple upward velocity
    }

    private canSlide(): boolean {
        return this.gameStart && 
               this.status !== playerStatus.DIE &&
               !this.roll && 
               this.status !== playerStatus.ROLL;
    }

    private slide() {
        if (!this.canSlide()) return;
        
        this.roll = true;
        setTimeout(() => {
            this.roll = false;
        }, 620);
        this.key = 'slide';
        this.fallingSpeed = -5 * 0.1;
    }

    private moveLeft() {
        if (!this.gameStart || this.status === playerStatus.DIE) {
            return;
        }
        
        // Located on the leftmost road
        if (this.way === 1) {
            this.runlookback = true;
            this.emit('collision');
            showToast('Hit obstacle! Be careful! / Wagize inzitizi! Witondere!');
            setTimeout(() => {
                this.runlookback = false;
            }, 1040);
            this.smallMistake += 1;
            return;
        }
        
        this.way -= 1;
        this.originLocation = this.model.position.clone();
        this.lastPosition = this.model.position.clone().x;
        this.targetPosition -= roadWidth / 3;
    }

    private moveRight() {
        if (!this.gameStart || this.status === playerStatus.DIE) {
            return;
        }
        
        if (this.way === 3) {
            this.runlookback = true;
            this.emit('collision');
            showToast('Hit obstacle! Be careful! / Wagize inzitizi! Witondere!');
            setTimeout(() => {
                this.runlookback = false;
            }, 1040);
            this.smallMistake += 1;
            return;
        }
        
        this.originLocation = this.model.position.clone();
        this.lastPosition = this.model.position.clone().x;
        this.targetPosition += roadWidth / 3;
        this.way += 1;
    }

    private restartGame() {
        this.gameStatus = GAME_STATUS.READY;
        this.game.emit('gameStatus', this.gameStatus);
        this.smallMistake = 0;
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.environement.startGame();
        this.player.createPlayer(false);
    }

    private handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Check if swipe distance is sufficient
        if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) {
            return;
        }

        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe right
                this.moveRight();
            } else {
                // Swipe left
                this.moveLeft();
            }
        } else {
            // Vertical swipe
            if (deltaY < 0) {
                // Swipe up - jump
                this.jump();
            } else {
                // Swipe down - slide
                this.slide();
            }
        }
    }
// Left-right movement control
handleLeftRightMove() {
    const targetPosition = this.targetPosition;
    const lastPosition = this.lastPosition;
    if (Math.abs(targetPosition - lastPosition) < 1) {
        this.removeHandle = true;
    }
    if (targetPosition !== lastPosition) {
        // removehandle handles single collision
        // Handle left-right collision bounce effect
        if ((this.leftCollide || this.rightCollide) && this.removeHandle) {
            this.smallMistake += 1;
            this.emit('collision');
            showToast('Hit obstacle! Be careful! / Wagize inzitizi! Witondere!');
            this.targetPosition = this.originLocation.x;
            this.removeHandle = false;
            if (targetPosition > lastPosition) {
                this.way -= 1;
            }
            else {
                this.way += 1;
            }
        }
        // Smooth movement logic
        const moveSpeed = 0.15; // Movement speed
        const diff = targetPosition - lastPosition;
        if (Math.abs(diff) > 0.0001) {
            this.model.position.x += diff * moveSpeed;
            this.lastPosition += diff * moveSpeed;
        }
    }
}
    // Up-down movement control
    handleUpdownMove() {
    }
    // All ray collision detection
    collideCheckAll() {
        const position = this.model.position.clone();
        try {
            // Ground detection - far ray length
            this.collideCheck(Side.DOWN, position, 5);
            this.collideCheck(Side.FRONTDOWN, position, 3);
            this.collideCheck(Side.FRONT, position, 2);
            this.collideCheck(Side.LEFT, position, 1);
            this.collideCheck(Side.RIGHT, position, 1);
        }
        catch (error) {
            console.log(error);
        }

    }
    // Single ray collision detection
    collideCheck(
        side: Side,
        position: THREE.Vector3,
        far: number = 2.5
    ) {
        const {x, y, z} = position;
        switch (side) {
            case Side.DOWN:
                this.raycasterDown.ray.origin = new THREE.Vector3(x, y + 4, z + 0.5);
                this.raycasterDown.far = far;
                break;
            case Side.FRONTDOWN:
                this.raycasterFrontDown.ray.origin = new THREE.Vector3(x, y + 2, z);
                this.raycasterFrontDown.far = far;
                break;
            case Side.FRONT:
                this.raycasterFront.ray.origin = new THREE.Vector3(x, y + 2, z - 1);
                this.raycasterFront.far = far;
            case Side.LEFT:
                this.raycasterLeft.ray.origin = new THREE.Vector3(x + 0.5, y + 2, z);
                this.raycasterLeft.far = far;
            case Side.RIGHT:
                this.raycasterRight.ray.origin = new THREE.Vector3(x - 0.5, y + 2, z);
                this.raycasterRight.far = far;
        }
        // const arrowHelper = new THREE.ArrowHelper(
        //     this.raycasterFront.ray.direction,
        //     this.raycasterFront.ray.origin,
        //     this.raycasterFront.far,
        //     0xff0000
        // );
        // this.scene.add(arrowHelper);
        const ds = this.playerRunDistance;
        // Current floor block location
        const nowPlane = Math.floor(ds / roadLength);
        const intersectPlane = this.environement.plane?.[nowPlane];
        const intersectObstacal = this.environement.obstacal?.[nowPlane];
        const intersectCoin = this.environement.coin?.[nowPlane];
        if (!intersectObstacal && !intersectPlane) {
            return;
        }
        // update collide
        const origin = new THREE.Vector3(x, position.y + 3, z);
        const originDown = new THREE.Vector3(x, position.y + 4.6, z - 0.5);
        switch (side) {
            case Side.DOWN: {
                if (!intersectPlane) {
                    return;
                }
                const c1 = this.raycasterDown.intersectObjects(
                    [intersectPlane, intersectObstacal]
                )[0]?.object.name;
                this.raycasterDown.ray.origin = originDown;
                const c2 = this.raycasterDown.intersectObjects(
                    [intersectPlane, intersectObstacal]
                )[0]?.object.name;
                c1 || c2 ? (this.downCollide = true) : (this.downCollide = false);
                break;
            }
            case Side.FRONT: {
                const r1 = this.raycasterFront.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r1Name = r1?.object.name;
                if (r1Name === 'coin') {
                    r1.object.visible = false;
                    this.coin += 1;
                }
                const c1 = r1Name && r1Name !== 'coin';
                this.raycasterFront.far = 1.5;
                const r2 = this.raycasterFront.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r2Name = r2?.object.name;
                if (r2Name === 'coin') {
                    r2.object.visible = false;
                    this.coin += 1;
                }
                // Collision point information
                const c2 = r2Name && r2Name !== 'coin';
                this.frontCollideInfo = r1 || r2;
                c1 || c2 ? (this.frontCollide = true) : (this.frontCollide = false);
                break;
            }
            case Side.FRONTDOWN: {
                const r1 = this.raycasterFrontDown.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r1Name = r1?.object.name;
                if (r1Name === 'coin') {
                    r1.object.visible = false;
                    this.coin += 1;
                }
                const c1 = r1Name && r1Name !== 'coin';
                c1 ? (this.frontCollide = true) : (this.frontCollide = false);
                break;
            }
            case Side.LEFT: {
                const r1 = this.raycasterLeft.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r1Name = r1?.object.name;
                if (r1Name === 'coin') {
                    r1.object.visible = false;
                    this.coin += 1;
                }
                const c1 = r1Name && r1Name !== 'coin';
                this.raycasterLeft.ray.origin = origin;
                const r2 = this.raycasterLeft.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r2Name = r2?.object.name;
                if (r2Name === 'coin') {
                    r2.object.visible = false;
                    this.coin += 1;
                }
                // Collision point information
                const c2 = r2Name && r2Name !== 'coin';
                c1 || c2 ? (this.leftCollide = true) : (this.leftCollide = false);
                break;
            }
            case Side.RIGHT: {
                const r1 = this.raycasterRight.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r1Name = r1?.object.name;
                if (r1Name === 'coin') {
                    r1.object.visible = false;
                    this.coin += 1;
                }
                const c1 = r1Name && r1Name !== 'coin';
                this.raycasterRight.ray.origin = origin;
                const r2 = this.raycasterRight.intersectObjects([intersectObstacal, intersectCoin])[0];
                const r2Name = r2?.object.name;
                if (r2Name === 'coin') {
                    r2.object.visible = false;
                    this.coin += 1;
                }
                // Collision point information
                const c2 = r2Name && r2Name !== 'coin';
                c1 || c2 ? (this.rightCollide = true) : (this.rightCollide = false);
                break;
            }
        }
    }
    // Control character action changes
    changeStatus(delta: number) {
        if (!this.gameStart) {
            return;
        }
        const moveZ = this.runVelocity * delta;
        if (!this.frontCollide) {
            if (this.status !== playerStatus.DIE) {
                this.playerRunDistance += moveZ;
                this.model.position.z -= moveZ;
            }
        }
        if (this.status === playerStatus.DIE) {
            this.status = playerStatus.DIE;
        }
        else if (this.isJumping && this.fallingSpeed > 0) {
            this.status = playerStatus.JUMP;
        }
        else if (!this.downCollide && this.fallingSpeed < 0) {
            this.status = playerStatus.FALL;
        }
        else if (this.roll) {
            this.status = playerStatus.ROLL;
        }
        else if (this.runlookback) {
            this.status = playerStatus.RUNLOOKBACK;
        }
        else if (this.downCollide && this.fallingSpeed === 0) {
            this.status = playerStatus.RUN;
        }
        // Don't execute repeated animations
        if (this.status === this.lastAnimation) {
            return;
        }
        this.lastAnimation && this.allAnimate[this.lastAnimation].fadeOut(0.1);
        this.allAnimate[this.status].reset().fadeIn(0.1).play();
        this.lastAnimation = this.status;
    }
    // Check player distance
    checkPlayerDistance() {
        const ds = this.playerRunDistance;
        // Current floor block location
        const nowPlane = Math.floor(ds / roadLength) + 1;

        // Percentage of current distance to total length
        // Dynamically add scenes when reaching 45% - infinite map
        const runToLength = (ds - roadLength * (nowPlane - 1)) / roadLength;
        if (runToLength > 0.45 && this.currentPlane !== nowPlane) {
            console.log('Adding next floor');
            this.currentPlane = nowPlane;
            this.environement.z -= roadLength;
            const newZ = this.environement.z;
            // Place in Z-axis direction
            this.environement.setGroupScene(newZ, -5 - nowPlane * roadLength, false);
        }
    }
    // 向前的碰撞检测判定
    frontCollideCheckStatus() {
        if (this.frontCollide && this.firstFrontCollide.isCollide) {
            const {object} = this.frontCollideInfo;
            const {y} = this.frontCollideInfo.point;
            const point = Number(y - 2);
            const obstacal = Number(Obstacal[object.name]?.y);
            // 计算撞击面积百分比
            const locateObstacal = point / obstacal;
            console.log('障碍物', object.name, '障碍物的百分比', locateObstacal);
            this.firstFrontCollide = {isCollide: false, name: object.name};
            // 障碍物撞击面积大于0.75，直接判定游戏结束 播放角色死亡动画
            if (locateObstacal < 0.75) {
                this.status = playerStatus.DIE;
                this.gameStatus = GAME_STATUS.END;
                showToast('你死了！请重新开始游戏！');
                this.game.emit('gameStatus', this.gameStatus);
            }
            else {
                this.fallingSpeed += 0.4;
                this.model.position.y += obstacal * (1 - locateObstacal);
                this.smallMistake += 1;
                this.emit('collision');
                showToast('撞到障碍物！请注意！！！');
                this.firstFrontCollide.isCollide = false;
                setTimeout(() => {
                    this.firstFrontCollide.isCollide = true;
                }, 400);

            }

        }
    }
    // 金币旋转
    coinRotate() {
        const ds = this.playerRunDistance;
        // Current floor block location
        const nowPlane = Math.floor(ds / roadLength);
        const nowPlane1 = nowPlane + 1;
        const intersectCoin = this.environement.coin?.[nowPlane];
        const intersectCoin1 = this.environement.coin?.[nowPlane1];
        // 使得两个场景的硬币做旋转动画
        intersectCoin && intersectCoin.traverse(mesh => {
            if (mesh.name === 'coin') {
                mesh.rotation.z += Math.random() * 0.1;
            }
        });
        intersectCoin1 && intersectCoin1.traverse(mesh => {
            if (mesh.name === 'coin') {
                mesh.rotation.z += Math.random() * 0.1;
            }
        });
    }
    // 检查比赛状态
    checkGameStatus() {
        const mistake = this.smallMistake;
        // 小错误到达两次则直接终止比赛
        if (mistake >= 2 && this.gameStatus !== GAME_STATUS.END) {
            this.status = playerStatus.DIE;
            this.gameStatus = GAME_STATUS.END;
            this.game.emit('gameStatus', this.gameStatus);
        }
    }
    update(delta: number) {
        this.changeStatus(delta);
        this.handleLeftRightMove();
        this.checkPlayerDistance();
        this.collideCheckAll();
        this.frontCollideCheckStatus();
        this.coinRotate();
        this.checkGameStatus();
        if (this.gameStatus === GAME_STATUS.START) {
            this.game.emit('gameData', {score: this.score += 20, coin: this.coin, mistake: this.smallMistake});
        }
        // Simple jumping physics
        if (this.isJumping || !this.downCollide) {
            // Apply gravity - this will always pull the player down
            this.fallingSpeed -= 20.0 * delta; // Gravity acceleration
            
            // Update Y position based on falling speed
            this.model.position.y += this.fallingSpeed * delta;
            
            // Debug logging
            if (this.isJumping) {
                console.log('Jumping physics:', {
                    positionY: this.model.position.y,
                    fallingSpeed: this.fallingSpeed,
                    delta: delta,
                    isJumping: this.isJumping,
                    downCollide: this.downCollide
                });
            }
            
            // Check if player has hit the ground
            if (this.model.position.y <= 0) {
                console.log('Player landed!');
                this.model.position.y = 0; // Keep on ground
                this.fallingSpeed = 0; // Stop all vertical movement
                this.downCollide = true; // Player is grounded
                this.isJumping = false; // Jump complete
            }
        } else {
            // Player is on ground - keep them there
            this.model.position.y = 0;
            this.fallingSpeed = 0;
        }
    }
}









