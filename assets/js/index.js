const inputValue = document.getElementById("input-de-valor");
const resultadoEl = document.getElementById("resultado");
const currencyEl = document.getElementById("currency-type");
const btnEl = document.getElementById("buscar-btn");
const chartEl = document.getElementById("myChart");
const chartDiv = document.getElementById("chart-div");

const obtenerDatosMoneda = async (moneda) => {
  try {
    const valores = await fetch(`https://mindicador.cl/api/${moneda.value}`);
    if (!valores.ok) {
      throw new Error(`HTTP error! status: ${valores.status}`);
    }
    const resultados = await valores.json();
    return resultados;
  } catch (error) {
    alert(error.message || "Ocurrio un error");
  }
};

btnEl.addEventListener("click", () => {
  obtenerDatosMoneda(currencyEl).then((res) => {
    let cambioActual = res.serie[0].valor;
    resultadoEl.innerHTML = "Resultado: " + (inputValue.value * cambioActual).toLocaleString(
      "es-CL",
    );
    inputValue.value = "";
  });
  renderGraph();
});

async function getGraphData(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda.value}`);
  const dias = await res.json();
  const trimLabels = dias.serie.slice(-10);
  const labels = trimLabels.map((fecha) => {
    return fecha.fecha.slice(-30, 10);
  });
  const trimValues = dias.serie.slice(-10);
  const data = trimValues.map((valor) => {
    return valor.valor;
  });

  const datasets = [
    {
      label: "Valor - Ultimos dias",
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGraph() {
  const data = await getGraphData(currencyEl);
  const config = {
    type: "line",
    data,
  };
  chartEl.style.backgroundColor = "white";
  new Chart(chartEl, config);
}