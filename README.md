# Movie Explorer – Discover Your Favorite Films

> Internship assignment — a responsive movie discovery app backed by the TMDb API.

**Live demo:** _link placeholder_

---

## Screenshots

_Add screenshots here after deployment._

---

## Features

### Core
- **Login** — mock auth with fixed demo credentials; session persisted in localStorage; redirects back to the intended page after login
- **Hero banner** — featured trending movie with backdrop, rating, overview, and quick-favorite
- **Trending grid** — weekly trending movies (TMDb `/trending/movie/week`)
- **Debounced search** — 500 ms debounce, infinite scroll on results, last query restored on reload
- **Filters** — genre, release year, minimum rating; uses TMDb `/discover/movie`; clear-all button
- **Movie details** — backdrop, poster, runtime, genres, overview, top-10 cast with photos, embedded YouTube trailer
- **Favorites** — persisted in localStorage; remove from grid; empty state with link to Home
- **Light / dark mode** — toggle in navbar, persisted, respects system preference on first visit

### Bonus / Quality
- Skeleton loaders on every fetch (`MovieSkeleton`)
- User-friendly error states with Retry button (network, 401, 404, 429, empty results)
- Duplicate movie deduplication when appending pages
- Stale request cancellation via request-id counter (AbortController for detail page)
- Accessible: `alt` text on images, `aria-label` on icon buttons, keyboard-navigable cards
- Mobile-first responsive grid (xs=2, sm=3, md=4, lg=5, xl=6 columns)
- TMDb attribution footer on all protected pages

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build tool | **Vite 8** _(the assignment brief listed Create React App, which was officially deprecated in 2023; Vite is the community-recommended replacement and used here)_ |
| Styling | Material-UI v5 + `@mui/icons-material`, custom MUI theme |
| Routing | React Router v6 |
| HTTP | axios |
| State | React Context API |
| Language | TypeScript |
| Deployment | Vercel |

---

## Setup

```bash
# 1. Clone
git clone <repo-url>
cd MovieExplorerWebApp

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your TMDb API key:
#   REACT_APP_TMDB_KEY=your_key_here
# Get a free key at https://www.themoviedb.org/settings/api

# 4. Start dev server
npm run dev
# App is available at http://localhost:5173
```

---

## Demo Credentials

| Field | Value |
|-------|-------|
| Username | `demo` |
| Password | `demo123` |

---

## TMDb API Usage

| Endpoint | Used in |
|----------|---------|
| `GET /trending/movie/week` | `MovieContext` — home hero + trending grid |
| `GET /genre/movie/list` | `MovieContext` — populates genre filter dropdown |
| `GET /search/movie?query=&page=` | `MovieContext` — debounced search with pagination |
| `GET /discover/movie` | `MovieContext` — genre / year / rating filter results |
| `GET /movie/now_playing` | `HomePage`, `MoviesPage` — New Releases category |
| `GET /movie/top_rated` | `HomePage`, `MoviesPage` — Top Rated category |
| `GET /movie/popular` | `HomePage`, `MoviesPage` — Popular category |
| `GET /movie/{id}?append_to_response=credits,videos,reviews` | `MovieDetailsPage` — full movie profile, cast, trailer, reviews |

Image base URL: `https://image.tmdb.org/t/p/w500{path}` (helper in `src/api/tmdb.ts` and re-exported from `src/utils/helpers.ts`).

---

## Folder Structure

```
src/
  api/
    tmdb.ts          axios instance, interceptors, all endpoint functions
    types.ts         shared TypeScript types
  components/
    AppLayout.tsx    shared navbar + outlet + TMDb footer
    CastList.tsx     top-10 cast grid
    EmptyState.tsx   zero-results and zero-favorites view
    ErrorMessage.tsx error card with Retry button
    Filters.tsx      genre / year / rating selects
    LoadMoreButton.tsx
    Loader.tsx       page spinner + grid skeleton wrapper
    MovieCard.tsx    poster card with favorite toggle
    MovieDetails.tsx details hero section
    MovieGrid.tsx    responsive MUI Grid wrapper
    MovieSkeleton.tsx  individual card skeleton
    Navbar.tsx       app bar with search link, theme toggle, logout
    PosterFan.tsx    decorative poster fan on home page
    ProtectedRoute.tsx redirect to /login when unauthenticated
    SearchBar.tsx    controlled search input
    ThemeToggle.tsx  light/dark icon button
    TrailerPlayer.tsx  YouTube iframe embed
    ErrorBoundary.tsx  catches render errors with recovery UI
    MovieRow.tsx       horizontal scrolling poster strip with See More
    ReviewsSection.tsx TMDb reviews + localStorage review form
    ErrorBoundary.tsx  catches render errors with recovery UI
    MovieRow.tsx       horizontal scrolling poster strip with See More
    ReviewsSection.tsx TMDb reviews + localStorage review form
  context/
    AuthContext.tsx      mock session (localStorage)
    FavoritesContext.tsx favorites list (localStorage)
    MovieContext.tsx     search, filters, pagination, trending
    ThemeContext.tsx     MUI theme + light/dark toggle
  hooks/
    useDebounce.ts       generic debounce hook
    useInfiniteScroll.ts IntersectionObserver sentinel
    useLocalStorage.ts   type-safe localStorage hook
    useCountUp.ts        count-up animation on scroll
    useCountUp.ts        count-up animation on scroll
  pages/
    FavoritesPage.tsx
    HomePage.tsx
    LoginPage.tsx
    MovieDetailsPage.tsx
    MoviesPage.tsx
    MoviesPage.tsx
    NotFoundPage.tsx
    SignupPage.tsx
    SignupPage.tsx
  routes.tsx             createBrowserRouter definition
  theme/
    theme.ts             light + dark MUI theme factory
  utils/
    helpers.ts           formatYear, formatRating, getImageUrl re-export
  index.css              Tailwind CSS v4 import + global resets
  main.tsx               React entry point
```

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import the project in Vercel; set `REACT_APP_TMDB_KEY` in **Settings → Environment Variables**.
3. Build command: `npm run build` — Output directory: `dist`.
4. `vercel.json` rewrites all paths to `/index.html` so deep links (e.g. `/movie/123`) work after a hard refresh.

---

> This product uses the TMDB API but is not endorsed or certified by TMDB.
