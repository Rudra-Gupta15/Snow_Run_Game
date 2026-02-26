import React, { useState, useEffect, useRef } from 'react';
import HUD from './HUD';
import GameOverOverlay from './GameOverOverlay';
import LevelCompleteOverlay from './LevelCompleteOverlay';
import MobileControls from './MobileControls';
import { RotateCcw, ChevronRight, Home } from 'lucide-react';

export default function BikeGame({ stage, onStageComplete, onGameOver, onQuit, globalTime, setGlobalTime }) {
    // FORCE NUMERIC STAGE
    const numericStage = Number(stage);
    stage = numericStage; // Override prop locally to ensure consistency

    const [gameState, setGameState] = useState('playing'); // playing, completed, failed, wasted (caught by bear)
    const [showIntro, setShowIntro] = useState(true); // Show story intro on load
    const [moonPhase, setMoonPhase] = useState('normal'); // normal, dim, eclipse
    const [dataLogActive, setDataLogActive] = useState(false);
    // Level 3 State
    const [wind, setWind] = useState({ x: 0, y: 0 });
    const [boostStable, setBoostStable] = useState(true);
    // Level 4 State
    const [securityEye, setSecurityEye] = useState({ x: 0, y: 0, active: false });
    // Level 5 State
    const [risingLavaY, setRisingLavaY] = useState(800);
    const [finaleActive, setFinaleActive] = useState(false);

    const [score, setScore] = useState(0);
    // Timer handled by globalTime prop
    // Level 5 Boss State
    const [boss, setBoss] = useState({ active: false, x: 0, y: 0, health: 100, shotsFired: 0, phase: 'attack' });
    const [creditsActive, setCreditsActive] = useState(false);

    // Entities
    // Double Jump State
    const jumpPressed = useRef(false); // Tracks if jump key was just pressed
    const prevJumpState = useRef(false); // Tracks previous key state to detect rising edge

    const [bikes, setBikes] = useState([
        { id: 1, x: 200, y: 200, rotation: 0, velocityX: 0, velocityY: 0, wheelRotation: 0, crashed: false, jumpCount: 0, flightTimer: 0 }
    ]);

    const [obstacles, setObstacles] = useState([]);
    const [enemies, setEnemies] = useState([]); // Bears, etc.
    const [particles, setParticles] = useState([]);
    const [snow, setSnow] = useState([]); // Falling snow
    const [projectiles, setProjectiles] = useState([]); // Player shots

    // Camera state
    const [cameraOffset, setCameraOffset] = useState(0);

    const keysPressed = useRef({});
    const touchInputs = useRef({ move: 0, jump: false, boost: false });
    const gameLoopRef = useRef(null);

    // Physics Constants
    const GRAVITY = 0.6;
    const FRICTION = 0.96;
    const WHEEL_RADIUS = 8;

    // Speed configs
    const BASE_MAX_SPEED = 18;
    const BOOST_MAX_SPEED = BASE_MAX_SPEED * 2.5; // 2.5x boost
    const ACCELERATION = 0.6; // Smoother acceleration

    // Stage configurations (Solstice Spark Theme)
    const stageConfigs = {
        1: { name: 'Frozen Tundra', subtitle: 'The Awakening', obstacles: 15, length: 12000, bg: 'from-sky-800 via-blue-900 to-slate-900', bgImage: '/snow_bg.jpg' },
        2: { name: 'Glacial Caverns', subtitle: 'The Descent', obstacles: 25, length: 18000, bg: 'from-indigo-950 via-cyan-950 to-black', bgImage: '/snow_bg.jpg' },
        3: { name: 'Snowy Peak', subtitle: 'The Climb', obstacles: 40, length: 22000, bg: 'from-sky-800 via-blue-900 to-slate-900', bgImage: '/snow_bg.jpg' },
        4: { name: 'Ice Ridge', subtitle: 'The Summit', obstacles: 35, length: 26000, bg: 'from-sky-800 via-blue-900 to-slate-900', bgImage: null },
        5: { name: 'Blizzard Run', subtitle: 'The Boss Fight', obstacles: 20, length: 30000, bg: 'from-red-900 via-slate-900 to-black', bgImage: null }
    };

    const stageConfig = stageConfigs[stage] || stageConfigs[1];

    // Refs
    const bikesRef = useRef(bikes);
    const obstaclesRef = useRef(obstacles);
    const enemiesRef = useRef(enemies);
    const projectilesRef = useRef(projectiles);
    const bossRef = useRef(boss);
    const victoryRef = useRef(false);
    const gameStateRef = useRef(gameState);

    // Sync Refs
    useEffect(() => {
        bikesRef.current = bikes;
        obstaclesRef.current = obstacles;
        enemiesRef.current = enemies;
        bossRef.current = boss;
        projectilesRef.current = projectiles;
        gameStateRef.current = gameState;
    }, [bikes, obstacles, enemies, boss, projectiles, gameState]);

    // Terrain Function: y = f(x)
    // Defined here to be accessible by Game Loop and Level Gen
    const getGroundHeight = (x) => {
        // Safe Start Zone: Flat for first 600px
        if (x < 600) return 450;

        // Level 3: Flat Ground (Factory)


        // Wavy Hills
        const baseFreq = 0.005;
        const amp = 80;
        const noise = Math.sin(x * 0.02) * 10; // Small bumps
        const bigHills = Math.sin((x - 600) * baseFreq) * amp;

        return 450 + bigHills + noise;
    };

    const getTerrainPath = (yOffset = 0) => {
        const length = stageConfig.length + 1500;
        const bottomY = 2000; // Deep enough to cover bottom of screen
        let d = `M -500 ${bottomY} L -500 ${getGroundHeight(-500) + yOffset} `;
        for (let x = -400; x < length; x += 20) {
            d += `L ${x} ${getGroundHeight(x) + yOffset} `;
        }
        d += `L ${length} ${bottomY} Z`;
        return d;
    };

    // Initialize stage
    useEffect(() => {
        resetGame();
    }, [stage]);

    // Auto-Advance to Next Level on Completion
    useEffect(() => {
        if (gameState === 'completed') {
            const timer = setTimeout(() => {
                onStageComplete();
            }, 2000); // 2 second delay to celebrate
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    const resetGame = (playIntro = true) => {
        setGameState('playing');
        setShowIntro(playIntro);
        setMoonPhase('normal');
        setDataLogActive(false);
        setWind({ x: 0, y: 0 });
        setBoostStable(true);
        setSecurityEye({ x: 0, y: 0, active: false });
        setRisingLavaY(800);
        setFinaleActive(false);
        // Time is global, do not reset here
        setScore(0);
        // Start bike higher for Level 3 if ground is lower, or let gravity handle it?
        // Let's spawn it lower for L3 to match ground
        const startY = stage === 3 ? 600 : 400;
        setBikes([{ id: 1, x: 200, y: startY, rotation: 0, velocityX: 0, velocityY: 0, wheelRotation: 0, crashed: false, jumpCount: 0, flightTimer: 0 }]);
        setEnemies([]);
        setProjectiles([]);
        // Initialize boss as inactive, will wake up when player gets close
        // Health 300 = 60 shots * 5 damage
        setBoss({ active: false, x: stageConfig.length - 700, y: 300, health: 300, phase: 'idle', timer: 0 });

        generateLevel();
        setParticles([]);

        // Generate falling snow
        const initialSnow = Array.from({ length: 100 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speed: 1 + Math.random() * 3,
            size: 1 + Math.random() * 3
        }));
        setSnow(initialSnow);

        setCameraOffset(0);
    };

    const generateLevel = () => {
        const newObstacles = [];
        const levelLength = stageConfig.length;

        // Standard Ground Levels
        const obsCount = stageConfig.obstacles;
        const startX = 600; // Safe zone
        const obsSpacing = (levelLength - startX - 400) / obsCount;

        for (let i = 0; i < obsCount; i++) {
            const typeRoll = Math.random();
            let type = 'rock';
            if (typeRoll > 0.6) type = 'spike';
            if (stage > 2 && typeRoll > 0.4 && typeRoll < 0.6) type = 'ramp';

            // Ensure distinct spacing to prevent overlapping
            // Add random jitter but keep a minimum distance from previous
            const minSpacing = 400; // Minimum distance between obstacles
            const spacing = (levelLength - startX - 1500) / obsCount;
            const actualSpacing = Math.max(spacing, minSpacing);

            const x = startX + i * actualSpacing + Math.random() * 200;
            // groundY declared later
            let width = 60; let height = 40;
            if (type === 'spike') { height = 40; width = 40; }
            else if (type === 'rock') { height = 50; width = 60; }
            else if (type === 'ramp') { height = 60; width = 80; }

            // FIX: Anchor center to ground, then rotate
            const centerX = x + width / 2;
            const groundY = getGroundHeight(centerX);
            const slope = Math.atan2(getGroundHeight(centerX + 5) - getGroundHeight(centerX - 5), 10);

            let y = groundY - height; // Default: sit on ground
            let rotation = slope; // Default rotation matches slope

            if (type === 'spike') y = groundY - height;
            else if (type === 'rock') y = groundY - height;
            else if (type === 'ramp') { y = groundY - height; rotation = slope - 0.2; }

            newObstacles.push({ id: i, x, y, width, height, type, rotation });
        }


        // Level 2 Specific: Frozen Probes (Graveyard)
        if (stage === 2 && Math.random() > 0.7) {
            const width = 40;
            const x = startX + Math.random() * 200;
            const centerX = x + width / 2;
            const groundY = getGroundHeight(centerX);
            const slope = Math.atan2(getGroundHeight(centerX + 5) - getGroundHeight(centerX - 5), 10);

            newObstacles.push({
                id: `probe-special`,
                x: x,
                y: groundY - 30, // Height is 30
                width: width,
                height: 30,
                type: 'frozen-probe',
                rotation: slope + Math.random() * 0.5 // Add some random tilt on top of slope
            });
        }

        // Level 3 Specific: Heat Vents
        if (stage === 3 && Math.random() > 0.6) {
            const width = 50;
            const x = startX + Math.random() * 100;
            const centerX = x + width / 2;
            const groundY = getGroundHeight(centerX);
            const slope = Math.atan2(getGroundHeight(centerX + 5) - getGroundHeight(centerX - 5), 10);

            newObstacles.push({
                id: `vent-special`,
                x: x,
                y: groundY - 40, // Height is 40, so y = groundY - height
                width: width,
                height: 40,
                type: 'heat-vent',
                rotation: slope
            });
        }

        const newEnemies = [];
        // Add Bears for Level 3, 4, and 5
        if (stage >= 3) {
            const bearCount = stage === 3 ? 8 : (stage === 5 ? 10 : 5); // More bears in L3 and L5
            for (let i = 0; i < bearCount; i++) {
                const isBigBear = stage === 3;
                newEnemies.push({
                    id: `bear-${i}`,
                    x: 1000 + i * (levelLength / bearCount) + Math.random() * 500,
                    y: 0, // Will be clamped to ground in loop
                    width: isBigBear ? 90 : 60, // Big Bears for Level 3
                    height: isBigBear ? 60 : 40,
                    type: 'bear',
                    direction: -1,
                    speed: 2 + Math.random() * 2
                });
            }
        }

        setObstacles(newObstacles);
        setEnemies(newEnemies);
    };

    // Input handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
            keysPressed.current[e.key.toLowerCase()] = true;
            keysPressed.current[e.key] = true;

            // Register jump intent on keydown if it wasn't already pressed
            if ([' ', 'w', 'arrowup'].includes(e.key.toLowerCase())) {
                if (!prevJumpState.current) {
                    jumpPressed.current = true;
                    prevJumpState.current = true;
                }
            }
        };
        const handleKeyUp = (e) => {
            keysPressed.current[e.key.toLowerCase()] = false;
            keysPressed.current[e.key] = false;
            if ([' ', 'w', 'arrowup'].includes(e.key.toLowerCase())) {
                prevJumpState.current = false;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);


    // Main Game Loop
    useEffect(() => {
        // Only run if playing or transitioning (for exit animation)
        if ((gameState !== 'playing' && gameState !== 'transitioning') || showIntro) {
            return;
        }

        const loopStart = Date.now();

        const loop = setInterval(() => {
            // Level 5: Random Ice Crystal Rain
            if (stage === 5 && Math.random() > 0.95) {
                const camX = -cameraOffset; // Approximate
                const spawnX = bikesRef.current[0].x + Math.random() * 1000 - 200;
                setParticles(prev => [...prev, {
                    x: spawnX, y: -50,
                    vx: (Math.random() - 0.5) * 2, vy: 5 + Math.random() * 5,
                    life: 100, type: 'ice-shard', color: '#a5f3fc', size: 10 // Falling ice
                }]);
            }

            // Use REFS inside the loop to get latest state without resetting interval
            // Use REFS inside the loop to get latest state without resetting interval
            const currentBikes = bikesRef.current;
            const currentObstacles = obstaclesRef.current; // access ref 
            const currentEnemies = enemiesRef.current;
            const currentBoss = bossRef.current;
            const currentProjectiles = projectilesRef.current;

            // 2. Bike Logic
            // Capture trigger outside updater to handle Strict Mode double-invocation
            const triggerJump = jumpPressed.current;
            if (triggerJump) jumpPressed.current = false;

            setBikes(prevBikes => prevBikes.map(bike => {
                if (bike.crashed) return bike;

                let newBike = { ...bike };
                const isCarryingCore = stage === 5;

                // ROBUST IMMUNITY CHECK
                const timeSinceStart = (Date.now() - loopStart) / 1000;
                const inExitZone = newBike.x > (stageConfig.length - 1000);
                const isTransitioning = gameState === 'transitioning';
                const isInvulnerable = inExitZone || isTransitioning;

                const groundY = getGroundHeight(newBike.x);

                // Controls
                let currentMaxSpeed = BASE_MAX_SPEED;

                // Level 4: Enemy (Visual Only Here)

                // Boost (E key)
                if (keysPressed.current['e'] || touchInputs.current.boost) {
                    currentMaxSpeed = BOOST_MAX_SPEED;
                    if (Math.random() > 0.5) createParticle(newBike.x - 20, newBike.y, '#00FFFF');
                }

                // Forward (D)
                if (keysPressed.current['d'] || keysPressed.current['arrowright'] || touchInputs.current.move > 0.3) {
                    // Level 5 Logic: Rocket Thrust handled later
                    const accelMod = isCarryingCore ? 0.8 : 1.0;
                    newBike.velocityX = Math.min(newBike.velocityX + (ACCELERATION * accelMod), currentMaxSpeed);
                    if (Math.random() > 0.7 && newBike.y >= groundY - WHEEL_RADIUS - 5) createParticle(newBike.x - 10, newBike.y + 10, '#E0F7FA');
                }

                // Backward/Brake (A)
                if (keysPressed.current['a'] || touchInputs.current.move < -0.3) {
                    newBike.velocityX = Math.max(newBike.velocityX - ACCELERATION * 1.5, -BASE_MAX_SPEED * 0.5);
                }

                if (keysPressed.current['arrowleft'] || touchInputs.current.move < -0.6) {
                    newBike.rotation = Math.max(newBike.rotation - 0.15, -0.8);
                }
                if (keysPressed.current['arrowright'] || touchInputs.current.move > 0.6) {
                    newBike.rotation = Math.min(newBike.rotation + 0.15, 0.8);
                }

                // Jump Logic (Double Jump)
                const jumpKey = keysPressed.current[' '] || keysPressed.current['w'] || keysPressed.current['arrowup'] || touchInputs.current.jump;

                const isGrounded = newBike.y >= groundY - WHEEL_RADIUS - 5;

                // Use the CAPTURED trigger from outside the loop
                if (triggerJump) {
                    if (isGrounded) {
                        // First Jump
                        const jumpMod = isCarryingCore ? 0.9 : 1.0;
                        newBike.velocityY = -13 * jumpMod;
                        newBike.jumpCount = 1;
                        createExplosion(newBike.x, newBike.y + 10, 'snow');
                    } else if (newBike.jumpCount < 2) {
                        // Double Jump
                        newBike.velocityY = -12; // Slightly weaker second jump
                        newBike.jumpCount = 2;
                        newBike.velocityX += 2; // Slight forward boost

                        // Check for Flight Mechanic
                        if (keysPressed.current['e'] || touchInputs.current.boost) {
                            newBike.flightTimer = 66; // approx 2 seconds at 30fps (66/33 = 2s)
                            newBike.velocityY = 0; // Immediate stabilization
                            createExplosion(newBike.x, newBike.y, 'gold');
                        } else {
                            createExplosion(newBike.x, newBike.y + 10, 'gold'); // Different effect
                        }
                    }
                } else if (jumpKey && isGrounded && Math.abs(newBike.velocityY) < 2) {
                    // Fallback for holding jump on ground (bunny hop)
                    const jumpMod = isCarryingCore ? 0.9 : 1.0;
                    newBike.velocityY = -13 * jumpMod;
                    newBike.jumpCount = 1;
                    createExplosion(newBike.x, newBike.y + 10, 'snow');
                }

                // Physics
                let gravityMod = isCarryingCore ? 1.2 : 1.0;

                // Handle Flight Timer
                if (newBike.flightTimer > 0) {
                    newBike.flightTimer--;
                    gravityMod = 0; // Zero gravity during flight
                    newBike.velocityY *= 0.8; // Dampen existing vertical velocity
                    if (Math.random() > 0.3) createParticle(newBike.x - 20, newBike.y, '#22D3EE'); // Cyan trail
                }

                // Standard Bike Physics
                const currentFriction = stage === 2 ? 0.99 : FRICTION;

                const windForceX = 0;
                const windForceY = 0;

                newBike.velocityX = (newBike.velocityX * currentFriction) + windForceX;
                newBike.velocityY = (newBike.velocityY + GRAVITY * gravityMod) + windForceY;
                newBike.velocityY *= 0.99;
                newBike.rotation *= 0.98;
                newBike.x += newBike.velocityX;
                newBike.y += newBike.velocityY;
                newBike.wheelRotation += newBike.velocityX * 0.3;

                // Ground Collision
                if (newBike.y > groundY - WHEEL_RADIUS) {
                    const delta = 5;
                    const y1 = getGroundHeight(newBike.x - delta);
                    const y2 = getGroundHeight(newBike.x + delta);
                    const slopeAngle = Math.atan2(y2 - y1, delta * 2);

                    // Crash logic
                    if (!isInvulnerable && newBike.velocityY > 10 && Math.abs(newBike.rotation - slopeAngle) > 1.2) {
                        newBike.crashed = true;
                        createExplosion(newBike.x, newBike.y);
                        setGameState('failed');
                    } else {
                        newBike.y = groundY - WHEEL_RADIUS;
                        newBike.velocityY = 0;
                        newBike.rotation = newBike.rotation * 0.8 + slopeAngle * 0.2;
                        newBike.velocityX += Math.sin(slopeAngle) * 0.4;
                        newBike.jumpCount = 0; // Reset jump count on landing
                    }
                }

                // Obstacle Collision
                currentObstacles.forEach(obstacle => {
                    // Standard hitbox logic
                    const obsCenterX = obstacle.x + obstacle.width / 2;
                    const obsCenterY = obstacle.y + obstacle.height / 2;
                    const distX = Math.abs(newBike.x - obsCenterX);
                    const distY = Math.abs(newBike.y - obsCenterY);
                    const hitWidth = obstacle.width * 0.7;
                    const hitHeight = obstacle.height * 0.7;

                    if (distX < (hitWidth / 2 + 10) && distY < (hitHeight / 2 + 10)) {
                        // Rocket Exit Logic (Level 4)
                        if (obstacle.type === 'rocket-exit') {
                            const hitW = obstacle.width * 0.9; // Larger hitbox (was 0.7)
                            const hitH = obstacle.height * 0.9;
                            if (distX < (hitW / 2 + 30) && distY < (hitH / 2 + 30)) { // More forgiving padding
                                if (!victoryRef.current) {
                                    victoryRef.current = true;
                                    setGameState('completed');
                                    createExplosion(newBike.x, newBike.y, 'gold');
                                }
                            }
                        } else if (obstacle.type !== 'gap') {
                            if (!isInvulnerable) {
                                newBike.crashed = true;
                                createExplosion(newBike.x, newBike.y);
                                setGameState('failed');
                            }
                        }
                    }
                });

                // Fallback tunneling fix
                if (newBike.y > groundY + 10) {
                    newBike.y = groundY - WHEEL_RADIUS;
                    newBike.velocityY = 0;
                }

                // Win Condition
                // Win Condition
                if (newBike.x > stageConfig.length && gameState === 'playing' && !victoryRef.current) {
                    victoryRef.current = true;
                    setGameState('completed');
                    createExplosion(newBike.x, newBike.y, 'gold');
                }

                // Update Camera
                const targetOffset = newBike.x - 200;
                setCameraOffset(prev => prev + (targetOffset - prev) * 0.1);

                // Update Wind (Level 4)
                if (stage === 4) {
                    // Nerfed Wind (Right to Left) for Level 4
                    // Only apply very slight resistance, mainly visual
                    const windGust = (Math.sin(Date.now() / 2000) + Math.cos(Date.now() / 5000)) * 0.1;
                    const windForce = -0.05 + (windGust * 0.02); // Minimal backward force
                    newBike.velocityX += windForce;

                    // Visual Wind - flowing right to left quickly
                    if (Math.random() > 0.8) {
                        createParticle(newBike.x + 400, newBike.y - 100 + Math.random() * 200, '#e0f2fe');
                        // We'll give these specific velocity in particle loop if needed, or just spawn them ahead
                    }
                }

                // Shoot Projectiles (Level 5)
                if (stage === 5 && keysPressed.current['f'] && (!newBike.lastShot || Date.now() - newBike.lastShot > 300)) {
                    newBike.lastShot = Date.now();
                    setProjectiles(prev => [...prev, { x: newBike.x + 30, y: newBike.y - 10, vx: 15 + newBike.velocityX, vy: 0, life: 60, type: 'player-bullet' }]);
                    createParticle(newBike.x + 30, newBike.y - 10, '#ffff00');
                }

                // Enemy Collision (Bears) — tightened hitbox so jumping over doesn't false-trigger
                currentEnemies.forEach(enemy => {
                    const dx = Math.abs(newBike.x - (enemy.x + enemy.width / 2));
                    const dy = Math.abs(newBike.y - (enemy.y + enemy.height / 2));
                    if (dx < 22 && dy < 18 && !isInvulnerable) {
                        newBike.crashed = true;
                        createExplosion(newBike.x, newBike.y);
                        setGameState('failed');
                    }
                });

                // Boss Logic Collision (Level 5)
                if (stage === 5 && currentBoss.active) {
                    const dx = Math.abs(newBike.x - currentBoss.x);
                    const dy = Math.abs(newBike.y - currentBoss.y);
                    if (dx < 60 && dy < 60 && !isInvulnerable) {
                        newBike.crashed = true;
                        createExplosion(newBike.x, newBike.y);
                        setGameState('failed');
                    }
                }

                return newBike;
            }));

            // Enemies Logic (Polar Bears Chase)
            setEnemies(prev => prev.map(enemy => {
                const bike = bikesRef.current[0];
                if (!bike) return enemy;

                // Move

                const distToPlayer = bike.x - enemy.x;
                const detectionRange = 400; // Will start chasing when close

                let moveDir = enemy.direction;

                if (Math.abs(distToPlayer) < detectionRange) {
                    // Chase the player!
                    moveDir = Math.sign(distToPlayer);
                } else {
                    // Idle Patrol
                    if (Math.random() > 0.98) moveDir *= -1;
                }

                // Move
                const speed = Math.abs(distToPlayer) < detectionRange ? enemy.speed * 1.5 : enemy.speed; // Run faster when chasing
                let newX = enemy.x + (speed * moveDir);

                // Calculate Slope for Bear at CENTER
                const centerX = newX + (enemy.width / 2);
                const gY = getGroundHeight(centerX);
                const slope = Math.atan2(getGroundHeight(centerX + 5) - getGroundHeight(centerX - 5), 10);

                return { ...enemy, x: newX, y: gY - enemy.height, direction: moveDir, rotation: slope };
            }));

            // Projectiles Logic
            setProjectiles(prev => prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 })).filter(p => p.life > 0));

            // Boss Logic (Level 5)
            // Activation Check
            if (stage === 5 && !bossRef.current.active) {
                const bike = bikesRef.current[0];
                if (bike && bike.x > stageConfig.length - 2500) { // Wake up distance
                    setBoss(prev => ({ ...prev, active: true }));
                    createExplosion(stageConfig.length - 700, 300, 'gold'); // Wake up effect
                }
            }

            if (stage === 5 && bossRef.current.active) {
                setBoss(prev => {
                    const bike = bikesRef.current[0];
                    if (!bike) return prev;

                    let newX = prev.x;
                    let newY = prev.y;
                    let newPhase = prev.phase;
                    let newTimer = prev.timer + 1;
                    let newHealth = prev.health;

                    // Boss Movement: Hover near player
                    const targetX = bike.x + 300;
                    const targetY = bike.y - 100 + Math.sin(Date.now() / 500) * 50;

                    newX = newX + (targetX - newX) * 0.05;
                    newY = newY + (targetY - newY) * 0.05;

                    // Check collisions with player projectiles
                    projectilesRef.current.forEach(proj => {
                        if (proj.type === 'player-bullet') {
                            const dx = Math.abs(proj.x - prev.x);
                            const dy = Math.abs(proj.y - prev.y);
                            if (dx < 60 && dy < 60) {
                                newHealth -= 5;
                                createExplosion(prev.x, prev.y, 'gold');
                                // remove projectile visual? (Logic handled in projectile loop ideally)
                            }
                        }
                    });

                    if (newHealth <= 0) {
                        // Boss Defeated
                        createExplosion(prev.x, prev.y, 'gold');
                        // Trigger Victory
                        if (!victoryRef.current) {
                            victoryRef.current = true;
                            setGameState('completed');
                        }
                        return { ...prev, active: false };
                    }

                    // Boss Attack (Throw Iceballs)
                    if (newTimer % 100 === 0) {
                        // Fire at player (Ice Shard)
                        const angle = Math.atan2(bike.y - newY, bike.x - newX);
                        setParticles(prevParts => [...prevParts, {
                            x: newX + 100, y: newY + 90, // Mouth position
                            vx: Math.cos(angle) * 12, vy: Math.sin(angle) * 12,
                            life: 120, type: 'ice-shard', color: '#22d3ee', size: 20
                        }]);
                    }

                    return { ...prev, x: newX, y: newY, phase: newPhase, timer: newTimer, health: newHealth };
                });
            }



            // Particles & Projectiles
            setParticles(prev => prev.map(p => {
                if (p.type === 'laser') {
                    // Check collision with bike
                    const bike = bikesRef.current[0];
                    if (bike && !bike.crashed) {
                        const dx = bike.x - p.x;
                        const dy = bike.y - p.y;
                        if (Math.sqrt(dx * dx + dy * dy) < 20) {
                            // Hit!
                            setGameState('failed');
                            createExplosion(bike.x, bike.y);
                            bike.crashed = true; // Mutating ref/state issue? Handled next loop
                        }
                    }
                    return { ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 };
                }

                return {
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.1, // gravity
                    life: p.life - 1
                };
            }).filter(p => p.life > 0));

            // ... (Snow logic removed for brevity or kept)
            setSnow(prev => prev.map(s => ({
                ...s,
                y: s.y + s.speed,
                x: s.x + Math.sin(s.y * 0.01) * 0.5,
            })).map(s => s.y > window.innerHeight ? { ...s, y: -10, x: Math.random() * window.innerWidth } : s));

            setGlobalTime(t => {
                const newTime = Math.max(0, t - 0.03);
                if (newTime <= 0) setGameState('failed');
                return newTime;
            });

        }, 30);

        gameLoopRef.current = loop;
        return () => clearInterval(loop);
    }, [gameState, stageConfig]); // Dependencies

    const createParticle = (x, y, color) => {
        setParticles(prev => [...prev.slice(-40), {
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1) * 4,
            life: 20 + Math.random() * 20,
            color,
            size: Math.random() * 4 + 1
        }]);
    };

    const createExplosion = (x, y, type = 'fire') => {
        const color = type === 'gold' ? '#FFD700' : type === 'snow' ? '#E0F7FA' : '#FF4500';
        for (let i = 0; i < 15; i++) {
            createParticle(x, y, color);
        }
    };

    // Rendering helpers
    const getCameraStyle = () => ({
        transform: `translateX(${-cameraOffset}px)`,
        transition: 'transform 0.0s linear'
    });

    return (
        <div className="relative w-full h-full bg-gray-900 overflow-hidden text-white font-sans">
            {/* Night Sky Gradient OR Image */}
            {/* Night Sky Gradient OR Image */}
            {stageConfig.bgImage ? (
                <div className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${stageConfig.bgImage})` }}>
                    {/* Level 3: Darker Atmosphere Overlay */}

                </div>
            ) : (
                <div className={`fixed inset-0 z-0 bg-gradient-to-b ${stageConfig.bg} transition-colors duration-1000`}></div>
            )}

            {/* Moon & Stars (Hide in Factory) */}
            {stage === 5 && (
                <div className="fixed inset-0 z-[1] pointer-events-none">
                    {/* Dense starfield for Level 5 */}
                    {Array.from({ length: 160 }, (_, i) => {
                        const seed = i * 2654435761;
                        const x = ((seed >> 0) & 0xFFFF) / 0xFFFF * 100;
                        const y = ((seed >> 5) & 0xFFFF) / 0xFFFF * 100;
                        const size = 0.5 + (((seed >> 10) & 0xFF) / 0xFF) * 2.5;
                        const delay = (((seed >> 15) & 0xFF) / 0xFF) * 4;
                        const bright = 0.4 + (((seed >> 20) & 0xFF) / 0xFF) * 0.6;
                        const isBlue = i % 5 === 0;
                        const isPurple = i % 7 === 0;
                        return (
                            <div key={`star-${i}`}
                                className="absolute rounded-full animate-pulse"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    width: size,
                                    height: size,
                                    backgroundColor: isBlue ? '#93c5fd' : isPurple ? '#c4b5fd' : 'white',
                                    opacity: bright,
                                    animationDelay: `${delay}s`,
                                    animationDuration: `${2 + delay * 0.5}s`,
                                    boxShadow: size > 2 ? `0 0 ${size * 2}px ${isBlue ? '#93c5fd' : isPurple ? '#c4b5fd' : 'white'}` : 'none'
                                }}
                            />
                        );
                    })}
                    {/* Large glowing stars */}
                    {[[15, 10], [45, 5], [70, 15], [85, 8], [30, 3], [60, 18], [90, 12]].map(([x, y], i) => (
                        <div key={`bigstar-${i}`} className="absolute animate-pulse"
                            style={{
                                left: `${x}%`, top: `${y}%`,
                                width: 4, height: 4,
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                opacity: 0.9,
                                animationDelay: `${i * 0.7}s`,
                                boxShadow: '0 0 8px 2px rgba(255,255,255,0.6), 0 0 20px 4px rgba(165,243,252,0.3)'
                            }}
                        />
                    ))}
                    {/* Nebula clouds - purple/red tones for boss level */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_20%_20%,rgba(109,40,217,0.12),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_15%,rgba(185,28,28,0.08),transparent)]" />
                </div>
            )}
            {/* Moon & Stars (Hide in Factory and Level 5 where we use custom starfield) */}
            {stage !== 3 && stage !== 5 && (
                <>
                    {/* Stars */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #ddd, rgba(0,0,0,0))',
                            backgroundSize: '300px 300px'
                        }}></div>

                    {/* Moon */}
                    <div className={`absolute top-10 right-20 w-16 h-16 rounded-full bg-yellow-100 shadow-[0_0_40px_rgba(255,255,200,0.3)] transition-all duration-1000 ${moonPhase === 'eclipse' ? 'shadow-[0_0_50px_rgba(255,0,0,0.5)] bg-red-900' : ''}`}></div>
                </>
            )}

            {/* Scrolling Parallax Mountains (Modify for Factory if needed, or hide) */}
            {stage !== 3 && (
                <div className="absolute bottom-0 w-[200%] h-1/2 opacity-30 pointer-events-none"
                    style={{ transform: `translateX(${-cameraOffset * 0.05}px)` }}>
                    <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="none">
                        <path d="M0,600 L0,300 C150,250 300,50 450,200 C600,350 750,150 900,300 Q1050,450 1200,200 L1200,600 Z" fill="#1e293b" />
                    </svg>
                </div>
            )}

            <HUD
                time={globalTime}
                stage={stage}
                stageName={stageConfig.name}
                speed={Math.abs(bikes[0]?.velocityX || 0)}
                progress={bikes[0]?.x || 0}
                totalDistance={stageConfig.length}
            />

            {/* Game World Container */}
            <div className="absolute inset-0 overflow-visible" style={{ transform: `translateX(${-cameraOffset}px)` }}>

                {/* Terrain SVG */}
                <div className="absolute top-0 left-0 pointer-events-none" style={{ width: stageConfig.length + 2000, height: '100%' }}>
                    <svg width="100%" height="100%" className="overflow-visible">
                        <defs>
                            {/* Metal Beam Gradient */}
                            <linearGradient id="metal-sheen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#52525b" /> {/* Zinc-600 */}
                                <stop offset="50%" stopColor="#a1a1aa" /> {/* Zinc-400 */}
                                <stop offset="100%" stopColor="#52525b" />
                            </linearGradient>
                            {/* Steel Rods Pattern */}
                            <pattern id="steel-rods" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
                                {/* Dark Gap */}
                                <rect width="40" height="20" fill="#09090b" />
                                {/* The Rod/Beam (Thinner than full height to show gap) */}
                                <rect y="2" width="40" height="16" fill="url(#metal-sheen)" rx="2" />
                            </pattern>
                        </defs>

                        {/* Dynamic Terrain Colors */}
                        <path d={getTerrainPath()}
                            fill="#f1f5f9" // Snow
                            stroke="#bfdbfe" // Ice
                            strokeWidth="4" />
                        <path d={getTerrainPath(20)}
                            fill="#cbd5e1" // Ice Shadow
                            fillOpacity={'0.5'} />
                    </svg>
                </div>

                {/* Obstacles (Ice/Snow theme) */}
                {obstacles.map(obs => (
                    <div key={obs.id} className="absolute" style={{
                        left: obs.x, top: obs.y, width: obs.width, height: obs.height,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${obs.rotation}rad)`
                    }}>

                        {/* ICE SPIKE */}
                        {obs.type === 'spike' && (
                            <svg width="100%" height="100%" viewBox="0 0 40 40" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="spikeGrad" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#a5f3fc" />
                                        <stop offset="100%" stopColor="#0284c7" />
                                    </linearGradient>
                                </defs>
                                {/* Main spike */}
                                <polygon points="20,0 0,40 40,40" fill="url(#spikeGrad)" stroke="#7dd3fc" strokeWidth="1.5" />
                                {/* Highlight shine */}
                                <polygon points="20,0 10,40 20,35" fill="white" opacity="0.3" />
                                {/* Side mini spikes */}
                                <polygon points="5,40 0,25 12,40" fill="#7dd3fc" opacity="0.7" />
                                <polygon points="35,40 40,25 28,40" fill="#7dd3fc" opacity="0.7" />
                            </svg>
                        )}

                        {/* BOULDER / ROCK */}
                        {obs.type === 'rock' && (
                            <svg width="100%" height="100%" viewBox="0 0 60 50" preserveAspectRatio="none">
                                <defs>
                                    <radialGradient id="rockGrad" cx="35%" cy="30%" r="60%">
                                        <stop offset="0%" stopColor="#94a3b8" />
                                        <stop offset="100%" stopColor="#334155" />
                                    </radialGradient>
                                </defs>
                                <ellipse cx="30" cy="30" rx="28" ry="18" fill="url(#rockGrad)" stroke="#475569" strokeWidth="2" />
                                {/* Cracks */}
                                <path d="M20,18 L28,30 L22,42" stroke="#1e293b" strokeWidth="1.5" fill="none" opacity="0.6" />
                                <path d="M35,20 L40,32" stroke="#1e293b" strokeWidth="1" fill="none" opacity="0.5" />
                                {/* Ice glaze on top */}
                                <ellipse cx="30" cy="18" rx="18" ry="5" fill="#bae6fd" opacity="0.3" />
                                {/* Highlight */}
                                <ellipse cx="22" cy="22" rx="7" ry="4" fill="white" opacity="0.15" />
                            </svg>
                        )}

                        {/* RAMP */}
                        {obs.type === 'ramp' && (
                            <svg width="100%" height="100%" viewBox="0 0 80 60" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="rampGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e2e8f0" />
                                        <stop offset="100%" stopColor="#94a3b8" />
                                    </linearGradient>
                                </defs>
                                <polygon points="80,0 0,60 80,60" fill="url(#rampGrad)" stroke="#bfdbfe" strokeWidth="2" />
                                {/* Surface stripes */}
                                <line x1="60" y1="8" x2="80" y2="8" stroke="white" strokeWidth="2" opacity="0.4" />
                                <line x1="40" y1="23" x2="80" y2="23" stroke="white" strokeWidth="2" opacity="0.4" />
                                <line x1="20" y1="38" x2="80" y2="38" stroke="white" strokeWidth="2" opacity="0.4" />
                                {/* Ice shine on edge */}
                                <polygon points="80,0 72,0 80,8" fill="#7dd3fc" opacity="0.5" />
                            </svg>
                        )}

                        {obs.type === 'frozen-probe' && (
                            <div className="w-full h-full opacity-60" style={{ transform: `rotate(${obs.rotation}rad)` }}>
                                <div className="absolute bottom-0 w-full h-3 bg-blue-900 rounded-full"></div>
                                <div className="absolute bottom-3 left-2 w-8 h-4 bg-slate-700 skew-x-[-20deg]"></div>
                                <div className="absolute bottom-0 left-0 w-full h-full bg-cyan-500/30 mix-blend-overlay"></div>
                            </div>
                        )}
                        {obs.type === 'heat-vent' && (
                            <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 border-x-2 border-slate-600 flex flex-col items-center justify-end relative">
                                <div className="w-full h-1 bg-black/50 mb-1"></div>
                                <div className="w-full h-1 bg-black/50 mb-1"></div>
                                <div className="w-full h-1 bg-black/50 mb-1"></div>
                                <div className="absolute bottom-0 w-3/4 h-2 bg-orange-500 blur-sm animate-pulse"></div>
                                <div className="absolute -top-10 w-2 h-10 bg-white/20 blur-md animate-ping"></div>
                            </div>
                        )}
                        {obs.type === 'lava-can' && (
                            <div className="w-full h-full bg-slate-800 border-2 border-yellow-500 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#334155_10px,#334155_20px)] opacity-40"></div>
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center z-10 border border-yellow-500">
                                    <span className="text-yellow-500 text-xs font-black">⚠</span>
                                </div>
                                <div className="absolute bottom-0 w-full h-1 bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                            </div>
                        )}
                        {obs.type === 'lava-pit' && (
                            <div className="w-full h-full bg-orange-600/20 border-b-4 border-red-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-orange-600 blur-md opacity-50 animate-pulse"></div>
                            </div>
                        )}
                        {obs.type === 'magnetic-coil' && (
                            <div className="w-full h-full bg-purple-900/50 rounded-full border-4 border-purple-500 flex items-center justify-center">
                                <div className="w-3/4 h-3/4 border-2 border-purple-300 rounded-full border-dashed"></div>
                                <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse"></div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Enemies (Bears) */}
                {enemies.map(enemy => (
                    <div key={enemy.id} className="absolute" style={{ left: enemy.x, top: enemy.y, width: enemy.width, height: enemy.height }}>
                        {enemy.type === 'bear' && (
                            <div className="w-full h-full relative" style={{ transformOrigin: 'bottom center', transform: `rotate(${enemy.rotation || 0}rad) scaleX(${-enemy.direction})` }}>
                                <svg width="100%" height="100%" viewBox="0 0 100 65" preserveAspectRatio="none">
                                    <defs>
                                        <radialGradient id="bearFur" cx="40%" cy="30%" r="70%">
                                            <stop offset="0%" stopColor="#f1f5f9" />
                                            <stop offset="100%" stopColor="#cbd5e1" />
                                        </radialGradient>
                                        <radialGradient id="bearHead" cx="40%" cy="35%" r="60%">
                                            <stop offset="0%" stopColor="#f8fafc" />
                                            <stop offset="100%" stopColor="#e2e8f0" />
                                        </radialGradient>
                                    </defs>
                                    {/* Shadow beneath */}
                                    <ellipse cx="50" cy="63" rx="40" ry="4" fill="black" opacity="0.2" />
                                    {/* Back legs */}
                                    <path d="M8,42 Q3,56 9,63 L22,63 Q28,52 23,42 Z" fill="#cbd5e1" />
                                    <path d="M72,42 Q67,56 73,63 L86,63 Q92,52 87,42 Z" fill="#cbd5e1" />
                                    {/* Body */}
                                    <ellipse cx="48" cy="32" rx="44" ry="26" fill="url(#bearFur)" />
                                    {/* Belly lighter patch */}
                                    <ellipse cx="48" cy="38" rx="26" ry="14" fill="#f8fafc" opacity="0.6" />
                                    {/* Front legs */}
                                    <path d="M14,42 Q9,56 15,63 L28,63 Q34,52 29,42 Z" fill="#e2e8f0" />
                                    <path d="M66,42 Q61,56 67,63 L80,63 Q86,52 81,42 Z" fill="#e2e8f0" />
                                    {/* Claws on front legs */}
                                    <path d="M10,62 L14,65 M15,63 L18,66 M20,63 L22,66" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M63,62 L66,65 M68,63 L71,66 M73,63 L75,66" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                                    {/* Head */}
                                    <circle cx="83" cy="20" r="15" fill="url(#bearHead)" />
                                    {/* Ears */}
                                    <circle cx="76" cy="8" r="6" fill="#e2e8f0" />
                                    <circle cx="76" cy="8" r="3" fill="#fda4af" />
                                    <circle cx="91" cy="7" r="5" fill="#e2e8f0" />
                                    <circle cx="91" cy="7" r="2.5" fill="#fda4af" />
                                    {/* Snout */}
                                    <ellipse cx="93" cy="24" rx="7" ry="5" fill="#e2e8f0" />
                                    <ellipse cx="94" cy="22" rx="3" ry="2" fill="#64748b" />
                                    {/* Nostrils */}
                                    <circle cx="92" cy="22" r="1" fill="black" />
                                    <circle cx="96" cy="22" r="1" fill="black" />
                                    {/* Eye - angry red glow */}
                                    <circle cx="87" cy="17" r="3.5" fill="#1e293b" />
                                    <circle cx="87" cy="17" r="2" fill="#ef4444" />
                                    <circle cx="88" cy="16" r="0.8" fill="white" opacity="0.7" />
                                    {/* Mouth line */}
                                    <path d="M89,27 Q93,30 97,27" stroke="#475569" strokeWidth="1" fill="none" />
                                    {/* Fur texture lines */}
                                    <path d="M20,20 Q24,16 28,20" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.7" />
                                    <path d="M30,15 Q34,11 38,15" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.6" />
                                    <path d="M10,28 Q14,24 18,28" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.5" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}

                {/* Boss (Level 5) — Frost Dragon King */}
                {boss.active && (
                    <div className="absolute" style={{ left: boss.x, top: boss.y, width: 220, height: 200 }}>
                        <div className="w-full h-full relative animate-float">
                            <svg width="100%" height="100%" viewBox="0 0 220 200" className="drop-shadow-[0_0_30px_rgba(99,102,241,0.8)]">
                                <defs>
                                    <radialGradient id="bossGlow" cx="50%" cy="40%" r="60%">
                                        <stop offset="0%" stopColor="#c7d2fe" />
                                        <stop offset="100%" stopColor="#312e81" />
                                    </radialGradient>
                                    <radialGradient id="bossEye" cx="30%" cy="30%" r="70%">
                                        <stop offset="0%" stopColor="#a78bfa" />
                                        <stop offset="60%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#1e1b4b" />
                                    </radialGradient>
                                    <filter id="iceGlow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Wing left — spread wide */}
                                <path d="M50,80 Q0,30 10,5 Q40,10 60,50 Q70,65 65,80 Z" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1.5" opacity="0.9" />
                                {/* Wing right */}
                                <path d="M170,80 Q220,30 210,5 Q180,10 160,50 Q150,65 155,80 Z" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1.5" opacity="0.9" />
                                {/* Wing membrane lines */}
                                <path d="M52,78 Q25,40 15,10" stroke="#6366f1" strokeWidth="1" fill="none" opacity="0.5" />
                                <path d="M58,76 Q40,45 25,15" stroke="#6366f1" strokeWidth="1" fill="none" opacity="0.5" />
                                <path d="M168,78 Q195,40 205,10" stroke="#6366f1" strokeWidth="1" fill="none" opacity="0.5" />
                                <path d="M162,76 Q180,45 195,15" stroke="#6366f1" strokeWidth="1" fill="none" opacity="0.5" />

                                {/* Tail */}
                                <path d="M100,180 Q60,200 40,190 Q70,175 80,165" fill="#818cf8" stroke="#6366f1" strokeWidth="1" />
                                <path d="M120,180 Q160,200 180,190 Q150,175 140,165" fill="#818cf8" stroke="#6366f1" strokeWidth="1" />

                                {/* Body */}
                                <ellipse cx="110" cy="115" rx="65" ry="70" fill="url(#bossGlow)" stroke="#818cf8" strokeWidth="3" />
                                {/* Belly scales */}
                                <ellipse cx="110" cy="130" rx="40" ry="45" fill="#e0e7ff" opacity="0.25" />
                                <path d="M80,100 Q110,120 140,100" fill="none" stroke="#a5b4fc" strokeWidth="2" opacity="0.5" />
                                <path d="M75,115 Q110,135 145,115" fill="none" stroke="#a5b4fc" strokeWidth="2" opacity="0.5" />
                                <path d="M80,130 Q110,148 140,130" fill="none" stroke="#a5b4fc" strokeWidth="2" opacity="0.5" />

                                {/* Neck */}
                                <path d="M75,65 Q110,55 145,65 L140,80 Q110,72 80,80 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="1" />

                                {/* Head */}
                                <ellipse cx="110" cy="45" rx="42" ry="35" fill="#312e81" stroke="#6366f1" strokeWidth="2.5" />
                                {/* Head scales / texture */}
                                <path d="M80,35 Q95,28 110,35" fill="none" stroke="#4338ca" strokeWidth="1.5" />
                                <path d="M110,35 Q125,28 140,35" fill="none" stroke="#4338ca" strokeWidth="1.5" />

                                {/* Horns */}
                                <path d="M88,20 L78,0 L96,18" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1" />
                                <path d="M132,20 L142,0 L124,18" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1" />
                                {/* Horn glow tips */}
                                <circle cx="78" cy="0" r="3" fill="#a5f3fc" opacity="0.9" />
                                <circle cx="142" cy="0" r="3" fill="#a5f3fc" opacity="0.9" />

                                {/* Left eye */}
                                <circle cx="92" cy="42" r="13" fill="#1e1b4b" />
                                <circle cx="92" cy="42" r="9" fill="url(#bossEye)" />
                                <circle cx="92" cy="42" r="4" fill="#7c3aed" />
                                <circle cx="89" cy="39" r="2.5" fill="white" opacity="0.5" />
                                {/* Right eye */}
                                <circle cx="128" cy="42" r="13" fill="#1e1b4b" />
                                <circle cx="128" cy="42" r="9" fill="url(#bossEye)" />
                                <circle cx="128" cy="42" r="4" fill="#7c3aed" />
                                <circle cx="125" cy="39" r="2.5" fill="white" opacity="0.5" />

                                {/* Jaw / Mouth */}
                                <path d="M85,60 Q110,75 135,60" stroke="#4338ca" strokeWidth="2" fill="none" />
                                {/* Teeth */}
                                <path d="M90,60 L87,68 L93,60" fill="#e0e7ff" />
                                <path d="M105,62 L103,70 L108,62" fill="#e0e7ff" />
                                <path d="M120,62 L118,70 L123,62" fill="#e0e7ff" />
                                <path d="M130,60 L128,68 L133,60" fill="#e0e7ff" />

                                {/* Ice breath glow from mouth */}
                                <ellipse cx="110" cy="68" rx="15" ry="6" fill="#a5f3fc" opacity="0.3" filter="url(#iceGlow)" />

                                {/* Claws / feet */}
                                <path d="M70,175 L60,188 M75,177 L68,192 M80,178 L76,193" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M150,175 L160,188 M145,177 L152,192 M140,178 L144,193" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>

                            {/* Mouth glow emitter */}
                            <div className="absolute" style={{ top: 68, left: 100, width: 20, height: 8 }}>
                                <div className="w-full h-full bg-cyan-300 blur-sm animate-pulse opacity-60"></div>
                            </div>

                            {/* Health Bar */}
                            <div className="absolute -top-14 left-0 w-full">
                                <div className="text-center text-xs font-bold text-purple-300 mb-1 tracking-widest">FROST KING</div>
                                <div className="h-4 bg-gray-900 border-2 border-purple-500 rounded-full overflow-hidden shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                                    <div className="h-full bg-gradient-to-r from-purple-700 via-indigo-500 to-cyan-400 transition-all duration-200" style={{ width: `${boss.health}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Projectiles */}
                {projectiles.map((p, i) => (
                    <div key={`proj-${i}`} className="absolute w-4 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#fbbf24]"
                        style={{ left: p.x, top: p.y }} />
                ))}


                {/* Visual Particles (Explosions / Lasers) */}
                {particles.map((p, i) => (
                    <div key={i} className="absolute"
                        style={{
                            left: p.x, top: p.y, width: p.size || 5, height: p.size || 5,
                            opacity: p.life / 20,
                            transform: p.type === 'ice-shard' ? `rotate(${Date.now() / 10 + i * 20}deg)` : 'none'
                        }}>
                        {p.type === 'ice-shard' ? (
                            <div className="w-full h-full bg-cyan-400 rotate-45 border border-white shadow-[0_0_10px_#22d3ee]"></div>
                        ) : (
                            <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}` }}></div>
                        )}
                    </div>
                ))}







                {/* Credits Screen */}
                {creditsActive && (
                    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-[fadeIn_2s_ease-out_forwards]">
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8 animate-bounce">
                            YOU SAVED THE GALAXY!
                        </h1>
                        <div className="text-white text-center space-y-4 text-xl">
                            <p>Mission Complete.</p>
                            <p>The Core is Secure.</p>
                            <p className="text-slate-500 mt-8">Thanks for playing!</p>
                            <button onClick={onQuit} className="mt-12 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold transition-all">
                                Return to Base
                            </button>
                        </div>
                        {/* Fireworks */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 bg-yellow-500 rounded-full animate-ping"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: '1s'
                                    }}></div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Overlays */}
                {/* Overlays moved to end of component */}

                {/* Player Rendering: Bike + Rider */}
                {bikes.map(bike => (
                    <div key={bike.id} className="absolute"
                        style={{ left: bike.x - 34, top: bike.y - 48, width: 68, height: 56, transform: `rotate(${bike.rotation}rad)` }}>
                        <svg width="68" height="56" viewBox="0 0 68 56" overflow="visible">
                            <defs>
                                <linearGradient id="bikeBodyGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="100%" stopColor="#0369a1" />
                                </linearGradient>
                                <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#1e293b" />
                                    <stop offset="50%" stopColor="#334155" />
                                    <stop offset="100%" stopColor="#1e293b" />
                                </linearGradient>
                            </defs>

                            {/* === SNOWMOBILE TRACK === */}
                            <rect x="4" y="42" width="60" height="10" rx="5" fill="url(#trackGrad)" stroke="#475569" strokeWidth="1" />
                            {/* Track tread marks */}
                            {[0, 1, 2, 3, 4, 5].map(i => (
                                <rect key={i}
                                    x={6 + ((i * 10 + (bike.wheelRotation * 5 | 0)) % 56)}
                                    y="43" width="4" height="8" rx="1"
                                    fill="#475569" opacity="0.7" />
                            ))}

                            {/* === SNOWMOBILE BODY === */}
                            {/* Ski/hull base */}
                            <path d="M4,42 Q2,46 8,47 L60,47 Q66,46 64,42 Z" fill="#0f172a" />
                            {/* Main body fairing */}
                            <path d="M10,42 L10,26 Q12,18 22,16 L50,16 Q58,18 60,26 L60,42 Z" fill="url(#bikeBodyGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                            {/* Windshield */}
                            <path d="M38,16 L34,24 L52,24 L54,16 Z" fill="#7dd3fc" opacity="0.5" stroke="#bae6fd" strokeWidth="1" />
                            {/* Hood intake grilles */}
                            <rect x="12" y="28" width="16" height="3" rx="1" fill="#1e40af" opacity="0.7" />
                            <rect x="12" y="33" width="12" height="3" rx="1" fill="#1e40af" opacity="0.7" />
                            {/* Side accent stripe */}
                            <path d="M10,36 L60,36" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
                            {/* Headlight */}
                            <ellipse cx="61" cy="28" rx="4" ry="5" fill="#fef08a" stroke="#fbbf24" strokeWidth="1" />
                            <ellipse cx="61" cy="28" rx="2" ry="3" fill="white" opacity="0.8" />
                            {/* Exhaust pipe */}
                            <rect x="6" y="34" width="6" height="5" rx="1" fill="#475569" />
                            <ellipse cx="6" cy="34" rx="3" ry="2.5" fill="#64748b" />
                            {/* Glowing thermal core indicator */}
                            <circle cx="30" cy="30" r="4" fill="#22d3ee" stroke="white" strokeWidth="1"
                                style={{ filter: 'drop-shadow(0 0 4px #22d3ee)' }} />
                            <circle cx="30" cy="30" r="2" fill="white" />

                            {/* === RIDER === */}
                            {/* Rider body/suit */}
                            <path d="M32,16 Q34,8 38,6 L42,6 Q46,8 46,16 Z" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1" />
                            {/* Rider helmet */}
                            <circle cx="39" cy="8" r="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                            {/* Visor */}
                            <path d="M33,6 Q39,2 45,6 Q45,10 39,11 Q33,10 33,6 Z" fill="#f97316" opacity="0.85" />
                            {/* Helmet ridge */}
                            <path d="M31,8 Q39,4 47,8" stroke="#64748b" strokeWidth="1" fill="none" />
                            {/* Rider arm holding handlebars */}
                            <path d="M46,12 L54,20" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="54" cy="20" r="3" fill="#475569" /> {/* Handlebar grip */}
                        </svg>

                        {/* Boost Exhaust Flame */}
                        {(keysPressed.current['e'] || touchInputs.current.boost) && (
                            <div className="absolute" style={{ left: -18, top: 28, width: 20, height: 10 }}>
                                <div className="w-full h-full bg-gradient-to-l from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm animate-pulse"></div>
                                <div className="absolute inset-0 w-3/4 h-full bg-white/40 rounded-full blur-sm"></div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Particles */}
                {particles.map((p, i) => (
                    <div key={i} className="absolute rounded-full" style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: p.color, opacity: p.life / 20 }} />
                ))}
            </div>

            {/* Level 2 & 4: Echo-Location / Darkness Overlay */}
            {(stage === 2 || stage === 4) && bikes[0] && (
                <div className="absolute inset-0 z-40 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 250px at ${bikes[0].x - cameraOffset}px ${bikes[0].y}px, transparent 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)`
                    }}>
                </div>
            )}



            {/* Falling Snow Overlay - Hide in Factory */}
            {stage !== 3 && snow.map((s, i) => (
                <div key={`s-${i}`} className="absolute bg-white rounded-full opacity-60 pointer-events-none"
                    style={{ left: s.x, top: s.y, width: s.size, height: s.size }} />
            ))}

            {/* Data Log UI Overlay */}
            {dataLogActive && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <div className="bg-black/90 border border-green-500 text-green-500 p-4 font-mono text-sm shadow-2xl animate-glitch max-w-sm">
                        <div className="text-xs text-green-700 mb-1 border-b border-green-800 pb-1">SYSTEM_OVERRIDE // LOG_024</div>
                        <div className="typing-effect">
                            "Initialization complete. Core Temperature nominal. We have missed you, Probe-7."
                        </div>
                    </div>
                </div>
            )}

            {/* Story Intro Modal */}
            {showIntro && (
                <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="max-w-2xl w-full bg-slate-900 border border-blue-500/30 p-8 rounded-sm shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="text-blue-500 text-xs tracking-[0.3em] uppercase mb-2">Incoming Transmission...</div>
                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-1">
                                {stageConfig.name}
                            </h2>
                            <h3 className="text-xl text-blue-200 font-light tracking-widest uppercase">
                                {stageConfig.subtitle}
                            </h3>
                        </div>

                        <div className="text-slate-300 font-mono text-lg leading-relaxed mb-8 border-l-2 border-blue-500 pl-6 space-y-4">
                            <p className="text-yellow-400 font-bold">MISSION: SUPERNATURAL ESCAPE</p>
                            <p>"You are trapped in the Cursed Ice Mountains. The only way out is to defeat the King of the Mountain."</p>
                            <div className="bg-blue-900/40 p-4 rounded text-sm">
                                <p className="text-blue-200 font-bold mb-1">INSTRUCTIONS:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Double tap <span className="text-white font-bold">JUMP/W</span> to Double Jump over large gaps.</li>
                                    <li>Use <span className="text-white font-bold">BOOST [E]</span> to clear long distances.</li>
                                    <li className="text-red-400 font-bold underline">WARNING: You have 10 MINUTES TOTAL to complete all levels.</li>
                                </ul>
                            </div>
                            {stage === 5 && <p className="text-red-400 animate-pulse">"This is it. The King awaits. SURVIVE."</p>}
                        </div>

                        <button
                            onClick={() => setShowIntro(false)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                        >
                            <span className="animate-pulse">Acknowledged // Begin Mission</span>
                        </button>
                    </div>
                </div>
            )}



            {/* Boost Meter UI */}
            <div className="absolute bottom-20 right-10 flex flex-col items-center">
                <div className="text-cyan-400 font-bold text-sm mb-1">BOOST [E]</div>
                <div className="w-32 h-4 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-full animate-pulse"></div>
                </div>
            </div>

            <div className="absolute bottom-4 right-10 text-right opacity-70 text-xs">
                <div>[D] Fwd • [A] Back • [W] Jump • [E] Boost</div>
                {stage === 5 && <div className="text-yellow-400 font-bold animate-pulse">[F] FIRE!</div>}
            </div>

            {/* Overlays (Fixed Position) */}
            {gameState === 'failed' && (
                <GameOverOverlay
                    onRetry={() => resetGame(false)}
                    onMenu={onQuit}
                    reason={globalTime <= 0 ? "TIME CRITICAL FAILURE (10 MIN LIMIT REACHED)" : "CATASTROPHIC SYSTEM ERROR"}
                />
            )}

            {gameState === 'completed' && (
                <LevelCompleteOverlay
                    onNextLevel={onStageComplete}
                    onMenu={onQuit}
                    score={Math.floor(score + globalTime * 10)}
                    time={Math.ceil(600 - globalTime)}
                />
            )}

            <MobileControls
                onAction={(type, value) => {
                    if (type === 'move') touchInputs.current.move = value;
                    if (type === 'jump') {
                        if (value && !touchInputs.current.jump) jumpPressed.current = true;
                        touchInputs.current.jump = value;
                    }
                    if (type === 'boost') touchInputs.current.boost = value;
                }}
            />
        </div>
    );
}
