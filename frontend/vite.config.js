import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        explore: resolve(__dirname, "explore.html"),
        movies: resolve(__dirname, "movies.html"),
        mylist: resolve(__dirname, "mylist.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        profile: resolve(__dirname, "profile.html"),
        newandpopular: resolve(__dirname, "newandpopular.html"),
        singlemovie: resolve(__dirname, "singlemovie.html"),
        tvshows: resolve(__dirname, "tvshows.html"),
        errorpage: resolve(__dirname, "404.html"),
      },
    },
  },
});
