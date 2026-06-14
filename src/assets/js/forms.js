/**
 * FORMS.JS - O Biscoito de Polvilho®
 * Validação e envio de formulários
 */

document.addEventListener('DOMContentLoaded', function() {
  initFormOrcamento();
  initFormContato();
  initPhoneMask();
});

// ========== FORMULÁRIO DE ORÇAMENTO ==========
function initFormOrcamento() {
  const form = document.getElementById('formOrcamento');
  
  if (!form) {
    console.log('ℹ️ Formulário de orçamento não encontrado nesta página');
    return;
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit(form, 'orcamento');
  });
  
  console.log('✅ Formulário de orçamento inicializado');
}

// ========== FORMULÁRIO DE CONTATO ==========
function initFormContato() {
  const form = document.getElementById('formContato');
  
  if (!form) {
    console.log('ℹ️ Formulário de contato não encontrado nesta página');
    return;
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit(form, 'contato');
  });
  
  console.log('✅ Formulário de contato inicializado');
}

// ========== HANDLER DE ENVIO ==========
function handleFormSubmit(form, tipo) {
  // Validar campos
  if (!validateForm(form)) {
    return;
  }
  
  // Coletar dados
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Desabilitar botão de envio
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  
  // Simular envio (substituir por integração real)
  setTimeout(() => {
    // OPÇÃO 1: Enviar via WhatsApp
    sendViaWhatsApp(data, tipo);
    
    // OPÇÃO 2: Enviar via E-mail (Formspree, EmailJS, etc.)
    // sendViaEmail(data, tipo);
    
    // Resetar formulário
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    // Mostrar mensagem de sucesso
    showFormMessage(form, 'success', 'Pedido enviado com sucesso! Entraremos em contato em breve.');
    
    console.log(`✅ Formulário ${tipo} enviado:`, data);
  }, 1500);
}

// ========== VALIDAÇÃO ==========
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    // Remove mensagens de erro anteriores
    removeFieldError(field);
    
    // Valida campo vazio
    if (!field.value.trim()) {
      showFieldError(field, 'Este campo é obrigatório');
      isValid = false;
      return;
    }
    
    // Valida e-mail
    if (field.type === 'email' && !isValidEmail(field.value)) {
      showFieldError(field, 'E-mail inválido');
      isValid = false;
      return;
    }
    
    // Valida telefone
    if (field.type === 'tel' && !isValidPhone(field.value)) {
      showFieldError(field, 'Telefone inválido');
      isValid = false;
      return;
    }
  });
  
  return isValid;
}

// ========== VALIDAÇÕES ESPECÍFICAS ==========
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  // Aceita 10 ou 11 dígitos (com ou sem DDD)
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// ========== MENSAGENS DE ERRO ==========
function showFieldError(field, message) {
  field.classList.add('error');
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  
  field.parentElement.appendChild(errorDiv);
}

function removeFieldError(field) {
  field.classList.remove('error');
  
  const errorDiv = field.parentElement.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// ========== MENSAGEM DE SUCESSO/ERRO ==========
function showFormMessage(form, type, message) {
  const messageDiv = form.querySelector('.form-message') || document.createElement('div');
  messageDiv.className = `form-message form-message--${type}`;
  messageDiv.textContent = message;
  
  if (!form.querySelector('.form-message')) {
    form.appendChild(messageDiv);
  }
  
  // Remove mensagem após 5 segundos
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    setTimeout(() => messageDiv.remove(), 300);
  }, 5000);
}

// ========== ENVIO VIA WHATSAPP ==========
function sendViaWhatsApp(data, tipo) {
  const phone = '5531995551022';
  let message = '';
  
  if (tipo === 'orcamento') {
    message = `
🍪 *NOVO PEDIDO - O Biscoito de Polvilho®*

*Nome:* ${data.nome}
*E-mail:* ${data.email}
*WhatsApp:* ${data.telefone}
*Cidade:* ${data.cidade} - ${data.estado}
*Quantidade:* ${data.quantidade || 'Não informada'}

*Mensagem:*
${data.mensagem || 'Sem mensagem adicional'}
    `.trim();
  } else {
    message = `
🍪 *NOVO CONTATO - O Biscoito de Polvilho®*

*Nome:* ${data.nome}
*E-mail:* ${data.email}
*Telefone:* ${data.telefone || 'Não informado'}

*Assunto:* ${data.assunto || 'Não informado'}

*Mensagem:*
${data.mensagem}
    `.trim();
  }
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Abre WhatsApp em nova aba
  window.open(whatsappURL, '_blank');
}

// ========== ENVIO VIA E-MAIL (FORMSPREE) ==========
function sendViaEmail(data, tipo) {
  // Substitua YOUR_FORM_ID pelo seu ID do Formspree
  const formspreeURL = 'https://formspree.io/f/YOUR_FORM_ID';
  
  fetch(formspreeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ E-mail enviado com sucesso');
    } else {
      console.error('❌ Erro ao enviar e-mail');
    }
  })
  .catch(error => {
    console.error('❌ Erro:', error);
  });
}

// ========== MÁSCARA DE TELEFONE ==========
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length <= 11) {
        // Formato: (00) 00000-0000 ou (00) 0000-0000
        if (value.length <= 2) {
          value = value.replace(/^(\d{0,2})/, '($1');
        } else if (value.length <= 6) {
          value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
        } else if (value.length <= 10) {
          value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
          value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
      }
      
      e.target.value = value;
    });
  });
  
  if (phoneInputs.length > 0) {
    console.log(`✅ Máscara de telefone aplicada em ${phoneInputs.length} campo(s)`);
  }
}

// ========== LIMPAR FORMULÁRIO ==========
function clearForm(form) {
  form.reset();
  
  // Remove mensagens de erro
  const errors = form.querySelectorAll('.field-error');
  errors.forEach(error => error.remove());
  
  // Remove classes de erro
  const errorFields = form.querySelectorAll('.error');
  errorFields.forEach(field => field.classList.remove('error'));
}

// ========== EXPORTAR FUNÇÕES ==========
window.FormUtils = {
  validateForm,
  clearForm,
  isValidEmail,
  isValidPhone,
  showFormMessage
};