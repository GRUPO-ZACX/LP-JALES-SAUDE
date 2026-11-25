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
- `script.js`: menu mobile, navegação por teclado, troca dos retratos e mensagem de WhatsApp.
- `config.js`: destinos oficiais de WhatsApp e avaliações.
- `assets/`: fotografias WebP, SVGs originais e fontes WOFF2 locais.
- `vercel.json`: cabeçalhos HTTP para a Vercel.

## Configurar os canais de contato

O WhatsApp está configurado com o número fornecido pelo cliente: **(61) 3879-7990**. O canal de avaliações continua vazio. Edite somente `config.js`:

```js
window.JALES_CONFIG = Object.freeze({
  whatsapp: "556138797990", // país + DDD + número, somente dígitos
  reviewsUrl: "", // URL completa do canal oficial de avaliações
});
```

Quando o WhatsApp estiver definido, o formulário pede somente o nome e abre uma mensagem personalizada para o usuário confirmar o envio no WhatsApp. Não há banco de dados, armazenamento local de dados pessoais ou serviço de envio de e-mails.

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

- Botão flutuante de WhatsApp no canto inferior direito, com balão branco “Converse com nossa equipe”. Usa o número de `config.js` e inclui o nome quando preenchido no formulário.

- Os três cards ficam lado a lado no desktop; no mobile há rolagem horizontal com parte do próximo card aparente.
- Menu mobile com Escape, estados `aria-expanded` e navegação por teclado.
- Perguntas frequentes usam `details` e `summary` nativos, inclusive sem JavaScript.
- O carrossel aceita toque, trackpad, foco por teclado e setas esquerda/direita.
- O formulário pede somente o nome. O botão “Falar no WhatsApp” abre a conversa com o escritório; a pessoa confirma o envio no próprio WhatsApp. Nenhuma mensagem é enviada automaticamente.
- Os retratos alternam nos mesmos enquadramentos a cada 6 segundos, com transição suave e suspensão fora da tela. A troca automática é desativada quando há preferência por movimento reduzido.
- A página respeita a preferência por movimento reduzido.
- Botões têm preenchimento lateral e rotação discreta da seta no hover/foco. A linha do tempo das etapas cresce uma única vez ao entrar em tela, horizontalmente no desktop e verticalmente no mobile.
- Tag do Google Ads `AW-11486541459` instalada uma única vez no início do `<head>`. Fontes e demais recursos da interface continuam locais.

## Tag do Google Ads

O `index.html` carrega `gtag.js` e inicializa a conta `AW-11486541459` com `allow_ad_personalization_signals: false`.

O contêiner Google Tag Manager `GTM-WX56N6F5` também é carregado uma única vez no `<head>`, compartilhando o mesmo `dataLayer` e a função `gtag`. O evento de inicialização `gtm.js` é enfileirado antes de carregar o contêiner. A tag do Google Ads e os eventos de WhatsApp existentes foram preservados.

Em `script.js:3`, substitua `ROTULO_AQUI` na constante `GADS_CONVERSION` pelo rótulo real da conversão do Google Ads. Cada abertura de WhatsApp registra `conversion` e `generate_lead`: `formulario` no envio do formulário e `rodape` no link flutuante “Converse com nossa equipe”. Outros links de WhatsApp são capturados por delegação e aceitam uma origem específica em `data-whatsapp-origem`.

Os contatos abrem em nova aba. Visitas com `utm_source=google` ou `gclid` gravam `origem_trafego=google` em `sessionStorage`. Nessa sessão, as mensagens recebem o prefixo “Olá! Vim pelo Google.”, preservando o texto original e o nome informado. Sem origem Google, a mensagem original é mantida. Bloqueios de armazenamento ou falhas da tag não interrompem o contato.

A política de segurança em `vercel.json` permite os domínios necessários ao Google Ads, incluindo DoubleClick em `script-src` e `script-src-elem`, o domínio brasileiro e os domínios de medição adicionais solicitados. As permissões anteriores foram preservadas. O script de inicialização inline está autorizado pelo seu hash SHA-256; se esse bloco for editado, atualize também o hash em `script-src` e `script-src-elem`. Referência: [Google Ads com Content Security Policy](https://developers.google.com/tag-platform/security/guides/csp#google_ads).

Depois de publicar os arquivos atualizados, use **Testar instalação** na conta do Google para confirmar a detecção no domínio de produção.

## Créditos e licenças

Marca e retratos fornecidos pelo cliente no Figma. Fotografia de adaptação de prótese: Kampus Production / Pexels, imagem 6111599, sob a licença Pexels. Ícones: Lucide, licença incluída em `assets/LICENSE-Lucide.txt`. Ícone do WhatsApp: Simple Icons, licença CC0 incluída em `assets/LICENSE-Simple-Icons.txt`. Montserrat e Cinzel: SIL Open Font License, arquivos de licença em `assets/fonts/`.

Não foram publicados dados fictícios de contato, endereço ou registro profissional. Antes da publicação definitiva, configure os canais oficiais e confira os dados institucionais que o escritório desejar divulgar.

## Validação realizada

Conferência visual com os layouts aprovados de 1440 px e 390 px. Testes de navegação, menu mobile, carrossel, perguntas frequentes e formulário em Chromium nas larguras 320, 375, 390, 768, 1024, 1440 e 1920 px. Compatibilidade de menu, rolagem horizontal e FAQ também verificada em WebKit nas larguras 390 e 1440 px.

Na validação visual original, não houve imagens ausentes ou erros de JavaScript. Após a instalação da tag, o Google Ads passa a fazer requisições externas de medição. O canal de avaliações permanece sem destino. O redirecionamento com mensagem personalizada foi verificado com interceptação local, sem enviar mensagens externas.

Na última revisão, os indicadores e o alinhamento das etapas foram conferidos em Chromium e WebKit nas larguras 320, 390 e 1440 px. A troca dos retratos e o movimento reduzido também foram verificados.

O formulário de nome e WhatsApp foi conferido em Chromium e WebKit, no desktop e no mobile: validação do nome, codificação de acentos no link e ausência de envio quando o número do escritório não está configurado.
