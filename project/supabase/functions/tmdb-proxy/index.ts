// Permite que o frontend faça requisições para a Edge Function.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};
const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY");

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY não configurada");
}

const TMDB_BASE = "https://api.themoviedb.org/3";


interface RouteHandler {
  (params: URLSearchParams): Promise<Response>;
}

function jsonResponse(
  data: unknown,
  status = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function errorResponse(
  message: string,
  status = 500
): Response {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

async function tmdbFetch(
  path: string,
  extraParams: URLSearchParams = new URLSearchParams()
): Promise<unknown> {

  const params = new URLSearchParams(extraParams);

  params.set("language", "pt-BR");

  params.set("api_key", TMDB_API_KEY);

  const url =
    `${TMDB_BASE}${path}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `TMDB ${response.status}: ${text}`
    );
  }

  return response.json();
}

const routes: Record<string, RouteHandler> = {


  popular: async (params) => {
    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      "/movie/popular",
      new URLSearchParams({
        page,
      })
    );

    return jsonResponse(data);
  },

  "now-playing": async (params) => {
    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      "/movie/now_playing",
      new URLSearchParams({
        page,
      })
    );

    return jsonResponse(data);
  },

  "top-rated": async (params) => {
    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      "/movie/top_rated",
      new URLSearchParams({
        page,
      })
    );

    return jsonResponse(data);
  },

  trending: async (params) => {
    const window = params.get("window") ?? "week";

    const data = await tmdbFetch(
      `/trending/movie/${window}`
    );

    return jsonResponse(data);
  },

  upcoming: async (params) => {
    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      "/movie/upcoming",
      new URLSearchParams({
        page,
      })
    );

    return jsonResponse(data);
  },


  "movie-details": async (params) => {
    const id = params.get("id");

    if (!id) {
      return errorResponse(
        "Missing 'id' parameter",
        400
      );
    }

    const data = await tmdbFetch(
      `/movie/${id}`,
      new URLSearchParams({
        append_to_response: "credits",
      })
    );

    return jsonResponse(data);
  },

  search: async (params) => {
    const query = params.get("query") ?? "";

    if (!query.trim()) {
      return jsonResponse({
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0,
      });
    }

    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      "/search/movie",
      new URLSearchParams({
        query,
        page,
        include_adult: "false",
      })
    );

    return jsonResponse(data);
  },

  genres: async () => {
    const data = await tmdbFetch(
      "/genre/movie/list"
    );

    return jsonResponse(data);
  },

  "discover-genre": async (params) => {
    const genreId = params.get("genre_id");

    if (!genreId) {
      return errorResponse(
        "Missing 'genre_id' parameter",
        400
      );
    }

    const page = params.get("page") ?? "1";

    const sort =
      params.get("sort_by") ??
      "popularity.desc";

    const data = await tmdbFetch(
      "/discover/movie",
      new URLSearchParams({
        with_genres: genreId,
        page,
        sort_by: sort,
        include_adult: "false",

        // Evita resultados com pouquíssimos votos.
        "vote_count.gte": "10",
      })
    );

    return jsonResponse(data);
  },

  recommendations: async (params) => {
    const id = params.get("id");

    if (!id) {
      return errorResponse(
        "Missing 'id' parameter",
        400
      );
    }

    const page = params.get("page") ?? "1";

    const data = await tmdbFetch(
      `/movie/${id}/recommendations`,
      new URLSearchParams({
        page,
      })
    );

    return jsonResponse(data);
  },
};

Deno.serve(async (req: Request) => {

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "GET") {
    return errorResponse(
      "Method not allowed",
      405
    );
  }

  try {
    const url = new URL(req.url);

    const segments = url.pathname
      .split("/")
      .filter(Boolean);

    const proxyIndex =
      segments.findIndex(
        (segment) => segment === "tmdb-proxy"
      );

    const route = segments
      .slice(proxyIndex + 1)
      .join("/");

    if (!route || !routes[route]) {
      return errorResponse(
        `Unknown route: ${
          route || "(none)"
        }. Available: ${Object.keys(routes).join(", ")}`,
        404
      );
    }

    return await routes[route](
      url.searchParams
    );

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    return errorResponse(
      message,
      502
    );
  }
});