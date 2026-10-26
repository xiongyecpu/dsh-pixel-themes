#!/usr/bin/env node
/**
 * 把 src/client.template.js 里的 __PIXEL_STYLES__ 换成 data/styles.json 里的 21 套主题数据，
 * 产出可直接被 DSH 加载的 client.js（手写 lazy-CJS bundle，无需 bundler）。
 *
 * 用法：node scripts/build.mjs [styles.json 路径]
 * 默认读仓库内的 data/styles.json（21 套主题，色值来自公开终端/编辑器配色，名称与像素画自绘）
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const source = process.argv[2] ?? resolve(root, 'data/styles.json')

const raw = JSON.parse(readFileSync(source, 'utf8'))

/** 只保留皮肤需要的字段：名字、配色、像素画、装饰字符。词条/音效这一版不用。 */
const styles = raw.styles.map((s) => ({
  id: s.id,
  name: s.name,
  colors: s.colors,
  bubbles: s.bubbles ?? [],
  sprite: s.sprite ? { palette: s.sprite.palette, frames: s.sprite.frames } : null,
}))

const template = readFileSync(resolve(root, 'src/client.template.js'), 'utf8')
if (!template.includes('__PIXEL_STYLES__')) throw new Error('template 里找不到 __PIXEL_STYLES__ 占位符')

const data = JSON.stringify(styles, null, 2).replace(/\n/g, '\n    ')
const out = template.replace('__PIXEL_STYLES__', data)
writeFileSync(resolve(root, 'client.js'), out)

const bytes = Buffer.byteLength(out)
console.log(`✓ client.js 已生成：${styles.length} 套风格，${(bytes / 1024).toFixed(1)} KB`)
let frames = 0
for (const s of styles) frames += s.sprite?.frames?.length ?? 0
console.log(`  sprite 帧数合计 ${frames}；纯色风格 ${styles.filter(s => !s.sprite).map(s => s.id).join(',') || '无'}`)
