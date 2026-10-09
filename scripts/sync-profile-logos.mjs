#!/usr/bin/env node
/**
 * 将仓库根 assets/profile-logos/ 下的星座/性格 logo 同步到各模板 public/profile-logos/。
 *
 * 用法：node scripts/sync-profile-logos.mjs [模板目录名 ...]
 * 不传参数时同步全部模板。修改 assets/profile-logos/ 后重跑本脚本即可更新所有模板。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(repoRoot, "assets", "profile-logos");
const templates = [
  "anime-diary",
  "food-diary",
  "game-diary",
  "lens-life-template",
  "manga-diary",
  "media-creator",
  "media-diary",
  "melody-notes",
  "photo-creator",
  "tech-geek",
  "wanderlust-template",
];

const groups = readdirSync(sourceDir).filter((name) =>
  existsSync(join(sourceDir, name)),
);

const requested = process.argv.slice(2);
const targets = requested.length > 0 ? requested : templates;

let synced = 0;
for (const template of targets) {
  const destRoot = join(repoRoot, template, "public", "profile-logos");
  if (!existsSync(join(repoRoot, template))) {
    console.warn(`[skip] 模板目录不存在: ${template}`);
    continue;
  }
  for (const group of groups) {
    const src = join(sourceDir, group);
    const dest = join(destRoot, group);
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
    synced += readdirSync(src).length;
  }
  console.log(`[ok] ${template}/public/profile-logos`);
}

console.log(`完成：${targets.length} 个模板 × ${groups.length} 组，共同步 ${synced} 个文件。`);
