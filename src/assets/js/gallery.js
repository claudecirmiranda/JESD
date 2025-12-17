/**
 * GALLERY.JS - O Biscoito de Polvilho®
 * Galeria com filtros e lightbox modal
 */

document.addEventListener('DOMContentLoaded', function() {
  initGalleryFilters();
  initGalleryLightbox();
});

let currentImageIndex = 0;
let galleryImages = [];

// ========== FILTROS DA GALERIA ==========
function initGalleryFilters() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  
  if (filters.length === 0 || items.length === 0) {
    console.log('ℹ️ Galeria não encontrada nesta página');
    return;
  }
  
  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      const category = this.getAttribute('data-filter');
      
      // Remove active de todos os filtros
      filters.forEach(f => f.classList.remove('active'));
      
      // Adiciona active no filtro clicado
      this.classList.add('active');
      
      // Filtra os itens
      filterGalleryItems(category, items);
    });
  });
  
  console.log('✅ Filtros da galeria inicializados');
}

function filterGalleryItems(category, items) {
  items.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'all' || category === itemCategory) {
      item.classList.remove('hidden');
      // Anima entrada
      item.style.animation = 'fadeIn 0.5s ease';
    } else {
      item.classList.add('hidden');
    }
  });
}

// ========== LIGHTBOX MODAL ==========
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalClose');
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  
  if (!modal || items.length === 0) {
    console.log('ℹ️ Lightbox não encontrado nesta página');
    return;
  }
  
  // Cria array com todas as imagens
  galleryImages = Array.from(items).map(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    return {
      src: img.src,
      alt: img.alt,
      title: overlay ? overlay.querySelector('h3').textContent : '',
      description: overlay ? overlay.querySelector('p').textContent : ''
    };
  });
  
  // Abre modal ao clicar na imagem
  items.forEach((item, index) => {
    item.addEventListener('click', function() {
      // Verifica se o item não está escondido
      if (!item.classList.contains('hidden')) {
        currentImageIndex = index;
        openModal(modal, modalImage, modalCaption);
      }
    });
  });
  
  // Fecha modal
  closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
  
  // Navegação
  prevBtn.addEventListener('click', () => navigateGallery(-1, modal, modalImage, modalCaption));
  nextBtn.addEventListener('click', () => navigateGallery(1, modal, modalImage, modalCaption));
  
  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal(modal);
    if (e.key === 'ArrowLeft') navigateGallery(-1, modal, modalImage, modalCaption);
    if (e.key === 'ArrowRight') navigateGallery(1, modal, modalImage, modalCaption);
  });
  
  console.log('✅ Lightbox inicializado com', galleryImages.length, 'imagens');
}

function openModal(modal, modalImage, modalCaption) {
  const image = galleryImages[currentImageIndex];
  
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalCaption.textContent = `${image.title} - ${image.description}`;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  console.log('🖼️ Modal aberto:', image.title);
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  console.log('❌ Modal fechado');
}

function navigateGallery(direction, modal, modalImage, modalCaption) {
  currentImageIndex += direction;
  
  // Loop circular
  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  } else if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }
  
  const image = galleryImages[currentImageIndex];
  
  // Fade effect
  modalImage.style.opacity = '0';
  
  setTimeout(() => {
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCaption.textContent = `${image.title} - ${image.description}`;
    modalImage.style.opacity = '1';
  }, 200);
}

// Exportar funções
window.GalleryUtils = {
  openModal,
  closeModal,
  navigateGallery
};