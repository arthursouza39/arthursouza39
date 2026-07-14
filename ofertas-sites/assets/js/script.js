/* =========================================================
   Ensaladas en Frasco — scripts de la landing
   ========================================================= */

(function () {
  "use strict";

  // Año dinámico en el footer
  var elYear = document.getElementById("year");
  if (elYear) elYear.textContent = new Date().getFullYear();
})();
