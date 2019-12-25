import config from "./config.ts";

const filesMap: Map<string, number> = new Map<string, number>();
let reloadHandle: number = undefined;
let process: Deno.Process = null;

async function saveFileToMap(path: string = ""): Promise<string> {
  const currentPath = config.rootDir + path;
  const files = await Deno.readDir(currentPath);

  for (let i = 0, length = files.length; i < length; i++) {
    const item = files[i];
    if (item.isFile()) {
      // 如果是文件
      const fileKey = path + "/" + item.name;
      const lastModified = filesMap.get(fileKey);
      if (lastModified && lastModified !== item.modified) {
        if (reloadHandle) {
          clearTimeout(reloadHandle);
        }
        console.log(`[MODIFIED] File: ${fileKey}`);
        reloadHandle = setTimeout(() => {
          if (process) {
            console.log(`[RELOAD] Closeing previous process....`);
            process.close();
            console.log(`[RELOAD] Previous process has been closed.`);
          }
          console.log(`[RELOAD] Starting new process....`);
          console.log(`[RELOAD] Execute command: ${config.cmd}`);
          process = Deno.run({ args: config.cmd.split(" ") });
        }, config.reloadDelay);
      }
      if (config.exts.indexOf(item.name.split(".")[1]) > -1) {
        filesMap.set(fileKey, item.modified);
      }
    }
    if (item.isDirectory()) {
      // 如果是目录
      const nextPath = path + "/" + item.name;
      if (config.excludeDir.indexOf(nextPath) === -1) {
        await saveFileToMap(nextPath);
      }
    }
  }
  return Promise.resolve("ok");
}

async function check() {
  await saveFileToMap();
}

export default function start() {
  if (config.autoRun) {
    console.log(`[AUTORUN] Starting new process....`);
    console.log(`[RELOAD] Execute command: ${config.cmd}`);
    process = Deno.run({ args: config.cmd.split(" ") });
  }
  setInterval(check, config.checkInterval);
}
