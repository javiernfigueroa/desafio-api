let myChart;

document.addEventListener("DOMContentLoaded", function () {
  const historial = {
    labels: [
      "Día 1",
      "Día 2",
      "Día 3",
      "Día 4",
      "Día 5",
      "Día 6",
      "Día 7",
      "Día 8",
      "Día 9",
      "Día 10",
    ],
    datasets: [
      {
        label: "Valor de la Moneda",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
      },
    ],
  };

  const ctx = document.getElementById("chart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: historial,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  fillCurrencyOptions();
});

async function fillCurrencyOptions() {
  const select = document.getElementById("moneda");

  try {
    const response = await fetch("https://mindicador.cl/api");
    const data = await response.json();

    Object.keys(data).forEach((key) => {
      if (data[key].codigo && data[key].nombre) {
        const option = document.createElement("option");
        option.value = data[key].codigo;
        option.textContent = data[key].nombre;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
  }
}

document
  .getElementById("convertir")
  .addEventListener("click", async function () {
    const cantidadInput = document.getElementById("cantidad");
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const moneda = document.getElementById("moneda").value;

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Ingrese una cantidad válida en Pesos Chilenos.");
      return;
    }

    try {
      const response = await fetch(`https://mindicador.cl/api`);
      const data = await response.json();
      const valorMoneda = data[moneda].valor;

      if (!isNaN(valorMoneda)) {
        const resultadoConversion = cantidad / valorMoneda;
        const nombreMoneda = data[moneda].nombre;
        const resultadoElement = document.getElementById("resultado");
        resultadoElement.textContent = `Resultado de la conversión: $${cantidad} Pesos Chilenos son $${resultadoConversion.toFixed(
          2
        )} ${nombreMoneda}`;
        cantidadInput.value = "";
        updateChart();
      } else {
        console.error("Valor de la moneda no es válido.");
      }
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  });

async function updateChart() {
  const moneda = document.getElementById("moneda").value;

  try {
    const response = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await response.json();

    const fechas = [];
    const valores = [];

    const historial = data.serie.slice(0, 10);

    historial.forEach((registro) => {
      fechas.push(registro.fecha);
      valores.push(registro.valor);
    });

    myChart.data.labels = fechas;
    myChart.data.datasets[0].data = valores;
    myChart.update();
  } catch (error) {
    console.error("Error al obtener datos históricos de la moneda:", error);
  }
}
