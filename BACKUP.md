# Content backup

The blog's content is authored in [DA](https://da.live) (`blefebvre/da-impl-det-blog`) and lives outside this repo. This process mirrors that content into `.backup/` so a copy is versioned alongside the code.

Backups are run manually, on demand. Nothing is scheduled.

## What gets backed up

- **DA source**: the HTML and JSON documents exactly as DA stores them (posts, `index`, `nav`, `footer`, `fragments/`, `redirects.json`, etc.). This is the restorable copy.
- **Media**: images and other files referenced by those documents, including the hidden `.<page-name>/` folders DA keeps next to each page.
- **Rendered Markdown**: the `.md` output from aem.live for each published page, for easy reading and diffing. This is a convenience copy, not a restore source.

`drafts/` is excluded by default because this repo is public.

## Requirements

- An Adobe IMS access token for an account with read access to the DA org, exported in your shell as `IMS_TOKEN`.
- IMS tokens expire (typically within 24 hours). Refresh it before each run.

Never commit, log, or paste the token anywhere. It only needs to exist in your shell environment.

## How it works

1. Walk the DA tree with the admin list API (`https://admin.da.live/list/{org}/{site}/{path}`).
2. For each document, download the source from `https://admin.da.live/source/{org}/{site}/{path}`.
3. Download referenced media into the matching path under `.backup/`.
4. Fetch the rendered `.md` for each published page from aem.live.
5. Write a manifest of paths, `lastModified` timestamps, and content hashes.

Runs are incremental:

- Documents are re-downloaded only when their `lastModified` changes. Git history keeps prior versions.
- Media files are never overwritten once downloaded.
- Content deleted in DA is kept in the backup, not removed.
- Any failed request makes the run exit non-zero so a partial backup isn't mistaken for a complete one.

## Running a backup

1. Refresh `IMS_TOKEN` in your shell.
2. Run the backup script.
3. Review the changes in `.backup/` with `git status` / `git diff`.
4. Commit the result.

## Restoring

Upload documents from `.backup/` back to DA with the admin source API (`PUT https://admin.da.live/source/{org}/{site}/{path}`) or through the da.live UI, then preview and publish as usual. Upload media before the documents that reference it.

## Notes

- `.backup/` is not served by the site: `.hlxignore` excludes all dot-folders (`.*`).
- Everything in `.backup/` is public once pushed. Don't back up content that shouldn't be public.
- Media adds to repo size over time.
