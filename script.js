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

/*
Supprime un rectangle spécifié du tableau des rectangles, 
puis appelle la fonction drawRectangles pour redessiner tous les rectangles sur le canevas.
*/
function removeRectangle(rect) {
  const index = rectangles.indexOf(rect);
  if (index > -1) {
    rectangles.splice(index, 1);
    drawRectangles();
  }
}

let rotationsInProgress = 0; // Compteur de rotations en cours

function rotateRectangle(rect) {
  const rotationSpeed = 5;
  let currentAngle = 0;
  
  // Cette fonction est appelée à plusieurs reprises à un intervalle fixe pour faire pivoter le rectangle.
  function rotate() {
    currentAngle += rotationSpeed; //Augmente la variable currentAngle de la valeur rotationSpeed, ce qui a pour effet de faire pivoter le rectangle de la valeur spécifiée.
    rect.angle = currentAngle; //met à jour la propriété angle de l'objet rect avec la nouvelle valeur currentAngle. Cette propriété est utilisée pour suivre l'angle de rotation du rectangle.
    drawRectangles(); //Redessiner tous les rectangles sur la toile et s'assurer que le rectangle pivoté est affiché correctement

    if (currentAngle >= 360) {
      clearInterval(rotationInterval);
      rect.angle = 0; // Remettre l'angle à zéro
      removeRectangle(rect); 
      checkRepaint();
    }
  }

  // Il s'agit d'une fonction interne nommée cancelRotation qui annule le processus de rotation lors d'un double-clic.
  const cancelRotation = () => {
    clearInterval(rotationInterval); //Efface l'intervalle défini par setInterval pour arrêter le processus de rotation. Le rotationInterval est la référence à l'intervalle renvoyé par setInterval.
    rect.angle = 0; // Remettre l'angle à zéro
    drawRectangles();
    removeRectangle(rect);
    checkRepaint();//repeindre d'autres rectangles sur le canevas.
    canvas.removeEventListener('dblclick', cancelRotation);
  };

  // Définir l'intervalle de rotation
  const rotationInterval = setInterval(rotate, 50);

  canvas.addEventListener('dblclick', cancelRotation);
}

/*
Vérifier la différence de surface entre les paires de rectangles 
et la mise à jour de leurs couleurs sur la base de la plus petite différence
*/
function checkRepaint() {
  let smallestDiff = Infinity; // Suivre la plus petite différence de surface entre des paires de rectangles
  let pair = null; // Stocker la paire de rectangles dont la différence d'aire est la plus faible
  /**
   * une boucle imbriquée qui parcourt les rectangles du tableau rectangles pour comparer leurs surfaces et trouver la paire dont la différence est la plus faible. 
    avec la plus petite différence.
   */
  for (let i = 0; i < rectangles.length - 1; i++) {
    for (let j = i + 1; j < rectangles.length; j++) {
      const area1 = rectangles[i].width * rectangles[i].height;
      const area2 = rectangles[j].width * rectangles[j].height;
      const diff = Math.abs(area1 - area2);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        pair = [rectangles[i], rectangles[j]];
      }
    }
  }
  /** Si une paire de rectangles présentant la plus petite différence a été trouvée,
  Attribuer une nouvelle couleur aléatoire au premier rectangle de la paire (paire[0]) et à la deuxième paire[1]
 */
  if (pair) {
    pair[0].color = getRandomColor();
    pair[1].color = getRandomColor();
    drawRectangles(); //Redessine tous les rectangles sur le canevas après avoir mis à jour leurs couleurs.
  }
}

/**
 * ajoute un récepteur d'événement dblclick au canevas pour rechercher un rectangle dans le tableau rectangles qui contient la position cliquée.
 */
canvas.addEventListener("dblclick", (e) => {
  const rect = rectangles.find((r) => {
    return (
      e.offsetX >= r.x &&
      e.offsetX <= r.x + r.width &&
      e.offsetY >= r.y &&
      e.offsetY <= r.y + r.height
    );
  });
  if (rect) {
    rotateRectangle(rect); //Appel de la fonction rotateRectangle, en passant le rectangle trouvé comme argument.
  }
});

/**
 * Lorsque le bouton est cliqué, 
 * il déclenche la vérification de la plus petite différence entre les surfaces des rectangles 
 * et met à jour leurs couleurs en conséquence.
 */
repaintBtn.addEventListener("click", () => {
  checkRepaint();
});
