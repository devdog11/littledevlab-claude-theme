# littledevlab — a Claude theme

A drafting-paper look for Claude, modeled on [littledevlab.com](https://littledevlab.com)'s blueprint style.

- **Light:** warm drafting paper (`#eeece4`), ink text (`#2e3438`), teal accent (`#426b78`), logo-orange highlight (`#e8742a`).
- **Dark:** "blueprint at night" — ink band surfaces with paper text and a faint cyan grid.
- **Backdrop:** an engineering grid, 24pt minor and 120pt major lines.
- **Messages:** your prompts sit in bordered cards with hard offset shadows; headings and tool calls use monospace.
- **Your Actions callout:** a reply that opens with `**Your Actions**` gets that block drawn as an orange-outlined box.

Colors and backdrop draw in the Claude desktop and mobile apps; message styles in the desktop app. The terminal and VS Code show the Your Actions box only.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install littledevlab --marketplace devdog11/littledevlab-claude-theme
```

Answer `y` to add the marketplace, then pick a scope (user is first).

From a shell:

```bash
claude plugin install littledevlab --marketplace devdog11/littledevlab-claude-theme
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `devdog11/littledevlab-claude-theme`, then **Add plugin**.

## Files

- `hooks/register.ts` — the theme, backdrop and Your Actions callout
- `hooks/make-colors.js` — palette builder from Claude's plugin-authoring kit
- `versions/`, `CHANGELOG.md` — version history

## License

MIT
