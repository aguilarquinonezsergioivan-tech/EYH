/**
 * REGLA DE ORO: Este archivo solo crea elementos visuales, no hace peticiones a internet.
 */

export function createProductCard(product, lang = 'en') {
    // 1. Creamos el contenedor principal de la tarjeta
    const card = document.createElement('article');
    card.className = 'product-card';

    // 2. Formateamos el precio para que siempre se vea como moneda de Estados Unidos (ej. $49.99)
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price);

    // 3. Limpiamos la ruta de la imagen (por si el CMS añade un slash extra al inicio)
    const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
    
    // 4. Lógica simple para el texto del botón de Stripe
    const buyText = lang === 'es' ? 'Comprar Ahora' : 'Buy Now';

    // 5. Inyectamos la información en el HTML. 
    // Usamos las clases CSS que definiste en styles.css (Módulo 2)
    card.innerHTML = `
        <img src="${imagePath}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-details">
            <h2 class="product-title">${product.title}</h2>
            <div class="product-price">${formattedPrice}</div>
            <p class="product-description">${product.description}</p>
            <!-- El enlace de Stripe se convierte en un botón de acción real -->
            <a href="${product.stripe_link}" target="_blank" rel="noopener noreferrer" class="btn-buy">${buyText}</a>
        </div>
    `;

    return card;
}