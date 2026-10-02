import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dir, '..')
const portalUrl = 'https://mcp.kodexarg.com/mcp'
const apexInstall = 'https://kodexarg.com' + '/mcp'
const forbiddenKey = 'ur' + 'l'
const secretMark = 'CF' + '_'
const schemeMark = 'Bear' + 'er'
const email = new RegExp('[A-Za-z0-9._%+' + '-]+@' + '[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')

function textFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) out.push(...textFiles(path))
    else out.push(path)
  }
  return out
}

function hasKey(value: unknown, key: string): boolean {
  if (Array.isArray(value)) return value.some((item) => hasKey(item, key))
  if (value !== null && typeof value === 'object') {
    for (const [childKey, child] of Object.entries(value)) {
      if (childKey === key || hasKey(child, key)) return true
    }
  }
  return false
}

const tracked = textFiles(root).map((path) => ({
  path,
  text: readFileSync(path, 'utf8'),
}))

describe('mcp.json', () => {
  const raw = readFileSync(join(root, 'mcp.json'), 'utf8')
  const parsed = JSON.parse(raw) as {
    mcpServers: Record<string, { command?: string; args?: string[] }>
  }

  test('parses and points npx mcp-remote at the portal', () => {
    expect(Object.keys(parsed.mcpServers)).toEqual(['kodexarg'])
    const server = parsed.mcpServers.kodexarg
    expect(server.command).toBe('npx')
    expect(server.args).toEqual(['-y', 'mcp-remote@latest', portalUrl])
    const endpoint = new URL(server.args![2])
    expect(endpoint.protocol).toBe('https:')
    expect(endpoint.hostname).toBe('mcp.kodexarg.com')
    expect(endpoint.pathname).toBe('/mcp')
    expect(endpoint.search).toBe('')
    expect(endpoint.hash).toBe('')
  })

  test('does not declare a direct endpoint key', () => {
    expect(hasKey(parsed, forbiddenKey)).toBe(false)
    expect(raw.includes(`"${forbiddenKey}"`)).toBe(false)
  })
})

describe('published files', () => {
  test('do not carry the apex install address, secrets, or a mail', () => {
    for (const file of tracked) {
      expect(file.text.includes(apexInstall)).toBe(false)
      expect(file.text.includes(secretMark)).toBe(false)
      expect(file.text.includes(schemeMark)).toBe(false)
      expect(file.text.match(email)).toBeNull()
    }
  })

  test('do not commit the direct endpoint key', () => {
    for (const file of tracked) {
      expect(file.text.includes(`"${forbiddenKey}"`)).toBe(false)
    }
  })
})

describe('README', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8')

  test('documents the portal bridge, the grant, and Connect', () => {
    expect(readme).toContain(portalUrl)
    expect(readme).toContain('bunx mcp-remote@latest')
    expect(readme).toContain('npx -y mcp-remote@latest')
    expect(readme).toContain('15 minutos')
    expect(readme).toContain('14 días')
    expect(readme).toContain('**Connect**')
    expect(readme).toContain('no lleva credenciales')
    expect(readme).toContain('no pide la contraseña de Google otra vez')
  })

  test('names the prefixed tool, the Worker tool, and the portal tools', () => {
    expect(readme).toContain('kodexarg_ask_kodexarg')
    expect(readme).toContain('ask_kodexarg')
    expect(readme).toContain('portal_list_servers')
    expect(readme).toContain('portal_toggle_servers')
    expect(readme).toContain('portal_toggle_single_server')
    expect(readme).toContain('no encuentra la tool')
  })
})
