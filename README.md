# Jales & Jales — Direito da Saúde

LP estática construída a partir dos layouts desktop e mobile aprovados no Figma. HTML, CSS e JavaScript sem dependências de produção ou etapa de build. As imagens, os ícones e as fontes estão dentro de `assets/`.

## Abrir e editar

Abra `index.html` diretamente no navegador. Para uma prévia por HTTP, com Node.js 18 ou mais recente:

```sh
npm run dev
```

Abra `http://localhost:4173`. Não é necessário executar `npm install`.

Também é possível usar `python3 -m http.server 4173` dentro desta pasta.

## Arquivos principais

- `index.html`: estrutura e conteúdo da página.
- `styles.css`: cores, fontes, layouts responsivos e carrossel.
- `script.js`: menu mobile, navegação por teclado, seletor de assunto, troca dos retratos e contato.
- `config.js`: destinos oficiais de WhatsApp e avaliações.
- `assets/`: fotografias WebP, SVGs originais e fontes WOFF2 locais.
- `vercel.json`: cabeçalhos HTTP para a Vercel.

## Configurar os canais de contato

Os destinos ficaram vazios conforme solicitado. Edite somente `config.js`:

```js
window.JALES_CONFIG = Object.freeze({
  whatsapp: "", // país + DDD + número, somente dígitos
  reviewsUrl: "", // URL completa do canal oficial de avaliações
});
```

Quando o WhatsApp estiver definido, o formulário valida os campos e abre uma mensagem preenchida para o usuário confirmar o envio no WhatsApp. Não há banco de dados, armazenamento local de dados pessoais ou serviço de envio de e-mails.

Sem número configurado, a página informa que o contato está temporariamente indisponível e que os dados não foram enviados. Sem URL de avaliações, o botão informa que o canal estará disponível em breve.

Não adicione senhas, credenciais ou tokens neste arquivo público. Para receber formulários diretamente em um CRM, será necessária uma integração de servidor separada.

## Publicar na Vercel

1. Envie o conteúdo desta pasta para um repositório do GitHub.
2. Na Vercel, importe o repositório e selecione o preset **Other**.
3. Use a pasta que contém `index.html` como **Root Directory**.
4. Deixe **Build Command** vazio e use `.` como **Output Directory**.
5. Publique. Não há dependências para instalar nem variáveis de ambiente obrigatórias.

Essas opções já estão declaradas em `vercel.json`. Referência: [configuração de builds da Vercel](https://vercel.com/docs/builds/configure-a-build#skip-build-step).

Se o repositório contiver a pasta `jales-lp` junto de outros arquivos, selecione `jales-lp` como Root Directory.

## Publicar no GitHub Pages

Coloque estes arquivos na raiz de um repositório. Em **Settings → Pages**, selecione **Deploy from a branch**, a branch desejada e a pasta **/(root)**. Os caminhos dos assets são relativos e funcionam também em um subdiretório do GitHub Pages.

O arquivo `vercel.json` só é aplicado pela Vercel. O GitHub Pages serve os mesmos arquivos estáticos, mas gerencia os seus próprios cabeçalhos HTTP.

## Comportamento e acessibilidade

- Os três cards ficam lado a lado no desktop; no mobile há rolagem horizontal com parte do próximo card aparente.
- Menu mobile com Escape, estados `aria-expanded` e navegação por teclado.
- Perguntas frequentes usam `details` e `summary` nativos, inclusive sem JavaScript.
- O carrossel aceita toque, trackpad, foco por teclado e setas esquerda/direita.
- O formulário usa validação nativa, consentimento obrigatório e mensagens acessíveis.
- O assunto usa uma lista personalizada, com suporte a toque, setas, Enter e Escape, sem abrir o seletor nativo do Safari.
- Os retratos alternam nos mesmos enquadramentos a cada 6 segundos, com transição suave e suspensão fora da tela. A troca automática é desativada quando há preferência por movimento reduzido.
- A página respeita a preferência por movimento reduzido.
- Botões têm preenchimento lateral e rotação discreta da seta no hover/foco. A linha do tempo das etapas cresce uma única vez ao entrar em tela, horizontalmente no desktop e verticalmente no mobile.
- Sem trackers, bibliotecas externas, fontes remotas ou animações pesadas.

## Créditos e licenças

Marca e retratos fornecidos pelo cliente no Figma. Fotografia de adaptação de prótese: Kampus Production / Pexels, imagem 6111599, sob a licença Pexels. Ícones: Lucide, licença incluída em `assets/LICENSE-Lucide.txt`. Montserrat e Cinzel: SIL Open Font License, arquivos de licença em `assets/fonts/`.

Não foram publicados dados fictícios de contato, endereço ou registro profissional. Antes da publicação definitiva, configure os canais oficiais e confira os dados institucionais que o escritório desejar divulgar.

## Validação realizada

Conferência visual com os layouts aprovados de 1440 px e 390 px. Testes de navegação, menu mobile, carrossel, perguntas frequentes, consentimento e formulário em Chromium nas larguras 320, 375, 390, 768, 1024, 1440 e 1920 px. Compatibilidade de menu, rolagem horizontal e FAQ também verificada em WebKit nas larguras 390 e 1440 px.

Não houve imagens ausentes, erros de JavaScript ou requisições externas para renderizar a página. Os canais de contato permanecem sem destino real conforme solicitado; o redirecionamento configurado foi testado com interceptação local, sem enviar mensagens externas.

Na última revisão, o seletor personalizado, os indicadores, o alinhamento das etapas e o formulário foram conferidos em Chromium e WebKit nas larguras 320, 390 e 1440 px. A troca dos retratos e o movimento reduzido também foram verificados.
