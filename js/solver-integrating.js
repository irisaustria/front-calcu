window.solveIntegrating = async function () {
  const M = document.getElementById("int-M").value.trim();
  const N = document.getElementById("int-N").value.trim();

  const response = await fetch("https://back-calcu-but6.onrender.com/solve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      method: "int",
      M,
      N
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo resolver por factor integrante.");
  }

  return data;
};
