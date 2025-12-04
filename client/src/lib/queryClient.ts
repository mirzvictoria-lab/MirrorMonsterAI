// ===============================
// BASE_URL — SAME ORIGIN FOR RENDER
// ===============================
// When backend + frontend are deployed on Render together,
// they share the same domain. So we use a relative URL.

const BASE_URL = ""; // Same-origin backend requests



// ===============================
// IMPORTS
// ===============================
import { QueryClient, QueryFunction } from "@tanstack/react-query";



// ===============================
// ERROR HANDLER
// Throw meaningful errors for non-OK responses
// ===============================
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}



// ===============================
// GENERIC API REQUEST FUNCTION
// For mutations (POST, PUT, DELETE)
// ===============================
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}



// ===============================
// QUERY FUNCTION FACTORY
// Handles GET requests for React Query
// ===============================

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>(options: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    // Build full request URL using same-origin base
    const url = `${BASE_URL}/${queryKey.join("/")}`;

    const res = await fetch(url, {
      credentials: "include",
    });

    // Handle 401 specially if needed
    if (options.on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };



// ===============================
// CREATE QUERY CLIENT
// ===============================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
    mutations: {
      retry: false,
    },
  },
});
