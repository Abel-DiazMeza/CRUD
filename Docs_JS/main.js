document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("generarQuincenas").addEventListener("click", () => {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
  
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }
  
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }
  
// Verificar si hay tarjetas con datos
const tarjetasConDatos = [];
const tarjetas = document.querySelectorAll(".tarjeta-quincena");

tarjetas.forEach(tarjeta => {
  const contenedorGastos = tarjeta.querySelector(".contenedor-gastos");
  if (contenedorGastos && contenedorGastos.children.length > 0) {
    const id = tarjeta.id || tarjeta.querySelector(".titulo-quincena")?.textContent;
    tarjetasConDatos.push(id);
  }
});

const continuar = tarjetasConDatos.length === 0 || confirm(
  "Se detectaron quincenas con registros:\n\n" +
  tarjetasConDatos.join("\n") +
  "\n\n¿Deseas sobrescribirlas y perder los datos actuales?"
);

if (continuar) {
  document.getElementById("contenedor-quincenas").innerHTML = "";
  generarQuincenas(fechaInicio, fechaFin);
  document.getElementById("formulario-gasto").style.display = "block";
}
  
    // Mostrar el formulario de gasto una vez generadas las quincenas
    document.getElementById("formulario-gasto").style.display = "block";
  });

  // Ocultar el formulario de gasto al inicio
  document.getElementById("formulario-gasto").style.display = "none";

  // Inicializar el formulario y contenedor de gastos
const form = document.getElementById("form-gasto");
const contenedor = document.getElementById("contenedor-quincenas");

// Crear las 24 tarjetas por quincena
const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function generarQuincenas(fechaInicioStr, fechaFinStr) {
  const contenedor = document.getElementById("contenedor-quincenas");

  let [anio, mes, dia] = fechaInicioStr.split('-').map(Number);
  let fechaInicio = new Date(anio, mes - 1, dia);
  const fechaFin = new Date(fechaFinStr);

  // Asegurar que la fecha de inicio sea el día 1 o 16 (inicio de una quincena)
  if (fechaInicio.getDate() > 15) {
    fechaInicio.setDate(16);
  } else {
    fechaInicio.setDate(1);
  }

  // Mientras no sobrepasemos la fecha fin
  while (fechaInicio <= fechaFin) {
    const mes = fechaInicio.getMonth(); // 0-11
    const anio = fechaInicio.getFullYear();
    const quincena = fechaInicio.getDate() <= 15 ? "1ª Quincena" : "2ª Quincena";

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-quincena");
    tarjeta.innerHTML = `
      <div class="titulo-quincena">${meses[mes]} ${anio} - ${quincena}</div>
      <div id="q-${anio}-${mes}-${quincena === '1ª Quincena' ? '1' : '2'}" class="contenedor-gastos"></div>
    `;
    contenedor.appendChild(tarjeta);

    // Avanzar a la siguiente quincena
    if (fechaInicio.getDate() === 1) {
      fechaInicio.setDate(16);
    } else {
      // Siguiente mes, día 1
      fechaInicio.setMonth(fechaInicio.getMonth() + 1);
      fechaInicio.setDate(1);
    }
  }
}


// Calcular el índice de la quincena
function obtenerIdQuincena(fechaStr) {
  const fecha = new Date(fechaStr);
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth(); // 0-11
  const dia = fecha.getDate();
  const quincena = dia <= 15 ? 1 : 2;
  return `q-${anio}-${mes}-${quincena}`;
}


// Evento del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const alias = document.getElementById("alias").value;
  const monto = document.getElementById("monto").value;
  const fechaRegistro = document.getElementById("fechaRegistro").value;
  const fechaPago = document.getElementById("fechaPago").value;
  const categoria = document.getElementById("categoria").value;
  const mesesDiferidos = document.getElementById("mesesDiferidos").value;
  const notas = document.getElementById("notas").value;

  const mesesDif = parseInt(mesesDiferidos) || 1; // mínimo 1 mes
  const fechaBase = new Date(fechaPago);
  
  for (let i = 0; i < mesesDif; i++) {
    const fechaIterada = new Date(fechaBase);
    fechaIterada.setMonth(fechaBase.getMonth() + i);
  
    const idQuincena = obtenerIdQuincena(fechaIterada.toISOString().split("T")[0]);
    const contenedorGastos = document.getElementById(idQuincena);
  
    const item = document.createElement("div");
    item.classList.add("item-gasto");
    item.innerHTML = `
      <strong>${alias}</strong> - $${monto} <br />
      <em>${categoria}</em> | Pago: ${fechaIterada.toISOString().split("T")[0]} <br />
      ${mesesDiferidos ? `${mesesDiferidos} meses` : ""} <br />
      ${notas ? `<small>Notas: ${notas}</small>` : ""}
      <br />
      <button class="btn-visualizar">Visualizar</button>
      <button class="btn-eliminar">Eliminar</button>
    `;
  
    contenedorGastos.appendChild(item);
  
    // Agrega eventos a los botones
    item.querySelector(".btn-visualizar").addEventListener("click", () => {
      mostrarFormularioEdicion({
        alias,
        monto,
        fechaRegistro,
        fechaPago: fechaIterada.toISOString().split("T")[0],
        categoria,
        mesesDiferidos,
        notas,
        itemDOM: item,
        contenedorGastos,
      });
    });
  
    item.querySelector(".btn-eliminar").addEventListener("click", () => {
      if (confirm("¿Estás seguro de eliminar este gasto?")) {
        item.remove();
      }
    });
  }
  
  form.reset();
});

function mostrarFormularioEdicion(gasto) {
  const { alias, monto, fechaRegistro, fechaPago, categoria, mesesDiferidos, notas, itemDOM } = gasto;

  // Crear formulario editable
  const formEdit = document.createElement("form");
  formEdit.classList.add("form-edicion");
  formEdit.innerHTML = `
    <input type="text" value="${alias}" required />
    <input type="number" value="${monto}" required />
    <input type="date" value="${fechaRegistro}" disabled />
    <input type="date" value="${fechaPago}" disabled />
    <select>
      <option value="Fijo" ${categoria === "Fijo" ? "selected" : ""}>Fijo</option>
      <option value="Comida" ${categoria === "Comida" ? "selected" : ""}>Comida</option>
      <option value="Entretenimiento" ${categoria === "Entretenimiento" ? "selected" : ""}>Entretenimiento</option>
    </select>
    <input type="number" value="${mesesDiferidos}" placeholder="Meses diferidos" disabled />
    <textarea placeholder="Notas">${notas}</textarea>
    <button type="submit">Guardar cambios</button>
    <button type="button" class="cancelar">Cancelar</button>
  `;

  function guardarDatosEnLocalStorage() {
  const datos = {
    quincenas: [...document.querySelectorAll('.quincena')].map(quincena => {
      const titulo = quincena.querySelector('.quincena-titulo').textContent;
      const gastos = [...quincena.querySelectorAll('.gasto')].map(gasto => ({
        alias: gasto.querySelector('span:nth-child(1)').textContent,
        monto: gasto.querySelector('span:nth-child(2)').textContent,
        fechaPago: gasto.querySelector('span:nth-child(3)').textContent,
        categoria: gasto.querySelector('span:nth-child(4)').textContent,
        notas: gasto.querySelector('span:nth-child(5)').textContent
      }));
      return { titulo, gastos };
    })
  };
  localStorage.setItem('datosGastos', JSON.stringify(datos));
}


  // Reemplazar el item visual por el formulario
  itemDOM.replaceWith(formEdit);

  // Cancelar edición
  formEdit.querySelector(".cancelar").addEventListener("click", () => {
    formEdit.replaceWith(itemDOM);
  });

  // Guardar cambios
  formEdit.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const nuevosValores = Array.from(formEdit.elements).map(el => el.value);
    const [nuevoAlias, nuevoMonto, nuevaFechaRegistro, nuevaFechaPago, nuevoCategoria, nuevosMeses, nuevasNotas] = nuevosValores;
  
    const nuevoItem = document.createElement("div");
    nuevoItem.classList.add("item-gasto");
    nuevoItem.innerHTML = `
      <strong>${nuevoAlias}</strong> - $${nuevoMonto} <br />
      <em>${nuevoCategoria}</em> | Pago: ${nuevaFechaPago} <br />
      ${nuevosMeses ? `${nuevosMeses} meses` : ""} <br />
      ${nuevasNotas ? `<small>Notas: ${nuevasNotas}</small>` : ""}
      <br />
      <button class="btn-visualizar">Visualizar</button>
      <button class="btn-eliminar">Eliminar</button>
    `;
  
    // Agregar funcionalidad a los nuevos botones
    nuevoItem.querySelector(".btn-visualizar").addEventListener("click", () => {
      mostrarFormularioEdicion({
        alias: nuevoAlias,
        monto: nuevoMonto,
        fechaRegistro: nuevaFechaRegistro,
        fechaPago: nuevaFechaPago,
        categoria: nuevoCategoria,
        mesesDiferidos: nuevosMeses,
        notas: nuevasNotas,
        itemDOM: nuevoItem,
      });
    });
  
    nuevoItem.querySelector(".btn-eliminar").addEventListener("click", () => {
      if (confirm("¿Estás seguro de eliminar este gasto?")) {
        nuevoItem.remove();
      }
    });
  
    // Reemplazar el formulario por el nuevo item actualizado
    formEdit.replaceWith(nuevoItem);
  });
  
}
});

function generarTarjetasPorFecha(fechaInicio, fechaFin) {
  const contenedor = document.getElementById("contenedor-quincenas");
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  // Asegurar que el inicio sea el día 1
  inicio.setDate(1);
  fin.setDate(31);

  while (inicio <= fin) {
    const año = inicio.getFullYear();
    const mes = inicio.getMonth();

    for (let quincena = 1; quincena <= 2; quincena++) {
      const id = `q-${año}-${mes}-${quincena}`;
      const div = document.createElement("div");
      div.classList.add("tarjeta-quincena");
      div.id = id;
      div.innerHTML = `
        <div class="titulo-quincena">${["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][mes]} - ${quincena}ª Quincena</div>
        <div class="contenedor-gastos"></div>
      `;
      contenedor.appendChild(div);
    }

    inicio.setMonth(mes + 1);
  }
}