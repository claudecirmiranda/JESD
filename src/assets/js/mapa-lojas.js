(function () {
  const API_BASE_URL = 'https://geo.soaone.com.br';

  const elMapa = document.getElementById('mapa');
  const elContador = document.getElementById('mapaContador');
  const elErro = document.getElementById('mapaErro');

  if (!elMapa || typeof L === 'undefined') return;

  // Pin customizado (SVG inline) nas cores da marca, sem depender de imagem externa.
  const iconeLoja = L.divIcon({
    className: 'mapa-lojas__pin',
    html: `
      <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="#EB6209"/>
        <circle cx="17" cy="17" r="7" fill="#FFFFFF"/>
        <circle cx="17" cy="17" r="4" fill="#70200F"/>
      </svg>
    `,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });

  async function carregarMapa() {
    try {
      const resposta = await fetch(`${API_BASE_URL}/api/estabelecimentos/todas`);
      if (!resposta.ok) throw new Error('Falha ao buscar lojas.');

      const dados = await resposta.json();
      const lojas = dados.estabelecimentos || [];

      if (lojas.length === 0) {
        elErro.hidden = false;
        elContador.textContent = '';
        return;
      }

      elContador.textContent = `${lojas.length} loja${lojas.length !== 1 ? 's' : ''} encontrada${lojas.length !== 1 ? 's' : ''}`;

      const mapa = L.map(elMapa);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapa);

      const marcadores = [];

      lojas.forEach((loja) => {
        if (loja.latitude == null || loja.longitude == null) return;

        const marcador = L.marker([loja.latitude, loja.longitude], { icon: iconeLoja }).addTo(mapa);

        marcador.bindPopup(`
          <div class="mapa-lojas__popup">
            <p class="mapa-lojas__popup-nome">${escaparHtml(loja.apelido)}</p>
            <p class="mapa-lojas__popup-endereco">${escaparHtml(loja.endereco || '')}</p>
            <a class="mapa-lojas__popup-cta" href="${escaparAtributo(loja.maps_url)}" target="_blank" rel="noopener">
              Como chegar
            </a>
          </div>
        `);

        marcadores.push(marcador);
      });

      if (marcadores.length > 0) {
        const grupo = L.featureGroup(marcadores);
        mapa.fitBounds(grupo.getBounds(), { padding: [30, 30] });
      } else {
        // fallback: centraliza em Belo Horizonte se nada tiver coordenadas válidas
        mapa.setView([-19.9167, -43.9345], 11);
      }
    } catch (erro) {
      elErro.hidden = false;
      elContador.textContent = '';
    }
  }

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
  }

  function escaparAtributo(url) {
    return encodeURI(url || '#');
  }

  carregarMapa();
})();
