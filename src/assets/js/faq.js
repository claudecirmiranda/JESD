/**
 * FAQ.JS - O Biscoito de Polvilho®
 * Funcionalidade de accordion para Perguntas Frequentes
 */

document.addEventListener('DOMContentLoaded', function() {
  initFAQ();
});

/**
 * Inicializa funcionalidade FAQ (accordion)
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) {
    console.log('ℹ️ Nenhum item FAQ encontrado nesta página');
    return;
  }
  
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    if (!question || !answer || !toggle) {
      console.warn(`⚠️ Elementos faltando no FAQ item ${index}`);
      return;
    }
    
    // Define altura inicial (fechado)
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
    
    // Adiciona evento de clique
    question.addEventListener('click', function() {
      toggleFAQItem(item, answer, toggle);
    });
  });
  
  console.log(`✅ ${faqItems.length} itens FAQ inicializados`);
}

/**
 * Abre/fecha um item do FAQ
 */
function toggleFAQItem(item, answer, toggle) {
  const isOpen = item.classList.contains('active');
  
  // Fecha todos os outros itens (opcional - comente se quiser múltiplos abertos)
  closeAllFAQItems();
  
  if (isOpen) {
    // Fecha o item
    closeFAQItem(item, answer, toggle);
  } else {
    // Abre o item
    openFAQItem(item, answer, toggle);
  }
}

/**
 * Abre um item do FAQ
 */
function openFAQItem(item, answer, toggle) {
  item.classList.add('active');
  answer.style.maxHeight = answer.scrollHeight + 'px';
  answer.style.paddingTop = 'var(--space-md)';
  toggle.textContent = '−'; // Sinal de menos
  toggle.style.transform = 'rotate(0deg)';
}

/**
 * Fecha um item do FAQ
 */
function closeFAQItem(item, answer, toggle) {
  item.classList.remove('active');
  answer.style.maxHeight = '0';
  answer.style.paddingTop = '0';
  toggle.textContent = '+'; // Sinal de mais
  toggle.style.transform = 'rotate(0deg)';
}

/**
 * Fecha todos os itens FAQ
 */
function closeAllFAQItems() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    if (answer && toggle) {
      closeFAQItem(item, answer, toggle);
    }
  });
}

/**
 * Abre todos os itens FAQ (para debug ou "expandir tudo")
 */
function openAllFAQItems() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    if (answer && toggle) {
      openFAQItem(item, answer, toggle);
    }
  });
}

// Exportar funções para uso global
window.FAQUtils = {
  closeAllFAQItems,
  openAllFAQItems
};