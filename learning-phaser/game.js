// 1. Global Game Variables
var platforms;
var player;
var cursors;
var stars;
var bombs;
var score = 0;
var scoreText;
var gameOver = false; // Tracks if the game has ended

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// 2. Preload Function: Load all assets
function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}


// 3. Create Function: Build the game world
function create() {
    // Background
    this.add.image(400, 300, 'sky');

    // Platforms (Static Group)
    platforms = this.physics.add.staticGroup();
    
    // Create the ground floor (scaled up to stretch across the screen)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    // Create floating ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Player Configuration
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Player Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Keyboard Input
    cursors = this.input.keyboard.createCursorKeys();

    // Stars Configuration
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Bombs Configuration
    bombs = this.physics.add.group();

    // UI Text Setup (Displays Score)
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Physics Colliders and Overlaps
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    
    // Check if player runs into a star or a bomb
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

// 4. Update Function: Game Loop
function update() {
    // If player hits a bomb, freeze the controls completely
    if (gameOver) {
        return;
    }

    // Left and Right Movement
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } 
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } 
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // Jumping Mechanism (Only jump if touching the ground)
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330); 
    }
}

// 5. Custom Gameplay Functions
function collectStar(player, star) {
    // Remove the star visually and physically from the game
    star.disableBody(true, true);

    // Increase the score and refresh the UI text
    score += 10;
    scoreText.setText('Score: ' + score);

    // If all 12 stars are collected, reset them and spawn a bomb!
    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        // Spawn bomb on the opposite side of the screen from the player
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb) {
    // Pause the entire game engine physics
    this.physics.pause();

    // Turn the player character red to indicate damage
    player.setTint(0xff0000);

    // Play the front-facing "turn" frame
    player.anims.play('turn');

    // Trigger game over variable to halt controls
    gameOver = true;
    
    // Add a visual Game Over message onto the screen
    this.add.text(250, 250, 'GAME OVER', { fontSize: '64px', fill: '#ff0000' });
}
