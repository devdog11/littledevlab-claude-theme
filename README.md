# littledevlab — a Claude theme

A drafting-paper look for Claude, modeled on [littledevlab.com](https://littledevlab.com)'s blueprint style.

- **Light:** warm drafting paper (`#eeece4`), ink text (`#2e3438`), teal accent (`#426b78`), logo-orange highlight (`#e8742a`).
- **Dark:** "blueprint at night" — ink band surfaces with paper text and a faint cyan grid.
- **Backdrop:** an engineering grid, 24pt minor and 120pt major lines.
- **Messages:** your prompts sit in bordered cards with hard offset shadows; headings and tool calls use monospace.
- **Your Actions callout:** a reply that opens with `**Your Actions**` gets that block drawn as an orange-outlined box.

This is a Claude Code plugin, so it works in Claude Code sessions only, not regular claude.ai or desktop chats. The full look (colors, backdrop, message styles) draws in the desktop app's **Code** tab; colors and backdrop also show when you follow a Code session on mobile. The terminal and VS Code draw no theme and show the Your Actions box only.

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

**Desktop app:** install with one of the commands above from a terminal, using the user scope. The theme then loads in new sessions in the desktop app's **Code** tab; `/plugin` itself doesn't run there.

## Files

- `hooks/register.ts` — the theme, backdrop and Your Actions callout
- `hooks/make-colors.js` — palette builder from Claude's plugin-authoring kit
- `versions/`, `CHANGELOG.md` — version history

## License

MIT
