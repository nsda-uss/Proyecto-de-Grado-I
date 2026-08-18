/* ============================================================
   sidebar.js
   Sidebar de navegación — Proyecto de Grado I (MGTS / MGTO)
   Inyectado vía JS (constante HTML embebida) para funcionar bajo
   el protocolo file://, donde fetch() de fragmentos HTML falla.
   Mantener este patrón en todas las páginas del sitio.
   ============================================================ */

(function () {
  var NAV_ITEMS = [
    { href: "index.html", label: "Inicio", icon: "home" },
    { href: "belbin_test.html", label: "Test de Belbin", icon: "users", group: "Autoconocimiento y equipo" },
    { href: "https://www.16personalities.com/es", label: "16Personalities", icon: "compass", external: true, group: "Autoconocimiento y equipo" },
    { href: "tuckman.html", label: "Etapas de Tuckman", icon: "trending-up", group: "Autoconocimiento y equipo" },
    { href: "contrato_equipo.html", label: "Contrato de Equipo", icon: "file-signature", group: "Documentos del proyecto" },
    { href: "plan_trabajo.html", label: "Plan de Trabajo", icon: "calendar", group: "Documentos del proyecto" }
  ];

  var ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.2 14.7c2.4.3 4.3 2.1 4.8 5.3"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/>',
    "trending-up": '<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    "file-signature": '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h9"/><path d="M14 3l5 5v3"/><path d="M15 19c1-2 2.5-2 3.5-1"/><path d="M19 21c-1-2.5.5-4 2-4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4M16 3v4"/>'
  };

  function svgIcon(name) {
    return '<svg class="pg1-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }

  function currentFile() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function buildSidebarHTML() {
    var here = currentFile();
    var groups = {};
    var order = [];

    NAV_ITEMS.forEach(function (item) {
      var key = item.group || "";
      if (!groups[key]) { groups[key] = []; order.push(key); }
      groups[key].push(item);
    });

    var html = "";
    html += '<div class="pg1-sidebar-inner">';
    html += '  <a class="pg1-brand" href="index.html">';
    html += '    <span class="pg1-brand-mark">PG</span>';
    html += '    <span class="pg1-brand-text"><strong>Proyecto de Grado I</strong><br><span>MGTS &middot; MGTO</span></span>';
    html += "  </a>";

    // "Inicio" como enlace independiente, fuera de los grupos temáticos
    var homeActive = here === "index.html";
    html += '<a class="pg1-nav-link pg1-nav-home' + (homeActive ? " is-active" : "") + '" href="index.html">' +
      svgIcon("home") + "<span>Inicio</span></a>";

    order.forEach(function (groupName) {
      if (!groupName) return; // el grupo sin nombre solo contenía "Inicio", ya renderizado arriba
      html += '  <nav class="pg1-nav-group">';
      html += '<span class="pg1-nav-eyebrow">' + groupName + "</span>";
      groups[groupName].forEach(function (item) {
        var active = !item.external && item.href === here;
        var extraAttrs = item.external ? ' target="_blank" rel="noopener"' : "";
        html += '<a class="pg1-nav-link' + (active ? " is-active" : "") + '" href="' + item.href + '"' + extraAttrs + ">";
        html += svgIcon(item.icon);
        html += '<span>' + item.label + "</span>";
        if (item.external) {
          html += '<svg class="pg1-nav-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg>';
        }
        html += "</a>";
      });
      html += "  </nav>";
    });

    html += "</div>";
    return html;
  }

  function injectSidebar() {
    var root = document.getElementById("sidebar-root");
    if (!root) return;
    root.innerHTML = buildSidebarHTML();

    var toggleBtn = document.getElementById("sidebar-toggle");
    var overlay = document.getElementById("sidebar-overlay");
    var aside = root.closest(".pg1-sidebar") || root;

    function openSidebar() {
      document.body.classList.add("pg1-sidebar-open");
    }
    function closeSidebar() {
      document.body.classList.remove("pg1-sidebar-open");
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        document.body.classList.contains("pg1-sidebar-open") ? closeSidebar() : openSidebar();
      });
    }
    if (overlay) overlay.addEventListener("click", closeSidebar);

    root.querySelectorAll(".pg1-nav-link:not([target])").forEach(function (link) {
      link.addEventListener("click", closeSidebar);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSidebar);
  } else {
    injectSidebar();
  }
})();
