/**
 * ARCHIVO COMPLETO: components.js
 * Contiene la lógica del recibo Y la construcción visual de la tarjeta
 */

// 1. FUNCIÓN DE RECIBOS DINÁMICOS
export async function generarRecibo(producto) {
    try {
        // Buscamos los datos de la tienda configurados en el CMS
        const configResponse = await fetch('content/settings/factura.json');
        const tienda = await configResponse.json();

        // Creamos la ventana del recibo
        const ventanaRecibo = window.open('', '_blank');
        
        ventanaRecibo.document.write(`
            <html>
            <head>
                <title>Recibo - ${producto.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    .header { border-bottom: 2px solid #15243b; padding-bottom: 20px; }
                    .total { font-size: 24px; font-weight: bold; color: #c29b57; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${tienda.store_name}</h1>
                    <p>RFC: ${tienda.tax_id}</p>
                </div>
                <h2>Detalle de Compra</h2>
                <p><strong>Producto:</strong> ${producto.title}</p>
                <p class="total"><strong>Total:</strong> $${producto.price}</p>
                <br>
                <p><em>${tienda.footer_msg}</em></p>
                
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        ventanaRecibo.document.close();

        // Redirigimos al pago después de 1.5 segundos
        setTimeout(() => {
            window.location.href = producto.payment_link;
        }, 1500);

    } catch (error) {
        console.error("No se pudo cargar la configuración de la factura", error);
        // Si no hay factura configurada aún, igual lo mandamos a pagar
        window.location.href = producto.payment_link;
    }
}


// 2. FUNCIÓN CONSTRUCTORA DE LA TARJETA (Actualizada al nuevo diseño)
export function createProductCard(product, lang = 'en') {
    const card = document.createElement('article');
    card.className = 'product-card';

    // Formatear precio principal (Cambiado a Pesos Mexicanos según tu diseño)
    const formattedPrice = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(product.price);

    // Formatear precio anterior si existe
    let oldPriceHtml = '';
    if (product.old_price) {
        const formattedOld = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(product.old_price);
        oldPriceHtml = `<span style="text-decoration: line-through; color: #999; font-size: 0.9em; margin-right: 10px;">${formattedOld}</span>`;
    }

    // Ruta de imagen segura
    const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
    
    // Etiqueta flotante (Ej. ¡NUEVO!) si existe
    let badgeHtml = '';
    if (product.badge) {
        badgeHtml = `<div class="badge">${product.badge}</div>`;
    }

    // Inyectamos el HTML de la tarjeta con el diseño premium
    card.innerHTML = `
        ${badgeHtml}
        <button class="fav-btn" onclick="this.style.color='#d32f2f'">🤍</button>
        <img src="${imagePath}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-details">
            <h3 style="font-size: 1rem; font-weight: normal; margin-bottom: 5px;">${product.title}</h3>
            <div class="price-box">
                ${oldPriceHtml}
                <span class="current-price">${formattedPrice}</span>
            </div>
            <button class="btn-comprar">Comprar ahora</button>
        </div>
    `;

    // Conectamos el botón de esta tarjeta con la función del recibo que está arriba
    const btnComprar = card.querySelector('.btn-comprar');
    btnComprar.addEventListener('click', () => generarRecibo(product));

    return card;
}
