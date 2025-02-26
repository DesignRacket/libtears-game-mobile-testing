// Game variables
let player;           // Player object
let tears = [];       // Array of falling tears
let flags = [];       // Array of player-shot flags
let score = 0;        // Player score
let gameState = 'loading'; // Start with loading state
let triggerPhrase = "There are only two genders."; // Initial phrase for Level 1
let phraseTimer = 0;  // Timer for displaying trigger phrase
let isBossFight = false; // Flag to indicate boss fight
let boss = null;      // Boss object
let tearsSpawned = 0; // Number of tears spawned in Level 1
let levelTearsToSpawn = 20; // Total tears to spawn in Level 1
let ladies = [];      // Array of lady enemies for Galaga-style formation
let formationDirection = 1; // Direction of formation movement (1 = right, -1 = left)
let formationSpeed = 1;     // Speed of formation movement
let formationDropTimer = 0; // Timer for formation vertical movement
let playerSpeed = 5;  // Speed of player movement with WASD
let backgroundStars = []; // Array for parallax background stars
let currentLevel = 1; // Track current level
let powerUps = [];    // Array for power-ups
let playerLives = 3;  // Player lives
let isPlayerInvulnerable = false; // Invulnerability after hit
let invulnerabilityTimer = 0;     // Timer for invulnerability
let playerScore = 0;  // Player score
let highScore = 0;    // High score
let gameStarted = false; // Flag to check if game has started
let playerShip = { type: 'standard', color: [0, 0, 255] }; // Player ship customization
let thrustParticles = []; // Array for thrust particles
let pelosiImg = null; // Image for Nancy Pelosi boss
let fallbackImg = null; // Fallback image if loading fails
let loadingComplete = false; // Flag to track loading completion
let imageLoadAttempted = false; // Flag to track if we've tried loading the image
let isLoadingPelosiImg = false; // Flag to track if we're currently loading the Pelosi image
let patternAnnouncement = null; // For displaying pattern announcements during boss fight
let patternAnnouncementTimer = 0; // Timer for pattern announcement display
let bossDeathQuote = "You can't impeach me now..."; // Nancy's death quote
let showBossDeathQuote = false; // Flag to show boss death quote
let bossDeathQuoteTimer = 0; // Timer for boss death quote
let bossDeathPhase = 0; // Track which phase of death animation we're in
let bossDeathQuotes = [
  "You can't impeach me now...",
  "My insider trading portfolio!",
  "I would have gotten away with it too...",
  "The deep state will avenge me!",
  "Nooooooooo!"
]; // Multiple death quotes for dramatic effect
let bossRotation = 0; // For death animation rotation
let bossScale = 1; // For death animation scaling
let bossOpacity = 255; // For death animation fading
let isBossDefeated = false; // Flag to track if boss is defeated
let showTriggerPhrase = false; // Flag to show trigger phrase during gameplay
let canLadiesDropTears = false; // Flag to control when ladies can drop tears

// Global variables for mobile controls
let isMobile = false;
let touchControls = {
  leftSide: false,
  rightSide: false,
  upSide: false,
  downSide: false,
  autoFire: true,
  controlsVisible: true
};

/** Preload function to load assets */
function preload() {
  console.log('Preload function running');
  // No longer loading Pelosi image here
  loadingComplete = true;
}

/** Setup function to initialize the game */
function setup() {
  console.log('Setup function running');
  createCanvas(800, 600);
  
  // Detect if user is on mobile
  detectMobileDevice();
  
  // Create fallback image immediately
  console.log('Creating fallback image');
  createFallbackImage();
  
  // Ensure pelosiImg is set to the fallback image
  if (!pelosiImg) {
    console.log('Ensuring pelosiImg is set');
    pelosiImg = fallbackImg;
  }
  
  // Initialize game components
  initStars();
  initGame();
  
  // Hide the loading message immediately
  let loadingElement = document.getElementById('p5_loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Force transition to title screen
  gameState = 'titleScreen';
  console.log('Game state set to:', gameState);
  
  // Force loading complete
  loadingComplete = true;
}

/** Detect if the user is on a mobile device */
function detectMobileDevice() {
  // Check if the user agent string contains mobile-specific keywords
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    isMobile = true;
    console.log('Mobile device detected');
  } else {
    isMobile = false;
    console.log('Desktop device detected');
  }
  
  // Also check screen size as a fallback
  if (window.innerWidth <= 800 || window.innerHeight <= 600) {
    isMobile = true;
    console.log('Small screen detected, treating as mobile');
  }
}

/** Create a fallback image if the Pelosi image fails to load */
function createFallbackImage() {
  fallbackImg = createGraphics(300, 300);
  
  // Set background to transparent
  fallbackImg.clear();
  
  // Draw head - skin tone for Pelosi
  fallbackImg.fill(240, 208, 192);
  fallbackImg.noStroke();
  fallbackImg.ellipse(150, 150, 200, 200);
  
  // Draw hair - dark brown with highlights
  fallbackImg.fill(80, 50, 35);
  fallbackImg.arc(150, 150, 220, 220, PI, 0, CHORD);
  
  // Hair highlights
  fallbackImg.fill(120, 90, 70);
  fallbackImg.arc(150, 150, 210, 210, PI, 0, CHORD);
  
  // Draw neck
  fallbackImg.fill(230, 198, 182);
  fallbackImg.rect(130, 230, 40, 50);
  
  // Draw suit - dark blue
  fallbackImg.fill(25, 25, 112);
  fallbackImg.rect(90, 250, 120, 50);
  
  // Draw pearl necklace
  for(let i = 0; i < 9; i++) {
    fallbackImg.fill(255, 255, 250);
    fallbackImg.ellipse(110 + i*20, 255, 15, 15);
    fallbackImg.fill(240, 240, 235);
    fallbackImg.ellipse(110 + i*20, 255, 10, 10);
  }
  
  // Draw eyes
  fallbackImg.fill(255);
  fallbackImg.ellipse(120, 130, 40, 30);
  fallbackImg.ellipse(180, 130, 40, 30);
  
  // Draw pupils - dark brown
  fallbackImg.fill(50, 25, 0);
  fallbackImg.ellipse(120, 130, 20, 20);
  fallbackImg.ellipse(180, 130, 20, 20);
  
  // Draw eyebrows - thin and arched
  fallbackImg.stroke(80, 50, 35);
  fallbackImg.strokeWeight(3);
  fallbackImg.noFill();
  fallbackImg.arc(120, 115, 50, 30, PI, TWO_PI-0.8);
  fallbackImg.arc(180, 115, 50, 30, PI+0.8, TWO_PI);
  
  // Draw eyelids and wrinkles
  fallbackImg.stroke(220, 188, 172);
  fallbackImg.strokeWeight(2);
  fallbackImg.line(100, 120, 140, 120);
  fallbackImg.line(160, 120, 200, 120);
  
  // More wrinkles around eyes
  fallbackImg.stroke(220, 188, 172);
  fallbackImg.line(95, 115, 145, 115);
  fallbackImg.line(155, 115, 205, 115);
  fallbackImg.arc(120, 130, 50, 40, 0, PI/2);
  fallbackImg.arc(180, 130, 50, 40, PI/2, PI);
  
  // Draw nose
  fallbackImg.noStroke();
  fallbackImg.fill(230, 198, 182);
  fallbackImg.triangle(150, 130, 135, 170, 165, 170);
  
  // Draw mouth - thin lips with lipstick
  fallbackImg.fill(180, 70, 70);
  fallbackImg.arc(150, 190, 70, 30, 0, PI);
  fallbackImg.fill(240, 208, 192);
  fallbackImg.arc(150, 190, 65, 20, 0, PI);
  fallbackImg.fill(180, 70, 70);
  fallbackImg.arc(150, 190, 60, 15, 0, PI);
  
  // Draw cheeks with slight blush
  fallbackImg.fill(255, 150, 150, 50);
  fallbackImg.ellipse(110, 170, 40, 30);
  fallbackImg.ellipse(190, 170, 40, 30);
  
  // Add some facial lines/wrinkles
  fallbackImg.stroke(220, 188, 172);
  fallbackImg.strokeWeight(1);
  fallbackImg.line(120, 170, 140, 180);
  fallbackImg.line(160, 180, 180, 170);
  fallbackImg.noFill();
  fallbackImg.arc(150, 210, 80, 20, PI/6, 5*PI/6);
  
  // Add earrings - pearl
  fallbackImg.fill(255, 255, 250);
  fallbackImg.noStroke();
  fallbackImg.ellipse(75, 150, 20, 20);
  fallbackImg.ellipse(225, 150, 20, 20);
  
  // Add some shine to earrings
  fallbackImg.fill(255);
  fallbackImg.ellipse(72, 147, 5, 5);
  fallbackImg.ellipse(222, 147, 5, 5);
  
  // Add text label
  fallbackImg.fill(0);
  fallbackImg.noStroke();
  fallbackImg.textSize(24);
  fallbackImg.textAlign(CENTER);
  fallbackImg.textStyle(BOLD);
  fallbackImg.text("NANCY PELOSI", 150, 290);
  
  console.log("Created enhanced Pelosi fallback image");
  
  // Immediately assign this to pelosiImg so it's used right away
  pelosiImg = fallbackImg;
}

/** Initialize the parallax star background */
function initStars() {
  // Create three layers of stars with different speeds for parallax effect
  for (let layer = 0; layer < 3; layer++) {
    for (let i = 0; i < 50; i++) {
      backgroundStars.push({
        x: random(width),
        y: random(height),
        size: random(1, 4),
        speed: map(layer, 0, 2, 0.2, 1.5),
        brightness: map(layer, 0, 2, 100, 255),
        layer: layer
      });
    }
  }
}

/** Initialize or reset the game */
function initGame() {
  player = { 
    x: width / 2 - 25, 
    y: height - 50, 
    width: 50, 
    height: 30,
    health: 100,
    shield: 0,
    powerLevel: 1,
    fireRate: 10,
    // Simplified movement properties
    speed: 5, // Player movement speed
    direction: 'up', // Default direction the ship is facing
    multiShot: false // Initialize multiShot property
  };
  
  thrustParticles = [];
  tears = [];
  flags = [];
  score = 0;
  gameState = 'titleScreen'; // Start with title screen
  phraseTimer = 0;
  isBossFight = false;
  boss = null;
  tearsSpawned = 0;
  formationDirection = 1;
  formationSpeed = 1;
  formationDropTimer = 0;
  showTriggerPhrase = false; // Initialize the flag
  canLadiesDropTears = false; // Initialize the flag
  
  // Initialize the Galaga-style formation of ladies
  initLadyFormation();
  
  currentLevel = 1;
  powerUps = [];
  playerLives = 3;
}

/** Initialize the formation of ladies for Galaga-style gameplay */
function initLadyFormation() {
  ladies = [];
  
  // Create a formation of 5 ladies in a row
  for (let i = 0; i < 5; i++) {
    ladies.push({ 
      x: 150 + i * 120, 
      y: 100, 
      width: 60,  // Smaller than the original lady
      height: 75, 
      leftEyeX: -15, 
      leftEyeY: -10,
      rightEyeX: 15, 
      rightEyeY: -10,
      tearTimer: floor(random(30, 60)), // Reduced from (60, 120) to double the rate
      tearSpeed: 3,
      tearPattern: 'normal',
      health: 3, // Each lady takes 3 hits to defeat
      isHit: false,
      hitTimer: 0
    });
  }
}

/** Main draw loop */
function draw() {
  // Always ensure we have a valid game state
  if (!gameState || gameState === '') {
    console.error('Invalid game state detected, resetting to titleScreen');
    gameState = 'titleScreen';
  }

  // Force transition from loading to title screen if needed
  if (gameState === 'loading' && frameCount > 60) {
    console.log('Forcing transition from loading to title screen');
    gameState = 'titleScreen';
    
    // Hide loading message
    let loadingElement = document.getElementById('p5_loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  background(0); // Black background
  drawParallaxStars();   // Draw animated background stars

  // Debug info every 60 frames
  if (frameCount % 60 === 0) {
    console.log('Current game state:', gameState, 'Frame:', frameCount);
  }

  switch(gameState) {
    case 'loading':
      // Show loading screen
      textAlign(CENTER);
      fill(255);
      textSize(24);
      text('Loading game assets...', width / 2, height / 2);
      break;
      
    case 'titleScreen':
      drawTitleScreen();
      break;
    case 'levelStart':
      // This state can still be used if needed
      displayTriggerPhrase();
      phraseTimer++;
      if (phraseTimer > 120) { // Show phrase for ~2 seconds at 60 FPS
        phraseTimer = 0;
        if (isBossFight) {
          // Start loading the Pelosi image when transitioning to boss fight
          if (!isLoadingPelosiImg && !pelosiImg) {
            console.log('Starting to load Pelosi image for boss fight');
            loadPelosiImage();
          }
          gameState = 'boss';
          initBoss();
        } else {
          gameState = 'playing';
        }
      }
      break;
    case 'playing':
      // Always show Galaga-style formation in level 1
      updateLadyFormation();
      drawLadies();
      
      // Display trigger phrase at the top of the screen if flag is set
      if (showTriggerPhrase) {
        displayTriggerPhraseInGame();
        phraseTimer++;
        if (phraseTimer > 180) { // Show phrase for 3 seconds
          showTriggerPhrase = false;
          phraseTimer = 0;
          canLadiesDropTears = true; // Allow ladies to drop tears after phrase is done
        }
      }
      
      drawPlayer();
      handlePlayerMovement();
      handleShooting();
      moveTears();
      moveFlags();
      updatePowerUps();
      checkCollisions();
      displayHUD();
      
      // Check if level is complete
      if (ladies.length === 0) {
        triggerPhrase = "Final Boss: Nancy Pelosi";
        // Change to levelStart state for boss transition
        gameState = 'levelStart';
        phraseTimer = 0;
        isBossFight = true; // Set the boss fight flag
      }
      
      // Draw mobile controls if on mobile device
      if (isMobile && gameState === 'playing' && touchControls.controlsVisible) {
        drawMobileControls();
      }
      break;
    case 'boss':
      drawBoss();
      // Only spawn boss tears if boss is not defeated
      if (!isBossDefeated) {
        handleBossTearSpawning();
      }
      
      drawPlayer();
      handlePlayerMovement();
      // Only allow shooting if boss is not defeated
      if (!isBossDefeated) {
        handleShooting();
      }
      moveTears();
      moveFlags();
      updatePowerUps();
      checkBossCollisions();
      displayHUD();
      
      // Display pattern announcement if active
      if (patternAnnouncement && patternAnnouncementTimer > 0) {
        displayPatternAnnouncement();
        patternAnnouncementTimer--;
      }
      
      // Display boss death sequence if active
      if (showBossDeathQuote) {
        displayBossDeathSequence();
        
        // Only transition to victory after the full death sequence
        if (bossDeathPhase >= bossDeathQuotes.length) {
          showBossDeathQuote = false;
          gameState = 'victory';
        }
      }
      
      if (boss.health <= 0 && !showBossDeathQuote) {
        score += 500; // Bonus for defeating boss
        showBossDeathQuote = true;
        bossDeathQuoteTimer = 180; // Show first quote for 3 seconds
        bossDeathPhase = 0; // Start with the first death phase
        bossRotation = 0;
        bossScale = 1;
        bossOpacity = 255;
        isBossDefeated = true; // Set the boss as defeated
        
        // Clear all tears from screen for dramatic effect
        tears = [];
      }
      break;
    case 'gameOver':
      drawGameOver();
      break;
    case 'victory':
      drawVictoryScreen();
      break;
  }
}

/** Draw animated parallax star background */
function drawParallaxStars() {
  for (let i = 0; i < backgroundStars.length; i++) {
    let star = backgroundStars[i];
    
    // Move stars at different speeds for parallax effect
    star.y += star.speed;
    
    // Reset stars when they go off screen
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
    
    // Draw stars with different brightness based on layer
    fill(star.brightness);
    noStroke();
    ellipse(star.x, star.y, star.size, star.size);
    
    // Add twinkle effect to some stars
    if (random(100) < 5 && star.layer === 2) {
      fill(255, 255, 255, 150);
      ellipse(star.x, star.y, star.size * 1.5, star.size * 1.5);
    }
  }
}

/** Draw title screen */
function drawTitleScreen() {
  // Debug
  if (frameCount % 60 === 0) {
    console.log('Drawing title screen');
  }

  textAlign(CENTER);
  
  // Title
  fill(0, 150, 255);
  textSize(60);
  text("LibTears", width / 2, height / 3);
  
  // Subtitle
  fill(255);
  textSize(24);
  text("The Triggering", width / 2, height / 3 + 50);
  
  // Instructions
  textSize(20);
  text("WASD to move, SPACE to shoot", width / 2, height / 2 + 50);
  text("Neutralize the tears of the triggered!", width / 2, height / 2 + 80);
  
  // Start prompt
  textSize(24);
  if (frameCount % 60 < 30) { // Blinking effect
    text("Press SPACE to start", width / 2, height / 2 + 150);
  }
  
  // Check for space to start game
  if (keyIsDown(32)) {
    console.log('Space pressed, starting game');
    // Skip levelStart state and go directly to playing
    gameState = 'playing';
    gameStarted = true;
    // Set flag to show trigger phrase during gameplay
    showTriggerPhrase = true;
    phraseTimer = 0;
    canLadiesDropTears = false; // Don't allow tears until phrase is done
  }
}

/** Get trigger phrase for each level */
function getLevelPhrase(level) {
  const phrases = [
    "There are only two genders.",
    "Elon Musk says DOGE to the moon!",
    "The Earth is not flat.",
    "Free speech is important.",
    "Pineapple belongs on pizza.",
    "Final Boss: Nancy Pelosi"
  ];
  
  return phrases[min(level - 1, phrases.length - 1)];
}

/** Draw player ship with customization and effects */
function drawPlayer() {
  push();
  translate(player.x + player.width / 2, player.y + player.height / 2);
  
  // Draw thrust particles when moving
  if (keyIsDown(87) || keyIsDown(65) || keyIsDown(83) || keyIsDown(68)) {
    createThrustParticles();
  }
  
  // Draw all thrust particles
  drawThrustParticles();
  
  // Draw shield if active
  if (player.shield > 0) {
    noFill();
    stroke(0, 200, 255, 150);
    strokeWeight(3);
    ellipse(0, 0, player.width * 1.5, player.height * 1.5);
  }
  
  // Draw player ship based on type
  if (isPlayerInvulnerable && frameCount % 10 < 5) {
    // Blinking effect when invulnerable
    fill(255, 255, 255, 150);
  } else {
    fill(playerShip.color[0], playerShip.color[1], playerShip.color[2]);
  }
  
  noStroke();
  
  // Ship body - always pointing upward
  beginShape();
  vertex(0, -player.height / 2); // Nose
  vertex(player.width / 2, player.height / 2); // Bottom right
  vertex(0, player.height / 3); // Bottom middle
  vertex(-player.width / 2, player.height / 2); // Bottom left
  endShape(CLOSE);
  
  // Engine flames (bigger when moving)
  if (keyIsDown(87) || keyIsDown(65) || keyIsDown(83) || keyIsDown(68)) {
    fill(255, 100, 0, 150 + random(100));
    beginShape();
    vertex(-player.width / 4, player.height / 2);
    vertex(0, player.height / 2 + random(15, 30)); // Longer flame when moving
    vertex(player.width / 4, player.height / 2);
    endShape();
  } else {
    fill(255, 100, 0, 150 + random(100));
    beginShape();
    vertex(-player.width / 4, player.height / 2);
    vertex(0, player.height / 2 + random(5, 15));
    vertex(player.width / 4, player.height / 2);
    endShape();
  }
  
  // Power level indicators
  for (let i = 0; i < player.powerLevel; i++) {
    fill(255, 255, 0);
    rect(-player.width / 2 + 5 + i * 10, -player.height / 2 + 5, 5, 5);
  }
  
  pop();
}

/** Create thrust particles when ship is moving */
function createThrustParticles() {
  // Add new particles at the ship's engine position
  if (frameCount % 2 === 0) { // Control particle emission rate
    // Calculate position behind the ship
    let particleX = player.x + player.width / 2;
    let particleY = player.y + player.height;
    
    // Add some randomness to the particle position
    particleX += random(-5, 5);
    
    // Create new particle
    thrustParticles.push({
      x: particleX,
      y: particleY,
      size: random(3, 8),
      life: 30, // Particle lifetime in frames
      color: [255, random(100, 200), 0, 255], // Orange-yellow color
      vx: random(-0.5, 0.5),
      vy: random(1, 3) // Particles always move downward
    });
  }
}

/** Draw and update all thrust particles */
function drawThrustParticles() {
  for (let i = thrustParticles.length - 1; i >= 0; i--) {
    let p = thrustParticles[i];
    
    // Update particle position
    p.x += p.vx;
    p.y += p.vy;
    
    // Update particle life
    p.life--;
    
    // Remove dead particles
    if (p.life <= 0) {
      thrustParticles.splice(i, 1);
      continue;
    }
    
    // Draw particle with fading effect
    let alpha = map(p.life, 0, 30, 0, 255);
    fill(p.color[0], p.color[1], p.color[2], alpha);
    noStroke();
    ellipse(p.x - player.x - player.width/2, p.y - player.y - player.height/2, p.size, p.size);
  }
}

/** Move player based on WASD keys with direct translation */
function handlePlayerMovement() {
  // Variable to track if any movement key is pressed
  let isMoving = false;
  
  if (isMobile) {
    // Mobile touch controls
    if (touchControls.leftSide) {
      player.x -= player.speed;
      isMoving = true;
    }
    
    if (touchControls.rightSide) {
      player.x += player.speed;
      isMoving = true;
    }
    
    if (touchControls.upSide) {
      player.y -= player.speed;
      isMoving = true;
    }
    
    if (touchControls.downSide) {
      player.y += player.speed;
      isMoving = true;
    }
  } else {
    // Desktop keyboard controls
    // W key - move up
    if (keyIsDown(87)) { // W key
      player.y -= player.speed;
      isMoving = true;
    }
    
    // S key - move down
    if (keyIsDown(83)) { // S key
      player.y += player.speed;
      isMoving = true;
    }
    
    // A key - move left
    if (keyIsDown(65)) { // A key
      player.x -= player.speed;
      isMoving = true;
    }
    
    // D key - move right
    if (keyIsDown(68)) { // D key
      player.x += player.speed;
      isMoving = true;
    }
  }
  
  // Constrain player to screen boundaries
  player.x = constrain(player.x, 0, width - player.width);
  
  // Constrain vertical movement to bottom 75% of the screen
  let topBoundary = height * 0.25; // 25% from the top (75% of screen height available)
  player.y = constrain(player.y, topBoundary, height - player.height);
}

/** Shoot flags based on player power level */
function handleShooting() {
  // Don't allow shooting if boss is defeated
  if (isBossDefeated) return;
  
  // For mobile, auto-fire is enabled
  let shouldShoot = isMobile ? touchControls.autoFire : keyIsDown(32);
  
  if (shouldShoot) {
    if (frameCount % player.fireRate === 0) { // Use player's fire rate
      
      // Basic flag
      let flag = { 
        x: player.x + player.width / 2 - 5, 
        y: player.y, 
        width: 10, 
        height: 20, 
        speed: 5 + player.powerLevel * 0.5, // Speed increases with power
        damage: 1 * player.powerLevel // Damage increases with power
      };
      flags.push(flag);
      
      // Add side flags based on power level
      if (player.powerLevel >= 2) {
        let leftFlag = { 
          x: player.x + 10, 
          y: player.y + 10, 
          width: 10, 
          height: 20, 
          speed: 5 + player.powerLevel * 0.5,
          damage: 1 * player.powerLevel
        };
        flags.push(leftFlag);
      }
      
      if (player.powerLevel >= 3) {
        let rightFlag = { 
          x: player.x + player.width - 20, 
          y: player.y + 10, 
          width: 10, 
          height: 20, 
          speed: 5 + player.powerLevel * 0.5,
          damage: 1 * player.powerLevel
        };
        flags.push(rightFlag);
      }
      
      // Multi-shot power-up: add diagonal flags
      if (player.multiShot) {
        let leftDiagonal = { 
          x: player.x + 5, 
          y: player.y, 
          width: 10, 
          height: 20, 
          speed: 5,
          damage: 1 * player.powerLevel,
          xSpeed: -1.5 // Move left as it goes up
        };
        flags.push(leftDiagonal);
        
        let rightDiagonal = { 
          x: player.x + player.width - 15, 
          y: player.y, 
          width: 10, 
          height: 20, 
          speed: 5,
          damage: 1 * player.powerLevel,
          xSpeed: 1.5 // Move right as it goes up
        };
        flags.push(rightDiagonal);
      }
    }
  }
}

/** Update the formation of ladies (Galaga-style movement) */
function updateLadyFormation() {
  // Move the entire formation horizontally
  let shouldChangeDirection = false;
  let shouldDropDown = false;
  
  // Check if formation should change direction
  for (let lady of ladies) {
    if ((formationDirection > 0 && lady.x + lady.width/2 > width - 50) || 
        (formationDirection < 0 && lady.x - lady.width/2 < 50)) {
      shouldChangeDirection = true;
      shouldDropDown = true;
      break;
    }
  }
  
  // Change direction and drop down if needed
  if (shouldChangeDirection) {
    formationDirection *= -1;
    formationDropTimer = 30; // Set timer for dropping down
  }
  
  // Move formation horizontally
  for (let lady of ladies) {
    lady.x += formationSpeed * formationDirection;
  }
  
  // Handle vertical movement (dropping down)
  if (formationDropTimer > 0) {
    formationDropTimer--;
    
    // Move formation down
    for (let lady of ladies) {
      lady.y += 0.5;
    }
  }
  
  // Increase formation speed slightly as ladies are defeated
  if (frameCount % 300 === 0) {
    formationSpeed = min(formationSpeed + 0.1, 3);
  }
  
  // Check if any ladies have reached the bottom of the screen
  for (let i = 0; i < ladies.length; i++) {
    let lady = ladies[i];
    
    // If lady reaches the bottom, move her back to the top with a new random x position
    if (lady.y > height) {
      lady.y = -lady.height;
      lady.x = random(50, width - 50);
      // Randomize tear pattern when respawning
      const patterns = ['normal', 'spread', 'aimed'];
      lady.tearPattern = patterns[floor(random(patterns.length))];
    }
    
    // Update hit effect timer
    if (lady.isHit) {
      lady.hitTimer--;
      if (lady.hitTimer <= 0) {
        lady.isHit = false;
      }
    }
    
    // Only update tear timer and spawn tears if allowed
    if (canLadiesDropTears) {
      // Update tear timer
      lady.tearTimer--;
      
      // Spawn tears when timer reaches zero
      if (lady.tearTimer <= 0) {
        // Random chance to shoot tears based on level
        if (random(100) < 20 + currentLevel * 5) {
          spawnTearsFromLady(lady);
        }
        
        // Reset tear timer with some randomness - reduced to double the rate
        lady.tearTimer = floor(random(45, 75)); // Reduced from (90, 150)
      }
    }
  }
}

/** Draw all ladies in the formation */
function drawLadies() {
  for (let lady of ladies) {
    drawLady(lady);
  }
}

/** Draw a single lady character with COVID mask */
function drawLady(lady) {
  push();
  translate(lady.x, lady.y);
  
  // Draw head (neutral tan skin tone) - flash white if hit
  if (lady.isHit) {
    fill(255);
  } else {
    fill(210, 180, 140); // Neutral tan skin tone
  }
  ellipse(0, 0, lady.width, lady.height);
  
  // Draw short purple hair on top of the round part of the head
  fill(160, 32, 240); // Purple hair color
  arc(0, 0, lady.width, lady.height/2, PI+QUARTER_PI, TWO_PI-QUARTER_PI, CHORD);
  
  // Add purple highlights
  fill(200, 100, 255); // Lighter purple for highlights
  arc(0, 0, lady.width - 10, lady.height/2 - 5, PI+QUARTER_PI, TWO_PI-QUARTER_PI, CHORD);
  
  // Add some short spiky hair on top
  fill(160, 32, 240); // Purple hair color
  for(let i = -20; i <= 20; i += 8) {
    // Draw spikes of different heights
    let spikeHeight = random(5, 12);
    triangle(i, -lady.height/4, i + 4, -lady.height/4 - spikeHeight, i - 4, -lady.height/4 - spikeHeight);
  }
  
  // Draw eyes (white with black pupils)
  fill(255);
  ellipse(lady.leftEyeX, lady.leftEyeY, 20, 15);
  ellipse(lady.rightEyeX, lady.rightEyeY, 20, 15);
  
  fill(0);
  ellipse(lady.leftEyeX, lady.leftEyeY, 8, 8);
  ellipse(lady.rightEyeX, lady.rightEyeY, 8, 8);
  
  // Draw COVID mask (light blue) - half the size to fit face better
  fill(173, 216, 230);
  rect(-15, 5, 30, 20, 5); // Reduced from (-30, 5, 60, 40, 10)
  
  // Draw mask straps - adjusted for smaller mask
  stroke(173, 216, 230);
  strokeWeight(3); // Thinner straps for smaller mask
  line(-15, 10, -35, -5);
  line(15, 10, 35, -5);
  noStroke();
  
  // Draw health indicators
  for (let i = 0; i < lady.health; i++) {
    fill(255, 0, 0);
    rect(-lady.width/4 + i * 10, -lady.height/2 - 10, 8, 5);
  }
  
  pop();
}

/** Spawn tears from a specific lady */
function spawnTearsFromLady(lady) {
  switch(lady.tearPattern) {
    case 'normal':
      // Left eye tear
      let leftTear = { 
        x: lady.x + lady.leftEyeX, 
        y: lady.y + lady.leftEyeY + 10, 
        width: 15, 
        height: 25, 
        speed: lady.tearSpeed,
        fromBoss: false // Mark as lady tear for collision detection
      };
      tears.push(leftTear);
      
      // Right eye tear
      let rightTear = { 
        x: lady.x + lady.rightEyeX, 
        y: lady.y + lady.rightEyeY + 10, 
        width: 15, 
        height: 25, 
        speed: lady.tearSpeed,
        fromBoss: false // Mark as lady tear for collision detection
      };
      tears.push(rightTear);
      break;
      
    case 'spread':
      // Spawn 3 tears in a spread pattern
      for (let i = -1; i <= 1; i++) {
        let tear = { 
          x: lady.x + i * 15, 
          y: lady.y + 20, 
          width: 15, 
          height: 25, 
          speed: lady.tearSpeed,
          xSpeed: i * 0.5, // Horizontal movement
          fromBoss: false // Mark as lady tear for collision detection
        };
        tears.push(tear);
      }
      break;
      
    case 'aimed':
      // Calculate angle to player
      let dx = player.x + player.width/2 - lady.x;
      let dy = player.y + player.height/2 - lady.y;
      let angle = atan2(dy, dx);
      
      // Aimed tear
      let aimedTear = { 
        x: lady.x, 
        y: lady.y + 10, 
        width: 15, 
        height: 25, 
        speed: 0,
        xSpeed: cos(angle) * lady.tearSpeed,
        ySpeed: sin(angle) * lady.tearSpeed,
        fromBoss: false // Mark as lady tear for collision detection
      };
      tears.push(aimedTear);
      break;
  }
  
  tearsSpawned += 2;
}

/** Check collisions for all game objects */
function checkCollisions() {
  // Check flag collisions with ladies
  for (let i = flags.length - 1; i >= 0; i--) {
    let flag = flags[i];
    
    // Check collision with ladies
    for (let j = ladies.length - 1; j >= 0; j--) {
      let lady = ladies[j];
      
      if (dist(flag.x + flag.width/2, flag.y + flag.height/2, lady.x, lady.y) < (flag.width + lady.width) / 2) {
        // Remove flag
        flags.splice(i, 1);
        
        // Reduce lady health
        lady.health -= flag.damage || 1;
        
        // Hit effect
        lady.isHit = true;
        lady.hitTimer = 10;
        
        // Add score
        score += 10;
        
        // Check if lady is defeated
        if (lady.health <= 0) {
          // Chance to spawn power-up (20%)
          if (random(100) < 20) {
            spawnPowerUp(lady.x, lady.y);
          }
          
          // Remove lady
          ladies.splice(j, 1);
          
          // Add score for defeating lady
          score += 50;
        }
        
        break;
      }
    }
  }
  
  // Check tear collisions with flags and player
  for (let i = tears.length - 1; i >= 0; i--) {
    let tear = tears[i];
    
    // Check collision with flags
    for (let j = flags.length - 1; j >= 0; j--) {
      let flag = flags[j];
      if (dist(flag.x + flag.width/2, flag.y + flag.height/2, tear.x, tear.y) < (flag.width + tear.width) / 2) {
        // Add score
        score += 10 * currentLevel;
        
        // Remove flag
        flags.splice(j, 1);
        
        // Remove tear
        tears.splice(i, 1);
        
        // Chance to spawn power-up (10%)
        if (random(100) < 10) {
          spawnPowerUp(tear.x, tear.y);
        }
        
        break;
      }
    }
    
    // Check collision with player if tear still exists
    if (i >= 0 && i < tears.length) {
      tear = tears[i];
      if (dist(tear.x, tear.y, player.x + player.width/2, player.y + player.height/2) < (tear.width + player.width) / 2) {
        // Remove tear
        tears.splice(i, 1);
        
        // If player has shield, reduce shield instead of health
        if (player.shield > 0) {
          player.shield -= 20;
          if (player.shield < 0) player.shield = 0;
        } 
        // Otherwise, if player is not invulnerable, reduce health
        else if (!isPlayerInvulnerable) {
          // Reduce player health by exactly 20% of max health (which is 100)
          player.health -= 20;
          
          // Make player invulnerable briefly
          isPlayerInvulnerable = true;
          invulnerabilityTimer = 90; // 1.5 seconds at 60 FPS
          console.log("Player hit by lady tear, invulnerability activated");
          
          // Check if player is dead
          if (player.health <= 0) {
            playerLives--;
            
            if (playerLives <= 0) {
              gameState = 'gameOver';
            } else {
              // Reset player position and health
              player.x = width / 2 - 25;
              player.y = height - 50;
              player.health = 100;
            }
          }
        }
      }
    }
  }
  
  // Update invulnerability
  if (isPlayerInvulnerable) {
    invulnerabilityTimer--;
    if (invulnerabilityTimer <= 0) {
      isPlayerInvulnerable = false;
      console.log("Player invulnerability ended");
    }
  }
}

/** Display current score */
function displayScore() {
  fill(255);
  textSize(20);
  text(`Score: ${score}`, 50, 30);
}

/** Initialize the boss with unique characteristics */
function initBoss() {
  boss = { 
    x: width / 2, 
    y: 100, 
    width: 120, 
    height: 150, 
    health: 75,
    maxHealth: 75,
    color: [200, 150, 150], // Skin tone base color
    name: "Nancy Pelosi",
    pattern: "congressional", // New pattern type
    moveSpeed: 2,
    moveDirection: 1,
    tearTimer: 0,
    isHit: false,
    rotation: 0,
    rotationSpeed: 0.01,
    patternPhase: 0, // Track which pattern to use
    patternTimer: 0,  // Timer for pattern changes
    previousHealthPercentage: null,
    patternSet: 0 // Track current pattern set
  };
  
  // If we don't have the Pelosi image yet, use the fallback
  if (!pelosiImg) {
    pelosiImg = fallbackImg;
  }
}

/** Draw boss with animations and effects */
function drawBoss() {
  push();
  translate(boss.x, boss.y);
  
  // Boss movement
  boss.x += boss.moveSpeed * boss.moveDirection;
  if (boss.x > width - 100 || boss.x < 100) {
    boss.moveDirection *= -1;
  }
  
  // Rotate the boss slightly for floating effect
  boss.rotation += boss.rotationSpeed;
  rotate(sin(boss.rotation) * 0.1);
  
  // Hit effect
  if (boss.isHit) {
    tint(255, 100, 100, 230);
  }
  
  // Check if image is loaded and valid
  if (pelosiImg && pelosiImg.width > 0) {
    // Draw Pelosi image if available and loaded
    imageMode(CENTER);
    image(pelosiImg, 0, 0, boss.width, boss.height);
    noTint(); // Reset tint
  } else {
    // Use the fallback image we created
    imageMode(CENTER);
    image(fallbackImg, 0, 0, boss.width, boss.height);
    noTint(); // Reset tint
  }
  
  pop();
  
  // Health bar
  fill(100);
  rect(width/2 - 100, 20, 200, 20);
  
  if (boss.health > boss.maxHealth * 0.6) {
    fill(0, 255, 0);
  } else if (boss.health > boss.maxHealth * 0.3) {
    fill(255, 255, 0);
  } else {
    fill(255, 0, 0);
  }
  
  let healthWidth = map(boss.health, 0, boss.maxHealth, 0, 200);
  rect(width/2 - 100, 20, healthWidth, 20);
  
  // Boss name
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(boss.name, width/2, 55);
}

/** Handle boss tear spawning with different patterns */
function handleBossTearSpawning() {
  // Don't spawn tears if boss is defeated
  if (isBossDefeated) return;
  
  boss.tearTimer++;
  
  // Track previous health percentage to detect threshold crossings
  if (!boss.previousHealthPercentage) {
    boss.previousHealthPercentage = boss.health / boss.maxHealth;
    
    // Initialize with the first pattern set
    boss.patternSet = 0; // Default patterns (75-50% health)
    boss.patternPhase = 0; // Start with first pattern in the set
    
    // Announce initial pattern
    let patternNames = [
      // Basic patterns (75-50% health) - Ordered by difficulty
      "Gavel Attack", "Filibuster Tears", "Budget Breakdown",
      // Aggressive patterns (50-10% health) - Ordered by difficulty
      "Insider Trading", "Political Spin", "Fundraising Frenzy",
      // Desperate patterns (10-0% health) - Ordered by difficulty
      "Emergency Powers", "Impeachment Fury", "Last Stand"
    ];
    
    patternAnnouncement = patternNames[boss.patternPhase];
    patternAnnouncementTimer = 120; // Show for 2 seconds
    
    console.log("Boss fight initialized with pattern: " + patternNames[boss.patternPhase]);
  }
  
  // Calculate current health percentage
  let currentHealthPercentage = boss.health / boss.maxHealth;
  
  // Check for threshold crossings
  if (boss.previousHealthPercentage > 0.5 && currentHealthPercentage <= 0.5) {
    // Crossed 50% threshold - switch to aggressive patterns
    console.log("Boss health dropped below 50%, switching to aggressive patterns");
    boss.patternSet = 1;
    boss.patternPhase = 3; // First aggressive pattern
    boss.patternTimer = 0; // Reset pattern timer
    
    // Announce pattern change
    patternAnnouncement = "Insider Trading";
    patternAnnouncementTimer = 120; // Show for 2 seconds
  }
  else if (boss.previousHealthPercentage > 0.1 && currentHealthPercentage <= 0.1) {
    // Crossed 10% threshold - switch to desperate patterns
    console.log("Boss health dropped below 10%, switching to desperate patterns");
    boss.patternSet = 2;
    boss.patternPhase = 6; // First desperate pattern
    boss.patternTimer = 0; // Reset pattern timer
    
    // Announce pattern change
    patternAnnouncement = "Emergency Powers";
    patternAnnouncementTimer = 120; // Show for 2 seconds
  }
  
  // Update previous health percentage for next frame
  boss.previousHealthPercentage = currentHealthPercentage;
  
  // Cycle through patterns within the current set every few seconds
  boss.patternTimer++;
  
  // Change pattern every 5 seconds (or faster at lower health)
  let patternChangeTime = 300; // 5 seconds at 60 FPS
  if (boss.patternSet === 1) patternChangeTime = 240; // 4 seconds at 60 FPS
  if (boss.patternSet === 2) patternChangeTime = 180; // 3 seconds at 60 FPS
  
  if (boss.patternTimer > patternChangeTime) {
    // Different pattern phases based on health
    let oldPatternPhase = boss.patternPhase;
    
    if (boss.patternSet === 0) {
      // Basic patterns (0-2) - cycle through in order of increasing difficulty
      boss.patternPhase = (boss.patternPhase + 1) % 3;
      if (boss.patternPhase < oldPatternPhase) boss.patternPhase = 0; // Ensure we don't go backwards in difficulty
    } else if (boss.patternSet === 1) {
      // Aggressive patterns (3-5) - cycle through in order of increasing difficulty
      boss.patternPhase = 3 + ((boss.patternPhase - 3 + 1) % 3);
      if (boss.patternPhase < oldPatternPhase) boss.patternPhase = 3; // Ensure we don't go backwards in difficulty
    } else {
      // Desperate patterns (6-8) - cycle through in order of increasing difficulty
      boss.patternPhase = 6 + ((boss.patternPhase - 6 + 1) % 3);
      if (boss.patternPhase < oldPatternPhase) boss.patternPhase = 6; // Ensure we don't go backwards in difficulty
    }
    
    boss.patternTimer = 0;
    
    // Announce pattern change with text
    let patternNames = [
      // Basic patterns (75-50% health)
      "Gavel Attack", "Filibuster Tears", "Budget Breakdown",
      // Aggressive patterns (50-10% health)
      "Insider Trading", "Political Spin", "Fundraising Frenzy",
      // Desperate patterns (10-0% health)
      "Emergency Powers", "Impeachment Fury", "Last Stand"
    ];
    
    console.log("Boss pattern changing from " + patternNames[oldPatternPhase] + " to " + patternNames[boss.patternPhase]);
    
    patternAnnouncement = patternNames[boss.patternPhase];
    patternAnnouncementTimer = 120; // Show for 2 seconds
  }
  
  // Spawn tears based on current pattern phase
  // Adjust spawn rate based on health - faster at lower health
  let spawnRate = 30; // Default spawn rate
  if (boss.patternSet === 1) spawnRate = 25;
  if (boss.patternSet === 2) spawnRate = 20;
  
  if (boss.tearTimer >= spawnRate) {
    switch(boss.patternPhase) {
      // Basic patterns (75-50% health)
      case 0: // Gavel pattern - tears fall in a hammer pattern
        spawnGavelTears();
        break;
      case 1: // Filibuster pattern - rapid circular tears
        spawnFilibusterTears();
        break;
      case 2: // Budget pattern - large wave of tears
        spawnBudgetTears();
        break;
        
      // Aggressive patterns (50-10% health)
      case 3: // Insider Trading - targeted tears that follow player
        spawnInsiderTradingTears();
        break;
      case 4: // Political Spin - spiral pattern of tears
        spawnPoliticalSpinTears();
        break;
      case 5: // Fundraising Frenzy - random bursts across the screen
        spawnFundraisingTears();
        break;
        
      // Desperate patterns (10-0% health)
      case 6: // Emergency Powers - screen-filling pattern
        spawnEmergencyPowersTears();
        break;
      case 7: // Impeachment Fury - rapid fire in all directions
        spawnImpeachmentTears();
        break;
      case 8: // Last Stand - combination of multiple patterns
        spawnLastStandTears();
        break;
    }
    
    boss.tearTimer = 0;
  }
}

/** Spawn tears in a gavel (hammer) pattern */
function spawnGavelTears() {
  // Handle shape
  for (let i = 0; i < 5; i++) {
    let tear = { 
      x: boss.x - 40 + i * 20, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 4,
      color: [200, 200, 255],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
  
  // Handle stem
  for (let i = 0; i < 3; i++) {
    let tear = { 
      x: boss.x, 
      y: boss.y + 20 + i * 20, 
      width: 15, 
      height: 25, 
      speed: 4,
      color: [200, 200, 255],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in a filibuster pattern (rapid circular) */
function spawnFilibusterTears() {
  let numTears = 12;
  for (let i = 0; i < numTears; i++) {
    let angle = i * TWO_PI / numTears;
    let tear = { 
      x: boss.x + cos(angle) * 50, 
      y: boss.y + sin(angle) * 50, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(angle) * 3.5,
      ySpeed: sin(angle) * 3.5,
      color: [150, 150, 255],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in a budget breakdown pattern (large wave) */
function spawnBudgetTears() {
  // Create a wave of dollar-colored tears
  for (let i = 0; i < width; i += 40) {
    let tear = { 
      x: i, 
      y: boss.y + 30, 
      width: 20, 
      height: 30, 
      speed: 3 + random(2),
      waveAmplitude: 10,
      waveFrequency: 0.1,
      wavePhase: i * 0.1,
      originalX: i,
      color: [50, 200, 50], // Dollar green
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in an Insider Trading pattern (targeted at player) */
function spawnInsiderTradingTears() {
  // Calculate angle to player
  let dx = player.x + player.width/2 - boss.x;
  let dy = player.y + player.height/2 - boss.y;
  let angle = atan2(dy, dx);
  
  // Spawn 5 tears in the player's direction with slight spread
  for (let i = -2; i <= 2; i++) {
    let spreadAngle = angle + i * 0.15;
    let tear = { 
      x: boss.x, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(spreadAngle) * 4,
      ySpeed: sin(spreadAngle) * 4,
      color: [255, 215, 0], // Gold color for money/insider trading
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in a Political Spin pattern (spiral) */
function spawnPoliticalSpinTears() {
  let numTears = 16;
  let spiralRadius = 20;
  
  for (let i = 0; i < numTears; i++) {
    let angle = i * TWO_PI / numTears;
    let tear = { 
      x: boss.x, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(angle) * 3,
      ySpeed: sin(angle) * 3,
      spiralAngle: angle,
      spiralRadius: spiralRadius,
      spiralSpeed: 0.1,
      color: [255, 100, 100],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in a Fundraising Frenzy pattern (random bursts) */
function spawnFundraisingTears() {
  // Create 3 random burst locations
  for (let j = 0; j < 3; j++) {
    let burstX = random(100, width - 100);
    let burstY = random(100, height / 2);
    
    // Create a burst of tears at each location
    for (let i = 0; i < 8; i++) {
      let angle = i * TWO_PI / 8;
      let tear = { 
        x: burstX, 
        y: burstY, 
        width: 15, 
        height: 25, 
        speed: 0,
        xSpeed: cos(angle) * 3,
        ySpeed: sin(angle) * 3,
        color: [0, 200, 100], // Money green
        fromBoss: true // Mark as boss tear for collision detection
      };
      tears.push(tear);
    }
  }
}

/** Spawn tears in an Emergency Powers pattern (screen-filling) */
function spawnEmergencyPowersTears() {
  // Create a grid of tears covering most of the screen
  for (let x = 100; x < width - 100; x += 80) {
    for (let y = 100; y < height / 2; y += 80) {
      let tear = { 
        x: x, 
        y: y, 
        width: 20, 
        height: 30, 
        speed: 2 + random(1),
        color: [255, 0, 0], // Red for emergency
        fromBoss: true // Mark as boss tear for collision detection
      };
      tears.push(tear);
    }
  }
}

/** Spawn tears in an Impeachment Fury pattern (rapid fire) */
function spawnImpeachmentTears() {
  // Rapid fire in all directions
  let numTears = 24; // More tears than the filibuster pattern
  for (let i = 0; i < numTears; i++) {
    let angle = i * TWO_PI / numTears;
    let tear = { 
      x: boss.x, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(angle) * 5, // Faster than normal
      ySpeed: sin(angle) * 5,
      color: [255, 50, 50], // Angry red
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Spawn tears in a Last Stand pattern (combination) */
function spawnLastStandTears() {
  // Combine multiple patterns for a final desperate attack
  
  // Pattern 1: Targeted at player
  let dx = player.x + player.width/2 - boss.x;
  let dy = player.y + player.height/2 - boss.y;
  let angle = atan2(dy, dx);
  
  for (let i = -1; i <= 1; i++) {
    let spreadAngle = angle + i * 0.2;
    let tear = { 
      x: boss.x, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(spreadAngle) * 4.5,
      ySpeed: sin(spreadAngle) * 4.5,
      color: [255, 0, 0],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
  
  // Pattern 2: Circular burst
  let numTears = 12;
  for (let i = 0; i < numTears; i++) {
    let burstAngle = i * TWO_PI / numTears;
    let tear = { 
      x: boss.x, 
      y: boss.y, 
      width: 15, 
      height: 25, 
      speed: 0,
      xSpeed: cos(burstAngle) * 3.5,
      ySpeed: sin(burstAngle) * 3.5,
      color: [150, 0, 255],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
  
  // Pattern 3: Random tears from above
  for (let i = 0; i < 5; i++) {
    let tear = { 
      x: random(width), 
      y: 0, 
      width: 20, 
      height: 30, 
      speed: 4 + random(2),
      color: [0, 0, 255],
      fromBoss: true // Mark as boss tear for collision detection
    };
    tears.push(tear);
  }
}

/** Display trigger phrase for level or boss start */
function displayTriggerPhrase() {
  textAlign(CENTER);
  fill(255);
  textSize(24);
  text(triggerPhrase, width / 2, height / 2);
}

/** Display trigger phrase during gameplay at the middle of the screen */
function displayTriggerPhraseInGame() {
  push();
  textAlign(CENTER);
  
  // Create a semi-transparent background for better readability
  fill(0, 0, 0, 150);
  rect(width/2 - 300, height/2 - 25, 600, 50, 10);
  
  // Draw the text with a flashing effect
  if (frameCount % 30 < 15) {
    fill(255, 100, 100); // Red-ish
  } else {
    fill(255, 255, 100); // Yellow-ish
  }
  
  textSize(24);
  text(triggerPhrase, width / 2, height / 2);
  pop();
}

/** Display game HUD (Heads-Up Display) */
function displayHUD() {
  // Score
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text(`Score: ${score}`, 20, 30);
  
  // Lives
  for (let i = 0; i < playerLives; i++) {
    fill(0, 0, 255);
    triangle(
      width - 30 - i * 30, 20,
      width - 20 - i * 30, 40,
      width - 40 - i * 30, 40
    );
  }
  
  // Health bar
  fill(100);
  rect(20, height - 30, 200, 15);
  
  if (player.health > 60) {
    fill(0, 255, 0);
  } else if (player.health > 30) {
    fill(255, 255, 0);
  } else {
    fill(255, 0, 0);
  }
  
  rect(20, height - 30, player.health * 2, 15);
  
  // Level indicator
  textAlign(CENTER);
  text(`Level ${currentLevel}`, width / 2, 30);
  
  // Shield indicator
  if (player.shield > 0) {
    fill(0, 200, 255);
    text(`Shield: ${player.shield}`, width / 2, height - 20);
  }
}

/** Draw game over screen */
function drawGameOver() {
  textAlign(CENTER);
  fill(255);
  textSize(60);
  text('GAME OVER', width / 2, height / 2 - 40);
  
  textSize(32);
  text(`Score: ${score}`, width / 2, height / 2 + 40);
  
  if (score > highScore) {
    highScore = score;
    fill(255, 255, 0);
    text('NEW HIGH SCORE!', width / 2, height / 2 + 80);
  } else {
    fill(200);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 80);
  }
  
  textSize(24);
  if (frameCount % 60 < 30) { // Blinking effect
    fill(255);
    text('Press SPACE to restart', width / 2, height / 2 + 150);
  }
  
  // Check for space bar to restart the game
  if (keyIsDown(32)) {
    initGame();
  }
}

/** Draw victory screen */
function drawVictoryScreen() {
  textAlign(CENTER);
  
  // Draw a decorative American flag
  drawAmericanFlag(width / 2 - 100, height / 2 - 100, 200, 120);
  
  // Victory title - moved above the flag
  fill(255, 215, 0); // Gold
  textSize(60);
  text('VICTORY!', width / 2, height / 2 - 130);
  
  // Score
  fill(255);
  textSize(32);
  text(`Final Score: ${score}`, width / 2, height / 2 + 40);
  
  // Congratulatory message
  textSize(24);
  text('You have defeated Nancy Pelosi and saved America!', width / 2, height / 2 + 80);
  
  // Additional congratulatory message
  textSize(20);
  fill(100, 255, 100);
  text('The Constitution is safe once again.', width / 2, height / 2 + 120);
  
  // Credits
  fill(200, 200, 200);
  textSize(16);
  text('Thanks for playing LibTears: The Triggering', width / 2, height / 2 + 170);
}

/** Draw a simple American flag */
function drawAmericanFlag(x, y, w, h) {
  push();
  
  // Draw stripes
  for (let i = 0; i < 13; i++) {
    if (i % 2 === 0) {
      fill(255, 0, 0); // Red
    } else {
      fill(255); // White
    }
    rect(x, y + i * (h / 13), w, h / 13);
  }
  
  // Draw blue field
  fill(0, 0, 128); // Navy blue
  rect(x, y, w * 0.4, h * 7/13);
  
  // Draw stars (simplified)
  fill(255);
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      let starX = x + 10 + j * (w * 0.4 / 6);
      let starY = y + 10 + i * (h * 7/13 / 5);
      drawStar(starX, starY, 3, 6, 5);
    }
  }
  
  pop();
}

/** Draw a star shape */
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  
  beginShape();
  for (let a = -PI/2; a < TWO_PI-PI/2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/** Display pattern announcement during boss fight */
function displayPatternAnnouncement() {
  push();
  textAlign(CENTER);
  
  // Flash between colors
  if (frameCount % 10 < 5) {
    fill(255, 50, 50, 200);
  } else {
    fill(255, 255, 50, 200);
  }
  
  textSize(28);
  // Draw with slight shadow for better visibility
  fill(0, 0, 0, 150);
  // Modified to display below Nancy (boss.y is around 100, so boss.y + 180 puts it below)
  text(patternAnnouncement, width / 2 + 2, boss.y + 180 + 2);
  
  if (frameCount % 10 < 5) {
    fill(255, 50, 50, 200);
  } else {
    fill(255, 255, 50, 200);
  }
  // Modified to display below Nancy
  text(patternAnnouncement, width / 2, boss.y + 180);
  pop();
}

/** Display boss death sequence */
function displayBossDeathSequence() {
  // Draw the boss with death effects
  push();
  translate(boss.x, boss.y);
  
  // Apply death animation effects based on phase
  if (bossDeathPhase > 0) {
    // Increase rotation as death progresses
    bossRotation += 0.01 * bossDeathPhase;
    rotate(sin(bossRotation) * 0.2 * bossDeathPhase);
    
    // Pulsate size
    bossScale = 1 + sin(frameCount * 0.1) * 0.05 * bossDeathPhase;
    scale(bossScale);
    
    // Flash red
    if (frameCount % 10 < 5) {
      tint(255, 100, 100, bossOpacity);
    } else {
      tint(255, 255, 255, bossOpacity);
    }
  }
  
  // Draw Pelosi image
  if (pelosiImg && pelosiImg.width > 0) {
    imageMode(CENTER);
    image(pelosiImg, 0, 0, boss.width, boss.height);
  } else {
    imageMode(CENTER);
    image(fallbackImg, 0, 0, boss.width, boss.height);
  }
  noTint();
  pop();
  
  // Draw speech bubble with current death quote
  push();
  textAlign(CENTER);
  
  // Draw speech bubble - MODIFIED to appear below Nancy instead of above
  fill(255, 255, 255, 200);
  rect(boss.x - 180, boss.y + 80, 360, 60, 10);
  
  // Draw speech bubble pointer - MODIFIED to point upward to Nancy
  triangle(
    boss.x, boss.y + 80,
    boss.x - 10, boss.y + 90,
    boss.x + 10, boss.y + 90
  );
  
  // Draw text - MODIFIED y position to be below Nancy
  fill(0);
  textSize(18);
  text(bossDeathQuotes[bossDeathPhase], boss.x, boss.y + 110);
  pop();
  
  // Add dramatic background effects
  push();
  // Draw explosion-like effects around the boss
  if (bossDeathPhase > 1) {
    for (let i = 0; i < 3; i++) {
      let explosionX = boss.x + random(-50, 50);
      let explosionY = boss.y + random(-50, 50);
      let explosionSize = random(10, 30) * bossDeathPhase;
      
      // Draw explosion
      fill(255, random(100, 200), 0, random(100, 200));
      ellipse(explosionX, explosionY, explosionSize, explosionSize);
    }
  }
  
  // Add screen shake for later phases
  if (bossDeathPhase > 2) {
    translate(random(-5, 5), random(-5, 5));
  }
  pop();
  
  // Update timer and phase
  bossDeathQuoteTimer--;
  
  // Progress to next phase when timer expires
  if (bossDeathQuoteTimer <= 0) {
    bossDeathPhase++;
    
    // Set timer for next phase, longer for final phase
    if (bossDeathPhase < bossDeathQuotes.length) {
      bossDeathQuoteTimer = 180; // 3 seconds for each quote
    } else {
      // Final phase - dramatic explosion and fade out
      bossDeathQuoteTimer = 240; // 4 seconds for final explosion
      
      // Create a burst of particles for final explosion
      for (let i = 0; i < 50; i++) {
        let angle = random(TWO_PI);
        let speed = random(1, 5);
        let tear = {
          x: boss.x,
          y: boss.y,
          width: random(10, 30),
          height: random(10, 30),
          speed: 0,
          xSpeed: cos(angle) * speed,
          ySpeed: sin(angle) * speed,
          color: [255, random(0, 100), 0],
          life: 240, // Particles last for 4 seconds
          fromBoss: false // Not harmful to player
        };
        tears.push(tear);
      }
    }
    
    // For the last phase, start reducing opacity
    if (bossDeathPhase >= bossDeathQuotes.length - 1) {
      // Start fading out the boss
      let fadeInterval = setInterval(() => {
        bossOpacity -= 5;
        if (bossOpacity <= 0) {
          clearInterval(fadeInterval);
        }
      }, 100);
    }
  }
}

/** Display boss death quote - replaced by the more dramatic sequence */
function displayBossDeathQuote() {
  // This function is now replaced by displayBossDeathSequence
  // Keeping it for compatibility
  displayBossDeathSequence();
}

/** Spawn and manage power-ups */
function spawnPowerUp(x, y) {
  // Random power-up type
  const types = ['health', 'shield', 'power', 'rapidFire', 'multiShot'];
  const type = types[floor(random(types.length))];
  
  powerUps.push({
    x: x,
    y: y,
    width: 20,
    height: 20,
    type: type,
    speed: 2,
    rotation: 0
  });
}

/** Update and draw power-ups */
function updatePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    
    // Move power-up down
    powerUp.y += powerUp.speed;
    powerUp.rotation += 0.05;
    
    // Remove if off screen
    if (powerUp.y > height) {
      powerUps.splice(i, 1);
      continue;
    }
    
    // Draw power-up
    push();
    translate(powerUp.x, powerUp.y);
    rotate(powerUp.rotation);
    
    // Different colors for different power-ups
    switch(powerUp.type) {
      case 'health':
        fill(255, 0, 0); // Red for health
        break;
      case 'shield':
        fill(0, 200, 255); // Blue for shield
        break;
      case 'power':
        fill(255, 255, 0); // Yellow for power
        break;
      case 'rapidFire':
        fill(0, 255, 0); // Green for rapid fire
        break;
      case 'multiShot':
        fill(255, 0, 255); // Purple for multi-shot
        break;
    }
    
    // Draw power-up shape
    rect(-powerUp.width/2, -powerUp.height/2, powerUp.width, powerUp.height);
    
    // Draw icon based on type
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(powerUp.type.charAt(0).toUpperCase(), 0, 0);
    
    pop();
    
    // Check collision with player
    if (dist(powerUp.x, powerUp.y, player.x + player.width/2, player.y + player.height/2) < 30) {
      // Apply power-up effect
      applyPowerUp(powerUp.type);
      // Remove power-up
      powerUps.splice(i, 1);
      // Sound effect
      // playSound('powerup');
    }
  }
}

/** Apply power-up effects */
function applyPowerUp(type) {
  switch(type) {
    case 'health':
      player.health = min(player.health + 25, 100);
      break;
    case 'shield':
      player.shield = 100; // Shield lasts for a certain amount of time/hits
      break;
    case 'power':
      player.powerLevel = min(player.powerLevel + 1, 5);
      break;
    case 'rapidFire':
      player.fireRate = 5; // Faster firing rate
      setTimeout(() => { player.fireRate = 10; }, 10000); // Reset after 10 seconds
      break;
    case 'multiShot':
      // Will be handled in shooting function
      player.multiShot = true;
      setTimeout(() => { player.multiShot = false; }, 10000); // Reset after 10 seconds
      break;
  }
  
  // Increase score for collecting power-up
  score += 25;
}

/** Check collisions with boss */
function checkBossCollisions() {
  // Check flag collisions with boss
  for (let j = flags.length - 1; j >= 0; j--) {
    let flag = flags[j];
    if (dist(flag.x + flag.width/2, flag.y + flag.height/2, boss.x, boss.y) < (flag.width + boss.width) / 2) {
      // Remove flag
      flags.splice(j, 1);
      
      // Reduce boss health based on flag damage
      boss.health -= flag.damage || 1;
      
      // Add score
      score += 20;
      
      // Boss hit effect
      boss.isHit = true;
      setTimeout(() => { boss.isHit = false; }, 100);
    }
  }
  
  // Check tear collisions with player (same as in checkCollisions)
  for (let i = tears.length - 1; i >= 0; i--) {
    let tear = tears[i];
    
    // Check collision with flags
    for (let j = flags.length - 1; j >= 0; j--) {
      let flag = flags[j];
      if (dist(flag.x + flag.width/2, flag.y + flag.height/2, tear.x, tear.y) < (flag.width + tear.width) / 2) {
        flags.splice(j, 1);
        tears.splice(i, 1);
        score += 10;
        break;
      }
    }
    
    // Check collision with player if tear still exists
    if (i >= 0 && i < tears.length) {
      tear = tears[i];
      if (dist(tear.x, tear.y, player.x + player.width/2, player.y + player.height/2) < (tear.width + player.width) / 2) {
        // Remove tear
        tears.splice(i, 1);
        
        // If player has shield, reduce shield instead of health
        if (player.shield > 0) {
          player.shield -= 20;
          if (player.shield < 0) player.shield = 0;
        } 
        // Otherwise, if player is not invulnerable, reduce health
        else if (!isPlayerInvulnerable) {
          // Reduce player health by exactly 20% of max health (which is 100)
          player.health -= 20;
          
          // Make player invulnerable briefly
          isPlayerInvulnerable = true;
          invulnerabilityTimer = 90; // 1.5 seconds at 60 FPS
          console.log("Player hit by boss tear, invulnerability activated");
          
          // Check if player is dead
          if (player.health <= 0) {
            playerLives--;
            
            if (playerLives <= 0) {
              gameState = 'gameOver';
            } else {
              // Reset player position and health
              player.x = width / 2 - 25;
              player.y = height - 50;
              player.health = 100;
            }
          }
        }
      }
    }
  }
  
  // Update invulnerability
  if (isPlayerInvulnerable) {
    invulnerabilityTimer--;
    if (invulnerabilityTimer <= 0) {
      isPlayerInvulnerable = false;
      console.log("Player invulnerability ended");
    }
  }
}

/** Move and draw all flags (player projectiles) */
function moveFlags() {
  for (let i = flags.length - 1; i >= 0; i--) {
    let flag = flags[i];
    
    // Move flag up
    flag.y -= flag.speed;
    
    // Handle diagonal movement for multi-shot
    if (flag.xSpeed) {
      flag.x += flag.xSpeed;
    }
    
    // Remove if off screen
    if (flag.y < -flag.height) {
      flags.splice(i, 1);
      continue;
    }
    
    // Draw flag
    fill(255, 0, 0);
    rect(flag.x, flag.y, flag.width, flag.height);
    
    // Draw flag details
    fill(255);
    rect(flag.x + flag.width/2 - 1, flag.y, 2, flag.height);
  }
}

/** Move and draw all tears */
function moveTears() {
  for (let i = tears.length - 1; i >= 0; i--) {
    let tear = tears[i];
    
    // Move tear based on its properties
    if (tear.speed) {
      tear.y += tear.speed;
      
      // Handle wave pattern
      if (tear.waveAmplitude) {
        tear.wavePhase += tear.waveFrequency;
        tear.x = tear.originalX + sin(tear.wavePhase) * tear.waveAmplitude;
      }
      
      // Handle horizontal movement
      if (tear.xSpeed) {
        tear.x += tear.xSpeed;
      }
    } else if (tear.xSpeed || tear.ySpeed) {
      tear.x += tear.xSpeed;
      tear.y += tear.ySpeed;
    }
    
    // Handle special movement patterns
    
    // Spiral movement for Political Spin tears
    if (tear.spiralAngle !== undefined) {
      tear.spiralAngle += tear.spiralSpeed;
      tear.spiralRadius += 1;
      
      // Update position based on spiral
      tear.x += cos(tear.spiralAngle) * tear.spiralSpeed * 10;
      tear.y += sin(tear.spiralAngle) * tear.spiralSpeed * 10;
    }
    
    // Remove if off screen
    if (tear.y > height || tear.x < 0 || tear.x > width) {
      tears.splice(i, 1);
      continue;
    }
    
    // Draw tear with custom color if specified
    if (tear.color) {
      fill(tear.color[0], tear.color[1], tear.color[2], 200);
    } else {
      fill(0, 150, 255, 200);
    }
    ellipse(tear.x, tear.y, tear.width, tear.height);
    
    // Draw tear highlight
    fill(255, 255, 255, 100);
    ellipse(tear.x - tear.width/4, tear.y - tear.height/4, tear.width/3, tear.height/3);
  }
}

/** Load the Pelosi image when needed */
function loadPelosiImage() {
  if (isLoadingPelosiImg || pelosiImg) return;
  
  isLoadingPelosiImg = true;
  console.log('Using built-in Pelosi image for boss fight');
  
  // Skip trying to load external files and use our fallback image directly
  pelosiImg = fallbackImg;
  isLoadingPelosiImg = false;
  console.log('Built-in Pelosi image ready for use');
  
  // No need for the timeout since we're using the fallback image immediately
}

/** Draw mobile touch controls */
function drawMobileControls() {
  // Set semi-transparent style for controls
  noStroke();
  fill(255, 255, 255, 30);
  
  // Draw directional controls on the left side
  // Left arrow
  triangle(50, height - 100, 20, height - 70, 50, height - 40);
  
  // Right arrow
  triangle(150, height - 100, 180, height - 70, 150, height - 40);
  
  // Up arrow
  triangle(100, height - 150, 70, height - 120, 130, height - 120);
  
  // Down arrow
  triangle(100, height - 50, 70, height - 80, 130, height - 80);
  
  // Draw auto-fire toggle on the right side
  fill(touchControls.autoFire ? color(0, 255, 0, 100) : color(255, 0, 0, 100));
  rect(width - 150, height - 100, 100, 50, 10);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(touchControls.autoFire ? "AUTO-FIRE ON" : "AUTO-FIRE OFF", width - 100, height - 75);
}

/** Handle touch events for mobile controls */
function touchStarted() {
  if (!isMobile || gameState !== 'playing') return;
  
  // Check which control was touched
  checkTouchControls();
  
  // Prevent default behavior (like scrolling)
  return false;
}

function touchEnded() {
  if (!isMobile) return;
  
  // Reset touch controls when touch ends
  touchControls.leftSide = false;
  touchControls.rightSide = false;
  touchControls.upSide = false;
  touchControls.downSide = false;
  
  // Prevent default behavior
  return false;
}

function touchMoved() {
  if (!isMobile || gameState !== 'playing') return;
  
  // Update which control is being touched
  checkTouchControls();
  
  // Prevent default behavior
  return false;
}

function checkTouchControls() {
  // Check for each touch point
  for (let i = 0; i < touches.length; i++) {
    let tx = touches[i].x;
    let ty = touches[i].y;
    
    // Left arrow
    if (tx >= 20 && tx <= 50 && ty >= height - 100 && ty <= height - 40) {
      touchControls.leftSide = true;
    }
    
    // Right arrow
    if (tx >= 150 && tx <= 180 && ty >= height - 100 && ty <= height - 40) {
      touchControls.rightSide = true;
    }
    
    // Up arrow
    if (tx >= 70 && tx <= 130 && ty >= height - 150 && ty <= height - 120) {
      touchControls.upSide = true;
    }
    
    // Down arrow
    if (tx >= 70 && tx <= 130 && ty >= height - 80 && ty <= height - 50) {
      touchControls.downSide = true;
    }
    
    // Auto-fire toggle
    if (tx >= width - 150 && tx <= width - 50 && ty >= height - 100 && ty <= height - 50) {
      // Toggle auto-fire on touch release
      if (touches.length === 0) {
        touchControls.autoFire = !touchControls.autoFire;
      }
    }
  }
}