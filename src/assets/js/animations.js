/**
 * ANIMATIONS.JS - O Biscoito de Polvilho®
 * Configuração de animações (AOS - Animate On Scroll)
 */

document.addEventListener('DOMContentLoaded', function() {
  initAOS();
  initCounterAnimations();
});

// ========== AOS (ANIMATE ON SCROLL) ==========
/**
 * Inicializa biblioteca AOS
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,           // Duração da animação em ms
      easing: 'ease-in-out',   // Tipo de easing
      once: true,              // Anima apenas uma vez
      mirror: false,           // Não anima ao fazer scroll para cima
      offset: 100,             // Offset (px) do ponto de trigger
      delay: 0,                // Delay entre cada elemento
      anchorPlacement: 'top-bottom' // Define quando a animação inicia
    });
    
    console.log('✨ AOS inicializado');
  } else {
    console.warn('⚠️ AOS não está carregado');
  }
}

// ========== ANIMAÇÃO DE CONTADORES ==========
/**
 * Anima números (útil para estatísticas)
 * Exemplo: <span class="counter" data-target="1000">0</span>
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length === 0) return;
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

/**
 * Anima um contador específico
 */
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = parseInt(element.getAttribute('data-duration')) || 2000;
  const increment = target / (duration / 16); // 60fps
  
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = target.toLocaleString('pt-BR');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('pt-BR');
    }
  }, 16);
}

// ========== ANIMAÇÃO DE SCROLL REVEAL ==========
/**
 * Alternativa ao AOS (caso não queira usar biblioteca externa)
 */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  
  if (elements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  elements.forEach(el => observer.observe(el));
}

// ========== ANIMAÇÃO DE FADE IN ==========
/**
 * Fade in simples para elementos
 */
function fadeIn(element, duration = 400) {
  element.style.opacity = 0;
  element.style.display = 'block';
  
  let opacity = 0;
  const timer = setInterval(() => {
    if (opacity >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = opacity;
    opacity += 0.1;
  }, duration / 10);
}

/**
 * Fade out simples para elementos
 */
function fadeOut(element, duration = 400) {
  let opacity = 1;
  const timer = setInterval(() => {
    if (opacity <= 0) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = opacity;
    opacity -= 0.1;
  }, duration / 10);
}

// ========== PARALLAX SIMPLES ==========
/**
 * Efeito parallax em elementos
 * Adicione class="parallax" e data-speed="0.5" no HTML
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length === 0) return;
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-speed') || 0.5;
      const yPos = -(window.scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ========== TYPING EFFECT ==========
/**
 * Efeito de digitação para textos
 * Exemplo: <span class="typing" data-text="Texto aqui"></span>
 */
function initTypingEffect() {
  const typingElements = document.querySelectorAll('.typing');
  
  typingElements.forEach(element => {
    const text = element.getAttribute('data-text');
    const speed = parseInt(element.getAttribute('data-speed')) || 100;
    
    let i = 0;
    element.textContent = '';
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        typeWriter();
        observer.disconnect();
      }
    });
    
    observer.observe(element);
    
    function typeWriter() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
  });
}

// ========== HOVER 3D EFFECT (CARDS) ==========
/**
 * Efeito 3D ao passar mouse sobre cards
 * Adicione class="card-3d" nos cards
 */
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  });
  
  function handleMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }
  
  function handleLeave(e) {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

// ========== EXPORTAR FUNÇÕES ==========
window.BiscoitoAnimations = {
  fadeIn,
  fadeOut,
  animateCounter,
  initParallax,
  initTypingEffect,
  init3DCards
};

document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.historia-video__tag');
  const audioBtn = document.querySelector('.historia-video__audio');

  if (!video) return;

  let lastTime = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Retoma do ponto salvo
          if (lastTime > 0 && video.currentTime !== lastTime) {
            video.currentTime = lastTime;
          }
          video.play().catch(() => {});
        } else {
          // Salva o tempo e pausa
          lastTime = video.currentTime;
          video.pause();
        }
      });
    },
    {
      threshold: 0.4 // 40% visível já é suficiente
    }
  );

  audioBtn.addEventListener('click', () => {
    video.muted = !video.muted;

    audioBtn.textContent = video.muted ? '🔇' : '🔊';
    audioBtn.setAttribute(
      'aria-label',
      video.muted ? 'Ativar som' : 'Desativar som'
    );
  });

  observer.observe(video);
});



// Descomente as que quiser ativar:
// initParallax();
// initTypingEffect();
// init3DCards();