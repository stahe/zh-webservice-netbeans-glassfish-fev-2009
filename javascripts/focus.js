document.addEventListener("DOMContentLoaded", function () {
  // --- BiDi document metadata (V907) ---
  var ODT_BIDI_ENABLED = __BIDI_ENABLED__;
  var ODT_BIDI_DIR = "__BIDI_DIR__";
  var ODT_BIDI_LANG = "__BIDI_LANG__";
  if (ODT_BIDI_ENABLED) {
    if (ODT_BIDI_DIR) document.documentElement.setAttribute("dir", ODT_BIDI_DIR);
    if (ODT_BIDI_LANG) document.documentElement.setAttribute("lang", ODT_BIDI_LANG);
    document.body.classList.add(ODT_BIDI_DIR === "rtl" ? "odt-rtl" : "odt-ltr");
  }
  // --- Focus toggle button (existing feature) ---
  if (!document.querySelector(".focus-toggle-btn")) {
    var btn = document.createElement("label");
    btn.className = "md-icon md-header__button focus-toggle-btn";
    btn.title = "Mode Focus";
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3M14 5v2h3v3h2V5h-5Z"></path></svg>';
    var header = document.querySelector(".md-header__inner");
    if (header) header.appendChild(btn);
    btn.addEventListener("click", function () {
      document.body.classList.toggle("md-focus");
      if (document.body.classList.contains("md-focus")) {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2m3-8H5v2h5V5H8v3m6 11h2v-3h3v-2h-5v5m2-11V5h-2v5h5V8h-3Z"></path></svg>';
      } else {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5m12 7h-3v2h5v-5h-2v3M14 5v2h3v3h2V5h-5Z"></path></svg>';
      }
    });
  }
  // --- Image lightbox (V357) ---
  var overlay = document.querySelector(".odt-lightbox-overlay");
  var overlayImg = null;
  var closeBtn = null;
  function ensureLightbox() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "odt-lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Agrandissement d'image");
    var content = document.createElement("div");
    content.className = "odt-lightbox-content";
    closeBtn = document.createElement("button");
    closeBtn.className = "odt-lightbox-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Fermer");
    closeBtn.textContent = "×";
    overlayImg = document.createElement("img");
    overlayImg.alt = "";
    content.appendChild(closeBtn);
    content.appendChild(overlayImg);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    // Close interactions
    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    content.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay && overlay.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }
  function openLightbox(src, altText) {
    ensureLightbox();
    if (!overlayImg) return;
    overlayImg.src = src;
    overlayImg.alt = altText || "";
    overlay.classList.add("is-open");
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    if (overlayImg) {
      overlayImg.src = "";
      overlayImg.alt = "";
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;
    if (t.tagName && t.tagName.toLowerCase() === "img" && t.classList.contains("odt-zoomable")) {
      var src = t.getAttribute("data-zoom-src") || t.getAttribute("src");
      if (!src) return;
      e.preventDefault();
      openLightbox(src, t.getAttribute("alt") || "Image");
    }
  });
});
// --- Copy-to-clipboard for code blocks (ODT converter) ---
(function() {
  var COPY_LABEL = "复制";
  var COPIED_LABEL = "已复制";
  var ONLY_RECOGNIZED = true;
  var MIN_LINES = 4;
  var PYGMENTS_HEURISTIC = true;
  // Languages considered "not recognized" (plain text)
  var EXCLUDED = { "text":1, "plaintext":1, "plain":1, "txt":1, "none":1 };
  function fallbackCopyText(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopyText(text);
      });
    }
    fallbackCopyText(text);
    return Promise.resolve();
  }
  function setButtonState(btn) {
    if (!btn) return;
    btn.textContent = COPIED_LABEL;
    btn.classList.add("is-copied");
    window.setTimeout(function () {
      btn.textContent = COPY_LABEL;
      btn.classList.remove("is-copied");
    }, 1200);
  }
  function getLangFromClass(el) {
    if (!el || !el.classList) return "";
    for (var i = 0; i < el.classList.length; i++) {
      var c = el.classList[i];
      if (c.indexOf("language-") === 0) return c.substring(9);
    }
    return "";
  }
  function detectLanguage(el) {
    if (!el) return "";
    // try code, pre, container, ancestors
    var code = el.querySelector ? (el.querySelector("code") || null) : null;
    var pre = el.querySelector ? (el.querySelector("pre") || null) : null;
    var lang = "";
    if (code) lang = getLangFromClass(code);
    if (!lang && pre) lang = getLangFromClass(pre);
    if (!lang) lang = getLangFromClass(el);
    if (!lang) {
      // ancestors
      var cur = el;
      for (var k = 0; k < 4 && cur; k++) {
        lang = getLangFromClass(cur);
        if (lang) break;
        cur = cur.parentElement;
      }
    }
    if (!lang) {
      // data attributes
      var attr = (code && (code.getAttribute("data-language") || code.getAttribute("data-lang"))) ||
                 (pre && (pre.getAttribute("data-language") || pre.getAttribute("data-lang"))) ||
                 (el.getAttribute && (el.getAttribute("data-language") || el.getAttribute("data-lang")));
      if (attr) lang = attr;
    if (!lang && PYGMENTS_HEURISTIC) {
      // Heuristic: if the block contains Pygments token spans, syntax highlighting is active
      // even if no explicit language-xxx class is present.
      var hasTok = el.querySelector && el.querySelector("span.k,span.kt,span.kn,span.kd,span.kc,span.nb,span.nc,span.nn,span.nf,span.nt,span.na,span.s,span.s1,span.s2,span.mi,span.mf,span.c,span.c1,span.cp,span.o");
      if (hasTok) lang = "pygments";
    }
    }
    return (lang || "").toLowerCase();
  }
  function countLinesFromText(text) {
    if (!text) return 0;
    // normalize trailing newline
    text = text.replace(/\s+$/,"");
    if (!text) return 0;
    return text.split("\n").length;
  }
  function extractCodeFromRich(container) {
    // Prefer explicit content spans to avoid line numbers
    var parts = container.querySelectorAll(".odt-code-line-content");
    if (parts && parts.length) {
      var lines = [];
      parts.forEach(function (sp) {
        lines.push(sp.textContent || "");
      });
      return lines.join("\n");
    }
    // Fallback: remove known line-number nodes then read text
    var code = container.querySelector("pre code") || container.querySelector("code") || container.querySelector("pre");
    if (!code) return "";
    var clone = code.cloneNode(true);
    clone.querySelectorAll(".odt-code-lineno,.lineno,.linenos,.linenodiv,td.linenos,span.linenos,.hljs-ln-numbers").forEach(function (n) {
      n.remove();
    });
    return (clone.textContent || "").replace(/\s+$/,"");
  }
  function extractCodeGeneric(scope) {
    // Handle common "table with line numbers" layouts by preferring the code cell
    var table = scope.closest ? scope.closest("table.highlighttable") : null;
    if (table) {
      var codeCell = table.querySelector("td.code pre, td.code code, td.code");
      if (codeCell) {
        return (codeCell.textContent || "").replace(/\s+$/,"");
      }
    }
    var pre = scope.tagName && scope.tagName.toLowerCase() === "pre" ? scope : (scope.querySelector ? (scope.querySelector("pre") || scope) : scope);
    var code = pre && pre.querySelector ? (pre.querySelector("code") || pre) : pre;
    if (!code) return "";
    var clone = code.cloneNode(true);
    clone.querySelectorAll(".odt-code-lineno,.lineno,.linenos,.linenodiv,td.linenos,span.linenos,.hljs-ln-numbers").forEach(function (n) {
      n.remove();
    });
    return (clone.textContent || "").replace(/\s+$/,"");
  }
  function shouldAddButton(container, codeText, opts) {
    opts = opts || {};
    var FORCE = !!opts.force;
    if (!container) return false;
    if (container.querySelector && container.querySelector(".odt-code-copy-btn")) return false;
    var lang = detectLanguage(container);
    // V369: Rich code blocks always get a [Copier] button (no language gating)
    if (!FORCE && ONLY_RECOGNIZED) {
      if (!lang || EXCLUDED[lang]) return false;
    }
    if (MIN_LINES && MIN_LINES > 0) {
      var n = countLinesFromText(codeText);
      if (n < MIN_LINES) return false;
    }
    return true;
  }
  function ensureButton(container, extractor, opts) {
    if (!container) return;
    // Compute text first (needed for min-lines decision)
    var text = extractor(container);
    if (!shouldAddButton(container, text, opts)) return;
    container.classList.add("odt-code-copy-container");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "odt-code-copy-btn";
    btn.textContent = COPY_LABEL;
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var t = extractor(container);
      copyText(t).then(function () {
        setButtonState(btn);
      });
    });
    container.appendChild(btn);
  }
  function initCopy(root) {
    var scope = root || document;
    // Rich code blocks generated by the converter
    scope.querySelectorAll(".odt-code-rich").forEach(function (block) {
      ensureButton(block, extractCodeFromRich, { force: true });
    });
    // Pygments highlight tables: attach only on td.code (prevents double buttons)
    scope.querySelectorAll("table.highlighttable").forEach(function (tbl) {
      var cell = tbl.querySelector("td.code");
      if (cell) {
        ensureButton(cell, function () { return extractCodeGeneric(cell); });
      }
    });
    // Other code blocks: add a button on the nearest wrapper around <pre>
    scope.querySelectorAll("pre").forEach(function (pre) {
      if (pre.closest && pre.closest(".odt-code-rich")) return;
      if (pre.closest && pre.closest("table.highlighttable")) return;
      var container = pre.parentElement;
      if (container && (container.classList.contains("highlight") || container.classList.contains("codehilite"))) {
        ensureButton(container, function () { return extractCodeGeneric(container); });
      } else {
        ensureButton(pre, function () { return extractCodeGeneric(pre); });
      }
    });
  }
  function boot() {
    try { initCopy(document); } catch (e) {}
  }
  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  // MkDocs Material instant navigation support
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () {
      window.setTimeout(boot, 0);
    });
  } else {
    // Fallback: observe content swaps
    var target = document.querySelector(".md-content");
    if (target && window.MutationObserver) {
      var mo = new MutationObserver(function () {
        window.setTimeout(boot, 0);
      });
      mo.observe(target, { childList: true, subtree: true });
    }
  }
})();
