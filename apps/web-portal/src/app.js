const { portalSections, portalHighlights } = require("./page-data.js");

function renderPortalDocument() {
  const cards = portalSections
    .map(
      (section) => `
        <article class="card">
          <p class="eyebrow">${section.id.toUpperCase()}</p>
          <h3>${section.title}</h3>
          <p>${section.description}</p>
        </article>
      `,
    )
    .join("");

  const highlights = portalHighlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  return `
    <section class="hero">
      <div>
        <p class="eyebrow">Customer Portal</p>
        <h1>OneManTec API 控制台</h1>
        <p class="lede">先把客户最常用的 3 件事放在台面上：拿 key、选模型、看账单。</p>
      </div>
      <aside class="panel">
        <h2>Portal Highlights</h2>
        <ul>${highlights}</ul>
      </aside>
    </section>
    <section class="grid">${cards}</section>
  `;
}

if (typeof window !== "undefined") {
  const mount = document.getElementById("app");
  mount.innerHTML = renderPortalDocument();
}

module.exports = {
  renderPortalDocument,
};
