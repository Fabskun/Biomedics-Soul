function cargarModal() {
    fetch('formulario.html')
        .then(response => response.text())
        .then(html => {
            const contenedor = document.getElementById('contenedor-modal');

            contenedor.innerHTML = html;

            Object.assign(contenedor.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '9999',
            });

            document.body.style.overflow = 'hidden';

            // ✅ Activar datepicker aquí
            $(function () {
                $(".datepicker").datepicker({
                    dateFormat: "dd-mm-yy"
                });
            });

            window.cerrarModal = () => {
                contenedor.innerHTML = '';
                Object.assign(contenedor.style, { display: 'none' });
                document.body.style.overflow = '';
            };
        });
}