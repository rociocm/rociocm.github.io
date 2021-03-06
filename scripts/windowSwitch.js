//FUNCIONALIDAD DE LINKS DEL HEADER-NAV, DISPLAY DE SECCIÓN DE FAVORITOS Y DE MIS GIFOS//

const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

//Inicializa los favoritos.
if (!localStorage.getItem("favGifs")) localStorage.setItem("favGifs", "[]");


//0. Links del header funcionales.
let galleryPagesShown = 0;
const headerMenuSwitch = document.getElementById("burguer-switch");
const homeLogo = document.getElementById("home-logo");
const navLinks = Array.from(document.getElementById("header-links").children);
const hiddenSections = Array.from(document.querySelectorAll(".hidden-section"));
//Datos: hiddenSection[0] y [1] trae a search-section y searched-section respectivamente.
//Y [2] y [3] se corresponden a las secciones de favoritos y myGifos respectivamente.

//Si el usuario proviene de CreateGifo desde los links del headerNav, muestra la sección correspondiente:
if (window.location.hash === "#favorites") {
  openFavorites();
} else if (window.location.hash === "#gifos") {
  openMyGifos();
};

//Funcionalidad de los links del header.
navLinks[1].addEventListener("click", openFavorites);
navLinks[2].addEventListener("click", openMyGifos);
homeLogo.addEventListener("click", displayHomescreen);


//Funcionalidad de los botones de 'Ver más' en Favoritos y Mis Gifos.
const favMoreBtn = hiddenSections[2].children[2].lastElementChild;
const myGifosMoreBtn = hiddenSections[3].children[2].lastElementChild;

favMoreBtn.addEventListener("click", () =>
  loadMoreGifs(JSON.parse(localStorage.getItem("favGifs")), hiddenSections[2], false)
);

myGifosMoreBtn.addEventListener("click", () =>
  loadMoreGifs(JSON.parse(localStorage.getItem("myGifs")), hiddenSections[3], true)
);



function openFavorites() {
  navLinks[1].classList.add("active-link");
  navLinks[2].classList.remove("active-link");
  const favoritesSection = hiddenSections[2];
  const favoritesGifs = JSON.parse(localStorage.getItem("favGifs"));
  displayGifsByIdGallery(favoritesGifs, favoritesSection, false);
}
function openMyGifos() {
  navLinks[2].classList.add("active-link");
  navLinks[1].classList.remove("active-link");
  const myGifosSection = hiddenSections[3];
  const myGifs = JSON.parse(localStorage.getItem("myGifs"));
  displayGifsByIdGallery(myGifs, myGifosSection, true);
}


function displayGifsByIdGallery(gifsIds, gallerySection, isMyGifos) {//Muestra la galería correspondiente (o el mensaje de galería vacía) y manda a cargar los primeros 12 gifs.
  galleryPagesShown = 0;
  headerMenuSwitch.checked = false;
  hiddenSections.forEach(section => section.classList.add("hidden"));
  gallerySection.classList.remove("hidden");

  if (gifsIds !== null && gifsIds.length !== 0) {//Muestra la galería.
    gallerySection.children[2].classList.remove("hidden");
    gallerySection.children[3].classList.add("hidden");
    gallerySection.children[2].firstElementChild.innerHTML = ""; //Vacía la galería de gifs previos.

    loadMoreGifs(gifsIds, gallerySection, isMyGifos); //Carga los gifs en la galería.
  } else { //Muestra la sección de "No hay Gifs".
    gallerySection.children[2].classList.add("hidden");
    gallerySection.children[3].classList.remove("hidden");
  }
}

function loadMoreGifs(gifsIds, gallerySection, isMyGifos) {//Manda a cargar hasta 12 gifs de gifsIds en el contenedor de GallerySection.
  gifsIds = gifsIds.splice(galleryPagesShown * 12, 12);

  displaySectionGifs(gifsIds, gallerySection.children[2].firstElementChild, isMyGifos);

  const moreBtn = gallerySection.children[2].lastElementChild;
  if (gifsIds.length < 12) { moreBtn.classList.add("hidden") }
  else { moreBtn.classList.remove("hidden") };

  galleryPagesShown++;
}

async function displaySectionGifs(gifsIds, gifsCtn, isMyGifos) {//Muestra en gifsCtn los gifs cuyos ids están en el array gifsIds.
  gifsIds = gifsIds.join(); //Formatea los ids al formato que la API requiere.

  try {
    let gifs = await fetch(`https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids=${gifsIds}`);
    gifs = await gifs.json();
    gifs = gifs.data;
    gifs.forEach(gif => addGifToDOM(gif, gifsCtn, isMyGifos));
  } catch (error) {
    console.log("No se ha podido cargar el gif: " + error);
  }
};


function displayHomescreen() {
  const searchSection = hiddenSections[0];
  hiddenSections.forEach(section => section.classList.add("hidden")); //Oculta todas las secciones.
  navLinks.forEach((sectionLink => sectionLink.classList.remove("active-link"))); //Le quita el color gris al header link de la sección abierta antes. 
  searchSection.classList.remove("hidden") //Muestra sólo la sección deseada.
}
