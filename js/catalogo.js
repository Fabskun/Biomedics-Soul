const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

// 📷 Asegúrate de tener tu array de imágenes aquí
// const imagenes = [...]; // Tu arreglo de imágenes

// ✅ Añadir una hoja blanca si el número total es impar
if (imagenes.length % 2 !== 0) {
  const imagenBlanca = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAE0lEQVR42mP8z/C/HwAFgwJ/lcp6EAAAAABJRU5ErkJggg==";

  imagenes.push(imagenBlanca); // Hoja blanca para cerrar
}

let currentLocation = 1;
let numOfPapers = Math.ceil(imagenes.length / 2);
let maxLocation = numOfPapers + 1;

// 📦 Zoom con inicialización diferida
const zoom = mediumZoom({ background: 'rgba(0, 0, 0, 0.8)' });
zoom.on('open', () => book.style.visibility = 'hidden');
zoom.on('close', () => book.style.visibility = 'visible');

// ✅ Render eficiente con fragmentos
function crearPaginasLibro(imagenes) {
  book.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < imagenes.length; i += 2) {
    const pageIndex = i / 2 + 1;
    const paper = document.createElement("div");
    paper.className = "paper";
    paper.id = `p${pageIndex}`;
    paper.style.zIndex = numOfPapers - pageIndex + 1;

    // FRONT
    const front = document.createElement("div");
    front.className = "front";
    const frontContent = document.createElement("div");
    frontContent.className = "front-content";
    frontContent.id = `f${pageIndex}`;
    const imgFront = document.createElement("img");
    imgFront.src = imagenes[i];
    imgFront.classList.add("zoomable");
    frontContent.appendChild(imgFront);
    front.appendChild(frontContent);

    // BACK
    const back = document.createElement("div");
    back.className = "back";
    const backContent = document.createElement("div");
    backContent.className = "back-content";
    backContent.id = `b${pageIndex}`;
    const imgBack = document.createElement("img");
    imgBack.src = imagenes[i + 1] ?? "";
    imgBack.classList.add("zoomable");
    backContent.appendChild(imgBack);
    back.appendChild(backContent);

    paper.appendChild(front);
    paper.appendChild(back);
    fragment.appendChild(paper);
  }

  book.appendChild(fragment);

  // 🔁 Reatacha el zoom después del render
  requestIdleCallback(() => {
    zoom.detach();
    zoom.attach('.zoomable');
  });
}

// ✅ Render inicial
crearPaginasLibro(imagenes);

// 📘 Navegación
function openBook() {
  book.style.transform = "translateX(50%)";
  prevBtn.style.transform = "translateX(-180px)";
  nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
  book.style.transform = isAtBeginning ? "translateX(0%)" : "translateX(100%)";
  prevBtn.style.transform = "translateX(0)";
  nextBtn.style.transform = "translateX(0)";
}

// 🧠 Movimiento con frame optimizado
function goNextPage() {
  if (currentLocation < maxLocation) {
    requestAnimationFrame(() => {
      const paper = document.getElementById(`p${currentLocation}`);
      if (paper) {
        paper.classList.add("flipped");
        paper.style.zIndex = currentLocation;
      }
      if (currentLocation === 1) openBook();
      if (currentLocation === numOfPapers) closeBook(false);
      currentLocation++;
    });
  }
}

function goPrevPage() {
  if (currentLocation > 1) {
    requestAnimationFrame(() => {
      currentLocation--;
      const paper = document.getElementById(`p${currentLocation}`);
      if (paper) {
        paper.classList.remove("flipped");
        paper.style.zIndex = numOfPapers - currentLocation + 1;
      }
      if (currentLocation === 1) closeBook(true);
      if (currentLocation === numOfPapers) openBook();
    });
  }
}

// 🖱️ Listeners
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);


