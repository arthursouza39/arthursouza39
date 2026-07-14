/* =========================================================
   Producto Premium — scripts de la landing
   - Cuenta atrás de la oferta (barra superior + caja de oferta)
   - Año dinámico en el footer
   ========================================================= */

(function () {
  "use strict";

  // Duración de la oferta desde que se abre la página (en minutos).
  // Cambia este valor para ajustar la urgencia. Ej.: 60 = 1 hora.
  var OFFER_MINUTES = 60;

  // Guardamos la hora de fin en sessionStorage para que el contador
  // no se reinicie al navegar dentro de la misma sesión.
  var KEY = "offer_deadline";
  var deadline = Number(sessionStorage.getItem(KEY));
  var now = Date.now();

  if (!deadline || isNaN(deadline) || deadline < now) {
    deadline = now + OFFER_MINUTES * 60 * 1000;
    sessionStorage.setItem(KEY, String(deadline));
  }

  var elTopbar = document.getElementById("topbar-timer");
  var elHours = document.getElementById("cd-hours");
  var elMins = document.getElementById("cd-mins");
  var elSecs = document.getElementById("cd-secs");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var diff = deadline - Date.now();
    if (diff < 0) diff = 0;

    var totalSecs = Math.floor(diff / 1000);
    var hours = Math.floor(totalSecs / 3600);
    var mins = Math.floor((totalSecs % 3600) / 60);
    var secs = totalSecs % 60;

    if (elTopbar) elTopbar.textContent = pad(hours) + ":" + pad(mins) + ":" + pad(secs);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);
    if (elSecs) elSecs.textContent = pad(secs);

    if (diff === 0) {
      clearInterval(timer);
    }
  }

  tick();
  var timer = setInterval(tick, 1000);

  // Año dinámico en el footer
  var elYear = document.getElementById("year");
  if (elYear) elYear.textContent = new Date().getFullYear();
})();
