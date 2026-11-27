// DealCheck — black-friday-deal-finder-01 entry program (Node 22, standard
// library only). The site is plain static files in app/ next to this file:
// index.html plus its modules, stylesheet and the deal data, with nothing
// loaded over the network. This program hands the entry in: it copies app/
// and screenshots/ into the output directory and writes dossier.json there
// with the vendored make.fun library, so the scorer can rebuild the same
// dossier byte for byte. vendor/makefun-frontend.ts must stay exactly as
// the kit shipped it.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Copy app/ first: the dossier is built from the output copy, so what the
// scorer reads is exactly what this program wrote.
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });

const shotsDir = join(outputDir, "screenshots");
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), shotsDir, { recursive: true });
}

// The scorer's caps, as the starter documents them: at most 4 screenshots
// and 256 KiB each, at most 993 app entries and 16 MiB of app files, and a
// 160 KiB dossier text cap.
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
