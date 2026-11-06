# Content backup

The blog's content is authored in [DA](https://da.live) (`blefebvre/da-impl-det-blog`) and lives outside this repo. A script mirrors that content into a local clone of a separate, **private** git repo, so every backup is versioned without making unpublished content public or bloating this code repo.

Backups are run manually, on demand. Nothing is scheduled.

## What gets backed up

- **DA source**: the HTML and JSON documents exactly as DA stores them (posts, `index`, `nav`, `footer`, `fragments/`, `redirects.json`, etc.). This is the restorable copy.
- **Media**: images and other files referenced by those documents, including the hidden `.<page-name>/` folders DA keeps next to each page.
- **Rendered Markdown**: the `.md` output from aem.live for each published page, for easy reading and diffing. This is a convenience copy, not a restore source.

`drafts/` is excluded.

## Requirements

- An Adobe IMS access token for an account with read access to the DA org, exported in your shell as `IMS_TOKEN`.
- IMS tokens expire (typically within 24 hours). Refresh it before each run.
- A local clone of the private backup repo.

Never commit, log, or paste the token anywhere. It only needs to exist in your shell environment.

## How it works

The script is [`tools/backup/backup.mjs`](tools/backup/backup.mjs). It is read-only: every request goes through a single GET-only function that refuses any URL other than this site's DA `list`/`source` endpoints and its aem.live pages. It also refuses to write inside this repo.

1. Walk the DA tree with the admin list API (`https://admin.da.live/list/{org}/{site}/{path}`), including each page's hidden `.<page-name>/` media folder.
2. Download every file from `https://admin.da.live/source/{org}/{site}/{path}` into `da/`.
3. Scan each page's HTML for `content.da.live` media references and download any the listing missed. The list API doesn't always return every file in hidden media folders.
4. Fetch the rendered `.md` for each published page from aem.live into `md/`.
5. Write `manifest.json` with each file's path, `lastModified` timestamp, size, and SHA-256 hash.

Runs are incremental:

- Documents are re-downloaded only when their `lastModified` changes. Git history keeps prior versions.
- Media files are never overwritten once downloaded.
- Content deleted in DA is kept in the backup, not removed.
- Any failed request makes the run exit non-zero so a partial backup isn't mistaken for a complete one.

## Running a backup

1. Refresh `IMS_TOKEN` in your shell.
2. Run `npm run backup -- --out <path-to-backup-clone>` (or set `BACKUP_DIR` and run `npm run backup`). Add `--dry-run` to only list what would be downloaded.
   By default, the backup clone lives next to this repo's checkout, so from the repo root run:

   ```sh
   npm run backup -- --out ../da-impl-det-blog-backup
   ```

   If you're working in a git worktree or another location, `..` won't point to the same folder. Pass the absolute path to the backup clone, or clone `blefebvre/da-impl-det-blog-backup` (private) first.
3. In the backup clone, review the changes with `git status` / `git diff`, then commit and push.

## Restoring

Upload documents from `da/` back to DA with the admin source API (`PUT https://admin.da.live/source/{org}/{site}/{path}`) or through the da.live UI, then preview and publish as usual. Upload media before the documents that reference it.
