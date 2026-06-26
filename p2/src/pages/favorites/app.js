import { getFavorites, removeFavorite, isFavorite } from "../../services/service.js";

const $grid = document.getElementById("fav-grid");
const $empty = document.getElementById("fav-empty");
const $count = document.getElementById("fav-count");
const $search = document.getElementById("fav-search");
const $ordering = document.getElementById("fav-ordering");

function renderFavorites() {
  const query = $search.value.trim().toLowerCase();
  const order = $ordering.value;
  let favs = getFavorites();

  if (query) {
    favs = favs.filter((g) => g.name.toLowerCase().includes(query));
  }

  favs.sort((a, b) => {
    if (order === "name") return a.name.localeCompare(b.name);
    if (order === "-name") return b.name.localeCompare(a.name);
    if (order === "-rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  const total = getFavorites().length;
  $count.textContent = total > 0
    ? `${favs.length} de ${total} juego${total !== 1 ? "s" : ""} guardado${total !== 1 ? "s" : ""}`
    : "";

  $grid.innerHTML = "";

  if (favs.length === 0) {
    $empty.classList.remove("hidden");
    $empty.querySelector("p").textContent = total === 0
      ? "No tenés juegos guardados aún."
      : "Ningún favorito coincide con la búsqueda.";
    return;
  }

  $empty.classList.add("hidden");
  favs.forEach((game) => renderCard(game));
}

function renderCard(game) {
  const rating = game.rating ?? 0;
  const ratingColor = rating >= 4 ? "#4ade80" : rating >= 3 ? "#facc15" : "#f87171";

  const $article = document.createElement("article");
  $article.classList.add("search-result");
  $article.dataset.id = game.id;

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
        <button class="btn-remove" title="Quitar de favoritos">♥ Quitar</button>
      </div>
    </div>
  `;

  $article.querySelector("img").addEventListener("click", () => {
    window.location.href = `/src/pages/info/index.html?id=${game.id}`;
  });
  $article.querySelector(".btn-info").addEventListener("click", () => {
    window.location.href = `/src/pages/info/index.html?id=${game.id}`;
  });

  $article.querySelector(".btn-remove").addEventListener("click", () => {
    removeFavorite(game.id);
    $article.style.transition = "opacity 0.3s, transform 0.3s";
    $article.style.opacity = "0";
    $article.style.transform = "scale(0.9)";
    setTimeout(() => renderFavorites(), 310);
  });

  $grid.appendChild($article);
}

$search.addEventListener("input", renderFavorites);
$ordering.addEventListener("change", renderFavorites);

renderFavorites();
