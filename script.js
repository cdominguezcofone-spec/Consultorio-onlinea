document.addEventListener("DOMContentLoaded", function () {
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbygfsYY7RHN8VGQ2qoXtR7avgm2wRgGIx5cj26rb7FwXmvxpHaLaf1CBxFabdJTagrm/exec";
  const formTurno = document.getElementById("form-turno");
  const selectEspecialista = document.getElementById("especialista");
  const inputFecha = document.getElementById("fecha");
  const selectHora = document.getElementById("hora");

  // Función para consultar turnos ocupados y bloquearlos visualmente
  function verificarHorariosOcupados() {
    const especialista = selectEspecialista.value;
    const fecha = inputFecha.value;

    if (!especialista || !fecha) return;

    // Consultar al Apps Script los horarios ya reservados
    fetch(`${URL_APPS_SCRIPT}?action=obtenerOcupados&especialista=${encodeURIComponent(especialista)}&fecha=${fecha}`)
      .then(response => response.json())
      .then(data => {
        const horasOcupadas = data.ocupados || [];

        // Recorrer las opciones del selector de hora
        for (let i = 0; i < selectHora.options.length; i++) {
          const option = selectHora.options[i];
          if (option.value === "") continue; // Saltar la opción por defecto

          // Guardar la hora base limpia si no está guardada en un atributo personalizado
          if (!option.dataset.horaOriginal) {
            option.dataset.horaOriginal = option.value;
          }

          const horaBase = option.dataset.horaOriginal;

          if (horasOcupadas.includes(horaBase)) {
            option.disabled = true;
            option.style.backgroundColor = "#e0e0e0";
            option.style.color = "#888888";
            option.textContent = horaBase + " hs (No disponible)";
          } else {
            option.disabled = false;
            option.style.backgroundColor = "";
            option.style.color = "";
            option.textContent = horaBase + " hs";
          }
        }
      })
      .catch(error => console.error("Error al verificar disponibilidad:", error));
  }

  // Eventos para actualizar la disponibilidad en tiempo real
  if (selectEspecialista && inputFecha) {
    selectEspecialista.addEventListener("change", verificarHorariosOcupados);
    inputFecha.addEventListener("change", verificarHorariosOcupados);
  }

  // Envío del formulario
  if (formTurno) {
    formTurno.addEventListener("submit", function (e) {
      e.preventDefault();

      const botonSubmit = formTurno.querySelector("button[type='submit']");
      if (botonSubmit) {
        botonSubmit.disabled = true;
        botonSubmit.textContent = "Verificando disponibilidad...";
      }

      const datosTurno = {
        especialista: selectEspecialista.value,
        fecha: inputFecha.value,
        hora: selectHora.value,
        paciente: document.getElementById("paciente").value,
        correo: document.getElementById("correo").value,
        obraSocial: document.getElementById("obraSocial").value
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
          verificarHorariosOcupados(); // Refrescar horarios bloqueados
        } else {
          alert("Aviso: " + resultado.mensaje);
          verificarHorariosOcupados(); // Refrescar por si cambió algo
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
