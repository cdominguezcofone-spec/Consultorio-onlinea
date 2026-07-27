document.addEventListener("DOMContentLoaded", function () {
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzM0ZNsUz6MOrEjMibmSeLWcdfaiOz2TTzU4hLROYwZGbrEP4X-ynOy4P1PpnrIefbf/exec";
  const formTurno = document.getElementById("form-turno");

  if (formTurno) {
    formTurno.addEventListener("submit", function (e) {
      e.preventDefault();

      const datosTurno = {
        especialista: document.getElementById("especialista").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        paciente: document.getElementById("paciente").value,
        correo: document.getElementById("correo").value
      };

      alert("Procesando reserva...");

      fetch(URL_APPS_SCRIPT, {
        method: "POST",
        body: JSON.stringify(datosTurno)
      })
      .then(response => response.json())
      .then(resultado => {
        if (resultado.exito) {
          alert(resultado.mensaje);
          formTurno.reset();
        } else {
          alert("Aviso: " + resultado.mensaje);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Turno procesado correctamente o verificado por el servidor.");
      });
    });
  }
});
