# kodexArg MCP

Configuración del servidor MCP público de [kodexArg](https://kodexarg.com).

- **URL:** `https://kodexarg.com/mcp` (Streamable HTTP, sin autenticación)
- **Tool:** `ask_kodexarg` — `{ "message": string }`, solo lectura. Responde lo mismo que la KodexBar de kodexarg.com para invitados.
- **Límites:** 5 preguntas cada 10 s y 60 requests por minuto, por IP. Al pasarse responde `429`.

## Uso

Copiá [`mcp.json`](./mcp.json) en la configuración MCP de tu cliente (por ejemplo `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "kodexarg": {
      "url": "https://kodexarg.com/mcp"
    }
  }
}
```

Claude Code:

```sh
claude mcp add --transport http kodexarg https://kodexarg.com/mcp
```

## License

[MIT](./LICENSE)
