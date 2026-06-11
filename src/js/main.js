/* ================================================
   JAVASCRIPT - GERENCIAMENTO DE CARRINHO E WHATSAPP
   ================================================ */

// Estado global do carrinho
const cartState = {
    items: [],
    total: 0
};

// Número WhatsApp (Configure com seu número)
const WHATSAPP_NUMBER = '5585987654321'; // Formato: país + DDD + número (sem formatação)

/* ================================================
   FUNÇÕES DE CARRINHO
   ================================================ */

/**
 * Adiciona item ao carrinho
 * @param {string} productName - Nome do produto
 * @param {number} price - Preço do produto
 * @param {number} quantity - Quantidade (padrão 1)
 */
function addToCart(productName, price, quantity = 1) {
    // Verifica se produto já existe no carrinho
    const existingItem = cartState.items.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartState.items.push({
            name: productName,
            price: price,
            quantity: quantity,
            id: Date.now()
        });
    }

    // Recalcula total
    updateCartTotal();

    // Atualiza UI
    updateCartUI();

    // Mostra notificação
    showToast(`✓ ${productName} adicionado!`);

    // Abre carrinho (opcional)
    // openCart();
}

/**
 * Remove item do carrinho
 * @param {number} itemId - ID do item
 */
function removeFromCart(itemId) {
    cartState.items = cartState.items.filter(item => item.id !== itemId);
    updateCartTotal();
    updateCartUI();
    showToast('Item removido');
}

/**
 * Calcula total do carrinho
 */
function updateCartTotal() {
    cartState.total = cartState.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
}

/**
 * Atualiza interface do carrinho
 */
function updateCartUI() {
    const cartCount = cartState.items.length;
    const cartCountElements = document.querySelectorAll('#cartCount, #headerBadge');

    cartCountElements.forEach(el => {
        el.textContent = cartCount;
        if (cartCount > 0) {
            el.parentElement.style.display = 'flex';
        }
    });

    // Atualiza valores
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(cartState.total);
    if (totalEl) totalEl.textContent = formatCurrency(cartState.total);

    // Renderiza items
    renderCartItems();
}

/**
 * Renderiza lista de items no carrinho
 */
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (cartState.items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Nenhum item adicionado ainda</p>
                <small>Clique em "Adicionar" nos produtos!</small>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cartState.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.quantity}x ${formatCurrency(item.price)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remover">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

/* ================================================
   GERENCIAMENTO DE INTERFACE
   ================================================ */

/**
 * Abre/fecha painel do carrinho
 */
function toggleCart() {
    const cartPanel = document.getElementById('cartPanel');
    cartPanel.classList.toggle('active');
}

/**
 * Abre carrinho
 */
function openCart() {
    const cartPanel = document.getElementById('cartPanel');
    if (!cartPanel.classList.contains('active')) {
        cartPanel.classList.add('active');
    }
}

/**
 * Fecha carrinho
 */
function closeCart() {
    const cartPanel = document.getElementById('cartPanel');
    if (cartPanel.classList.contains('active')) {
        cartPanel.classList.remove('active');
    }
}

/**
 * Mostra notificação Toast
 * @param {string} message - Mensagem a exibir
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.add('show');

    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ================================================
   INTEGRAÇÃO WHATSAPP
   ================================================ */

/**
 * Gera mensagem formatada para WhatsApp
 * @returns {string} Mensagem pronta para envio
 */
function generateWhatsAppMessage() {
    if (cartState.items.length === 0) {
        showToast('⚠️ Adicione produtos primeiro!');
        return null;
    }

    let message = `*Olá! 👋 Gostaria de fazer um pedido:*\n\n`;

    // Lista todos os items
    cartState.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `🛍️ *${item.name}*\n`;
        message += `   Preço: ${formatCurrency(item.price)}\n`;
        message += `   Quantidade: ${item.quantity}\n`;
        message += `   Subtotal: ${formatCurrency(itemTotal)}\n\n`;
    });

    // Total
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL: ${formatCurrency(cartState.total)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Poderia confirmar disponibilidade e entrega? 💕`;

    return message;
}

/**
 * Envia pedido para WhatsApp
 */
function sendToWhatsApp() {
    const message = generateWhatsAppMessage();

    if (!message) {
        return;
    }

    // Codifica mensagem para URL
    const encodedMessage = encodeURIComponent(message);

    // Cria link WhatsApp
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Abre WhatsApp em nova aba
    window.open(whatsappLink, '_blank');

    // Feedback ao usuário
    showToast('✓ Abrindo WhatsApp...');

    // Limpa carrinho após 2 segundos (opcional)
    setTimeout(() => {
        // cartState.items = [];
        // updateCartUI();
        // closeCart();
    }, 2000);
}

/* ================================================
   UTILITÁRIOS
   ================================================ */

/**
 * Formata número para moeda brasileira
 * @param {number} value - Valor a formatar
 * @returns {string} Valor formatado (ex: R$ 129,99)
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/* ================================================
   MENU MOBILE
   ================================================ */

const mobileBtn = document.querySelector('.btn-mobile');
const navLinks = document.getElementById('nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Fecha menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });
}

/* ================================================
   CARRINHO FLUTUANTE - EVENT LISTENERS
   ================================================ */

const cartButton = document.getElementById('cartButton');
if (cartButton) {
    cartButton.addEventListener('click', toggleCart);
}

// Fecha carrinho ao clicar fora
document.addEventListener('click', (e) => {
    const cartWidget = document.getElementById('cartWidget');
    const cartPanel = document.getElementById('cartPanel');

    if (cartWidget && !cartWidget.contains(e.target) && cartPanel.classList.contains('active')) {
        closeCart();
    }
});

/* ================================================
   INICIALIZAÇÃO
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa UI do carrinho
    updateCartUI();

    // Scroll reveal animations
    observeElements();

    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
});

/* ================================================
   INTERSECTION OBSERVER - SCROLL REVEAL
   ================================================ */

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `slideInUp 0.6s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observa cards
    document.querySelectorAll('.trending-card, .product-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* ================================================
   STORAGE - PERSISTÊNCIA (Opcional)
   ================================================ */

/**
 * Salva carrinho no localStorage
 */
function saveCart() {
    localStorage.setItem('lmfitwear_cart', JSON.stringify(cartState));
}

/**
 * Carrega carrinho do localStorage
 */
function loadCart() {
    const saved = localStorage.getItem('lmfitwear_cart');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            cartState.items = parsed.items || [];
            cartState.total = parsed.total || 0;
            updateCartUI();
        } catch (e) {
            console.error('Erro ao carregar carrinho:', e);
        }
    }
}

// Carrega carrinho ao iniciar
window.addEventListener('load', loadCart);

// Salva carrinho antes de sair da página
window.addEventListener('beforeunload', saveCart);

/* ================================================
   DEBUG - Remover em produção
   ================================================ */
console.log('%c🛍️ LM Fitwear - Catálogo Premium', 'font-size: 18px; font-weight: bold; color: #7B5BA8;');
console.log('Carrinho iniciado com sucesso ✓');
console.log('WhatsApp configurado para:', WHATSAPP_NUMBER);
