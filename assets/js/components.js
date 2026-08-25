// Función para generar un recibo dinámico en una ventana nueva
export async function generarRecibo(producto) {
    try {
        // 1. Buscamos los datos de la tienda que tu familiar configuró en el CMS
        const configResponse = await fetch('content/settings/factura.json');
        const tienda = await configResponse.json();

        // 2. Creamos una ventana emergente
        const ventanaRecibo = window.open('', '_blank');
        
        // 3. Escribimos el HTML del recibo combinando los datos dinámicos
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
                
                <!-- Script automático para abrir el diálogo de impresión/guardar PDF -->
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        ventanaRecibo.document.close();

        // 4. Redirigimos al enlace de pago (Mercado Pago o Stripe)
        setTimeout(() => {
            window.location.href = producto.payment_link;
        }, 1500);

    } catch (error) {
        console.error("No se pudo cargar la configuración de la factura", error);
        // Si falla, simplemente enviamos al usuario al pago
        window.location.href = producto.payment_link;
    }
}
