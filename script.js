// headline words
var h = document.getElementById("h");
var n = 0;
"I help businesses grow smarter.".split(" ").forEach(function (w) {
  var b = document.createElement("b");
  b.className = "w";
  w.split("").forEach(function (ch) {
    var l = document.createElement("i");
    l.textContent = ch;
    l.style.setProperty("--d", 0.15 + n * 0.045 + "s");
    n++;
    b.appendChild(l);
  });
  h.appendChild(b);
  h.appendChild(document.createTextNode(" "));
});
document.getElementById("y").textContent = new Date().getFullYear();
// stay on the same page: no navigation, details shown in place
document.querySelectorAll(".ci").forEach(function (b) {
  b.onclick = function () {
    document.getElementById("info").textContent = b.dataset.v;
  };
});
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.onclick = function (e) {
    e.preventDefault();
    var t = document.querySelector(a.getAttribute("href"));
    if (t) t.scrollIntoView({ behavior: "smooth" });
  };
});
// network canvas
(function () {
  var c = document.getElementById("net"),
    x = c.getContext("2d"),
    W,
    H,
    P = [],
    m = { x: -999, y: -999 },
    dpr = Math.min(devicePixelRatio || 1, 2);
  var still = matchMedia("(prefers-reduced-motion:reduce)").matches;
  function rgb() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--node")
      .trim();
  }
  function size() {
    W = c.clientWidth;
    H = c.clientHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, (W * H) / 14000));
    P = [];
    for (var i = 0; i < n; i++)
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 2.2,
      });
  }
  function draw() {
    var col = rgb();
    x.clearRect(0, 0, W, H);
    P.forEach(function (p) {
      if (!still) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      var dx = m.x - p.x,
        dy = m.y - p.y,
        d = Math.hypot(dx, dy);
      if (d < 160 && !still) {
        p.x += dx * 0.012;
        p.y += dy * 0.012;
      }
    });
    for (var i = 0; i < P.length; i++) {
      for (var j = i + 1; j < P.length; j++) {
        var d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
        if (d < 130) {
          x.strokeStyle = "rgba(" + col + "," + (1 - d / 130) * 0.35 + ")";
          x.lineWidth = 1;
          x.beginPath();
          x.moveTo(P[i].x, P[i].y);
          x.lineTo(P[j].x, P[j].y);
          x.stroke();
        }
      }
      var dm = Math.hypot(P[i].x - m.x, P[i].y - m.y);
      if (dm < 170) {
        x.strokeStyle = "rgba(255,255,255," + (1 - dm / 170) * 0.8 + ")";
        x.lineWidth = 1.4;
        x.beginPath();
        x.moveTo(P[i].x, P[i].y);
        x.lineTo(m.x, m.y);
        x.stroke();
      }
      x.fillStyle = "rgba(" + col + ",.75)";
      x.beginPath();
      x.arc(P[i].x, P[i].y, P[i].r, 0, 7);
      x.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }
  c.parentNode.addEventListener("pointermove", function (e) {
    var r = c.getBoundingClientRect();
    m.x = e.clientX - r.left;
    m.y = e.clientY - r.top;
  });
  c.parentNode.addEventListener("pointerleave", function () {
    m.x = m.y = -999;
  });
  addEventListener("resize", function () {
    size();
    if (still) draw();
  });
  size();
  draw();
})();
// scroll animations (added only)
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".stat,.svc article,.card,.contact .row")
    .forEach(function (el, i) {
      var sib = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--d", (sib % 4) * 0.14 + "s");
      el.classList.add("rv");
      io.observe(el);
    });
  document.querySelectorAll("h2").forEach(function (hd) {
    var t = hd.textContent,
      k = 0;
    hd.textContent = "";
    hd.classList.add("lt");
    t.split(" ").forEach(function (w) {
      var b = document.createElement("b");
      b.className = "w";
      w.split("").forEach(function (ch) {
        var l = document.createElement("i");
        l.textContent = ch;
        l.style.setProperty("--d", k * 0.03 + "s");
        k++;
        b.appendChild(l);
      });
      hd.appendChild(b);
      hd.appendChild(document.createTextNode(" "));
    });
    io.observe(hd);
  });
}
