const $ = (id) => document.getElementById(id);

window.AppUI = {
  currentMethod: "sep",

  examples: {
    sep1: { method: "sep", fx: "x", gy: "y" },
    sep2: { method: "sep", fx: "1/(1+x^2)", gy: "1+y^2" },

    exa1: { method: "exa", M: "2*x*y+3", N: "x^2+4*y" },
    exa2: { method: "exa", M: "y*cos(x)+2*x", N: "sin(x)+2*y" },

    int1: { method: "int", M: "y", N: "2*x" },
    int2: { method: "int", M: "x*y", N: "x^2" },

    lin1: { method: "lin", P: "2", Q: "4" },
    lin2: { method: "lin", P: "2/x", Q: "x^3" },

    lap1: { method: "lap", expression: "t^2*exp(3*t)", mode: "forward" },
    lap2: { method: "lap", expression: "exp(-t)*sin(2*t)", mode: "forward" },
    lap3: { method: "lap", expression: "1/(s^2+4)", mode: "inverse" }
  },

  setStatus(text, cls = "warn") {
    const pill = $("statusPill");
    if (!pill) return;
    pill.textContent = text;
    pill.className = `status-pill ${cls}`;
  },

  setMode(text) {
    const pill = $("modePill");
    if (!pill) return;
    pill.textContent = text;
  },

  renderMath() {
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  },

  showPanel(method) {
    this.currentMethod = method;

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.method === method);
    });

    document.querySelectorAll(".method-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    const panel = document.getElementById(`panel-${method}`);
    if (panel) panel.classList.add("active");

    const names = {
      sep: "Separación de Variables",
      exa: "Ecuaciones Exactas",
      int: "Factor Integrante",
      lin: "Ecuación Lineal",
      lap: "Transformada de Laplace"
    };

    this.setMode(names[method] || "Método");
    this.setStatus("Listo", "warn");
  },

  renderResult(data) {
    const stepsHtml = data.steps.map((step, i) => `
      <div class="step-card">
        <h3 class="step-title">Paso ${i + 1}</h3>
        <div>${step}</div>
      </div>
    `).join("");

    $("output-area").innerHTML = `
      <div class="step-card">
        <h3 class="step-title">Entrada</h3>
        <div class="math-block">$$${data.input_latex}$$</div>
      </div>

      ${stepsHtml}

      <div class="step-card final-result">
        <h3 class="step-title">Resultado final</h3>
        <div class="math-block">$$${data.result_latex}$$</div>
      </div>
    `;

    this.renderMath();
  },

  renderError(message) {
    $("output-area").innerHTML = `
      <div class="error-box">
        <strong>Error:</strong>
        <div style="margin-top:8px;">${message}</div>
      </div>
    `;
    this.renderMath();
  },

  clearAll() {
    document.querySelectorAll("input").forEach((el) => el.value = "");

    const lapMode = $("lap-mode");
    if (lapMode) lapMode.value = "forward";

    $("output-area").innerHTML = `
      <div class="output-placeholder">
        <div class="placeholder-icon">∫</div>
        <p>Ingresa los datos y presiona <strong>Resolver</strong></p>
      </div>
    `;

    this.setStatus("Listo", "warn");
    this.renderMath();
  },

  applyExample(key) {
    const ex = this.examples[key];
    if (!ex) return;

    this.showPanel(ex.method);

    if (ex.method === "sep") {
      $("sep-fx").value = ex.fx;
      $("sep-gy").value = ex.gy;
    } else if (ex.method === "exa") {
      $("exa-M").value = ex.M;
      $("exa-N").value = ex.N;
    } else if (ex.method === "int") {
      $("int-M").value = ex.M;
      $("int-N").value = ex.N;
    } else if (ex.method === "lin") {
      $("lin-P").value = ex.P;
      $("lin-Q").value = ex.Q;
    } else if (ex.method === "lap") {
      $("lap-ft").value = ex.expression;
      $("lap-mode").value = ex.mode;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => AppUI.showPanel(btn.dataset.method));
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => AppUI.applyExample(chip.dataset.ex));
  });

  $("btn-clear").addEventListener("click", () => AppUI.clearAll());

  $("btn-copy").addEventListener("click", async () => {
    const box = document.querySelector(".final-result .math-block");
    if (!box) {
      AppUI.renderError("No hay resultado para copiar.");
      return;
    }

    await navigator.clipboard.writeText(box.textContent.trim());
    AppUI.setStatus("Copiado", "ok");
  });

  $("btn-solve").addEventListener("click", async () => {
    try {
      AppUI.setStatus("Resolviendo...", "warn");

      let data = null;

      if (AppUI.currentMethod === "sep") data = await solveSeparable();
      else if (AppUI.currentMethod === "exa") data = await solveExact();
      else if (AppUI.currentMethod === "int") data = await solveIntegrating();
      else if (AppUI.currentMethod === "lin") data = await solveLinear();
      else if (AppUI.currentMethod === "lap") data = await solveLaplace();

      if (!data || data.error) {
        throw new Error(data?.error || "No se pudo resolver.");
      }

      AppUI.renderResult(data);
      AppUI.setStatus("Resuelto", "ok");
    } catch (err) {
      AppUI.renderError(err.message);
      AppUI.setStatus("Error", "warn");
    }
  });

  AppUI.showPanel("sep");
});