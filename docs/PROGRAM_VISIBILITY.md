# Independent program visibility

The event program is separate from the keepsake at program.html, with its own downloadable PDF. The homepage links to the separate program rather than embedding the full schedule.

To hide after the event: set programVisible to false in content/site.json, run the build and checks, commit and redeploy. This removes program links from the home page, replaces the direct program URL with an event-ended message, and removes the PDF from the published downloads directory. The keepsake and profiles are unaffected. No automatic takedown is scheduled.

The editorial PDF source remains private in content/program.pdf while preparing. Before making the repository public, understand that files committed there and their Git history can be accessed by others. Hiding a program on the website cannot revoke previously downloaded copies or erase Git history. A future public-release build must omit private material; this program contains only guest-facing information.

Times: Sunday October 25, 2026, 4–6 PM Eastern. Program shows order, not internal cue times. Public deployment remains disabled until Charlene authorizes release.
