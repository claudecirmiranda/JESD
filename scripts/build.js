#!/usr/bin/env node
/**
 * Monta as páginas finais em src/ a partir de templates/pages + templates/partials.
 * Elimina a duplicação manual de cabeçalho, rodapé e botão flutuante do WhatsApp
 * entre as páginas do site. Rode `npm run build` após editar qualquer arquivo
 * em templates/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'templates', 'pages');
const PARTIALS_DIR = path.join(ROOT, 'templates', 'partials');
const OUT_DIR = path.join(ROOT, 'src');

// Item de navegação ativo em cada página (usado pelo header para marcar o link atual)
const NAV_ACTIVE = {
  'index.html': 'home',
  'sobre.html': 'sobre',
  'produto.html': 'produto',
  'portfolio.html': 'portfolio',
  'depoimentos.html': 'depoimentos',
  'contato.html': 'contato',
  'todas-as-lojas.html': 'lojas',
  'ondeencontrar.html': 'lojas',
};

const NAV_KEYS = ['home', 'sobre', 'produto', 'portfolio', 'depoimentos', 'contato', 'lojas'];

function readPartial(name) {
  return fs.readFileSync(path.join(PARTIALS_DIR, name), 'utf8');
}

function renderHeader(activeKey) {
  let html = readPartial('header.html');
  for (const key of NAV_KEYS) {
    const token = `{{ACTIVE:${key}}}`;
    html = html.split(token).join(key === activeKey ? 'active' : '');
  }
  // Remove espaço extra deixado por classes sem o token "active"
  html = html.replace(/class="([^"]*?)\s+"/g, 'class="$1"');
  return html;
}

const FOOTER_HTML = readPartial('footer.html');
const WHATSAPP_FLOAT_HTML = readPartial('whatsapp-float.html');

function build() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.html'));
  for (const file of files) {
    let html = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');

    if (html.includes('<!--@include:header-->')) {
      const activeKey = NAV_ACTIVE[file] || null;
      html = html.split('<!--@include:header-->').join(renderHeader(activeKey));
    }
    html = html.split('<!--@include:footer-->').join(FOOTER_HTML);
    html = html.split('<!--@include:whatsapp-float-->').join(WHATSAPP_FLOAT_HTML);

    fs.writeFileSync(path.join(OUT_DIR, file), html, 'utf8');
    console.log(`build: src/${file}`);
  }
}

build();
