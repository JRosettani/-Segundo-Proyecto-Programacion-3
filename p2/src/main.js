import {
  fetchGames,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "./services/service.js";

const $form = document.querySelector("form");
const $search = document.getElementById("search");
const $results = document.querySelector(".results");
const $btnMore = document.getElementById("btn-show-more");
const $genre = document.getElementById("filter-genre");
const $platform = document.getElementById("filter-platform");
const $ordering = document.getElementById("filter-ordering");
const $errorMsg = document.getElementById("error-msg");
const $modal = document.getElementById("modal");
const $modalBody = document.getElementById("modal-body");
const $modalClose = document.getElementById("modal-close");

let currentPage = 1;
let isLoading = false;

async function searchGames(append = false) {
  if (isLoading) return;
  isLoading = true;
  $errorMsg.textContent = "";
  $btnMore.disabled = true;

  if (!append) {
    currentPage = 1;
    $results.innerHTML = "";
  }

  try {
    const { results, next } = await fetchGames({
      search: $search.value.trim(),
      genre: $genre.value,
      platform: $platform.value,
      ordering: $ordering.value,
      page: currentPage,
    });

    if (results.length === 0 && !append) {
      $errorMsg.textContent = "No se encontraron juegos para esa búsqueda.";
      $btnMore.style.display = "none";
      return;
    }

    results.forEach((game) => renderCard(game));

    currentPage++;
    $btnMore.style.display = next ? "block" : "none";
  } catch (err) {
    console.error(err);
    $errorMsg.textContent =
      "Ocurrió un error al cargar los juegos. Intentá de nuevo.";
    $btnMore.style.display = "none";
  } finally {
    isLoading = false;
    $btnMore.disabled = false;
  }
}

function renderCard(game) {
  const fav = isFavorite(game.id);

  const $article = document.createElement("article");
  $article.classList.add("search-result");
  $article.dataset.id = game.id;

  const rating = game.rating ?? 0;
  const ratingColor =
    rating >= 4 ? "#4ade80" : rating >= 3 ? "#facc15" : "#f87171";

  $article.innerHTML = `
    <div class="card-img-wrapper">
      <img
        src="${game.background_image ?? "https://placehold.co/400x200/222/444?text=Sin+imagen"}"
        alt="${game.name}"
        loading="lazy"
      />
      <span class="card-rating" style="color:${ratingColor}">★ ${rating.toFixed(1)}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${game.name}</h3>
      <p class="card-genres">${(game.genres ?? []).map((g) => g.name).join(", ") || "—"}</p>
      <div class="card-actions">
        <button class="btn-info">Ver info</button>
        <button class="btn-fav ${fav ? "active" : ""}" title="${fav ? "Quitar de favoritos" : "Agregar a favoritos"}">
          ${fav ? "♥" : "♡"}
        </button>
      </div>
    </div>
  `;

  $article
    .querySelector("img")
    .addEventListener("click", () => goToInfo(game.id));
  $article
    .querySelector(".btn-info")
    .addEventListener("click", () => goToInfo(game.id));
  $article
    .querySelector(".btn-fav")
    .addEventListener("click", () => toggleFavorite(game, $article));

  $results.appendChild($article);
}

function goToInfo(id) {
  window.location.href = `/src/pages/info/index.html?id=${id}`;
}

function toggleFavorite(game, $article) {
  const $btn = $article.querySelector(".btn-fav");
  if (isFavorite(game.id)) {
    removeFavorite(game.id);
    $btn.textContent = "♡";
    $btn.classList.remove("active");
    $btn.title = "Agregar a favoritos";
  } else {
    addFavorite(game);
    $btn.textContent = "♥";
    $btn.classList.add("active");
    $btn.title = "Quitar de favoritos";
  }
}

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchGames(false);
});

$btnMore.addEventListener("click", () => searchGames(true));

[$genre, $platform, $ordering].forEach(($el) => {
  $el.addEventListener("change", () => searchGames(false));
});

searchGames(false);
