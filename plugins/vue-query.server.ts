import {
  VueQueryPlugin,
  dehydrate,
  QueryClient,
} from "@tanstack/vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient();

  nuxtApp.hook("app:rendered", () => {
    const state = dehydrate(queryClient);
    useState("vue-query").value = state;
  });

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Adjust stale time according to your needs
        refetchOnWindowFocus: false,
      },
    },
  });
});
