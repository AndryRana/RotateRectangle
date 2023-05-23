const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // Récupère le contexte de rendu 2D de la toile en utilisant la méthode `getContext` avec l'argument "2d".
const repaintBtn = document.getElementById("repaint-btn");

let rectangles = []; // Déclarer un tableau vide nommé `rectangles` pour stocker des informations sur les rectangles qui seront dessinés sur le canevas.

// Génère un code couleur hexadécimal aléatoire
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  } // Génère en boucle six caractères aléatoires à partir de la chaîne "0123456789ABCDEF" et les concatène pour former un code couleur au format "#RRGGBB". 
  return color;
}


function drawRectangle(rect) {
  ctx.save(); // Sauvegarde de l'état actuel de la transformation
  ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2); // Translation vers le centre du rectangle
  ctx.rotate((rect.angle * Math.PI) / 180); // Appliquer une transformation de rotation
  ctx.fillStyle = rect.color;
  ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height); // Dessinez le rectangle centré sur (0,0)
  ctx.restore(); // Rétablir l'état de transformation précédent
}

// Dessiner tous les rectangles stockés dans le tableau rectangles sur le canevas.
function drawRectangles() {
  /* 
  Efface tous les dessins précédents sur le canevas et 
  spécifie la zone rectangulaire à effacer, en commençant par le coin supérieur gauche (0, 0) et en s'étendant jusqu'à la largeur et la hauteur du canevas.
  */
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < rectangles.length; i++) {
    drawRectangle(rectangles[i]);// Invoque la fonction drawRectangle pour dessiner le rectangle individuel sur le canevas.
  }
}

// Ajoute un nouveau rectangle au tableau des rectangles, puis appelle la fonction drawRectangles pour redessiner tous les rectangles sur le canevas.
function addRectangle(x, y, width, height) {
  const rect = {
    x: x,
    y: y,
    width: width,
    height: height,
    color: getRandomColor(),
    angle: 0,
  };
  rectangles.push(rect);
  drawRectangles();
}

/*
Au clic, la fonction addRectangle est appelée et les valeurs e.offsetX et e.offsetY sont utilisées pour définir la position du nouveau rectangle,
et la largeur et la hauteur générées aléatoirement comme dimensions
*/
canvas.addEventListener("mousedown", (e) => {
  const width = Math.floor(Math.random() * (100 - 20 + 1))
  const height = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
  addRectangle(e.offsetX, e.offsetY, width, height);
});


