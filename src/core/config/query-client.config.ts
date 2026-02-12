import { QueryClient, DefaultOptions } from "@tanstack/react-query"

const queryConfig: DefaultOptions = {
  queries: {
    // Refetch settings
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    
    // Retry settings
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Cache settings
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
    
    // Network mode
    networkMode: "online",
  },
  mutations: {
    // Retry settings for mutations
    retry: 0,
    networkMode: "online",
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

export default queryClient
