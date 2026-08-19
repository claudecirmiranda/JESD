(function () {
  // IMPORTANTE: aponte para onde a API do localizador (projeto cep-estabelecimentos)
  // está hospedada. Deixe vazio ('') se este site e a API estiverem no MESMO domínio
  // (ex: reverse proxy no Nginx apontando /api para o backend Node).
  // Caso contrário, use a URL completa, ex: 'https://localizador.obiscoito.com.br'
  const API_BASE_URL = '';

  const form = document.getElementById('formBusca');
  const inputCep = document.getElementById('cep');
  const mensagemErro = document.getElementById('mensagemErro');
  const resultadosSecao = document.getElementById('resultadosSecao');
  const listaResultados = document.getElementById('listaResultados');
  const cepRef = document.getElementById('resultadosCepRef');
  const estadoVazio = document.getElementById('estadoVazio');
  const carregando = document.getElementById('carregando');

  if (!form) return;

  // Máscara simples de CEP: 00000-000
  inputCep.addEventListener('input', () => {
    let digitos = inputCep.value.replace(/\D/g, '').slice(0, 8);
    if (digitos.length > 5) {
      digitos = `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
    }
    inputCep.value = digitos;
  });

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    esconderErro();

    const cep = inputCep.value.trim();
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
      mostrarErro('Digite um CEP válido, no formato 00000-000.');
      return;
    }

    await buscarUnidades(cep);
  });

  async function buscarUnidades(cep) {
    mostrarCarregando(true);
    resultadosSecao.hidden = true;
    estadoVazio.hidden = true;

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/estabelecimentos?cep=${encodeURIComponent(cep)}`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível concluir a busca.');
      }

      renderizarResultados(dados);
    } catch (erro) {
      mostrarErro(erro.message || 'Erro ao buscar unidades. Tente novamente.');
    } finally {
      mostrarCarregando(false);
    }
  }

  function renderizarResultados(dados) {
    listaResultados.innerHTML = '';

    if (!dados.resultados || dados.resultados.length === 0) {
      estadoVazio.hidden = false;
      return;
    }

    cepRef.textContent = dados.consulta.cep;

    dados.resultados.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card localizador-card';
      card.setAttribute('data-aos', 'fade-up');

      const logoSrc = item.logo || 'assets/images/logo/logo.svg';

      card.innerHTML = `
        <img class="localizador-card__logo" src="${escaparHtml(logoSrc)}" alt="${escaparHtml(item.apelido)}">
        <div class="localizador-card__info">
          <h3 class="localizador-card__nome">${escaparHtml(item.apelido)}</h3>
          <p class="localizador-card__endereco">${escaparHtml(item.endereco)}</p>
          <p class="localizador-card__trajeto">🚗 ${formatarNumero(item.distancia_km)} km · ${item.tempo_minutos} min</p>
          <a class="localizador-card__cta" href="${escaparAtributo(item.maps_url)}" target="_blank" rel="noopener">
            Como chegar
          </a>
        </div>
      `;

      listaResultados.appendChild(card);
    });

    resultadosSecao.hidden = false;
  }

  function formatarNumero(valor) {
    return Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  }

  function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? '';
    return div.innerHTML;
  }

  function escaparAtributo(url) {
    return encodeURI(url || '#');
  }

  function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.hidden = false;
  }

  function esconderErro() {
    mensagemErro.hidden = true;
  }

  function mostrarCarregando(ativo) {
    carregando.hidden = !ativo;
  }
})();
