# Francisco Oliveira — Portfolio

Personal portfolio: CV, about me and side projects. Built with Astro, Vue 3 and SCSS.

## Commands

| Command           | Action                                   |
| ----------------- | ---------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Dev server at `localhost:4321`           |
| `npm run build`   | Build the static site into `./dist/`     |
| `npm run preview` | Preview the production build locally     |

## Editing content

- **Personal info, skills, certifications, education, languages:** `src/data/site.ts`
- **Jobs:** one Markdown file per job in `src/content/experience/`
- **Projects:** one Markdown file per project in `src/content/projects/`
  (`draft: true` hides it from the production build; images go in `public/projects/`)
- **CV download:** put a PDF at `public/cv.pdf` and set `hasCv: true` in `src/data/site.ts`
