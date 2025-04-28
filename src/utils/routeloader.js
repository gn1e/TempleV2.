import { readdir, stat } from "fs/promises";
import { join } from "path";
import { Hono } from "hono";

class RouteLoader {
  constructor(app) {
    this.app = app;
  }

  async loadRoute(directory, file) {
    try {
      const RouteModule = await import(join(directory, file));
      const defaultExport = RouteModule.default;

      if (defaultExport && typeof defaultExport === "function") {
        defaultExport(this.app);
      } else {
        console.error(`${file} does not export a valid route initializer`);
      }
    } catch (error) {
      console.error(`Error loading route ${file}: ${error.message}`);
    }
  }

  async processDirectory(directory) {
    const files = await readdir(directory);

    await Promise.all(
      files.map(async (file) => {
        const filePath = join(directory, file);
        const fileStats = await stat(filePath);

        if (fileStats.isDirectory()) {
          await this.processDirectory(filePath);
        } else if (fileStats.isFile() && (file.endsWith(".ts") || file.endsWith(".js"))) {
          await this.loadRoute(directory, file);
        }
      })
    );
  }

  async loadRoutes(directory) {
    try {
      await this.processDirectory(directory);
    } catch (error) {
      console.error(`Failed to load routes: ${error.message}`);
    }
  }
}

export default RouteLoader;
