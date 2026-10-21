# Install

The skills need the `aicut` CLI on the machine the agent runs on.

```
npm i -g aicut-cli
aicut login
```

`aicut login` opens the browser and the person approves. `aicut account` shows the balance.

## Any agent that reads SKILL.md folders

```
npx skills add aicut-pro/skills
```

The installer asks which agents to install for. To install by hand, copy the folders in `skills/` into the folder your agent reads skills from (for Claude Code: `~/.claude/skills/`, or `.claude/skills/` in a project).

## Claude Code plugin marketplace

```
/plugin install aicut --marketplace aicut-pro/skills
```

On an older Claude Code, add the marketplace first: `/plugin marketplace add aicut-pro/skills`, then `/plugin install aicut@aicut-skills`.

## Cursor

The repository carries a `.cursor-plugin/plugin.json`. Install it from the Cursor plugin directory (search for aicut) or add this repository as a local plugin. This is a separate plugin from `aicut-pro/cursor-plugin`, which only connects Cursor to the hosted MCP server.

## Codex

The repository carries a `.codex-plugin/plugin.json`; the skills folder works with `npx skills add` as above.

## Check it works

Ask the agent: "make me a cheap test image with aicut". It should run `aicut account`, find a model, run the generate command with `--estimate`, tell you the price and wait for your go before it spends anything.
