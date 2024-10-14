import { build, createServer, InlineConfig } from "vite";
import { rimrafSync } from "rimraf";
import { viteSingleFile } from "vite-plugin-singlefile";
import { parseArgs } from "util";
import chokidar from "chokidar";
import { zip } from "zip-a-folder";
import fs from "fs";

const {
  values: { dev: isDev }
} = parseArgs({
  args: process.argv,
  options: {
    dev: {
      type: "boolean"
    },
    build: {
      type: "boolean"
    }
  },
  allowPositionals: true
});

const panelConfig: InlineConfig = {
  root: "./src/panel",
  publicDir: "../../metadata",
  build: {
    outDir: "../../dist",
    emptyOutDir: false
  },
  plugins: [
    viteSingleFile(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Access-Control-Request-Private-Network", "true");
          res.setHeader("Access-Control-Allow-Private-Network", "true");
          res.setHeader("Access-Control-Expose-Headers", "ETag");
          next();
        });
      }
    }
  ],
  server: {
    port: 8888,
    cors: {
      origin: [
        "https://qatium.app",
        "http://localhost:8888",
        "http://localhost:3000",
        "null"
      ],
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      optionsSuccessStatus: 204
    }
  }
};

const pluginDirectory = "src/plugin";
const watchPython = (changed: () => void) => {
  const watcher = chokidar.watch([pluginDirectory], {
    persistent: true
  });

  watcher.on("all", changed);
}

const pythonZip = "metadata/plugin.zip";
const zipPlugin = async () => {
  console.log("Zipping plugin...")
  if (fs.existsSync(pythonZip)) {
    fs.unlinkSync(pythonZip)
  }

  await zip(pluginDirectory, pythonZip);
}

(async () => {
  rimrafSync("./dist");

  await new Promise((resolve) => setTimeout(() => resolve(true), 1000));

  if (isDev) {
    await zipPlugin();
    watchPython(zipPlugin);
    const server = await createServer(panelConfig);

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } else {
    await zipPlugin();
    await build(panelConfig);
  }
})();
