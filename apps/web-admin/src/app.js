const { adminPanels } = require("./page-data.js");

function renderAdminDocument() {
  const panels = adminPanels
    .map(
      (panel) => `
        <article class="panel">
          <p class="eyebrow">${panel.id.toUpperCase()}</p>
          <h3>${panel.title}</h3>
          <p>${panel.description}</p>
        </article>
      `,
    )
    .join("");

  return `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Admin Console</p>
        <h1>OneManTec 运营控制台</h1>
        <p class="lede">把模型、节点、部署、价格和风控放在一张控制面上，方便一人公司高频操作。</p>
      </div>
      <div class="hero-metrics">
        <div><strong>9</strong><span>模块已规划</span></div>
        <div><strong>48</strong><span>后端单测通过</span></div>
        <div><strong>3</strong><span>核心运维面板</span></div>
      </div>
    </section>
    <section class="grid">${panels}</section>
  `;
}

if (typeof window !== "undefined") {
  const mount = document.getElementById("app");
  mount.innerHTML = renderAdminDocument();
}

module.exports = {
  renderAdminDocument,
};
