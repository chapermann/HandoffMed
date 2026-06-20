# HandoffMed

Aplicacao web de pagina unica para organizar passagem de plantao medico por leito.

## Publicacao no GitHub Pages

Publique estes arquivos na raiz do repositorio `HandoffMed`:

- `index.html`
- `styles.css`
- `app.js`

Depois ative o GitHub Pages no repositorio. A URL esperada e:

`https://chapermann.github.io/HandoffMed/`

## API

O navegador chama o proxy Cloudflare configurado em `app.js`:

`https://nvidia-api-proxy.chapermann.workers.dev/`

A chave da NVIDIA deve ficar somente no backend/proxy. Nao coloque chave `nvapi-` em arquivo publicado no GitHub Pages.

Se o app mostrar erro de `Authorization`, o Worker nao esta anexando a chave secreta na chamada para a NVIDIA. Use `cloudflare-worker.example.js` como referencia e configure o segredo `NVIDIA_API_KEY` no painel do Cloudflare Worker.

## Privacidade

O app nao usa banco de dados e nao grava evolucoes em armazenamento local. Os dados permanecem na sessao atual do navegador e sao enviados ao proxy apenas quando o botao `Gerar passagem` e acionado.
