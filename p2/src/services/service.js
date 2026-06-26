const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_URL;

export async function fetchGames({
  search = "",
  genre = "",
  platform = "",
  ordering = "-rating",
  page = 1,
} = {}) {
  const params = new URLSearchParams({
    key: API_KEY,
    page_size: 20,
    page,
    ordering,
  });

  if (search) params.append("search", search);
  if (genre) params.append("genres", genre);
  if (platform) params.append("platforms", platform);

  const res = await fetch(`${BASE_URL}?${params}`);

  if (res.ok) {
    const data = await res.json();
    return {
      results: data.results ?? [],
      count: data.count ?? 0,
      next: data.next ?? null,
    };
  } else {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
}

export async function fetchGameDetail(id) {
  const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);

  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }
}

export async function fetchGameScreenshots(id) {
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`,
  );

  if (res.ok) {
    const data = await res.json();
    return data.results ?? [];
  } else {
    return [];
  }
}

// Favoritos (localStorage)

const FAVORITES_KEY = "gameexplorer_favorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function addFavorite(game) {
  const favs = getFavorites();
  if (!favs.some((f) => f.id === game.id)) {
    favs.push(game);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
  return favs;
}

export function removeFavorite(id) {
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(id) {
  return getFavorites().some((f) => f.id === id);
}
