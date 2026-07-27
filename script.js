document.addEventListener("DOMContentLoaded", function () {
  // URL configurada con la versión que me proporcionaste
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwDVO7dQoDyR71AV-9zWt8veyrAPpryjz9K2sR8nu4Spclf2VfGsOWj6Ci4T_I9IARG/exec";
  const formTurno = document.getElementById("form-turno");

  if (formTurno) {
    formTurno.addEventListener("submit", function (e) {
      e.preventDefault();

      const botonSubmit = formTurno.querySelector("button[type='submit']");
      if (botonSubmit) {
        botonSubmit.disabled = true;
        botonSubmit.textContent = "Verificando disponibilidad...";
      }

      const datosTurno = {
        especialista: document.getElementById("especialista").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value,
        paciente: document.getElementById("paciente").value,
        correo: document.getElementById("correo").value
      };

      fetch(URL_APPS_SCRIPT, {
        method: "POST",
        body: JSON.stringify(datosTurno)
      })
      .then(response => response.json())
      .then(resultado => {
        if (botonSubmit) {
          botonSubmit.disabled = false;
          botonSubmit.textContent = "Confirmar y Reservar Turno";
        }

        if (resultado.exito === true) {
          alert(resultado.mensaje);
          formTurno.reset();
        } else {
          // Aquí se detiene y muestra la alerta exacta si el horario está ocupado o el cupo está lleno
          alert("Aviso: " + resultado.mensaje);
        }
      })
      .catch(error => {
        if (botonSubmit) {
          botonSubmit.disabled = false;
          botonSubmit.textContent = "Confirmar y Reservar Turno";
        }
        console.error("Error:", error);
        alert("Ocurrió un error al comunicarse con el servidor del consultorio.");
      });
    });
  }
});
