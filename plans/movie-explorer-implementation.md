# Movie Explorer – Discover Your Favorite Films: Implementation Plan

## 1. Goal and success criteria

Build a complete responsive React application that follows the supplied Figma reference’s cinematic visual language while implementing the requested TMDb-backed product flows.

The implementation is successful when:

- `/login` supports fixed mock credentials (`demo` / `movie123`), validates inputs, reports invalid credentials, persists the authenticated user in `localStorage`, and redirects authenticated users into the app.
- `/`, `/movie/:id`, and `/favorites` are protected and return unauthenticated users to `/login`, preserving the attempted location for post-login redirection.
- The home page loads a trending hero and trending grid, supports debounced search, supports genre/year/rating discovery filters, and appends unique paginated results via both infinite scrolling and an explicit Load More fallback.
- Movie details show all requested metadata, cast, trailer, and favorite controls.
- Favorites and theme choice persist across reloads.
- All requested loading, empty, failure, retry, responsive, hover, and not-found states are implemented.
- No TMDb credential is hardcoded or stored in source control.
- The production build succeeds.

## 2. Reference design interpretation

The supplied Figma node is a wide design board containing multiple desktop and mobile movie screens. The Figma `get_design_context` endpoint rejected the supplied node as if no layer were selected, but the node screenshot was retrieved and inspected. Use that render as the visual target and preserve these visible traits:

- Dark, cinema-first composition with near-black/charcoal page and surface colors.
- Restrained red accent for branding, selected states, ratings/actions, and important highlights.
- Large backdrop-led hero treatment with strong black gradients to keep text readable.
- Compact top navigation, bold display titles, subdued supporting metadata, and tightly composed poster grids/rails.
- Poster cards with minimal chrome, cinematic imagery, small metadata, and subtle hover elevation/scale.
- Responsive compositions that become narrow single-column/mobile layouts rather than fixed desktop canvases.
- Rounded controls and surfaces should remain restrained rather than adopting heavily pill-shaped generic styling.

Create a derived light theme that retains the same red accent, typography, hierarchy, spacing, and cinematic image treatment, using warm off-white/light-gray backgrounds and dark text instead of simply applying MUI defaults.

All movie/backdrop/poster imagery remains dynamic TMDb content rather than copied Figma artwork. Use the required TMDb URLs and a local styled placeholder when paths are missing.

## 3. Dependencies and environment configuration

Add runtime dependencies with pnpm:

- `@mui/material@^5`
- `@mui/icons-material@^5`
- `@emotion/react`
- `@emotion/styled`
- `react-router-dom@^6`
- `axios`

Update `vite.config.ts` with `envPrefix: ["VITE_", "REACT_APP_"]` so Vite exposes the exact requested `REACT_APP_TMDB_KEY` name through `import.meta.env` without embedding a credential in code.

Extend `src/vite-env.d.ts` with a typed optional `ImportMetaEnv.REACT_APP_TMDB_KEY` declaration. Do not add a real `.env` file or sample secret value.

When the variable is absent, API calls should fail with a clear configuration message rendered through the normal error UI rather than throwing an opaque runtime exception.

## 4. Proposed source structure

Keep `src/main.tsx`, `src/App.tsx`, and `src/index.css`, then add:

```text
src/
  api/
    tmdb.ts
    types.ts
  components/
    AppLayout.tsx
    CastList.tsx
    EmptyState.tsx
    ErrorMessage.tsx
    Filters.tsx
    LoadMoreButton.tsx
    Loader.tsx
    MovieCard.tsx
    MovieDetails.tsx
    MovieGrid.tsx
    Navbar.tsx
    ProtectedRoute.tsx
    SearchBar.tsx
    ThemeToggle.tsx
    TrailerPlayer.tsx
  context/
    AuthContext.tsx
    FavoritesContext.tsx
    MovieContext.tsx
    ThemeContext.tsx
  hooks/
    useDebounce.ts
    useInfiniteScroll.ts
    useLocalStorage.ts
  pages/
    FavoritesPage.tsx
    HomePage.tsx
    LoginPage.tsx
    MovieDetailsPage.tsx
    NotFoundPage.tsx
  theme/
    theme.ts
  App.tsx
  index.css
  main.tsx
  vite-env.d.ts
```

Use default exports for React components to match repository instructions. Add concise comments/JSDoc that explain each component, context, hook, and API function, while avoiding comments that merely restate obvious JSX.

## 5. Domain types and API layer

### Types

Define reusable TypeScript models for:

- `MovieSummary`
- `MovieDetailsResponse`
- `Genre`
- `CastMember`
- `Video`
- `PaginatedMovieResponse`
- `MovieFilters`
- normalized app/API errors

The favorite representation should be a stable `MovieSummary` subset sufficient to render a card offline from `localStorage`.

### Axios client

Create one axios instance with `https://api.themoviedb.org/3` as `baseURL` and a request interceptor/default parameter that injects `api_key` from `import.meta.env.REACT_APP_TMDB_KEY`.

Export focused API functions:

- `getTrendingMovies()` → `GET /trending/movie/week`
- `getGenres()` → `GET /genre/movie/list`
- `searchMovies(query, page)` → `GET /search/movie` with encoded axios params
- `discoverMovies(filters, page)` → `GET /discover/movie` with `with_genres`, `primary_release_year`, `vote_average.gte`, page, and a sensible popularity sort
- `getMovieDetails(id)` → `GET /movie/{id}` with `append_to_response=credits,videos`

Normalize errors into user-facing categories:

- Missing key/configuration
- Network/offline failure
- TMDb HTTP response failure
- Unknown failure

Provide small image URL helpers for `w500` poster/profile paths and an appropriately wider backdrop size. Return `null` for absent paths so components render styled placeholders.

## 6. Contexts and persistence

### `useLocalStorage`

Implement a generic hook that:

- Reads JSON safely once during initialization.
- Falls back to a supplied default for absent or malformed data.
- Writes updated values to `localStorage`.
- Handles storage failures without crashing the UI.

### `AuthContext`

State/API:

- `user: { username: string } | null`
- `isAuthenticated`
- `login(username, password)`
- `logout()`

Behavior:

- Accept only `demo` / `movie123`.
- Persist only the mock user/session marker, never the password.
- Return a typed success/failure result so the login page owns field/error presentation.
- Logout clears auth state and redirects through protected routing.

### `FavoritesContext`

State/API:

- `favorites`
- `isFavorite(id)`
- `addFavorite(movie)`
- `removeFavorite(id)`
- `toggleFavorite(movie)`

Persist a deduplicated array in `localStorage`, keying by movie ID. Keep favorites global across the single mock user session unless a future multi-user requirement is added.

### `ThemeContext`

State/API:

- `mode: "light" | "dark"`
- `toggleTheme()`

Persist mode in `localStorage`, defaulting to dark to match the reference. Build the MUI theme from this mode and wrap the app in `ThemeProvider`, `CssBaseline`, and the custom context provider.

### `MovieContext`

State:

- `trending`
- `genres`
- `results`
- restored `query`
- `filters`
- `page` and `totalPages`
- `mode: "idle" | "search" | "discover"`
- separate initial/append loading state
- normalized error
- request-generation/ref guard to prevent stale responses

Actions:

- Load/retry trending and genres.
- Set search query.
- Apply/reset filters.
- Run first-page search/discovery.
- Load next page.
- Clear results/error.

Persist the latest search query in `localStorage`. On reload, restore it and run the debounced search after providers mount.

Endpoint-mode rule, made explicit to avoid ambiguous mixed semantics:

- Typing a non-empty search query clears active filters and uses `/search/movie`.
- Applying any filter clears the text query and uses `/discover/movie`.
- Clearing the query and all filters returns the page to the trending-only state.

When appending pages, merge by movie ID using a `Map`/ID set to prevent duplicates. Block concurrent append calls and stop when `page >= totalPages`.

## 7. Routing and provider composition

In `src/main.tsx`, mount the app under `BrowserRouter` and compose providers in this order:

1. Theme provider/context
2. Auth provider
3. Favorites provider
4. Movie provider
5. App routes

In `src/App.tsx`, define React Router v6 routes:

- `/login` → `LoginPage`
- Protected layout branch using `ProtectedRoute` + `AppLayout`:
  - `/` → `HomePage`
  - `/movie/:id` → `MovieDetailsPage`
  - `/favorites` → `FavoritesPage`
- `*` → `NotFoundPage`

`ProtectedRoute` redirects to `/login` with `state.from`. Login redirects authenticated users away from `/login`, and successful login returns users to `state.from` or `/`.

Place `Navbar` in `AppLayout` so all protected pages consistently receive navigation, favorites access, theme toggle, and logout. The mobile navbar collapses secondary actions into a MUI menu/drawer while keeping brand and core controls accessible.

## 8. MUI theme and global styling

Use MUI as the UI/design-system source of truth for all controls and layout primitives:

- `AppBar`, `Toolbar`, `Drawer`/`Menu`, `Button`, `IconButton`
- `TextField`/`InputBase`, `Select`, `MenuItem`, `FormControl`
- `Card`, `CardActionArea`, `CardMedia`, `Chip`, `Badge`
- `Grid`, `Box`, `Stack`, `Container`, `Paper`
- `Typography`, `Alert`, `Skeleton`, `CircularProgress`
- MUI icons for navigation, search, theme, favorite, rating, play, retry, and logout

Do not build raw button/input/select controls. Define semantic palette, typography, shape, spacing, shadows, and component overrides in `src/theme/theme.ts` rather than scattering raw visual values throughout components.

Theme details:

- Dark background and paper tiers with a red primary accent.
- Warm light counterparts with the same accent and contrast hierarchy.
- Bold condensed-feeling display hierarchy using a public Google font suitable for the reference, paired with a highly readable body family; wire imports at the top of `src/index.css` before Tailwind.
- Shared card hover transition, image overlay, focus-visible treatment, button shape, and form field styling through theme overrides and reusable `sx` objects where needed.
- Keep `src/index.css` minimal: Tailwind import, Google font import in valid import order, full-height/root defaults, and any truly global browser behavior such as smooth body background transitions.

Although Tailwind remains installed, use MUI components and theme styling for the application per the user’s stack requirement.

## 9. Reusable components

### `Navbar`

- Brand links home.
- Desktop links for Home and Favorites, with favorite count.
- Theme toggle and logout action.
- Mobile menu/drawer with the same actions.
- Sticky/translucent dark treatment that integrates with the hero.

### `ThemeToggle`

- MUI `IconButton` with sun/moon icon, tooltip, and accessible label reflecting the action.

### `SearchBar`

- Controlled MUI search field.
- Clear action.
- Debouncing occurs through `useDebounce` in the consuming flow, not by mutating value late.
- Accessible label and mobile-friendly full width.

### `Filters`

- Genre select populated from context.
- Release-year select/range generated from current year down to a reasonable movie-history boundary.
- Minimum-rating select with clear options.
- Reset action.
- Responsive row on larger screens and stacked/compact grid on mobile.

### `MovieCard`

- Poster or branded placeholder.
- Title, release year fallback, rating badge, and favorite icon.
- Card click navigates to details.
- Favorite button stops propagation so it does not navigate.
- Keyboard/focus support and descriptive labels.
- Hover raises/scales subtly and reveals stronger overlay/details without hiding essential content on touch devices.

### `MovieGrid`

Use responsive MUI CSS grid breakpoints to meet the required density:

- 1 column on the narrowest mobile widths
- 2 columns on typical mobile/small tablet
- 3 columns on tablet
- 4–6 columns across desktop/wide desktop

### Loading and failure components

- `Loader` supports page spinner and movie-card skeleton grid variants.
- `ErrorMessage` uses a themed MUI alert/panel, normalized message, and optional retry button.
- `EmptyState` handles no search matches, no favorites, and no trailer/cast content with context-specific copy and actions.
- `LoadMoreButton` includes loading/disabled/end states and remains available even when intersection-based loading is enabled.

### `useInfiniteScroll`

- Observe a small sentinel after results using `IntersectionObserver`.
- Call the latest callback only when enabled, not loading, and more pages exist.
- Disconnect on cleanup and tolerate environments without `IntersectionObserver`; the Load More button remains the fallback.

### Movie detail components

- `MovieDetails`: backdrop hero, poster, title/year, score, runtime, genres, overview, and favorite action.
- `CastList`: responsive horizontal scroll/compact grid of top-billed cast (limit to a useful initial set), with profile placeholder.
- `TrailerPlayer`: choose the first official YouTube Trailer when available, otherwise the first YouTube Trailer; render a responsive privacy-conscious YouTube embed with title and fullscreen support, or an empty state.

## 10. Page behavior

### Login page

- Cinematic dark/red background treatment consistent with the reference and a focused MUI `Paper` form.
- Username and password fields with required validation.
- Password visibility toggle.
- Submit loading feedback only long enough to make state transition clear; no fake network delay is required.
- Inline invalid-credentials error.
- Display the demo credentials near the form so evaluators can enter the app.
- Theme toggle can remain available on login, but no protected navbar is shown.

### Home page

1. Fetch trending and genres when needed.
2. Render a hero from the first trending movie with a valid backdrop when possible, falling back to another trending item or a gradient surface.
3. Hero includes title, overview, key metadata, details CTA, and favorite CTA.
4. Render search and filters in a clear surface overlapping or directly below the hero, matching the reference’s compact control style.
5. With no active mode, show `Trending Movies` grid.
6. With query mode, show `Search Results for “…”` and paginated results.
7. With discover mode, show `Filtered Movies` and active-filter chips/summary.
8. Show first-load skeletons, append skeletons/spinner, empty state, retry error, sentinel, and Load More button as appropriate.
9. Debounce query by roughly 400 ms and ignore stale request responses.

### Movie details page

- Validate `id` as a positive numeric route param; invalid IDs render a not-found-style state.
- Fetch details on ID change with local loading/error/retry state.
- Build the page from the details response and appended credits/videos.
- Use full-width backdrop hero with gradients, responsive poster/details split, cast section, and trailer section.
- Favorite action uses normalized details data compatible with `MovieSummary`.
- A TMDb 404 produces a movie-not-found message rather than the generic network error.

### Favorites page

- Render persisted favorites using `MovieGrid`.
- Each card can remove via its favorite control; optionally provide a clearly labeled remove action in the card overlay.
- Empty state explains how to add movies and links back home.

### 404 page

- Cinematic themed error page with `404`, concise copy, and a MUI button to return home (or login when unauthenticated via normal route protection behavior).

## 11. Accessibility and edge cases

- Use semantic MUI components and meaningful heading variants/component props.
- Ensure all icon-only controls have tooltips and `aria-label`s.
- Preserve visible keyboard focus and sufficient contrast in both themes.
- Give all loaded images useful alt text and mark decorative backdrops appropriately.
- Handle absent poster, backdrop, profile, overview, release date, runtime, genres, cast, and trailer independently.
- Prevent duplicate requests from React Strict Mode with in-flight/request-generation guards where practical.
- Cancel or ignore obsolete searches when query/filter mode changes.
- Encode all API params via axios rather than interpolating query strings manually.
- Disable pagination at the final page and during active requests.
- Do not let malformed localStorage data crash providers.
- Never persist passwords, API responses unnecessarily, or the TMDb key.

## 12. Verification strategy

Do not start a development server; use the already supervised `.figma/make/dev` instance and hot reload.

After implementation:

1. Run the repository formatter through the defined package script (`pnpm format`).
2. Run `pnpm build` to verify TypeScript and Vite production compilation.
3. Inspect only produced source files for accidental raw interactive HTML controls and hardcoded TMDb credentials.
4. Use the existing preview to verify:
   - unauthenticated redirects and attempted-route return
   - login validation, wrong credentials, and `demo` / `movie123`
   - logout
   - dark/light persistence
   - trending and hero states
   - debounced search and restored query
   - filters switching to discover mode
   - infinite append plus Load More, without duplicate cards
   - details, missing media fallbacks, cast, trailer, and details retry
   - adding/removing favorites from cards, hero/details, and favorites page
   - favorites persistence and empty state
   - direct 404 route
   - mobile, tablet, desktop, and wide grid/layout behavior
5. If a real `REACT_APP_TMDB_KEY` is not available during verification, confirm the missing-key error state and complete build-level checks; live TMDb response verification remains dependent on the environment variable being supplied.

## 13. Scope controls

- Do not add a backend, real identity provider, account registration, server-side favorite storage, or testing framework unless separately requested.
- Do not commit or create a real API key file.
- Do not start a second Vite server.
- Keep design extensions inside the MUI theme and local app components; do not introduce a second UI library.
