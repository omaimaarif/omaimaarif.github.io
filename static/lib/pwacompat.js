(function() {
    function B(a) {
        try {
            return document.head.querySelector(a)
        } catch (b) {
            return null
        }
    }
    function v(a, b) {
        a = "__pwacompat_" + a;
        void 0 !== b && (w[a] = b);
        return w[a]
    }
    function F() {
        var a = (x = B('link[rel="manifest"]')) ? x.href : "";
        if (!a)
            throw 'can\'t find <link rel="manifest" href=".." />\'';
        var b = Q([a, location])
          , d = v("manifest");
        if (d)
            try {
                var g = JSON.parse(d);
                G(g, b)
            } catch (r) {
                console.warn("PWACompat error", r)
            }
        else {
            var n = new XMLHttpRequest;
            n.open("GET", a);
            n.withCredentials = "use-credentials" === x.getAttribute("crossorigin");
            n.onload = function() {
                try {
                    var r = JSON.parse(n.responseText);
                    v("manifest", n.responseText);
                    G(r, b)
                } catch (t) {
                    console.warn("PWACompat error", t)
                }
            }
            ;
            n.send(null)
        }
    }
    function Q(a) {
        for (var b = {}, d = 0; d < a.length; b = {
            c: b.c
        },
        ++d) {
            b.c = a[d];
            try {
                return new URL("",b.c),
                function(g) {
                    return function(n) {
                        return (new URL(n || "",g.c)).toString()
                    }
                }(b)
            } catch (g) {}
        }
        return function(g) {
            return g || ""
        }
    }
    function C(a, b, d) {
        if (!B(a + d)) {
            a = document.createElement(a);
            for (var g in b)
                a.setAttribute(g, b[g]);
            document.head.appendChild(a);
            return a
        }
    }
    function k(a, b) {
        b && (!0 === b && (b = "yes"),
        C("meta", {
            name: a,
            content: b
        }, '[name="' + a + '"]'))
    }
    function R(a) {
        var b = a.sizes.split(/\s+/g).map(function(d) {
            return "any" === d ? Infinity : parseInt(d, 10) || 0
        });
        return {
            src: a.src,
            type: a.type,
            sizes: a.sizes,
            h: Math.max.apply(null, b),
            f: a.f ? a.f.split(/\s+/g) : ["any"]
        }
    }
    function G(a, b) {
        function d(f, c, h, m) {
            var e = window.devicePixelRatio
              , l = D({
                width: f * e,
                height: c * e
            });
            l.scale(e, e);
            l.fillStyle = y;
            l.fillRect(0, 0, f, c);
            l.translate(f / 2, (c - 20) / 2);
            m && (c = m.width / e,
            e = m.height / e,
            128 < e && (c /= e / 128,
            e = 128),
            48 <= c && 48 <= e && (l.drawImage(m, c / -2, e / -2, c, e),
            l.translate(0, e / 2 + 20)));
            l.fillStyle = S ? "white" : "black";
            l.font = "24px HelveticaNeue-CondensedBold";
            l.font = getComputedStyle(x).getPropertyValue("--pwacompat-splash-font");
            e = a.name || a.short_name || document.title;
            c = l.measureText(e);
            m = c.j || 24;
            l.translate(0, m);
            if (c.width < .8 * f)
                l.fillText(e, c.width / -2, 0);
            else
                for (e = e.split(/\s+/g),
                c = 1; c <= e.length; ++c) {
                    var H = e.slice(0, c).join(" ")
                      , I = l.measureText(H).width;
                    if (c === e.length || I > .6 * f)
                        l.fillText(H, I / -2, 0),
                        l.translate(0, 1.2 * m),
                        e.splice(0, c),
                        c = 0
                }
            return function() {
                var J = l.canvas.toDataURL();
                g(h, J);
                return J
            }
        }
        function g(f, c) {
            var h = document.createElement("link");
            h.setAttribute("rel", "apple-touch-startup-image");
            h.setAttribute("media", "(orientation: " + f + ")");
            h.setAttribute("href", c);
            document.head.appendChild(h)
        }
        function n(f, c) {
            var h = window.screen
              , m = d(h.width, h.height, "portrait", f)
              , e = d(h.height, h.width, "landscape", f);
            setTimeout(function() {
                u.p = m();
                setTimeout(function() {
                    u.l = e();
                    c()
                }, 10)
            }, 10)
        }
        function r(f) {
            function c() {
                --h || f()
            }
            var h = z.length + 1;
            c();
            z.forEach(function(m) {
                var e = new Image;
                e.crossOrigin = "anonymous";
                e.onerror = c;
                e.onload = function() {
                    e.onload = null;
                    m.href = K(e, y, !0);
                    u.i[e.src] = m.href;
                    c()
                }
                ;
                e.src = m.href
            })
        }
        function t() {
            v("iOS", JSON.stringify(u))
        }
        function L() {
            var f = z.shift();
            if (f) {
                var c = new Image;
                c.crossOrigin = "anonymous";
                c.onerror = function() {
                    return void L()
                }
                ;
                c.onload = function() {
                    c.onload = null;
                    n(c, function() {
                        var h = a.background_color && K(c, y);
                        h ? (f.href = h,
                        u.i[c.src] = h,
                        r(t)) : t()
                    })
                }
                ;
                c.src = f.href
            } else
                n(null, t)
        }
        var p = (a.icons || []).map(R).sort(function(f, c) {
            return c.h - f.h
        })
          , q = p.filter(function(f) {
            return -1 < f.f.indexOf("any")
        });
        p = p.filter(function(f) {
            return -1 < f.f.indexOf("maskable")
        });
        var z = (0 < p.length ? p : q).map(function(f) {
            var c = {
                rel: "icon",
                href: b(f.src),
                sizes: f.sizes
            }
              , h = '[sizes="' + f.sizes + '"]';
            C("link", c, '[rel="icon"]' + h);
            if (A && !(120 > f.h))
                return c.rel = "apple-touch-icon",
                C("link", c, '[rel="apple-touch-icon"]' + h)
        }).filter(Boolean);
        p = B('meta[name="viewport"]');
        var T = !!(p && p.content || "").match(/\bviewport-fit\s*=\s*cover\b/)
          , M = a.display;
        p = -1 !== U.indexOf(M);
        k("mobile-web-app-capable", p);
        V(a.theme_color || "black", T);
        W && (k("application-name", a.short_name),
        k("msapplication-tooltip", a.description),
        k("msapplication-starturl", b(a.start_url || ".")),
        k("msapplication-navbutton-color", a.theme_color),
        (q = q[0]) && k("msapplication-TileImage", b(q.src)),
        k("msapplication-TileColor", a.background_color));
        k("theme-color", a.theme_color);
        if (A) {
            var y = a.background_color || "#f8f9fa"
              , S = N(y);
            (q = X(a.related_applications)) && k("apple-itunes-app", "app-id=" + q);
            k("apple-mobile-web-app-capable", p);
            k("apple-mobile-web-app-title", a.short_name || a.name);
            if (q = v("iOS"))
                try {
                    var E = JSON.parse(q);
                    g("portrait", E.p);
                    g("landscape", E.l);
                    z.forEach(function(f) {
                        var c = E.i[f.href];
                        c && (f.href = c)
                    });
                    return
                } catch (f) {}
            var u = {
                i: {}
            };
            L()
        } else
            q = {
                por: "portrait",
                lan: "landscape"
            }[String(a.orientation || "").substr(0, 3)] || "",
            k("x5-orientation", q),
            k("screen-orientation", q),
            "fullscreen" === M ? (k("x5-fullscreen", "true"),
            k("full-screen", "yes")) : p && (k("x5-page-mode", "app"),
            k("browsermode", "application"))
    }
    function X(a) {
        var b;
        (a || []).filter(function(d) {
            return "itunes" === d.platform
        }).forEach(function(d) {
            d.id ? b = d.id : (d = d.url.match(/id(\d+)/)) && (b = d[1])
        });
        return b
    }
    function V(a, b) {
        if (A || Y) {
            var d = N(a);
            if (A)
                k("apple-mobile-web-app-status-bar-style", b ? "black-translucent" : d ? "black" : "default");
            else {
                a: {
                    try {
                        var g = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
                        break a
                    } catch (n) {}
                    g = void 0
                }
                if (b = g)
                    d = d ? 255 : 0,
                    b.foregroundColor = {
                        r: d,
                        g: d,
                        b: d,
                        a: 255
                    },
                    a = O(a),
                    b.backgroundColor = {
                        r: a[0],
                        g: a[1],
                        b: a[2],
                        a: a[3]
                    }
            }
        }
    }
    function O(a) {
        var b = D();
        b.fillStyle = a;
        b.fillRect(0, 0, 1, 1);
        return b.getImageData(0, 0, 1, 1).data || []
    }
    function N(a) {
        a = O(a).map(function(b) {
            b /= 255;
            return .03928 > b ? b / 12.92 : Math.pow((b + .055) / 1.055, 2.4)
        });
        return 3 < Math.abs(1.05 / (.2126 * a[0] + .7152 * a[1] + .0722 * a[2] + .05))
    }
    function K(a, b, d) {
        d = void 0 === d ? !1 : d;
        var g = D(a);
        g.drawImage(a, 0, 0);
        if (d || 255 !== g.getImageData(0, 0, 1, 1).data[3])
            return g.globalCompositeOperation = "destination-over",
            g.fillStyle = b,
            g.fillRect(0, 0, a.width, a.height),
            g.canvas.toDataURL()
    }
    function D(a) {
        a = void 0 === a ? {
            width: 1,
            height: 1
        } : a;
        var b = a.height
          , d = document.createElement("canvas");
        d.width = a.width;
        d.height = b;
        return d.getContext("2d")
    }
    if ("onload"in XMLHttpRequest.prototype && !navigator.m) {
        var U = ["standalone", "fullscreen", "minimal-ui"], P = navigator.userAgent || "", A = navigator.vendor && -1 !== navigator.vendor.indexOf("Apple") && (-1 !== P.indexOf("Mobile/") || "standalone"in navigator) || !1, W = !!P.match(/(MSIE |Edge\/|Trident\/)/), Y = "undefined" !== typeof Windows, x;
        try {
            var w = sessionStorage
        } catch (a) {}
        w = w || {};
        "complete" === document.readyState ? F() : window.addEventListener("load", F)
    }
}
)();
