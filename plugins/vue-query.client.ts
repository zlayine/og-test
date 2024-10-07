import { VueQueryPlugin, hydrate, QueryClient } from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient();

  const dehydratedState = useState("vue-query").value;
  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });
});
