# The Sound of Becoming

Private working website for the October 25, 2026 listening circle. **Current stage: website structure complete; awaiting final content. GitHub Pages must remain unpublished.**

## Approved direction

Website: The Listening Room (option 1), with subtle right-side radial waves, gold event-style waveform, and two album-link sections on every songwriter page. Downloadable keepsake: The Becoming Journal (option 2). Five songwriter profiles and Sanah Bittaye Mitchell’s producer profile are included. Sanah has no album sections.

## Edit content once

- `content/profiles.json`: approved names, bios, full purpose statements, song stories, portraits, album links and primary connection links. Existing bios are reference drafts. Blank fields are intentionally awaiting final copy.
- `content/site.json`: download destinations and approval/readiness flags. Keepsake entry is https://bklyncustomdesigns.com/sob-keepsake. The final Google Drive destination and program URL still need confirmation.
- `templates/`: approved page layouts. Generated HTML at the repository root is the preview output; change the content files and rebuild rather than editing duplicated text.

## Local preview and checks

Requires Node.js 18 or later. No package installation or API key is needed.

```
npm run build
npm run check
npm run content:status
npm run check:release
```

`content:status` lists missing information. `check:release` intentionally fails until profiles, song titles, platform links, downloads and editorial approvals are complete. It is separate from the structural check, which should pass now. Serve the root using any static local server, for example `python3 -m http.server 8766 --bind 127.0.0.1`.

## Publishing is a separate step

There is no deployment workflow, no Pages configuration and no custom domain configuration in this repository. `noindex` and draft labels are convenience markers, not access controls. Repository privacy and leaving Pages unpublished provide the current private preparation workflow. Do not change visibility or enable Pages until Charlene requests release. On a Free account, the repository will need to become public to use GitHub Pages.

See `docs/CONTENT_NEEDED.md` for the remaining content and `docs/RELEASE_CHECKLIST.md` for release checks. Keep rehearsal transcripts, guest lists, Zoom join links, original music masters and production records outside this repository. Only guest-safe site content and assets are included.
