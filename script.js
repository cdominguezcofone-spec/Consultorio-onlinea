document.getElementById('formTurno').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const msgBox = document.getElementById('mensaje-resultado');
    
    btn.disabled = true;
    btn.textContent = "Procesando...";
    
    const datos = {
        especialista: document.getElementById('especialista').value,
        fecha: document.getElementById('fecha').value,
        paciente: document.getElementById('paciente').value,
        correo: document.getElementById('correo').value
    };

    // Envía los datos a tu backend en Google Apps Script
    google.script.run
        .withSuccessHandler(function(res) {
            msgBox.style.display = 'block';
            if (res.exito) {
                msgBox.style.backgroundColor = '#d1fae5';
                msgBox.style.color = '#065f46';
                msgBox.textContent = res.mensaje;
                document.getElementById('formTurno').reset();
            } else {
                msgBox.style.backgroundColor = '#fee2e2';
                msgBox.style.color = '#991b1b';
                msgBox.textContent = res.mensaje;
            }
            btn.disabled = false;
            btn.textContent = "Confirmar Turno";
        })
        .withFailureHandler(function(err) {
            msgBox.style.display = 'block';
            msgBox.style.backgroundColor = '#fee2e2';
            msgBox.style.color = '#991b1b';
            msgBox.textContent = "Ocurrió un error de conexión: " + err.message;
            btn.disabled = false;
            btn.textContent = "Confirmar Turno";
        })
        .agendarTurnoWeb(datos);
});
