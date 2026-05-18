# Ash Note

This starter is based on Ash, installed through the current npm package name `experimental-ash`.

Primary docs:

- https://ash.labs.vercel.dev/docs/project-layout
- https://ash.labs.vercel.dev/docs/tools
- https://ash.labs.vercel.dev/docs/hooks
- https://ash.labs.vercel.dev/docs/skills
- https://ash.labs.vercel.dev/docs/evals
- https://ash.labs.vercel.dev/docs/context-control
- https://ash.labs.vercel.dev/docs/subagents

The repo is private-first and early. Avoid overclaiming public API stability. In particular,
`experimental-ash@0.16.2` does not yet expose the plugin API described in the current research docs,
so local packages expose normal Ash hook/tool/context helpers for v1.
