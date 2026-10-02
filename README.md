# kodexArg MCP

Configuración para instalar el servidor MCP de [kodexArg](https://kodexarg.com) a través del portal.

[`mcp.json`](./mcp.json) no lleva credenciales. El login lo pide el portal.

## Instalación

Copiá [`mcp.json`](./mcp.json) en la configuración MCP del cliente (por ejemplo `~/.cursor/mcp.json`). Claude Desktop acepta el mismo bloque: solo lee `command` y `args`.

```json
{
  "mcpServers": {
    "kodexarg": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.kodexarg.com/mcp"]
    }
  }
}
```

En un entorno Bun el mismo puente es `bunx mcp-remote@latest` en lugar de `npx -y mcp-remote@latest`. El archivo commiteado deja `npx`.

El Workers AI Playground, el conector custom de claude.ai y el developer mode de ChatGPT piden la URL del portal en su propia pantalla: `https://mcp.kodexarg.com/mcp`. Este archivo no es esa pantalla.

## Login

La primera vez el portal abre el login de Google, el mismo proveedor que kodexarg.com. El access token dura 15 minutos. El grant, que es la sesión autorizada, dura 14 días. Mientras el grant sigue vivo, el cliente renueva el token y no vuelve a pedir la contraseña.

Después del login, el server de origen puede mostrar **Connect**. Ese paso es el consentimiento del upstream. Lo resuelve el mismo SSO y no pide la contraseña de Google otra vez.

## Tools

El cliente llama a `kodexarg_ask_kodexarg`. El argumento es `{ "message": string }`, solo lectura.

Ese nombre lo arma el portal: el id del server `kodexarg` más la tool que el Worker conserva, `ask_kodexarg`. Un cliente instruido a llamar `ask_kodexarg` contra la URL del portal no encuentra la tool.

El portal además inyecta estas tres. El Worker no puede apagarlas:

- `portal_list_servers`
- `portal_toggle_servers`
- `portal_toggle_single_server`

## Límites

5 preguntas cada 10 segundos y 60 requests por minuto, por IP. Al pasarse, el Worker responde 429.

## License

[MIT](./LICENSE)
