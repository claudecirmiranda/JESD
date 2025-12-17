/**
 * MENU.JS - O Biscoito de Polvilho®
 * Controle do menu responsivo (hamburger)
 */

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initMenuOutsideClick();
  initMenuEscapeKey();
  initMenuResize();
});

// ========== MENU MOBILE ==========
/**
 * Abre e fecha o menu mobile
 */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!navToggle || !navMenu) {
    console.warn('⚠️ Elementos do menu não encontrados');
    return;
  }
  
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita propagação do evento
    toggleMenu();
  });
  
  // Fecha menu ao clicar em um link
  const navLinks = navMenu.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  console.log('✅ Menu mobile inicializado');
}

/**
 * Toggle do menu (abre/fecha)
 */
function toggleMenu() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const body = document.body;
  
  if (!navToggle || !navMenu) return;
  
  const isActive = navMenu.classList.contains('active');
  
  if (isActive) {
    // Fechar menu
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    body.style.overflow = '';
    console.log('📱 Menu fechado');
  } else {
    // Abrir menu
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    body.style.overflow = 'hidden'; // Previne scroll quando menu está aberto
    console.log('📱 Menu aberto');
  }
}

/**
 * Fecha menu ao clicar fora dele
 */
function initMenuOutsideClick() {
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  
  if (!navMenu || !navToggle) return;
  
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);
    const isMenuActive = navMenu.classList.contains('active');
    
    // Se clicou fora do menu E fora do botão E o menu está aberto
    if (!isClickInsideMenu && !isClickOnToggle && isMenuActive) {
      toggleMenu();
    }
  });
  
  console.log('✅ Click fora do menu inicializado');
}

/**
 * Fecha menu ao pressionar ESC
 */
function initMenuEscapeKey() {
  document.addEventListener('keydown', function(event) {
    const navMenu = document.getElementById('navMenu');
    
    if (!navMenu) return;
    
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu();
      console.log('⌨️ Menu fechado com ESC');
    }
  });
  
  console.log('✅ Tecla ESC inicializada');
}

/**
 * Fecha menu ao redimensionar para desktop
 */
function initMenuResize() {
  let resizeTimer;
  
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(function() {
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.getElementById('navToggle');
      const body = document.body;
      
      if (!navMenu || !navToggle) return;
      
      // Se a tela for maior que 768px e o menu estiver aberto
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = '';
        console.log('💻 Menu fechado (resize para desktop)');
      }
    }, 250); // Debounce de 250ms
  });
  
  console.log('✅ Resize listener inicializado');
}

/**
 * Fecha o menu (função pública para uso externo)
 */
function closeMenu() {
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const body = document.body;
  
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    body.style.overflow = '';
  }
}

/**
 * Abre o menu (função pública para uso externo)
 */
function openMenu() {
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const body = document.body;
  
  if (navMenu && !navMenu.classList.contains('active')) {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    body.style.overflow = 'hidden';
  }
}

// Exportar funções para uso global (se necessário)
window.MenuUtils = {
  toggleMenu,
  closeMenu,
  openMenu
};