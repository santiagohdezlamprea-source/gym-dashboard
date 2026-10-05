const STORAGE_KEY = "h72-panel-v1";
const DAY = 24 * 60 * 60 * 1000;

const money = (n) => "$" + n.toLocaleString("es-CO");
const shortDate = (d) => new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "short" });

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// arma el estado inicial a partir de los datos de ejemplo
function buildSampleState() {
  const today = startOfToday();
  const members = SAMPLE_MEMBERS.map((m, i) => ({
    id: i + 1,
    name: m.name,
    plan: m.plan,
    due: today + m.daysLeft * DAY,
  }));

  // se asume que cada socio pago el dia que arranco su plan
  const payments = members.map((m) => ({
    memberId: m.id,
    amount: PLANS[m.plan].price,
    date: m.due - PLANS[m.plan].days * DAY,
  }));

  return { members, payments };
}

// localStorage puede fallar (modo incognito, etc), por eso el try/catch
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.members) return saved;
  } catch (e) { /* nada, usamos los de ejemplo */ }
  return buildSampleState();
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

let state = loadState();

function statusOf(member) {
  const daysLeft = Math.round((member.due - startOfToday()) / DAY);
  if (daysLeft < 0) return { key: "late", label: "Vencido", icon: "✕", daysLeft };
  if (daysLeft <= 7) return { key: "soon", label: "Por vencer", icon: "!", daysLeft };
  return { key: "ok", label: "Al día", icon: "✓", daysLeft };
}

/* ---------- KPIs ---------- */
function renderKpis() {
  const statuses = state.members.map(statusOf);
  const active = statuses.filter((s) => s.key !== "late").length;
  const late = statuses.length - active;

  document.getElementById("kActive").textContent = active;
  document.getElementById("kActiveSub").textContent = `${late} vencidos de ${statuses.length} en total`;
  document.getElementById("kSoon").textContent = statuses.filter((s) => s.key === "soon").length;

  const now = new Date();
  const last30 = state.payments.filter((p) => Date.now() - p.date <= 30 * DAY);
  document.getElementById("kMoney").textContent = money(last30.reduce((sum, p) => sum + p.amount, 0));

  // entradas "hasta ahora": suma de las horas que ya pasaron
  const h = now.getHours();
  const soFar = HOURLY.filter(([hour]) => Number(hour) <= h).reduce((s, [, n]) => s + n, 0);
  document.getElementById("kToday").textContent = soFar;
}

/* ---------- grafica de horas ---------- */
function hourLabel(h) {
  h = Number(h);
  if (h === 12) return "12 m.";
  return h < 12 ? `${h} a. m.` : `${h - 12} p. m.`;
}

function renderHourChart() {
  const chart = document.getElementById("hourChart");
  const max = Math.max(...HOURLY.map(([, n]) => n));
  const peak = HOURLY.find(([, n]) => n === max);

  chart.innerHTML = HOURLY.map(([hour, n]) => `
    <div class="bar-col" tabindex="0" data-tip="${hourLabel(hour)}: ${n} entradas en promedio">
      ${hour === peak[0] ? `<span class="peak-label">pico</span>` : ""}
      <div class="bar" style="height:${(n / max) * 100}%"></div>
      <span class="bar-x">${Number(hour) % 2 === 0 ? "" : hour}</span>
    </div>`).join("");

  document.getElementById("hourTable").innerHTML =
    "<tr><th>Hora</th><th>Entradas</th></tr>" +
    HOURLY.map(([h, n]) => `<tr><td>${hourLabel(h)}</td><td>${n}</td></tr>`).join("");
}

/* ---------- socios por plan ---------- */
function renderPlans() {
  const active = state.members.filter((m) => statusOf(m).key !== "late");
  const counts = {};
  active.forEach((m) => { counts[m.plan] = (counts[m.plan] || 0) + 1; });
  const max = Math.max(...Object.values(counts), 1);

  document.getElementById("plans").innerHTML = Object.keys(PLANS).map((key) => {
    const n = counts[key] || 0;
    return `
      <li>
        <div class="plan-top"><span>${PLANS[key].name} <small class="muted">${money(PLANS[key].price)}</small></span><b>${n}</b></div>
        <div class="plan-track"><div class="plan-fill" style="width:${(n / max) * 100}%"></div></div>
      </li>`;
  }).join("");
}

/* ---------- tabla de socios ---------- */
function renderMembers() {
  const q = document.getElementById("search").value.trim().toLowerCase();
  const filter = document.getElementById("statusFilter").value;

  // los vencidos y por vencer primero, que son los que importan
  const order = { late: 0, soon: 1, ok: 2 };
  const rows = state.members
    .map((m) => ({ ...m, st: statusOf(m) }))
    .filter((m) => m.name.toLowerCase().includes(q))
    .filter((m) => filter === "all" || m.st.key === filter)
    .sort((a, b) => order[a.st.key] - order[b.st.key] || a.due - b.due);

  document.getElementById("empty").hidden = rows.length > 0;

  document.getElementById("memberRows").innerHTML = rows.map((m) => {
    const d = m.st.daysLeft;
    const hint = d < 0 ? `hace ${-d} d` : d === 0 ? "hoy" : `en ${d} d`;
    return `
      <tr>
        <td>${m.name}</td>
        <td>${PLANS[m.plan].name}</td>
        <td>${shortDate(m.due)} <span class="muted small">(${hint})</span></td>
        <td><span class="pill pill--${m.st.key}"><i>${m.st.icon}</i>${m.st.label}</span></td>
        <td class="right"><button class="btn btn--small" data-pay="${m.id}">Registrar pago</button></td>
      </tr>`;
  }).join("");
}

function registerPayment(id) {
  const m = state.members.find((x) => x.id === id);
  const plan = PLANS[m.plan];
  if (!confirm(`¿Registrar pago de ${money(plan.price)} para ${m.name}?`)) return;

  // si ya estaba vencido arranca desde hoy, si no se suma a lo que le quedaba
  const base = Math.max(m.due, startOfToday());
  m.due = base + plan.days * DAY;
  state.payments.push({ memberId: id, amount: plan.price, date: Date.now() });

  saveState();
  renderAll();
}

function renderAll() {
  renderKpis();
  renderPlans();
  renderMembers();
}

/* ---------- eventos ---------- */
document.getElementById("today").textContent = new Date().toLocaleDateString("es-CO", {
  weekday: "long", day: "numeric", month: "long",
});

document.getElementById("search").addEventListener("input", renderMembers);
document.getElementById("statusFilter").addEventListener("change", renderMembers);

document.getElementById("memberRows").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pay]");
  if (btn) registerPayment(Number(btn.dataset.pay));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  state = buildSampleState();
  renderAll();
});

// tooltip de la grafica (mouse y teclado)
const tip = document.getElementById("tooltip");
const chart = document.getElementById("hourChart");

function showTip(col) {
  tip.textContent = col.dataset.tip;
  tip.hidden = false;
  const r = col.getBoundingClientRect();
  tip.style.left = r.left + r.width / 2 + window.scrollX + "px";
  tip.style.top = r.top + window.scrollY - 8 + "px";
}
chart.addEventListener("mouseover", (e) => { const c = e.target.closest(".bar-col"); if (c) showTip(c); });
chart.addEventListener("focusin", (e) => { const c = e.target.closest(".bar-col"); if (c) showTip(c); });
chart.addEventListener("mouseleave", () => { tip.hidden = true; });
chart.addEventListener("focusout", () => { tip.hidden = true; });

renderHourChart();
renderAll();
