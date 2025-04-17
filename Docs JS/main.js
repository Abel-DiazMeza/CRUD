  const contenedorDias = document.getElementById("dias");

  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth(); // 0 = enero

  // Día de la semana en que comienza el mes (0 = domingo)
  const primerDia = new Date(anio, mes, 1).getDay();

  // Cuántos días tiene el mes
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  // Limpiar por si se recarga
  contenedorDias.innerHTML = "";

  // Agregar celdas vacías antes del primer día
  for (let i = 0; i < primerDia; i++) {
    const celdaVacia = document.createElement("div");
    celdaVacia.classList.add("dia");
    contenedorDias.appendChild(celdaVacia);
  }

  // Agregar los días del mes
  for (let dia = 1; dia <= totalDias; dia++) {
    const celda = document.createElement("div");
    celda.classList.add("dia");
    celda.innerHTML = `<div class="numero-dia">${dia}</div>`;
    contenedorDias.appendChild(celda);}