/**
 * REGLA DE ORO: Este archivo solo busca datos, no toca el HTML.
 */

// REEMPLAZA ESTO con tu nombre de usuario y el nombre de tu repositorio en GitHub
const REPO_OWNER = 'TU_USUARIO_DE_GITHUB'; 
const REPO_NAME = 'NOMBRE_DE_TU_REPOSITORIO';

export async function fetchProducts() {
    try {
        // PASO 1: Pedimos a GitHub la lista de archivos dentro de la carpeta "productos"
        const dirUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/productos`;
        const dirResponse = await fetch(dirUrl);
        
        if (!dirResponse.ok) {
            throw new Error(`Error de red al leer el directorio: ${dirResponse.status}`);
        }
        
        const files = await dirResponse.json();

        // PASO 2: Filtramos solo los archivos .json y creamos una lista de "promesas" para descargar su contenido
        const productPromises = files
            .filter(file => file.name.endsWith('.json'))
            .map(async file => {
                // file.download_url es el enlace directo al texto puro del archivo
                const fileResponse = await fetch(file.download_url);
                if (!fileResponse.ok) throw new Error(`Falló la carga de ${file.name}`);
                return await fileResponse.json(); // Convertimos el texto a un objeto JavaScript
            });

        // PASO 3: Esperamos a que todos los archivos se descarguen al mismo tiempo y los retornamos
        return await Promise.all(productPromises);
        
    } catch (error) {
        console.error("API Error - No se pudieron cargar los productos:", error);
        throw error; // Lanzamos el error para que main.js lo maneje y muestre un mensaje en pantalla
    }
}