// ============================================================
// GALLERY
// Romantic Horizontal Side-Scrolling Game
// ============================================================
//
// CONTROLS
//
// A / LEFT ARROW  = Move left
// D / RIGHT ARROW = Move right
// W               = Jump
// SPACEBAR        = Kawaii pose + "habibi~"
//
// SPACEBAR works on the ground AND in the air.
// While Space is held, mika_kawaii.png has absolute priority.
//
// ============================================================


// ============================================================
// GLOBALS
// ============================================================

let backgroundMusic;

let player;
let mikaVisual;

let einstein;
let endTrigger;
let ground;

let cursors;
let keyA;
let keyD;
let keyW;
let keySpace;

let habibiLetters = [];
let habibiStars = [];

let currentTexture = "mika";

let runTimer = 0;
let runFrame = 1;

let habibiTimer = 0;
let habibiDirection = 1;

let gameEnded = false;

let letters = [];
let messageOpen = false;
let messagePanel;
let messageText;
let messageHint;

const letterMessages = [
    "From studying to coding, I gave this place my golden time\n A simple gallery of paradigm of rhymes for you to visit anytime\n Every pixel, every line, I want to show you what it means to be mine \n From the heart of your most beloved habibictuiepie - Einstein \n", // Letter by painting1
    "From combing to warm pampers, from tickling to giggling squeals, \n You love it when I consistently prioritize your happiness until it fills. \n Do you remember my will in this picture, and how magically it feels? \n I was honored to carry you on my back and lift your smile up to your ears.", // Letter by painting2
    "Always beautiful and cute, a playful mixture in unimaginable ways,\n It only took a pair of glasses to make me fall for two different gazes \n Whether nerdy or gorgeous, dazzled, I kept your face as a painting on display, \nFrom there, I learned I risk my fidelity by craving two versions of your face.", // Letter by painting3
    "Any beauty or brain is nowhere near the heart that I see, \n A sea of unwavering waves of kindness, shaped by your history. \n Despite tragedies, I love that your actions are guided by just purity, \n Being with BeeTea made me seek the person who I used to be.", // Letter by painting4
    "I regret that I met you late, after wandering through romantic detours, \n Yet somehow, a decade of memories found its way into our months as lovers. \n Now these roses are for the woman I proudly call my partner, \n And through all types of roads, I call myself “Yours” for all the adventures after"  // Letter by painting5
];


// ============================================================
// GAME SETTINGS
// ============================================================

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;

const GALLERY_WIDTH = 10000;

// Raised from 430.
// This gives Mika more visible room above the floor.
const FLOOR_TOP = 400;

const FLOOR_HEIGHT =
    GAME_HEIGHT - FLOOR_TOP;


// ============================================================
// PRELOAD
// ============================================================

function preload() {


    // --------------------------------------------------------
    // GALLERY MUSIC
    // --------------------------------------------------------

    this.load.audio("galleryMusic", "assets/gallery-music.mp3");

    // --------------------------------------------------------
    // MIKA
    // --------------------------------------------------------

    this.load.image(
        "mika",
        "assets/mika.png"
    );

    this.load.image(
        "mika_run1",
        "assets/mika_run1.png"
    );

    this.load.image(
        "mika_run2",
        "assets/mika_run2.png"
    );

    this.load.image(
        "mika_jump",
        "assets/mika_jump.png"
    );

    this.load.image(
        "mika_kawaii",
        "assets/mika_kawaii.png"
    );


    // --------------------------------------------------------
    // EINSTEIN
    // --------------------------------------------------------

    this.load.image(
        "einstein",
        "assets/Einstein.png"
    );

   


    // --------------------------------------------------------
    // FIVE MESSAGE IMAGES
    // --------------------------------------------------------

    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        this.load.image(
            `painting${i}`,
            `assets/painting${i}.png`
        );
    }
     // --------------------------------------------------------
    // PETALS
    // --------------------------------------------------------

    this.load.image("petals", "assets/petals.png");

    // ---------------------------------------------------------
    // LETTER
    // ---------------------------------------------------------

    this.load.image(
    "letter",
    "assets/letter.png"
);
 
}

function createLetter(scene, x, y, messageIndex) {
    const letter = scene.add.image(x, y, "letter")
        .setScale(0.15)
        .setDepth(15);

    letter.setData("messageIndex", messageIndex);
    letters.push(letter);

    // Wider than the letter, and shifted slightly toward Mika's approach.
    const trigger = scene.add.zone(x - 100, y, 300, 220);
    scene.physics.add.existing(trigger, true);

    scene.physics.add.overlap(player, trigger, () => {
        if (messageOpen) return;

        trigger.destroy();
        collectLetter(scene, letter);
    });
}

function createPetalsUnderEinstein(scene, centerX) {
    for (let i = 0; i < 35; i++) {
        const x = centerX + Phaser.Math.Between(-160, 160);
        const y = Phaser.Math.Between(FLOOR_TOP + 10, FLOOR_TOP + 70);

        scene.add.image(x, y, "petals")
            .setScale(Phaser.Math.FloatBetween(0.03, 0.07))
            .setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2))
            .setAlpha(Phaser.Math.FloatBetween(0.7, 1))
            .setDepth(2);
    }
}

// ============================================================
// CREATE
// ============================================================

function create() {

    const scene = this;


    // ========================================================
    // PHYSICS WORLD
    // ========================================================

    this.physics.world.setBounds(
        0,
        0,
        GALLERY_WIDTH,
        GAME_HEIGHT,
        true,
        true,
        true,
        true
    );


    this.cameras.main.setBackgroundColor(
        "#f8f0e5"
    );

    // -------------------------------------------------------
    // GALLERY MUSIC
    // -------------------------------------------------------

    backgroundMusic = this.sound.add("galleryMusic", {
        loop: true,
        volume: 0.35
    });

    backgroundMusic.play();

    // ========================================================
    // CLEAN ROMANTIC WALL
    // ========================================================

    createWall(
        scene
    );


    // ========================================================
    // FIVE MESSAGE FRAMES
    // ========================================================

    const messagePositions = [
        1200,
        3000,
        4800,
        6600,
        8400
    ];


    messagePositions.forEach(
        (x, index) => {

            createRomanticFrame(
                scene,
                x,
                205,
                index + 1
            );
        }
    );

   


    // ========================================================
    // HEART MARKERS
    // ========================================================

    const heartPositions = [
        2100,
        3900,
        5700,
        7500
    ];


    heartPositions.forEach(
        (x) => {

            createHeartMarker(
                scene,
                x
            );
        }
    );


    // ========================================================
    // SIDE BANNERS
    // ========================================================

    createSideBanner(
        scene,
        120,
        "Better\nTogether"
    );


    createSideBanner(
        scene,
        GALLERY_WIDTH - 120,
        "Forever",
        "& Always"
    );


    // ========================================================
    // WOODEN FLOOR
    // ========================================================

    createWoodFloor(
        scene
    );


    // ========================================================
    // TEMPORARY PLANT DECORATIONS
    // ========================================================

    createPlantPlaceholder(
        scene,
        80
    );


    createPlantPlaceholder(
        scene,
        GALLERY_WIDTH - 80
    );


    // ========================================================
    // EINSTEIN
    // ========================================================

    const einsteinX =
        GALLERY_WIDTH - 500;


    einstein =
        scene.add.image(
            einsteinX,
            FLOOR_TOP - 115,
            "einstein"
        );


    einstein.setScale(
        0.32
    );


    // Einstein must stay behind Mika.

    einstein.setDepth(
        20
    );

    // ========================================================
    // PETALS
    // ========================================================

    createPetalsUnderEinstein(scene, einsteinX);

    // ========================================================
    // HAPPY BIRTHDAY
    // ========================================================

    scene.add.text(
        einsteinX - 390,
        150,
        "HAPPY BIRTHDAY",
        {
            fontFamily: "Arial",
            fontSize: "60px",
            fontStyle: "bold",
            color: "#e68c9b"
        }
    )
    .setOrigin(0.5)
    .setDepth(20);

    scene.add.text(
        einsteinX - 390,
        210, // larger Y value places it underneath
        "DEAREST THERESA",
        {
            fontFamily: "Arial",
            fontSize: "60px",
            fontStyle: "bold",
            color: "#e68c9b",
            align: "center"
        }
    )
    .setOrigin(0.5)
    .setDepth(20);


    // ========================================================
    // END TRIGGER
    // ========================================================

    // Ending begins BEFORE Mika visually touches Einstein.

    endTrigger =
        scene.add.rectangle(
            einsteinX - 180,
            FLOOR_TOP - 160,
            160,
            320,
            0xffffff,
            0
        );


    scene.physics.add.existing(
        endTrigger,
        true
    );


    // ========================================================
    // GROUND
    // ========================================================

    ground =
        scene.add.rectangle(
            GALLERY_WIDTH / 2,
            FLOOR_TOP + FLOOR_HEIGHT / 2,
            GALLERY_WIDTH,
            FLOOR_HEIGHT,
            0xffffff,
            0
        );


    scene.physics.add.existing(
        ground,
        true
    );


    // ========================================================
    // MIKA PHYSICS BODY
    // ========================================================

    player =
        scene.physics.add.sprite(
            0,
            750,
            "mika"
        );


    // The physics sprite itself is invisible.
    // Mika's visible artwork is handled separately below.

    player.setVisible(
        false
    );


    // Collision body.

    player.body.setSize(
        290,
        290
    );


    player.body.setOffset(
        0,
        0
    );


    player.setCollideWorldBounds(
        true
    );


    player.setBounce(
        0
    );


    // Ground.

    scene.physics.add.collider(
        player,
        ground
    );


    // Ending.

    scene.physics.add.overlap(
        player,
        endTrigger,
        triggerEnding,
        null,
        scene
    );


    // ========================================================
    // MIKA VISIBLE FOREGROUND SPRITE
    // ========================================================

    mikaVisual =
        scene.add.image(
            player.x,
            0,
            "mika"
        );


    mikaVisual.setScale(
        0.32 
    );


    // Origin at the feet.

    mikaVisual.setOrigin(
        0.5,
        1
    );


    // This guarantees Mika appears in front.

    mikaVisual.setDepth(
        100
    );


    // Place her feet directly on the physics body.

    updateMikaVisual();


    // ========================================================
    // KEYBOARD
    // ========================================================

    cursors =
        scene.input.keyboard.createCursorKeys();


    keyA =
        scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );


    keyD =
        scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );


    keyW =
        scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );


    keySpace =
        scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        messagePositions.forEach((x, index) => {
    createLetter(scene, x, FLOOR_TOP - -70, index);
});

    // ========================================================
// HABIBI TEXT — characters arranged in an arc
// ========================================================

habibiLetters = [..."HABIBI"].map((character) =>
    scene.add.text(0, 0, character, {
        fontFamily: "Arial",
        fontSize: "70px",
        fontStyle: "bold",
        color: "#713f43",
        stroke: "#f7dfe3",
        strokeThickness: 6
    })
    .setOrigin(0.5)
    .setDepth(120)
    .setVisible(false)
);

// ===================================================
// HABIBI STARS — two stationary flickering stars
// ===================================================

habibiStars = Array.from({ length: 2 }, () => {
    const star = this.add.text(0, 0, "✦", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#fff2a8",
        stroke: "#d99b55",
        strokeThickness: 2
    })
    .setOrigin(0.5)
    .setDepth(121)
    .setVisible(false);

    this.tweens.add({
        targets: star,
        alpha: { from: 0.25, to: 1 },
        scale: { from: 0.6, to: 1.3 },
        duration: Phaser.Math.Between(350, 700),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 500)
    });

    return star;
});



    // ========================================================
    // CAMERA
    // ========================================================

    scene.cameras.main.setBounds(
        0,
        0,
        GALLERY_WIDTH,
        GAME_HEIGHT
    );


    scene.cameras.main.startFollow(
        player,
        true,
        0.10,
        0.10
    );


    scene.cameras.main.setDeadzone(
        350,
        180
    );


    gameEnded =
        false;


    currentTexture =
        "mika";
}



// ============================================================
// UPDATE
// ============================================================

function update(time, delta) {

    if (!player) {
        return;
        
    }

    if (messageOpen) {
    player.setVelocityX(0);
    updateMikaVisual();

    if (Phaser.Input.Keyboard.JustDown(keySpace)) {
        closeLetterMessage();
    }

    return;
}
    // ========================================================
    // UPDATE VISIBLE MIKA
    // ========================================================

    updateMikaVisual();


    // ========================================================
    // ENDING LOCK
    // ========================================================

    if (gameEnded) {

        player.setVelocity(
            0,
            0
        );


        player.body.moves =
            false;


        hideHabibiText();


        return;
    }


    // ========================================================
    // SPACEBAR
    // ========================================================

    if (
        keySpace.isDown
    ) {

        player.setVelocityX(
            0
        );


        setMikaTexture(
            "mika_kawaii"
        );


        showHabibiText(time);
        updateMikaVisual();
        return;



     }


    // ========================================================
    // RESET HABIBI
    // ========================================================

    hideHabibiText();
habibiTimer = 0;
habibiDirection = 1;


    // ========================================================
    // MOVEMENT
    // ========================================================

    let moving =
        false;


    // LEFT

    if (
        cursors.left.isDown ||
        keyA.isDown
    ) {

        player.setVelocityX(
            -300
        );


        mikaVisual.setFlipX(
            true
        );


        moving =
            true;
    }


    // RIGHT

    else if (
        cursors.right.isDown ||
        keyD.isDown
    ) {

        player.setVelocityX(
            300
        );


        mikaVisual.setFlipX(
            false
        );


        moving =
            true;
    }


    // STOP

    else {

        player.setVelocityX(
            0
        );
    }


    // ========================================================
    // JUMP
    // ========================================================

    if (
        Phaser.Input.Keyboard.JustDown(keyW) &&
        player.body.blocked.down
    ) {

        player.setVelocityY(
            -650
        );
    }


    // ========================================================
    // ANIMATION
    // ========================================================

    if (
        !player.body.blocked.down
    ) {

        setMikaTexture(
            "mika_jump"
        );
    }


    else if (
        moving
    ) {

        animateRunning(
            delta
        );
    }


    else {

        setMikaTexture(
            "mika"
        );


        runTimer =
            0;


        runFrame =
            1;
    }


    updateMikaVisual();
}


// ============================================================
// POSITION MIKA VISUAL
// ============================================================

function updateMikaVisual() {

    if (
        !player ||
        !mikaVisual
    ) {

        return;
    }


    // Mika's visible feet are attached to the
    // bottom of her physics body.

    mikaVisual.x =
        player.x;


    mikaVisual.y =
        player.body.bottom - 70; // shifted pixel upwards


    // Make sure Mika is ALWAYS in front.

    mikaVisual.setDepth(
        100
    );


    // Keep visual orientation synchronized.

    if (
        player.body.velocity.x < 0
    ) {

        mikaVisual.setFlipX(
            true
        );
    }

    else if (
        player.body.velocity.x > 0
    ) {

        mikaVisual.setFlipX(
            false
        );
    }
}


// ============================================================
// RUNNING ANIMATION
// ============================================================

function animateRunning(
    delta
) {

    runTimer +=
        delta;


    if (
        runTimer >= 130
    ) {

        runTimer =
            0;


        runFrame =
            runFrame === 1
                ? 2
                : 1;


        setMikaTexture(
            runFrame === 1
                ? "mika_run1"
                : "mika_run2"
        );
    }
}


// ============================================================
// CHANGE MIKA TEXTURE
// ============================================================

function setMikaTexture(
    textureName
) {

    if (
        currentTexture === textureName
    ) {

        return;
    }


    if (
        mikaVisual.scene.textures.exists(
            textureName
        )
    ) {

        mikaVisual.setTexture(
            textureName
        );


        mikaVisual.setScale(
            0.32
        );


        // Keep feet anchored after changing
        // between images with different dimensions.

        mikaVisual.setOrigin(
            0.5,
            1
        );


        currentTexture =
            textureName;
    }
}


// ============================================================
// HABIBI ANIMATION
// ============================================================

function showHabibiText(time) {
    const count = habibiLetters.length;
    const spacing = 55;
    const arcHeight = 50;

    const centerX = player.x;
    const baseY = mikaVisual.y - mikaVisual.displayHeight + 85;
    const totalWidth = (count - 1) * spacing;

    habibiLetters.forEach((letter, index) => {
        const offsetX = index * spacing - totalWidth / 2;
        const progress = offsetX / (totalWidth / 2);

        const x = centerX + offsetX;
        const y = baseY - arcHeight * (1 - progress * progress);

        letter.setPosition(
            x + Math.sin(time * 0.12 + index * 2) * 10,
            y + Math.cos(time * 0.15 + index * 2) * 10
        );
        letter.setRotation(0);
        letter.setVisible(true);
    });

    // Keep one star at each end of the word.
    const sideStars = [
        { star: habibiStars[0], side: -1 },
        { star: habibiStars[1], side: 1 }
    ];

    sideStars.forEach(({ star, side }, index) => {
        star.setPosition(
            centerX + side * (totalWidth / 2 + 30),
            baseY - 5 + Math.sin(time * 0.01 + index * Math.PI) * 4
        );
        star.setVisible(true);
    });
}

function hideHabibiText() {
    habibiLetters.forEach(letter => letter.setVisible(false));
    habibiStars.forEach(star => star.setVisible(false));
}


// ============================================================
// WALL
// ============================================================

function createWall(
    scene
) {

    const wall =
        scene.add.graphics();


    // Main wall.

    wall.fillStyle(
        0xf7dfe3,
        1
    );


    wall.fillRect(
        0,
        0,
        GALLERY_WIDTH,
        FLOOR_TOP
    );


    // Top trim.

    wall.fillStyle(
        0xe4b8bd,
        1
    );


    wall.fillRect(
        0,
        0,
        GALLERY_WIDTH,
        12
    );


    wall.fillStyle(
        0xf3ccd1,
        1
    );


    wall.fillRect(
        0,
        12,
        GALLERY_WIDTH,
        6
    );


    // Bottom wall trim.

    wall.fillStyle(
        0xe2b7bd,
        1
    );


    wall.fillRect(
        0,
        FLOOR_TOP - 16,
        GALLERY_WIDTH,
        16
    );


    wall.fillStyle(
        0xf9e8ea,
        1
    );


    wall.fillRect(
        0,
        FLOOR_TOP - 16,
        GALLERY_WIDTH,
        4
    );


    // Very subtle horizontal decorative line.

    wall.fillStyle(
        0xe8c5ca,
        0.25
    );


    wall.fillRect(
        0,
        80,
        GALLERY_WIDTH,
        3
    );
}


// ============================================================
// ROMANTIC FRAME
// ============================================================

function createRomanticFrame(
    scene,
    x,
    y,
    number
) {

    const frameWidth =
        430;


    const frameHeight =
        265;


    const left =
        x - frameWidth / 2;


    const top =
        y - frameHeight / 2;


    // --------------------------------------------------------
    // SHADOW
    // --------------------------------------------------------

    const shadow =
        scene.add.graphics();


    shadow.fillStyle(
        0x5c3428,
        0.22
    );


    shadow.fillRect(
        left + 12,
        top + 14,
        frameWidth,
        frameHeight
    );


    shadow.setDepth(
        3
    );


    // --------------------------------------------------------
    // OUTER FRAME
    // --------------------------------------------------------

    const frame =
        scene.add.graphics();


    frame.fillStyle(
        0x6a3d2d,
        1
    );


    frame.fillRect(
        left,
        top,
        frameWidth,
        frameHeight
    );


    frame.setDepth(
        4
    );


    // --------------------------------------------------------
    // GOLD BORDER
    // --------------------------------------------------------

    frame.fillStyle(
        0xc28b52,
        1
    );


    frame.fillRect(
        left + 10,
        top + 10,
        frameWidth - 20,
        frameHeight - 20
    );


    // --------------------------------------------------------
    // DARK INNER BORDER
    // --------------------------------------------------------

    frame.fillStyle(
        0x583327,
        1
    );


    frame.fillRect(
        left + 19,
        top + 19,
        frameWidth - 38,
        frameHeight - 38
    );


    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    const image =
        scene.add.image(
            x,
            y,
            "painting" + number
        );


    const maxWidth =
        frameWidth - 50;


    const maxHeight =
        frameHeight - 50;


    const scale =
        Math.min(
            maxWidth / image.width,
            maxHeight / image.height
        );


    image.setScale(
        scale
    );


    image.setDepth(
        5
    );


    // --------------------------------------------------------
    // CORNERS
    // --------------------------------------------------------

    createFrameCorner(
        scene,
        left + 8,
        top + 8
    );


    createFrameCorner(
        scene,
        left + frameWidth - 8,
        top + 8
    );


    createFrameCorner(
        scene,
        left + 8,
        top + frameHeight - 8
    );


    createFrameCorner(
        scene,
        left + frameWidth - 8,
        top + frameHeight - 8
    );


    // --------------------------------------------------------
    // LIGHT
    // --------------------------------------------------------

    createSpotlight(
        scene,
        x,
        top - 30
    );


    // --------------------------------------------------------
    // NEW WORD UNDER EACH PICTURE
    // --------------------------------------------------------

    const words = [
        "EINSTEIN",
        "WILL",
        "ALWAYS",
        "BE",
        "YOURS"
    ];


    createMessageCaption(
        scene,
        x,
        top + frameHeight + 45,
        words[number - 1]
    );
}


// ============================================================
// FRAME CORNER
// ============================================================

function createFrameCorner(
    scene,
    x,
    y
) {

    const corner =
        scene.add.graphics();


    corner.fillStyle(
        0xe0ad68,
        1
    );


    corner.fillCircle(
        x,
        y,
        8
    );


    corner.lineStyle(
        2,
        0x70432f,
        1
    );


    corner.strokeCircle(
        x,
        y,
        8
    );


    corner.setDepth(
        7
    );
}


// ============================================================
// SPOTLIGHT
// ============================================================

function createSpotlight(
    scene,
    x,
    y
) {

    const light =
        scene.add.graphics();


    light.fillStyle(
        0xc38a4e,
        1
    );


    light.fillRoundedRect(
        x - 34,
        y - 9,
        68,
        14,
        5
    );


    light.fillStyle(
        0xfff1c7,
        1
    );


    light.fillCircle(
        x,
        y + 6,
        8
    );


    light.fillStyle(
        0xfff3d0,
        0.10
    );


    light.fillTriangle(
        x - 12,
        y + 12,
        x + 12,
        y + 12,
        x + 75,
        y + 105
    );


    light.fillTriangle(
        x - 12,
        y + 12,
        x - 75,
        y + 105,
        x + 12,
        y + 12
    );


    light.setDepth(
        2
    );
}


// ============================================================
// MESSAGE CAPTION
// ============================================================

function createMessageCaption(
    scene,
    x,
    y,
    text
) {

    const width =
        260;


    const height =
        58;


    const plate =
        scene.add.graphics();


    // Shadow.

    plate.fillStyle(
        0x6b3e33,
        0.15
    );


    plate.fillRoundedRect(
        x - width / 2 + 5,
        y - height / 2 + 5,
        width,
        height,
        10
    );


    // Plate.

    plate.fillStyle(
        0xffeee9,
        1
    );


    plate.fillRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        10
    );


    // Border.

    plate.lineStyle(
        2,
        0xd39a82,
        1
    );


    plate.strokeRoundedRect(
        x - width / 2,
        y - height / 2,
        width,
        height,
        10
    );


    plate.setDepth(
        8
    );


    // Word.

    scene.add.text(
        x,
        y,
        text,
        {
            fontFamily: "Georgia",
            fontSize: "21px",
            fontStyle: "bold",
            color: "#713f43"
        }
    )
    .setOrigin(0.5)
    .setDepth(10);


    // Tiny heart.

    scene.add.text(
        x + width / 2 - 22,
        y,
        "♥",
        {
            fontFamily: "Arial",
            fontSize: "17px",
            color: "#d56f82"
        }
    )
    .setOrigin(0.5)
    .setDepth(10);
}


// ============================================================
// HEART MARKER
// ============================================================

function createHeartMarker(
    scene,
    x
) {

    scene.add.text(
        x,
        245,
        "♥",
        {
            fontFamily: "Arial",
            fontSize: "34px",
            color: "#d56f82"
        }
    )
    .setOrigin(0.5)
    .setDepth(10);


    scene.add.text(
        x,
        285,
        "✦",
        {
            fontFamily: "Georgia",
            fontSize: "18px",
            color: "#c68c7b"
        }
    )
    .setOrigin(0.5)
    .setDepth(10);
}


// ============================================================
// SIDE BANNER
// ============================================================

function createSideBanner(
    scene,
    x,
    line1,
    line2
) {

    const banner =
        scene.add.graphics();


    banner.fillStyle(
        0xd47d86,
        1
    );


    banner.fillRect(
        x - 45,
        135,
        90,
        150
    );


    banner.fillTriangle(
        x - 45,
        285,
        x + 45,
        285,
        x,
        320
    );


    banner.lineStyle(
        2,
        0xf5c4c7,
        1
    );


    banner.strokeRect(
        x - 42,
        138,
        84,
        145
    );


    scene.add.text(
        x,
        190,
        line1,
        {
            fontFamily: "Georgia",
            fontSize: "15px",
            fontStyle: "italic",
            color: "#fff4f2",
            align: "center"
        }
    )
    .setOrigin(0.5);


    scene.add.text(
        x,
        230,
        line2,
        {
            fontFamily: "Georgia",
            fontSize: "15px",
            fontStyle: "italic",
            color: "#fff4f2",
            align: "center"
        }
    )
    .setOrigin(0.5);


    scene.add.text(
        x,
        265,
        "♥",
        {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#fff4f2"
        }
    )
    .setOrigin(0.5);
}


// ============================================================
// PLANT PLACEHOLDER
// ============================================================

function createPlantPlaceholder(
    scene,
    x
) {

    const plant =
        scene.add.graphics();


    // Pot.

    plant.fillStyle(
        0xf0c7bd,
        1
    );


    plant.fillRoundedRect(
        x - 30,
        FLOOR_TOP - 20,
        60,
        55,
        8
    );


    plant.lineStyle(
        2,
        0xb87d76,
        1
    );


    plant.strokeRoundedRect(
        x - 30,
        FLOOR_TOP - 20,
        60,
        55,
        8
    );


    // Leaves.

    plant.fillStyle(
        0x78945d,
        1
    );


    plant.fillEllipse(
        x - 25,
        FLOOR_TOP - 55,
        38,
        70
    );


    plant.fillEllipse(
        x + 5,
        FLOOR_TOP - 65,
        42,
        75
    );


    plant.fillEllipse(
        x + 25,
        FLOOR_TOP - 45,
        35,
        60
    );


    scene.add.text(
        x,
        FLOOR_TOP + 5,
        "♥",
        {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#d56f82"
        }
    )
    .setOrigin(0.5);
}


// ============================================================
// WOOD FLOOR
// ============================================================

function createWoodFloor(
    scene
) {

    const floor =
        scene.add.graphics();


    // Base.

    floor.fillStyle(
        0x75472d,
        1
    );


    floor.fillRect(
        0,
        FLOOR_TOP,
        GALLERY_WIDTH,
        FLOOR_HEIGHT
    );


    const plankHeight =
        34;


    const plankWidth =
        220;


    // Planks.

    for (
        let row = 0;
        row < 7;
        row++
    ) {

        const y =
            FLOOR_TOP +
            row * plankHeight;


        floor.fillStyle(
            row % 2 === 0
                ? 0x8b5533
                : 0x75452d,
            1
        );


        floor.fillRect(
            0,
            y,
            GALLERY_WIDTH,
            plankHeight
        );
    }


    // Horizontal seams.

    floor.lineStyle(
        2,
        0x4e2e20,
        0.7
    );


    for (
        let y = FLOOR_TOP + plankHeight;
        y < GAME_HEIGHT;
        y += plankHeight
    ) {

        floor.lineBetween(
            0,
            y,
            GALLERY_WIDTH,
            y
        );
    }


    // Vertical seams.

    floor.lineStyle(
        1,
        0x4e2e20,
        0.55
    );


    for (
        let row = 0;
        row < 7;
        row++
    ) {

        const y =
            FLOOR_TOP +
            row * plankHeight;


        const offset =
            row % 2 === 0
                ? 0
                : plankWidth / 2;


        for (
            let x = offset;
            x < GALLERY_WIDTH;
            x += plankWidth
        ) {

            floor.lineBetween(
                x,
                y,
                x,
                y + plankHeight
            );
        }
    }


    // Wall/floor border.

    floor.fillStyle(
        0x4e2e20,
        1
    );


    floor.fillRect(
        0,
        FLOOR_TOP,
        GALLERY_WIDTH,
        8
    );
}


// ============================================================
// EINSTEIN NAME PLATE
// ============================================================

function createNamePlate(
    scene,
    x,
    y,
    text
) {

    const plate =
        scene.add.graphics();


    plate.fillStyle(
        0xffeee7,
        1
    );


    plate.fillRoundedRect(
        x - 85,
        y - 22,
        170,
        44,
        8
    );


    plate.lineStyle(
        2,
        0xc78d75,
        1
    );


    plate.strokeRoundedRect(
        x - 85,
        y - 22,
        170,
        44,
        8
    );


    scene.add.text(
        x,
        y,
        text,
        {
            fontFamily: "Georgia",
            fontSize: "17px",
            fontStyle: "bold",
            color: "#713f43"
        }
    )
    .setOrigin(0.5)
    .setDepth(25);
}

// ============================================================
// COLLECT LETTER
// ============================================================


function collectLetter(scene, letter) {
    if (messageOpen) return;

    const index = letter.getData("messageIndex");
    messageOpen = true;

    // Remove the collected letter from the scene.
    letter.destroy();

    // Stop Mika while the message is displayed.
    player.setVelocity(0, 0);

    // Screen-fixed background panel.
    messagePanel = scene.add.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2,
        720,
        220,
        0x713f43,
        0.96
    )
    .setScrollFactor(0)
    .setDepth(200);

    messageText = scene.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 15,
        letterMessages[index],
        {
            fontFamily: "Georgia",
            fontSize: "18px",
            color: "#fff4f2",
            align: "center",
            wordWrap: { width: 640 }
        }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(201);

    messageHint = scene.add.text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 75,
        "Press SPACE to close",
        {
            fontFamily: "Arial",
            fontSize: "18px",
            color: "#ffd6dc"
        }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(201);
}

function closeLetterMessage() {
    messagePanel?.destroy();
    messageText?.destroy();
    messageHint?.destroy();

    messagePanel = null;
    messageText = null;
    messageHint = null;
    messageOpen = false;
}

// ============================================================
// ENDING
// ============================================================

function triggerEnding() {

    if (
        gameEnded
    ) {

        return;
    }


    gameEnded =
        true;


    showEndMessage();
}


// ============================================================
// END MESSAGE
// ============================================================

function showEndMessage() {
    player.setVelocity(0, 0);
    player.body.moves = false;

    const scene = player.scene;

    // Hearts above Einstein
    [-80, -40, 0, 40, 80].forEach((offset) => {
        scene.add.text(
            einstein.x + offset,
            150,
            "♥",
            {
                fontFamily: "Arial",
                fontSize: "30px",
                color: "#d56f82"
            }
        )
        .setOrigin(0.5)
        .setDepth(120);
    });

    // Center the message above Einstein
    const endText = scene.add.text(
        einstein.x - 100,
        einstein.y - einstein.displayHeight/3 - 50 ,
        "I will always love you in ways that I can \nEven if I am not there, I am here to give you roses.\n\n♥ I love you ♥",
        {
            fontFamily: "Arial",
            fontSize: "15px",
            fontStyle: "bold italic",
            color: "#713f43",
            backgroundColor: "#ffeee9",
            padding: {
                left: 18,
                right: 18,
                top: 12,
                bottom: 12
            },
            align: "center"
        }
    )
    .setOrigin(0.5)
    .setDepth(120)
    .setAlpha(0);

    scene.tweens.add({
        targets: endText,
        alpha: 1,
        duration: 700,
        ease: "Power2"
    });
}


// ============================================================
// PHASER CONFIGURATION
// ============================================================

const config = {

    type:
        Phaser.AUTO,


    width:
        GAME_WIDTH,


    height:
        GAME_HEIGHT,


    parent:
        "game",


    backgroundColor:
        "#f7dfe3",


    physics: {

        default:
            "arcade",

        arcade: {

            gravity: {
                y: 1400
            },

            debug:
                false
        }
    },


    scale: {

        mode:
            Phaser.Scale.FIT,

        autoCenter:
            Phaser.Scale.CENTER_BOTH
    },


    scene: {

        preload,

        create,

        update
    }
};


// ============================================================
// START GAME
// ============================================================

const game =
    new Phaser.Game(
        config
    );