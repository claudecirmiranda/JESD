/**
 * MAIN.JS - O Biscoito de Polvilho®
 * JavaScript principal do site
 */

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🍪 O Biscoito de Polvilho® - Site carregado!');
  
  // Inicializar funções
  initScrollHeader();
  initSmoothScroll();
  initActiveNavLinks();
  
  // Log de analytics (se necessário)
  logPageView();
});

// ========== SCROLL HEADER ==========
/**
 * Adiciona sombra no header ao fazer scroll
 */
function initScrollHeader() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ========== SMOOTH SCROLL ==========
/**
 * Scroll suave para links internos
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignora links vazios (#)
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Fecha menu mobile se estiver aberto
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// ========== ACTIVE NAV LINKS ==========
/**
 * Marca link ativo baseado na seção visível
 */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href && href.includes(current)) {
        link.classList.add('active');
      }
    });
  });
}

// ========== UTILITÁRIOS ==========

/**
 * Log de visualização de página (Google Analytics)
 */
function logPageView() {
  // Quando o Google Analytics estiver configurado, descomentar:
  /*
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: window.location.pathname
    });
  }
  */
}

/**
 * Formatar número de telefone
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Validar email
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Copiar texto para clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log('Texto copiado com sucesso!');
      // Você pode adicionar um toast/notification aqui
    },
    (err) => {
      console.error('Erro ao copiar texto:', err);
    }
  );
}

/**
 * Detectar dispositivo móvel
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Debounce function (útil para eventos de scroll/resize)
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== SCROLL TO TOP ==========
/**
 * Botão de voltar ao topo (opcional)
 */
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
  `;
  
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 500) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.visibility = 'visible';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.visibility = 'hidden';
    }
  }, 100));
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Descomente se quiser o botão de voltar ao topo
// initScrollToTop();

// ========== LAZY LOADING DE IMAGENS ==========
/**
 * Lazy loading nativo ou fallback com Intersection Observer
 */
function initLazyLoading() {
  // Verifica se o navegador suporta lazy loading nativo
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback para navegadores mais antigos
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    const images = document.querySelectorAll('img.lazy');
    images.forEach(img => imageObserver.observe(img));
  }
}

// Inicializar lazy loading
initLazyLoading();

// ========== EXPORTAR FUNÇÕES (se necessário) ==========
window.BiscoitoUtils = {
  formatPhone,
  isValidEmail,
  copyToClipboard,
  isMobile,
  debounce
};