# aicut skills

Skills that let a coding agent (Claude Code, Codex, Cursor and others) make AI video, images, audio and story episodes with the [aicut](https://www.aicut.pro) command line. Every skill prices a job first and asks the person before it spends tokens.

```
npx skills add aicut-pro/skills
```

In Claude Code you can install it as a plugin instead: `/plugin install aicut --marketplace aicut-pro/skills`.

The skills drive the `aicut` CLI, so install and sign in once.

```
npm i -g aicut-cli
aicut login
```

## Skills

| Skill | What it does |
| --- | --- |
| `aicut-generate` | Generate AI video, images and audio |
| `aicut-story-episode` | Make an AI Video Story episode |
| `aicut-niche-run` | Make a video from a trend format |
| `aicut-fake-text` | Make a fake-text chat video |
| `aicut-image-story` | Make an AI image story video |
| `aicut-explainer` | Make an explainer video |
| `aicut-talking-avatar` | Make a talking avatar |
| `aicut-motion-control` | Copy a video's motion onto a character |

## How spending works

Creating anything costs tokens from the person's aicut balance. The skills teach the agent one order: run the command with `--estimate` (prints the price, charges nothing), tell the person the price, wait for their explicit go, then run it with `--max-tokens <quote> --yes`. Firing a story episode needs a go that names firing and `--confirm-fire`; publishing a post needs a go that names publishing and `--confirm-publish`. The CLI enforces the order in code, and without a terminal `--max-tokens` alone counts as the go.

## More

- Install steps for each tool: [INSTALL.md](INSTALL.md)
- Prefer a hosted connection to a CLI? aicut is also an MCP server: https://www.aicut.pro/mcp
- This repository is generated from the aicut recipe source; fix a skill in the source, not here.
