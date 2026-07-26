// URL de tu Web App de Google Apps Script desplegada
const URL_WEB_APP = "https://script.google.com/macros/s/AKfycby9uM_qTASPTOChOnJxIiJICmSRxj92EqRVc7wBcKDr6hVpeaFijnZDC2_q_c-5L8D7/exec";

document.getElementById('formTurno').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const msgBox = document.getElementById('mensaje-resultado');
    
    btn.disabled = true;
    btn.textContent = "Procesando...";
    msgBox.style.display = 'none';
    
    const datos = {
        especialista: document.getElementById('especialista').value,
        fecha: document.getElementById('fecha').value,
        paciente: document.getElementById('paciente').value,
        correo: document.getElementById('correo').value
    };

    // Petición HTTP POST hacia tu Google Apps Script
    fetch(URL_WEB_APP, {
        method: 'POST',
        mode: 'no-cors', // Evita bloqueos de CORS con Google Apps Script
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(() => {
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = '#d1fae5';
        msgBox.style.color = '#065f46';
        msgBox.textContent = "¡Turno registrado con éxito! Se ha enviado la confirmación a su correo.";
        document.getElementById('formTurno').reset();
        
        btn.disabled = false;
        btn.textContent = "Confirmar Turno";
    })
    .catch((err) => {
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = '#fee2e2';
        msgBox.style.color = '#991b1b';
        msgBox.textContent = "Ocurrió un error de conexión: " + err.message;
        
        btn.disabled = false;
        btn.textContent = "Confirmar Turno";
    });
});
