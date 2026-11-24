// littledevlab v0.1.0 — drafting-paper look modeled on littledevlab.com's "engr" theme.
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
}
