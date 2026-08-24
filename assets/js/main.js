/**
 * REGLA DE ORO: Este archivo coordina toda la aplicación y maneja las interacciones del usuario.
 */
import { fetchProducts } from './api.js';
import { createProductCard } from './components.js';

// Diccionario para la traducción automática
const i18n = {
    en: {
        pageTitle: "Everything For Your Home - Store",
        catalogTitle: "Featured Products",
        loading: "Loading products...",
        error: "Failed to load products. Please try again later."
    },
    es: {
        pageTitle: "Everything For Your Home - Tienda",
        catalogTitle: "Productos Destacados",
        loading: "Cargando productos...",
        error: "No se pudieron cargar los productos. Inténtelo más tarde."
    }
};

let currentLang = 'en'; // Idioma por defecto (Mercado USA)
let productsData = [];  // Aquí guardaremos el inventario para no tener que descargarlo 2 veces al cambiar de idioma

// Este evento asegura que el código solo se ejecute cuando el HTML esté completamente listo
document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('products-grid');
    const langToggleBtn = document.getElementById('lang-toggle');

    // Escuchador de clics para el botón de cambio de idioma
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        updateUIText();
        // Volvemos a dibujar las tarjetas con el nuevo idioma
        renderProducts(productsData, gridContainer);
    });

    try {
        // 1. Pedimos los datos al mensajero (API)
        productsData = await fetchProducts();
        
        // 2. Si no hay error, borramos el texto de "Cargando..."
        gridContainer.innerHTML = '';
        
        // 3. Dibujamos los productos en pantalla
        renderProducts(productsData, gridContainer);
    } catch (error) {
        // Si hay un error de red o en GitHub, mostramos un mensaje amigable
        gridContainer.innerHTML = `<div class="loading-state"><p data-i18n="error">${i18n[currentLang].error}</p></div>`;
    }
});

// Función auxiliar para pegar las tarjetas en el HTML
function renderProducts(products, container) {
    container.innerHTML = ''; 
    products.forEach(product => {
        // Llama al Constructor para hacer la tarjeta y la añade al "Grid"
        const card = createProductCard(product, currentLang);
        container.appendChild(card);
    });
}

// Función auxiliar para actualizar los textos sueltos del HTML (Títulos, errores)
function updateUIText() {
    document.title = i18n[currentLang].pageTitle;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            element.textContent = i18n[currentLang][key];
        }
    });
}