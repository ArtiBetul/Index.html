// === Variables globales ===
// Récupère les éléments HTML utilisés dans le jeu
const canvas = document.getElementById('gameCanvas');         // Le canevas où le jeu est dessiné
const ctx = canvas.getContext('2d');                          // Contexte 2D pour dessiner sur le canevas
const scoreDisplay = document.getElementById('scoreDisplay'); // Zone d'affichage du score
const startButton = document.getElementById('startButton');   // Bouton pour démarrer / rejouer
const messageDisplay = document.getElementById('messageDisplay'); // Zone pour afficher les messages (victoire, défaite)

// Images utilisées pour les messages de victoire ou défaite
const imgPlayerLost = "https://i.imgflip.com/6z1af6.jpg";     // Image quand un joueur perd
const imgPlayer1Victory = "https://i.imgflip.com/4exxf2.jpg"; // Image quand le joueur 1 gagne

// === Paramètres ===
// Paramètres de taille et vitesse des éléments
const paddleWidth = 10, paddleHeight = 80, ballSize = 10;     // Dimensions des palettes et de la balle
let paddleSpeed = 8, ballSpeedX = 2, ballSpeedY = 2;          // Vitesse des palettes et de la balle
let baseSpeedX = 2, baseSpeedY = 2;                            // Vitesse de base utilisée pour réinitialiser la balle
let afterScorePause = true, pauseTimer = 0;                   // Pause après un point et durée de cette pause

// === État du jeu ===
// Variables qui gardent l’état actuel du jeu
let gameRunning = false, gamePaused = false; // Si le jeu est en cours ou en pause
let scoreLeft = 0, scoreRight = 0;           // Scores des deux joueurs
let keys = {};                               // Stocke les touches actuellement pressées

// Position et mouvement de la balle
let ball = {
    x: canvas.width / 2,              // Position horizontale (centre du canvas)
    y: canvas.height / 2,             // Position verticale (centre du canvas)
    width: ballSize,                  // Largeur de la balle
    height: ballSize,                 // Hauteur de la balle
    speedX: ballSpeedX,               // Vitesse horizontale
    speedY: ballSpeedY                // Vitesse verticale
};

// Propriétés de la palette de gauche
let paddleLeft = {
    x: 10,                            // Position horizontale (proche du bord gauche)
    y: canvas.height / 2 - paddleHeight / 2, // Centrée verticalement
    width: paddleWidth,              // Largeur
    height: paddleHeight,            // Hauteur
    speed: paddleSpeed               // Vitesse de déplacement
};

// Propriétés de la palette de droite
let paddleRight = {
    x: canvas.width - paddleWidth - 10, // Position proche du bord droit
    y: canvas.height / 2 - paddleHeight / 2, // Centrée verticalement
    width: paddleWidth,              // Largeur
    height: paddleHeight,            // Hauteur
    speed: paddleSpeed               // Vitesse de déplacement
};

// === Contrôles ===
// Écoute les touches appuyées
window.addEventListener('keydown', function(e) {
    keys[e.key] = true;              // Marque la touche comme pressée
    if ((e.key === 's' || e.key === 'S') && !gameRunning) startGame(); // Lance le jeu si 'S' est pressée
});

// Écoute les touches relâchées
window.addEventListener('keyup', e => keys[e.key] = false); // Marque la touche comme relâchée

// Quand on clique sur le bouton de démarrage
startButton.addEventListener('click', () => { 
    if (!gameRunning) startGame(); // Démarre le jeu si pas déjà en cours
});

// Fonction qui démarre le jeu
function startGame() {
    resetGame();                     // Réinitialise le score et les positions
    gameRunning = true;             // Le jeu est actif
    startButton.style.display = 'none';         // Masque le bouton
    messageDisplay.style.display = 'none';      // Masque les messages
    gameLoop();                      // Lance la boucle du jeu
}

// === Fonctions principales ===

// Affiche une image dans la zone de message
function showImage(src) {
    messageDisplay.innerHTML = `<img src="${src}" alt="Game Message">`; // Met l'image dans le message
    messageDisplay.style.display = 'block'; // Affiche le message
}

// Met à jour l'état du jeu à chaque frame
function update() {
    if (gamePaused) {                // Si le jeu est en pause
        if (--pauseTimer <= 0) {     // Réduit le timer jusqu’à 0
            gamePaused = false;      // Sort de la pause
            messageDisplay.style.display = 'none'; // Cache le message
        }
        return; // Arrête ici pour ne pas continuer le jeu pendant la pause
    }

    // Déplacement des palettes
    if (keys['z'] || keys['Z']) paddleLeft.y = Math.max(0, paddleLeft.y - paddleLeft.speed); // Monte la palette gauche
    if (keys['w'] || keys['W']) paddleLeft.y = Math.min(canvas.height - paddleLeft.height, paddleLeft.y + paddleLeft.speed); // Descend la palette gauche
    if (keys['ArrowUp']) paddleRight.y = Math.max(0, paddleRight.y - paddleRight.speed); // Monte la palette droite
    if (keys['ArrowDown']) paddleRight.y = Math.min(canvas.height - paddleRight.height, paddleRight.y + paddleRight.speed); // Descend la palette droite

    // Déplacement de la balle
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Rebond en haut ou en bas
    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) ball.speedY = -ball.speedY;

    // Collision balle / palette
    if (checkCollision(ball, paddleLeft) || checkCollision(ball, paddleRight)) {
        ball.speedX *= -1.03; // Inverse la direction et augmente légèrement la vitesse
        let paddle = checkCollision(ball, paddleLeft) ? paddleLeft : paddleRight; // Détermine la palette touchée
        let hitPos = (ball.y - paddle.y) / paddle.height; // Position du contact sur la palette
        ball.speedY = 8 * (hitPos - 0.5); // Redirige la balle selon l'endroit où elle touche
    }

    // Si la balle sort à gauche : point pour joueur 2
    if (ball.x <= 0) {
        scoreRight++;              // Ajoute un point au joueur 2
        updateScore();             // Met à jour l'affichage
        showImage(imgPlayerLost);  // Affiche image de défaite
        if (afterScorePause) {     // Si pause après score activée
            gamePaused = true;
            pauseTimer = 120;      // Pause de 120 frames
        }
        checkSpeedIncrease();      // Augmente la difficulté si besoin
        resetBall();               // Replace la balle au centre
        if (scoreRight >= 10) endGame("Joueur 2"); // Fin de partie si score max
    }

    // Si la balle sort à droite : point pour joueur 1
    else if (ball.x + ball.width >= canvas.width) {
        scoreLeft++;               // Ajoute un point au joueur 1
        updateScore();             // Met à jour l'affichage
        checkSpeedIncrease();      // Augmente la difficulté si besoin
        resetBall();               // Replace la balle au centre
        if (scoreLeft >= 10) {
            endGame("Joueur 1");   // Fin du jeu si joueur 1 gagne
            showImage(imgPlayer1Victory); // Affiche image de victoire
        }
    }
}

// Augmente la vitesse de la balle après 5 points cumulés
function checkSpeedIncrease() {
    if (scoreLeft + scoreRight === 5) {
        baseSpeedX = 3.7;         // Augmente la vitesse X de base
        baseSpeedY = 3.7;         // Augmente la vitesse Y de base
        resetBall();              // Replace la balle avec la nouvelle vitesse
    }
}

// Vérifie la collision entre deux rectangles (ex : balle et palette)
function checkCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}

// Dessine les éléments du jeu sur le canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas

    // Ligne centrale pointillée
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);

    // Dessin des palettes et de la balle
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height); // Palette gauche
    ctx.fillRect(paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height); // Palette droite
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height); // Balle
}

// Met à jour l’affichage du score
function updateScore() {
    scoreDisplay.textContent = `${scoreLeft} : ${scoreRight}`;
}

// Replace la balle au centre avec une direction aléatoire
function resetBall() {
    ball.x = canvas.width / 2 - ball.width / 2;
    ball.y = canvas.height / 2 - ball.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeedX;
    ball.speedY = (Math.random() > 0.5 ? 1 : -1) * baseSpeedY;
}

// Réinitialise tout pour recommencer une partie
function resetGame() {
    scoreLeft = 0;
    scoreRight = 0;
    baseSpeedX = baseSpeedY = 2;
    gamePaused = false;
    updateScore();
    resetBall();
    paddleLeft.y = paddleRight.y = canvas.height / 2 - paddleHeight / 2;
}

// Termine la partie et affiche le gagnant
function endGame(winner) {
    gameRunning = false;
    startButton.style.display = 'block';
    startButton.textContent = `${winner} gagne ! Rejouer ?`; // Change le texte du bouton
}

// Boucle principale du jeu
function gameLoop() {
    if (gameRunning) {
        update();       // Met à jour l'état du jeu
        draw();         // Dessine l'état actuel
        requestAnimationFrame(gameLoop); // Continue la boucle
    }
}
