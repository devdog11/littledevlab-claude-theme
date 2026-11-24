// littledevlab v0.4.0 — drafting-paper look modeled on littledevlab.com's "engr" theme.
import type { Register, ThemeSetArgs, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'

const { theme, problems } = makeColors({
  label: 'littledevlab blueprint',
  roles: { accent: '#426b78', danger: '#b3412f', success: '#4e7d3a', warning: '#e8742a', pro: '#6d5a8f' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eeece4', // engr-paper
        'surface-1': '#f3f1ea',
        'surface-2': '#f7f6f0',
        'text-primary': '#2e3438', // engr-ink
        'text-secondary': '#525b60', // engr-ink-soft
        'text-muted': '#5f686d',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1f2427',
        'surface-1': '#252a2d', // engr-band
        'surface-2': '#292e31',
        'surface-3': '#2c3235',
        'text-primary': '#eeece4',
        'text-secondary': '#c9ccc6',
        'text-muted': '#a3abac',
      },
    },
  },
})

// Drafting grid: 24pt minor, 120pt major, teal on paper by day, pale cyan on ink by night.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1200" preserveAspectRatio="xMidYMid slice">
<style>
.paper { fill: #eeece4; }
.minor { stroke: #426b78; stroke-opacity: .16; }
.major { stroke: #426b78; stroke-opacity: .30; }
@media (prefers-color-scheme: dark) {
  .paper { fill: #1f2427; }
  .minor { stroke: #9fc4cf; stroke-opacity: .07; }
  .major { stroke: #9fc4cf; stroke-opacity: .14; }
}
</style>
<defs>
<pattern id="minor" width="24" height="24" patternUnits="userSpaceOnUse">
<path class="minor" d="M24 0H0V24" fill="none" stroke-width="1"/>
</pattern>
<pattern id="major" width="120" height="120" patternUnits="userSpaceOnUse">
<path class="major" d="M120 0H0V120" fill="none" stroke-width="1"/>
</pattern>
</defs>
<rect class="paper" width="1920" height="1200"/>
<rect width="1920" height="1200" fill="url(#minor)"/>
<rect width="1920" height="1200" fill="url(#major)"/>
</svg>`

const hardShadow = { x: 3, y: 3, blur: 0, color: '#2e343826' } as const

// "Your Actions" callout: an outlined box in the logo orange, so Markdown inside keeps
// its bold, code and links in the theme's own text colors (light and dark).
const CALLOUT = { border: '#e8742a', fill: 'surface-1', eyebrow: 'text-accent' } as const
// Ruled paper behind the callout: one rule every LINE pt, matching the theme's Text
// lineHeight, nudged by RULE_OFFSET so the rule sits under each line's baseline.
const LINE = 24
const RULE_OFFSET = 4
const RULED = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="2400">
<style>
.rule { stroke: #426b78; stroke-opacity: .38; }
@media (prefers-color-scheme: dark) { .rule { stroke: #9fc4cf; stroke-opacity: .22; } }
</style>
<defs>
<pattern id="ruled" width="2400" height="${LINE}" y="${RULE_OFFSET}" patternUnits="userSpaceOnUse">
<path class="rule" d="M0 ${LINE - 0.5}H2400" stroke-width="1"/>
</pattern>
</defs>
<rect width="2400" height="2400" fill="url(#ruled)"/>
</svg>`

const ACTIONS = /^\*\*Your Actions:?\*\*:?[ \t]*([^\n]*)\n?((?:[ \t]*[-*] [^\n]*\n?)*)/

const STYLE: ThemeStyle = {
  Text: { fontFamily: ['sans'], fontSize: 15, lineHeight: 24 },
  Heading: { fontFamily: ['mono'], fontWeight: 'semibold', letterSpacing: 0.5 },
  UserMessage: {
    backgroundColor: 'surface-1',
    borderColor: 'border-strong',
    borderWidth: 1,
    radius: 3,
    padding: 12,
    shadow: hardShadow,
  },
  AssistantMessage: { backgroundColor: 'surface-0', radius: 3, paddingX: 10, paddingY: 6 },
  ToolUse: {
    fontFamily: ['mono'],
    backgroundColor: 'surface-2',
    borderColor: 'border-accent',
    borderWidth: 1,
    radius: 3,
    paddingX: 8,
    shadow: hardShadow,
  },
}

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'littledevlab-grid', glass: false } }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) $.ui.toast(unpainted)

    try {
      await $.theme.set({ ...LOOK, style: STYLE })
    } catch (error) {
      $.ui.log(String(error))
      await $.theme.set(LOOK)
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== 'littledevlab-grid') return next(e)
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    const { Svg } = $.ui.resolve(e)
    return Svg({ source: SCENE, alt: 'Drafting paper with a teal engineering grid' })
  })

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    const m = e.props.text.match(ACTIONS)
    if (m === null) return next(e)

    const inline = (m[1] ?? '').trim()
    const list = (m[2] ?? '').replace(/\s+$/, '')
    const rest = e.props.text.slice(m[0].length).replace(/^\s+/, '')
    const els = $.ui.resolve(e)
    const { Box, Text, Markdown } = els

    // Ruled layer: absolute, clipped to the box, drawn first so the words sit on top.
    const ruled =
      'Svg' in els
        ? [
            Box({
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              children: [els.Svg({ source: RULED, alt: '', width: 2400, height: 2400 })],
            }),
          ]
        : []

    const band = Box({
      position: 'relative',
      overflow: 'hidden',
      flexDirection: 'column',
      backgroundColor: CALLOUT.fill,
      borderStyle: 'round',
      borderColor: CALLOUT.border,
      paddingX: 'md',
      paddingY: 0,
      marginBottom: 'sm',
      children: [
        ...ruled,
        Text({ mono: true, size: 'footnote', weight: 'bold', color: CALLOUT.eyebrow, children: 'YOUR ACTIONS' }),
        Markdown({ text: list !== '' ? list : inline !== '' ? inline : 'none.' }),
      ],
    })

    if (rest === '') return band
    return Box({ flexDirection: 'column', children: [band, await next({ ...e, props: { ...e.props, text: rest } })] })
  })
}
