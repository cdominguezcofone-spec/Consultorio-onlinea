document.addEventListener("DOMContentLoaded", function () {
  // Reemplaza esto con tu URL de implementación actual de Google Apps Script si llega a cambiar
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzM0ZNsUz6MOrEjMibmSeLWcdfaiOz2TTzU4hLROYwZGbrEP4X-ynOy4P1PpnrIefbf/exec";

  const formTurno = document.getElementById("form-turno"); // Asegúrate de que el ID de tu formulario en el HTML coincida

  if (formTurno) {
    formTurno.addEventListener("submit", function (e) {
      e.preventDefault();

      // Capturamos los valores del formulario
      const especialista = document.getElementById("especialista").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value; // Hora seleccionada por el paciente (ej: 08:00 a 12:00)
      const paciente = document.getElementById("paciente").value;
      const correo = document.getElementById("correo").value;

      // Validación rápida de hora en el cliente antes de enviar
      const horaPartes = parseInt(hora.split(":")[0]);
      if (horaPartes < 8 || horaPartes >= 12) {
        alert("Por favor, seleccione un horario válido entre las 08:00 y las 12:00 hs.");
        return;
      }

      const datosTurno = {
        especialista: especialista,
        fecha: fecha,
        hora: hora,
        paciente: paciente,
        correo: correo
      };

      // Mostrar mensaje de carga (opcional)
      alert("Procesando turno, por favor espere...");

      // Envío de datos mediante fetch (POST) a Google Apps Script
      fetch(URL_APPS_SCRIPT, {
        method: "POST",
        mode: "no-cors", // Necesario para evitar problemas de CORS con Apps Script
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosTurno)
      })
      .then(response => {
        // Nota: Con 'no-cors' la respuesta opaca no deja leer el JSON directamente de inmediato, 
        // pero el servidor procesa y guarda el turno correctamente en la hoja y envía los correos.
        alert("¡Petición enviada con éxito! Revisa tu correo electrónico para ver la confirmación.");
        formTurno.reset();
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al intentar registrar el turno. Inténtalo nuevamente.");
      });
    });
  }
});
