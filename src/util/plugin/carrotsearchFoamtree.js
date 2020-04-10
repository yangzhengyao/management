/*
 Carrot Search HTML5 FoamTree.
 v2.0.1, 17f1c89, build 137, 2012-08-08 09:49:39

 Carrot Search confidential.
 Copyright 2002-2012, Carrot Search s.c, All Rights Reserved.

 This software includes the JavaScript-Voronoi code developed by Raymond Hill.
 https://github.com/gorhill/Javascript-Voronoi

 This software includes the hammer.js code developerd by Jorik Tangelder (Eight Media).
 https://github.com/EightMedia/hammer.js
 */
window.CarrotSearchFoamTree = function(Z) {
	function fa(a) {
		function b(u) {
			u = u || window.event;
			if (u.touches) {
				for ( var v = [], E, J = 0, N = u.touches.length; J < N; J++) {
					E = u.touches[J];
					v.push( {
						x : E.pageX,
						y : E.pageY
					})
				}
				return v
			} else {
				v = document;
				E = v.body;
				return [ {
					x : u.pageX || u.clientX
							+ (v && v.scrollLeft || E && E.scrollLeft || 0)
							- (v && v.clientLeft || E && v.clientLeft || 0),
					y : u.pageY || u.clientY
							+ (v && v.scrollTop || E && E.scrollTop || 0)
							- (v && v.clientTop || E && v.clientTop || 0)
				} ]
			}
		}
		function f(u, v) {
			v.touches = b(v.V);
			v.type = u;
			Object.prototype.toString.call(j["on" + u]) == "[object Function]"
					&& j["on" + u].call(j, v)
		}
		function i(u) {
			u = u || window.event;
			if (u.preventDefault)
				u.preventDefault();
			else {
				u.returnValue = false;
				u.cancelBubble = true
			}
		}
		function d(u) {
			switch (u.type) {
			case "mousedown":
			case "touchstart":
				p.start = b(u);
				c = (new Date).getTime();
				t = u.touches ? u.touches.length : 1;
				e = true;
				I = u;
				var v = a.getBoundingClientRect();
				n = {
					top : v.top
							+ (window.pageYOffset || a.scrollTop || document.body.scrollTop)
							- (a.clientTop || document.body.clientTop || 0),
					left : v.left
							+ (window.pageXOffset || a.scrollLeft || document.body.scrollLeft)
							- (a.clientLeft || document.body.clientLeft || 0)
				};
				w = true;
				F.oa(u);
				k.wd && i(u);
				break;
			case "mousemove":
			case "touchmove":
				if (!w)
					return false;
				D = u;
				p.move = b(u);
				F.transform(u) || F.Qa(u);
				break;
			case "mouseup":
			case "mouseout":
			case "touchcancel":
			case "touchend":
				if (!w || g != "transform" && u.touches && u.touches.length > 0)
					return false;
				w = false;
				z = u;
				if (g == "drag")
					f("dragend", {
						V : u,
						direction : s,
						Pc : l,
						xa : h
					});
				else
					g == "transform" ? f("transformend", {
						V : u,
						position : p.Bb,
						scale : u.scale,
						rotation : u.rotation
					}) : F.ob(I);
				m = g;
				p = {};
				e = false;
				h = l = t = 0;
				g = null;
				break
			}
		}
		var j = this, k = {
			wd : false,
			Mc : true,
			Qa : true,
			Rc : true,
			Qc : true,
			Jb : 20,
			transform : true,
			Ld : 0.1,
			Id : 15,
			ob : true,
			Qd : true,
			Sd : 300,
			Rd : 20,
			oa : true,
			$b : 500
		};
		(function() {
			if (!k.Mc)
				return false;
			for ( var u = [ "webkit", "moz", "ms", "o", "" ], v = {
				userSelect : "none",
				touchCallout : "none",
				userDrag : "none",
				tapHighlightColor : "rgba(0,0,0,0)"
			}, E = "", J = 0; J < u.length; J++)
				for ( var N in v) {
					E = N;
					if (u[J])
						E = u[J] + E.substring(0, 1).toUpperCase()
								+ E.substring(1);
					a.style[E] = v[N]
				}
		})();
		var l = 0, h = 0, s = 0, p = {}, t = 0, e = false, g = null, m = null, c = null, o = {
			x : 0,
			y : 0
		}, q = null, r = null, n = {}, w = false, I, D, z, F = {
			oa : function(u) {
				if (k.oa) {
					g = "hold";
					clearTimeout(r);
					r = setTimeout(function() {
						g == "hold" && f("hold", {
							V : u,
							position : p.start[0]
						})
					}, k.$b)
				}
			},
			Qa : function(u) {
				var v = p.move[0].x - p.start[0].x, E = p.move[0].y
						- p.start[0].y;
				l = Math.sqrt(v * v + E * E);
				if (k.Qa && l > k.Jb || g == "drag") {
					var J = s == "up" || s == "down";
					if (!((J && !k.Rc || !J && !k.Qc) && l > k.Jb)) {
						g = "drag";
						J = {
							V : u,
							position : {
								x : p.move[0].x - n.left,
								y : p.move[0].y - n.top
							},
							Pc : l,
							be : v,
							ce : E
						};
						if (e) {
							f("dragstart", J);
							e = false
						}
						f("drag", J);
						i(u)
					}
				}
			},
			transform : function(u) {
				if (k.transform) {
					var v = u.scale || 1, E = u.rotation || 0;
					if ((u.touches ? u.touches.length : 1) != 2)
						return false;
					if (g != "drag"
							&& (g == "transform" || Math.abs(1 - v) > k.Ld || Math
									.abs(E) > k.Id)) {
						g = "transform";
						p.Bb = {
							x : (p.move[0].x + p.move[1].x) / 2 - n.left,
							y : (p.move[0].y + p.move[1].y) / 2 - n.top
						};
						v = {
							V : u,
							position : p.Bb,
							scale : v,
							rotation : E
						};
						if (e) {
							f("transformstart", v);
							e = false
						}
						f("transform", v);
						i(u);
						return true
					}
				}
				return false
			},
			ob : function(u) {
				var v = (new Date).getTime(), E = v - c;
				if (!(k.oa && !(k.oa && k.$b > E))) {
					E = function() {
						if (o && k.Qd && m == "tap" && c - q < k.Sd) {
							var J = Math.abs(o[0].x - p.start[0].x), N = Math
									.abs(o[0].y - p.start[0].y);
							return o && p.start && Math.max(J, N) < k.Rd
						}
						return false
					}();
					g = "tap";
					q = v;
					o = p.start;
					if (k.ob) {
						f("tap", {
							V : u,
							position : p.start[0]
						});
						i(u)
					}
					if (E) {
						g = "double_tap";
						q = null;
						f("doubletap", {
							V : u,
							position : p.start[0]
						});
						i(u)
					}
				}
			}
		};
		if ("ontouchstart" in window) {
			a.addEventListener("touchstart", d, false);
			a.addEventListener("touchmove", d, false);
			a.addEventListener("touchend", d, false);
			a.addEventListener("touchcancel", d, false)
		} else if (a.addEventListener) {
			a.addEventListener("mouseout", function(u) {
				var v;
				a: {
					v = u.relatedTarget;
					if (!v && window.event && window.event.toElement)
						v = window.event.toElement;
					if (a === v)
						v = true;
					else {
						if (v)
							for (v = v.parentNode; v !== null;) {
								if (v === a) {
									v = true;
									break a
								}
								v = v.parentNode
							}
						v = false
					}
				}
				v || d(u)
			}, false);
			a.addEventListener("mouseup", d, false);
			a.addEventListener("mousedown", d, false);
			a.addEventListener("mousemove", d, false)
		}
	}
	function M() {
		this.cells = this.ba = null;
		this.Ja = [];
		this.Eb = []
	}
	function ga() {
		function a(g, m) {
			e = g;
			p = m;
			t = j( {}, p.Od);
			h() && window.console.group(p.wa + ": initial embedding");
			d(t, {}, null);
			t = j( {}, p.Oa, t);
			g = e;
			g.get = i;
			g.set = f;
			return {
				options : t,
				Uc : b
			}
		}
		function b(g) {
			g = document.getElementById(g);
			if (!/relative|absolute|fixed/.test(window.getComputedStyle(g, null).getPropertyValue("position")))
				g.style.position = "relative";
			if (g.clientWidth == 0 || g.clientHeight == 0)
				s()&& window.console.error(p.wa
										+ ": embedding failed: the element must have non-zero dimensions, found: "
										+ g.clientWidth + " x "
										+ g.clientHeight + ".");
			else {
				var m = document.createElement("canvas");
				m
						.setAttribute(
								"style",
								"position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%");
				g.innerHTML = "";
				g.appendChild(m);
				return m
			}
		}
		function f() {
			var g;
			if (arguments.length != 0) {
				if (arguments.length == 1)
					g = arguments[0];
				else if (arguments.length == 2) {
					g = {};
					g[arguments[0]] = arguments[1]
				}
				h() && window.console.group(p.wa + ": setting options");
				d(g, {}, null);
				h() && window.console.info("options: ", g);
				var m = 0, c = {};
				l(g, function(o, q) {
					if (t[o] != q) {
						c[o] = q;
						m++
					}
					t[o] = q
				});
				m > 0 && p.yb.Md(c);
				h() && window.console.groupEnd();
				return m
			}
		}
		function i() {
			if (arguments.length == 0)
				return t;
			else {
				var g = arguments[0];
				if (g == null)
					return p.Oa;
				var m = {};
				m[g] = true;
				d(m, {}, function() {
					window.console.group(p.wa + ": getting options")
				});
				if (k(m, g))
					return p.yb.$c(g, Array.prototype.slice.call(arguments, 1))
			}
		}
		function d(g, m, c) {
			if (p.zb) {
				var o = false;
				l(
						p.zb,
						function(q, r) {
							l(
									r,
									function(n, w) {
										if (k(g, n) && !k(g, w)) {
											g[w] = g[n];
											if (h()) {
												if (!o) {
													c && c.apply(this);
													window.console
															.group(p.wa
																	+ ": deprecated option names used");
													o = true
												}
												window.console
														.warn('Use "'
																+ w
																+ '" instead of "'
																+ n
																+ '". The old option name will stop working in version '
																+ q + ".")
											}
											delete g[n]
										}
									})
						});
				if (h()) {
					o && window.console.groupEnd();
					c && window.console.groupEnd()
				}
			}
			l(g, function(q) {
				if (!k(p.Oa, q) && !k(m, q)) {
					h() && window.console.warn("Ignoring unknown option: ", q);
					delete g[q]
				}
			})
		}
		function j() {
			for ( var g = arguments[0], m = arguments.length, c = 1; c < m; c++) {
				var o = arguments[c];
				o != null && l(o, function(q, r) {
					g[q] = r
				})
			}
			return g
		}
		function k(g, m) {
			return typeof g[m] != "undefined"
		}
		function l(g, m) {
			var c, o = 0, q = g.length;
			if (q === undefined)
				for (c in g) {
					if (m.call(g[c], c, g[c]) === false)
						break
				}
			else
				for (; o < q;)
					if (m.call(g[o], o, g[o++]) === false)
						break;
			return g
		}
		function h() {
			return t.logging && s()
		}
		function s() {
			return typeof window.console != "undefined"
					&& k(window.console, "group")
					&& k(window.console, "groupEnd")
		}
		var p, t, e;
		this.$a = a;
		this.Ya = k
	}
	function ha(a, b) {
		if (a == "selection")
			return S.Oc();
		else if (a == "open")
			return S.Nc();
		else if (a == "imageData")
			return S.hd(b[0]);
		return a == "times" ? S.Td() : G[a]
	}
	function da(a) {
		function b(f) {
			return function() {
				if (f)
					return f.apply(ia, arguments)
			}
		}
		x.id = G.id;
		x.Na = G.dataObject;
		x.fe = G.logging;
		x.Ac = G.attributionText;
		x.zc = G.attributionLogo;
		x.Bc = G.attributionUrl;
		x.backgroundColor = G.backgroundColor;
		x.zd = G.rainbowStartColor;
		x.xd = G.rainbowEndColor;
		x.da = G.groupBorderWidth;
		x.Ub = G.groupInsetWidth;
		x.Ba = G.groupBorderWidthScaling;
		x.Pb = G.groupBorderRadius;
		x.od = G.minGroupDiameter;
		x.yc = G.aspectRatioImprovementSteps;
		x.lb = G.siblingRevealingParallelism;
		x.Fc = G.childRevealingParallelism;
		x.Hd = G.rolloutType;
		x.Fd = G.rolloutRate;
		x.Gd = G.rolloutSpeed;
		x.Yb = G.groupsVisibleAtRolloutStart;
		x.Vc = G.explodeDistance;
		x.Jd = G.roundBordersDuringRollout;
		x.Kb = G.drawLabelsDuringRollout;
		x.Xc = G.fadeInTime;
		x.Mb = G.fadeOutTime;
		x.Rb = G.groupFontFamily;
		x.fa = G.groupMinFontSize;
		x.ea = G.groupMaxFontSize;
		x.Xa = G.groupMaxTotalLabelHeight;
		x.Wb = G.groupLinePadding;
		x.md = G.labelLightColor;
		x.ld = G.labelDarkColor;
		x.ab = G.labelColorThreshold;
		x.Xb = G.groupOverlayOpacity;
		x.cd = G.groupGradientStrength;
		x.Wa = G.groupGradientRadius;
		x.Sb = G.groupGradientType;
		x.nd = G.maxLabelSizeForTitleBar;
		x.Vd = G.titleBarFontFamily;
		x.Zd = G.titleBarTextPaddingLeftRight;
		x.$d = G.titleBarTextPaddingTopBottom;
		x.Xd = G.titleBarMinFontSize;
		x.Wd = G.titleBarMaxFontSize;
		x.Ud = G.titleBarBackgroundColor;
		x.tc = G.titleBarTextColor;
		x.fd = G.groupSelectionColor;
		x.gd = G.groupSelectionOutlineColor;
		x.dd = G.groupHoverColor;
		x.ed = G.groupHoverOutlineColor;
		x.pc = G.showZeroWeightGroups;
		x.ae = G.useFastRenderingRoutines;
		x.qa = G.pixelRatio;
		x.td = G.pixelRatioDuringRollout;
		x.selection = G.selection;
		x.open = G.open;
		x.Qb = b(G.groupColorDecorator);
		x.Vb = b(G.groupLabelDecorator);
		x.sc = b(G.titleBarDecorator);
		x.sd = b(G.onRolloutStart);
		x.rd = b(G.onRolloutComplete);
		x.lc = b(G.onRedraw);
		x.qd = b(G.onModelChanged);
		x.kc = b(G.onGroupSelectionChanging);
		x.pd = b(G.onGroupSelectionChanged);
		x.db = b(G.onGroupHover);
		x.jc = b(G.onGroupOpenOrClose);
		x.hc = /%$/.test(x.fa) ? parseFloat(x.fa.replace(/[%\s]/g, ""))
				: undefined;
		x.gc = /%$/.test(x.ea) ? parseFloat(x.ea.replace(/[%\s]/g, ""))
				: undefined;
		x.fa = x.fa ? parseFloat(x.fa.replace(/[%\s]/g, "")) : undefined;
		x.ea = x.ea ? parseFloat(x.ea.replace(/[%\s]/g, "")) : undefined;
		x.cc = P.ca(x.md);
		x.bc = P.ca(x.ld);
		x.Ia = P.ja(P.ca(x.backgroundColor));
		x.Ad = P.ja(P.ca(x.zd));
		x.yd = P.ja(P.ca(x.xd));
		x.Yd = P.ja(P.ca(x.tc));
		P.Zb(a, [ "groupFontFamily", "groupMinFontSize", "groupMaxFontSize",
				"groupMaxTotalLabelHeight", "groupLinePadding",
				"groupBorderWidth", "groupInsetWidth" ])
				&& S.La();
		aa |= P.Zb(a, [ "aspectRatioImprovementSteps", "groupInsetWidth",
				"minGroupDiameter", "attributionText", "attributionLogo",
				"showZeroWeightGroups" ]);
		ba = typeof a.pixelRatio != "undefined";
		typeof a.showZeroWeightGroups != "undefined" && S.reload(false);
		if (typeof a.dataObject != "undefined") {
			S.reload(true);
			S.ib()
		}
		if (typeof a.selection !== "undefined") {
			delete G.selection;
			S.Ec(a.selection)
		}
		if (typeof a.open !== "undefined") {
			delete G.open;
			S.Dc(a.open)
		}
	}
	function X() {
	}
	var W = new (function() {
		function a() {
			l(function() {
				var h = true;
				for ( var s in k)
					if (k.hasOwnProperty(s)) {
						var p = k[s];
						if (p.length > 0) {
							var t = p[0], e = Date.now();
							if (t.nb === undefined)
								t.nb = e;
							var g = t.Zc(t.Ta), m = Date.now();
							t.Nb += m - e;
							t.Ta++;
							if (g) {
								p.shift();
								t.complete && t.complete(t.Ta, t.Nb, m - t.nb)
							}
						}
						h &= p.length == 0
					}
				h || a()
			})
		}
		function b(h, s, p, t) {
			function e(g) {
				g = g + s;
				var m = new RegExp(g + ": [^;]+", "g"), c = h
						.getAttribute("style")
						|| "";
				m.test(c) ? h.setAttribute("style", c.replace(m, g + ": " + p))
						: h.setAttribute("style", c + (c ? "; " : "") + g
								+ ": " + p)
			}
			if (t) {
				e("-moz-");
				e("-webkit-");
				e("-o-")
			} else
				e("")
		}
		function f(h, s, p) {
			return function(t) {
				var e = Math.floor(s * 60);
				b(h, "opacity", p(t / e), false);
				return t == e
			}
		}
		function i(h) {
			return -h * h + 1
		}
		function d(h) {
			h = h * 2;
			return h <= 1 ? Math.pow(h, 2) / 2 : (-Math.pow(h - 2, 2) + 2) / 2
		}
		var j = document.head.style.webkitTransition !== undefined
				|| document.head.style.MozTransition !== undefined
				|| document.head.style.oTransition !== undefined, k = {};
		this.R = function(h, s, p) {
			s = {
				Zc : s,
				complete : p,
				nb : undefined,
				Nb : 0,
				Ta : 0
			};
			if (typeof k[h] !== "undefined")
				k[h].push(s);
			else
				k[h] = [ s ];
			a()
		};
		this.stop = function() {
			k = {}
		};
		this.Kd = function(h) {
			return k[h] && k[h].length > 0
		};
		this.Wc = function(h, s) {
			if (j) {
				b(h, "transition-property", "opacity", true);
				b(h, "transition-timing-function", "ease-out", true);
				b(h, "transition-duration", s + "s", true);
				b(h, "opacity", "1", false)
			} else
				s > 0 ? this.R("fadeIn", f(h, s, d), undefined) : b(h,
						"opacity", "1", false)
		};
		this.Yc = function(h, s) {
			if (j) {
				b(h, "transition-property", "opacity", true);
				b(h, "transition-timing-function", "ease-in", true);
				b(h, "transition-duration", s + "s", true);
				b(h, "opacity", "0", false)
			} else
				s > 0 ? this.R("fadeOut", f(h, s, i), undefined) : b(h,
						"opacity", "0", false)
		};
		this.Gb = function(h, s, p) {
			this.Wc(h, p);
			this.Yc(s, p)
		};
		var l = function() {
			return window.requestAnimationFrame
					|| window.webkitRequestAnimationFrame
					|| window.mozRequestAnimationFrame
					|| window.oRequestAnimationFrame
					|| window.msRequestAnimationFrame || function(h) {
						var s = 0;
						window.setTimeout(function() {
							var p = Date.now();
							h();
							s = Date.now() - p
						}, s < 16 ? 16 - s : 0)
					}
		}();
		return this
	});
	function ja(a) {
		function b(c) {
			R.Ea(c, function(o) {
				o.I = false
			})
		}
		function f(c, o, q) {
			R.Ea(c, function(r) {
				r.frame = 0;
				r.C = o;
				r.pb = o;
				r.o = o >= 1;
				r.Ua = false;
				r.slice = q ? Math.floor(Math.min(2, r.e.length) * (1 - a.Yb)
						+ a.Yb * r.e.length) : r.e.length
			});
			R.J(c, function(r) {
				r.C = o;
				r.mb = false;
				r.o = o >= 1;
				delete r.Db
			})
		}
		function i(c) {
			c && R.J(c, function(o) {
				delete o.O
			})
		}
		function d(c) {
			var o = Q.ia(c.parent ? c.parent.n : e(c.u)), q = [], r = [], n, w, I = 1 - a.Vc * 0.95;
			for (w = 0; w < c.e.length; w++) {
				n = c.e[w];
				r.push( {
					x : n.x,
					y : n.y
				});
				q.push(Q.pa(I, n, o, {}))
			}
			c.qc = q;
			c.Lb = r;
			c = c.e;
			for (w = 0; w < c.length; w++) {
				n = c[w];
				n.c && !n.c.I && d(n.c)
			}
		}
		function j(c) {
			t(c);
			c.parent && Q.cb(c.e, e(c.u), c.parent.n);
			p(c);
			var o = a.yc;
			if (!(o < 0))
				for ( var q = c.e; o--;) {
					for ( var r = 0; r < q.length; r++) {
						var n = q[r];
						if (n.n && n.n.length > 2) {
							var w = Q.ia(n.n);
							n.x = w.x;
							n.y = w.y
						}
					}
					p(c)
				}
			c = c.e;
			for (o = 0; o < c.length; o++) {
				q = c[o];
				q.c && !q.c.I && j(q.c)
			}
		}
		function k(c) {
			function o(I) {
				var D, z;
				h(I);
				for (z = 0; z < I.slice; z++) {
					D = I.e[z];
					var F;
					F = D.C * 2;
					F = F <= 1 ? Math.pow(F, 2) / 2
							: (-Math.pow(F - 2, 2) + 2) / 2;
					Q
							.pa(
									F
											* (F
													* (F
															* (F
																	* (25.9425 * F - 85.88) + 105.78) - 58.69) + 13.8475),
									I.Lb[z], I.qc[z], D)
				}
				z = p(I);
				F = true;
				if (!I.parent || I.parent.o)
					if (z) {
						var u = z.cells;
						for (z = 0; z < I.slice; z++) {
							D = u[z];
							var v = D.ga;
							D = D.m;
							if (D.uc) {
								for ( var E = true, J = 0; J < v.length; J++) {
									var N = v[J].A;
									if ((N = N.Da === D ? N.U : N.Da) && !N.uc) {
										E = false;
										break
									}
								}
								D.o = E
							} else
								D.o = false;
							F &= D.o
						}
					} else
						for (z = 0; z < I.slice; z++) {
							D.o = D.C >= 1;
							F &= D.o
						}
				else {
					for (z = 0; z < I.slice; z++) {
						D = I.e[z];
						D.o = false
					}
					F = false
				}
				I.o = F
			}
			if (!c.o) {
				var q = c.e, r = [], n;
				for (n = 0; n < q.length; n++)
					r.push(q[n].n);
				o(c);
				for (n = 0; n < q.length; n++) {
					var w = c.e[n];
					if (w.c && !w.c.I && !w.o && r[n] && w.n) {
						Q.cb(w.c.Lb, r[n], w.n);
						Q.cb(w.c.qc, r[n], w.n)
					}
				}
			}
		}
		function l(c) {
			if (!c.o) {
				h(c);
				var o, q, r = true;
				if (!c.parent || c.parent.o)
					for (q = 0; q < c.slice; q++) {
						o = c.e[q];
						o.o = o.C >= 1;
						r &= o.o
					}
				else {
					for (q = 0; q < c.slice; q++) {
						o = c.e[q];
						o.o = false
					}
					r = false
				}
				c.o = r
			}
		}
		function h(c) {
			c.frame % Math.max(6 - a.Fd, 1) == 0 && c.slice < c.e.length
					&& c.slice++;
			var o = 0.01 * a.Gd / Math.pow(c.e.length, 0.3), q, r;
			for (r = 0; r < c.slice; r++) {
				q = c.e[r];
				if (q.C < 1) {
					q.C += o;
					q.uc = q.C >= 1
				}
			}
			for (r = o = 0; r < c.slice; r++) {
				q = c.e[r];
				o += q.C
			}
			o /= c.e.length;
			c.frame++;
			c.C = o
		}
		function s(c, o) {
			o(c);
			if (c.C >= 1 - a.Fc) {
				var q = c.o, r, n;
				for (r = 0; r < c.slice; r++) {
					n = c.e[r];
					if (n.c && !n.c.I) {
						q &= s(n.c, o);
						if (!(a.lb == 1 || n.c.C > 1 - a.lb))
							break
					}
				}
				for (r = o = 0; r < c.e.length; r++) {
					n = c.e[r];
					o += n.c && !n.c.I ? n.c.pb || 0 : n.C
				}
				c.pb = o / c.e.length;
				return c.Ua = q
			}
			return false
		}
		function p(c) {
			function o(J, N) {
				for ( var T = 0; T < J.length; T++)
					if (!Q.eb(N, J[T]))
						return false;
				return true
			}
			var q = c.e;
			if (q.length != 0) {
				if (c.slice)
					q = q.slice(0, c.slice);
				var r, n, w;
				w = c.parent ? c.parent.n : e(c.u);
				if (q.length > 1) {
					var I = [];
					for (r = 0; r < q.length; r++) {
						n = q[r];
						for ( var D = 0.5 + n.x | 0, z = 0.5 + n.y | 0, F = D << 14
								| z, u = 0.125; I[F] && u < 1; u += 0.125)
							for ( var v = 1 - u, E = 0; E < I[F] && w.length; E++) {
								D = u * w[E].x + v * D;
								z = u * w[E].y + v * z;
								D = 0.5 + D | 0;
								z = 0.5 + z | 0;
								F = D << 14 | z
							}
						I[F] = true;
						n.x = D;
						n.y = z
					}
					I = g.Jc(q, {
						rb : c.u.x,
						vb : c.u.y,
						sb : c.u.x + c.u.k,
						tb : c.u.y + c.u.j
					});
					D = I.cells;
					for (r = 0; r < D.length; r++) {
						n = D[r].m;
						w = [];
						z = D[r].ga;
						if (z.length == 0)
							delete n.n;
						else {
							for (F = 0; F < z.length; F++) {
								u = z[F];
								v = u.A;
								w.unshift(v.U === u.m ? v.D : v.H)
							}
							Q.jb(w);
							z = w;
							if (c.parent)
								if (!o(w, c.parent.ra))
									if ((z = ka.kd(c.parent.ra, w)) && !n.c)
										z = Q.jb(z);
							n.n = z
						}
					}
				} else {
					n = c.parent ? c.parent.ra : w;
					w = [];
					for (r = 0; r < n.length; r++) {
						D = n[r];
						w.push( {
							x : D.x,
							y : D.y
						})
					}
					q[0].n = w
				}
				c = a.Ub * Math.pow(a.Ba, c.ha);
				for (r = 0; r < q.length; r++) {
					n = q[r];
					w = n.n;
					if (n.c && !n.c.I) {
						n.ra = Q.jb(a.Ub > 0 ? ea.ic(w, c) : w);
						if (n.ra.length < 3
								|| 1.1283 * Math
										.sqrt(Q.ud(n.ra) / n.c.e.length) < a.od) {
							n.c.I = true;
							n.B = false
						}
					}
					if (n.c)
						n.c.u = Q.Ka(n.n)
				}
				return I
			}
		}
		function t(c) {
			function o(v, E, J, N, T) {
				function A(O, U, V, Y, la) {
					O.x = U + Y / 2;
					O.y = V + la / 2
				}
				if (v.length != 0) {
					var y = v.shift(), C = r(y), B, K, H, L;
					if (N < T) {
						B = E;
						H = C / N;
						do {
							C = y.shift();
							K = C.S;
							L = K / H;
							A(C, B, J, L, H);
							B += L
						} while (y.length > 0);
						return o(v, E, J + H, N, T - H)
					} else {
						B = J;
						L = C / T;
						do {
							C = y.shift();
							K = C.S;
							H = K / L;
							A(C, E, B, L, H);
							B += H
						} while (y.length > 0);
						return o(v, E + L, J, N - L, T)
					}
				}
			}
			function q(v, E, J, N) {
				function T(H, L) {
					var O = r(H);
					O = O * O;
					L = L * L;
					for ( var U = Math.max(L * H[0].S / O, O / (L * H[0].S)), V = 1; V < H.length; V++)
						U = Math.max(U, Math.max(L * H[V].S / O, O
								/ (L * H[V].S)));
					return U
				}
				if (v.length != 0) {
					var A = N[N.length - 1], y = E < J ? E : J, C = E < J ? J
							: E, B = v.shift(), K = T(A, y);
					A.push(B);
					if (K >= T(A, y))
						q(v, E, J, N);
					else {
						A.pop();
						N.push( [ B ]);
						q(v, y, C - r(A) / y, N)
					}
					return N
				}
			}
			function r(v) {
				for ( var E = 0, J = 0; J < v.length; J++)
					E += v[J].S;
				return E
			}
			var n = c.u.x, w = c.u.y, I = c.u.k, D = c.u.j;
			c = c.e;
			if (c.length != 0)
				if (c.length == 1) {
					c[0].x = n + I / 2;
					c[0].y = w + D / 2;
					c[0].Za = 0
				} else {
					c = c.slice(0);
					for ( var z = I * D, F = 0, u = 0; u < c.length; u++)
						F += c[u].L;
					z = z / F;
					for (u = 0; u < c.length; u++)
						c[u].S = c[u].L * z;
					c.sort(function(v, E) {
						return E.S - v.S
					});
					for (u = 0; u < c.length; u++)
						c[u].Za = u;
					c = q(c, I, D, [ [ c.shift() ] ]);
					o(c, n, w, I, D)
				}
		}
		function e(c) {
			return [ {
				x : c.x,
				y : c.y
			}, {
				x : c.x + c.k,
				y : c.y
			}, {
				x : c.x + c.k,
				y : c.y + c.j
			}, {
				x : c.x,
				y : c.y + c.j
			} ]
		}
		var g = new M, m = {
			fadein : {
				sa : function() {
				},
				Ib : l
			},
			explode : {
				sa : d,
				Ib : k
			},
			none : {
				sa : function() {
				}
			}
		};
		this.vd = function(c, o) {
			m[o].sa(c);
			f(c, 0, true)
		};
		this.Pd = function(c, o) {
			o == "explode" && a.Kb && i(c);
			return s(c, m[o].Ib)
		};
		this.fb = function(c) {
			b(c);
			i(c);
			f(c, 1, false);
			j(c);
			c.mc = true
		};
		this.La = i;
		return this
	}
	var R = new (function() {
		var a = this;
		this.J = function(b, f) {
			return this.N(b, function(i, d) {
				d = f(i, d);
				d !== false && i.c && a.J(i.c, f);
				return d
			})
		};
		this.N = function(b, f) {
			b = b.e;
			for ( var i = 0; i < b.length; i++) {
				var d = f(b[i], i);
				if (d === false)
					return d
			}
		};
		this.Ea = function(b, f) {
			if (f(b) === false)
				return false;
			return a.N(b, function(i) {
				if (i.c)
					return a.Ea(i.c, f)
			})
		};
		this.Aa = function(b, f) {
			for ( var i = [ b ]; b.M.parent;) {
				b = b.M.parent;
				i.unshift(b);
				b = b
			}
			for (b = 0; b < i.length; b++)
				if (f(i[b]) === false)
					return
		};
		return this
	});
	function ma(a) {
		function b(e, g, m) {
			if (e.c && !e.c.I && e.c.C > 0) {
				f(e.c, e.Y);
				for ( var c = e.c.e, o = 0; o < e.c.slice; o++)
					b(c[o], g, m)
			}
			j(e, g, m)
		}
		function f(e, g) {
			function m(u, v, E, J) {
				v = v[J];
				return v + (E[J] - v) * u
			}
			for ( var c = e.e.length, o = 0.9 * Math.pow(0.5, e.ha - 1), q = 0; q < c; q++) {
				var r = e.e[q];
				if (r.p) {
					var n = r.Za / r.M.e.length, w, I, D;
					if (g) {
						P.ja(g);
						w = g.h;
						D = g.l * (1 + o * (0.25 - n));
						if (D > 100)
							D = 100;
						else if (D < 0)
							D = 0;
						I = g.s;
						n = g.a
					} else {
						var z = a.Ad, F = a.yd;
						w = m(n, z, F, "h");
						I = m(n, z, F, "s");
						D = m(n, z, F, "l");
						n = m(n, z, F, "a")
					}
					r.Y = {
						h : w,
						s : I,
						l : D,
						a : n,
						model : "hsl"
					}
				} else {
					w = P.Ma(a.Ia);
					if (w.l < 50)
						w.l += 15;
					else
						w.l -= 15;
					r.Y = w
				}
				i(r)
			}
		}
		function i(e) {
			if (a.Qb && (e.p || 1)) {
				var g = {
					groupColor : e.Y
				};
				a.Qb(a, d(e), g);
				e.Y = P.Ha(g.groupColor)
			}
		}
		function d(e) {
			return {
				group : e.p,
				weightNormalized : e.L,
				index : e.index,
				indexByWeight : e.Za,
				siblingCount : e.M.e.length,
				level : e.M.ha,
				hasChildren : typeof e.c != "undefined" && !e.c.I,
				selected : e.selected,
				polygonCenterX : e.x,
				polygonCenterY : e.y,
				transitionProgress : e.C
			}
		}
		function j(e, g, m) {
			var c = e.n;
			if (!(!c || c.length == 0)) {
				var o = !e.B && (!m && e.o || a.Kb);
				if (a.da > 0) {
					c = ea.ic(c, 0.5 * a.da * Math.pow(a.Ba, e.M.ha));
					if (!c || c.length == 0)
						return;
					c = c
				}
				if (h(c, e, m, g)) {
					if (!e.B || e.B && e.c.C == 0) {
						var q = P.ja(e.Y), r = (0.05 + Math.pow(e.C, 0.5) * 0.95)
								* (typeof e.c != "undefined" && !e.c.I ? a.Xb
										: 1);
						g.fillStyle = p(q.h, q.s, q.l, q.a * r);
						var n = a.cd;
						if (!m && e.o && a.Sb != "none" && n > 0 && a.Wa > 0) {
							m = e.Db;
							if (!m) {
								m = Q.ia(e.n);
								e.Db = m
							}
							var w = Math.sqrt(Q.za(m, e.n[0]));
							m = g.createRadialGradient(m.x, m.y, 10, m.x, m.y,
									w * 2);
							if (a.Sb == "lightening") {
								m.addColorStop(0, p(q.h, q.s, Math.min(100, q.l
										+ n * 50), q.a * r));
								m.addColorStop(a.Wa, g.fillStyle)
							} else {
								m.addColorStop(0, g.fillStyle);
								m.addColorStop(a.Wa, p(q.h, q.s, Math.max(0,
										q.l - n * 50), q.a * r))
							}
							g.fillStyle = m
						}
						g.fill();
						if (e.selected) {
							g.fillStyle = a.fd;
							g.fill()
						}
					}
					if (e.selected && a.da > 2) {
						g.lineWidth = (a.da - 2 || 1) * Math.pow(a.Ba, e.M.ha);
						g.strokeStyle = a.gd;
						g.stroke()
					}
					o && k(e, c, g)
				}
			}
		}
		function k(e, g, m) {
			var c = e.c ? e.c.u.j : Q.Ka(e.n).j;
			if (e.O !== undefined)
				g = e.O.u;
			else {
				g = Q.jd(g);
				if (a.Xa < 1 && g.j / c > a.Xa) {
					var o = g.j;
					g.j = c * a.Xa;
					g.y += (o - g.j) / 2
				}
				e.O = {
					u : g
				}
			}
			o = a.hc !== undefined ? c * a.hc / 100 + 0.5 | 0 : a.fa;
			c = a.gc !== undefined ? c * a.gc / 100 + 0.5 | 0 : a.ea;
			var q = g, r = a.ab == 0 ? a.bc : a.ab == 1 ? a.cc
					: P.Cc(e.Y) >= a.ab ? a.bc : a.cc;
			e.Ca = P.Ma(r);
			if (e.p)
				e.label = e.p.label;
			if (a.Vb && (e.p || 1)) {
				r = {
					labelText : e.label,
					labelColor : e.Ca
				};
				var n = d(e);
				n.boxWidth = q.k;
				n.boxHeight = q.j;
				a.Vb(a, n, r);
				e.Ca = P.Ha(r.labelColor);
				e.label = r.labelText
			}
			if (e.label || e.v) {
				q = s(e.Ca, e.Ca.a
						* (typeof e.c != "undefined" && !e.c.I ? a.Xb : 1));
				if (e.v)
					if (e.label && Math.min(g.k, g.j) > 50) {
						r = e.v;
						var w;
						if (g.k > g.j * 1.1) {
							n = Math.min(1, 0.3 * g.k / r.width);
							w = n < 1 ? 0.05 : 0.1;
							g = {
								v : {
									x : g.x + g.k * w,
									y : g.y + (g.j - r.height * n) / 2,
									k : r.width * n,
									j : r.height * n
								},
								text : {
									x : g.x + g.k * w + r.width * n * 1.1,
									y : g.y + (g.j - r.height * n) / 2,
									k : (1 - 2 * w) * g.k - r.width * n * 1.1,
									j : r.height * n,
									Cb : false
								}
							}
						} else {
							n = Math.min(1, 0.3 * g.j / r.height);
							w = n < 1 ? 0.05 : 0.1;
							g = {
								v : {
									x : g.x + (g.k - r.width * n) / 2,
									y : g.y + g.j * w,
									k : r.width * n,
									j : r.height * n
								},
								text : {
									x : g.x + w * g.k,
									y : g.y + g.j * w + r.height * n * 1.1,
									k : g.k * (1 - 2 * w),
									j : (1 - 2 * w) * g.j - r.height * n * 1.1,
									Cb : true
								}
							}
						}
						m[t](e.v, g.v.x, g.v.y, g.v.k, g.v.j);
						ca.Ra(m, e.label, g.text, a.Rb, o, c, a.Wb, q,
								g.text.Cb, e.O)
					} else {
						o = Math.min(1, Math.min(g.k / e.v.width, g.j
								/ e.v.height));
						m[t](e.v, g.x + (g.k - e.v.width * o) / 2, g.y
								+ (g.j - e.v.height * o) / 2, e.v.width * o,
								e.v.height * o)
					}
				else
					ca.Ra(m, e.label, g, a.Rb, o, c, a.Wb, q, true, e.O)
			}
		}
		function l(e, g) {
			g.beginPath();
			var m = e[0];
			g.moveTo(m.x, m.y);
			for ( var c = 1; c < e.length; c++) {
				m = e[c];
				g.lineTo(m.x, m.y)
			}
			g.closePath()
		}
		function h(e, g, m, c) {
			var o = m && !a.Jd ? 0 : Math.min(1, 0.75 * a.Pb);
			if (o > 0) {
				var q = 0, r = 0;
				if (g.c) {
					var n = g.c.e;
					for (m = 0; m < n.length; m++)
						if (n[m].Ab) {
							q += n[m].Ab;
							r++
						}
				}
				if (r > 0)
					q /= r;
				else
					q = Number.MAX_VALUE;
				var w;
				r = [];
				var I = 0, D = 0;
				for (m = 0; m < e.length; m++) {
					n = e[m];
					w = e[(m + 1) % e.length];
					n = Q.za(n, w);
					if (n > 9) {
						n = Math.sqrt(n);
						r.push(n);
						I += n;
						D++
					} else
						r.push(0)
				}
				o = Math.min(q, o
						* ((c.canvas.width + c.canvas.height) / 100 + o * 0.5
								* I / D));
				I = [];
				D = [];
				q = o / 3;
				for (m = 0; m < e.length; m++) {
					n = r[m];
					if (n > q) {
						I.push(e[m]);
						D.push(n)
					}
				}
				if (I.length < 3)
					return false;
				var z, F;
				e = {};
				var u = {}, v = {};
				r = q = 0;
				c.beginPath();
				for (m = 0; m < I.length; m++) {
					n = I[m];
					w = I[(m + 1) % I.length];
					z = I[(m + 2) % I.length];
					F = D[(m + 1) % I.length];
					var E = Math.min(0.5, o / F);
					Q.pa(1 - E, w, z, u);
					Q.pa(E, w, z, v);
					q += F * E;
					r++;
					if (m == 0) {
						z = D[0];
						F = Math.min(0.5, o / z);
						Q.pa(F, n, w, e);
						q += z * F;
						r++;
						c.moveTo(e.x, e.y)
					}
					c.quadraticCurveTo(w.x, w.y, u.x, u.y);
					c.lineTo(v.x, v.y)
				}
				g.Ab = q / r
			} else
				l(e, c);
			return true
		}
		function s(e, g) {
			if (typeof e == "string")
				return e;
			else {
				if (e.model == "hsl" || e.model == "hsla")
					return p(e.h, e.s, e.l, g);
				if (e.model == "rgb" || e.model == "rgba")
					return "rgba(" + e.r + ", " + e.g + ", " + e.b + ", "
							+ (g === undefined ? 1 : g.toFixed(2)) + ")"
			}
			return "#000"
		}
		function p(e, g, m, c) {
			return "hsla(" + e.toFixed(2) + ", " + g.toFixed(2) + "%, "
					+ m.toFixed(2) + "%, "
					+ (c === undefined ? 1 : c.toFixed(2)) + ")"
		}
		var t = P.kb("es`vHl`fd");
		this.clear = function(e) {
			var g = e.canvas, m = 1 / g.scale;
			e.clearRect(0, 0, g.width * m, e.canvas.height * m);
			if (a.backgroundColor) {
				e.fillStyle = a.backgroundColor;
				e.fillRect(0, 0, e.canvas.width * m, e.canvas.height * m)
			}
		};
		this.X = function(e, g, m) {
			var c = e.parent;
			c || this.clear(g);
			f(e, c ? c.Y : undefined);
			c = e.e;
			var o, q;
			for (o = 0; o < e.slice; o++) {
				q = c[o];
				q.c && !q.c.I && q.c.C > 0 && this.X(q.c, g, m)
			}
			for (o = 0; o < e.slice; o++) {
				q = c[o];
				j(q, g, m)
			}
		};
		this.Sc = function(e, g, m) {
			function c(n) {
				g.beginPath();
				for ( var w = false, I = 0; I < n.slice; I++) {
					var D = n.e[I];
					if (!D.mb) {
						w = D.n;
						D = g;
						var z = w[0];
						D.moveTo(z.x, z.y);
						for ( var F = 1; F <= w.length; F++) {
							z = w[F] || w[0];
							D.lineTo(z.x, z.y)
						}
						w = true
					}
				}
				w && g.fill()
			}
			if (a.ae) {
				var o = true, q, r;
				for (q = 0; q < e.e.length; q++) {
					r = e.e[q];
					if (e.c && e.c.Ua || !e.c && r.o) {
						o = false;
						break
					}
				}
				if (o)
					this.X(e, g, m);
				else {
					o = a.Ia.a;
					if (o < 1) {
						g.fillStyle = "#fff";
						g.globalCompositeOperation = "destination-out";
						c(e);
						g.globalCompositeOperation = "source-over"
					}
					if (o > 0) {
						g.fillStyle = a.backgroundColor;
						c(e)
					}
					f(e, undefined);
					for (q = 0; q < e.slice; q++) {
						r = e.e[q];
						if (!r.mb) {
							b(r, g, m);
							r.mb = r.c && r.c.Ua || !r.c && r.o
						}
					}
				}
			} else
				this.X(e, g, m)
		};
		this.va = function(e, g, m) {
			var c = a.Ia.a;
			if (c < 1) {
				g.fillStyle = "#fff";
				g.globalCompositeOperation = "destination-out";
				l(e.n, g);
				g.fill();
				g.globalCompositeOperation = "source-over"
			}
			if (c > 0) {
				g.fillStyle = a.backgroundColor;
				l(e.n, g);
				g.fill()
			}
			b(e, g, m)
		};
		this.Tc = function(e, g) {
			if (h(e.n, e, false, g)) {
				g.fillStyle = a.dd;
				g.strokeStyle = a.ed;
				g.lineWidth = a.da / 4 * Math.pow(a.Ba, e.M.ha);
				g.fill();
				g.stroke();
				if (e.O && e.O.bb && e.O.bb.na < a.nd) {
					var m = a.$d, c = a.Zd, o = a.Wd, q = o + 2 * m, r;
					r = e.y < g.canvas.height / 2 ? g.canvas.height - q : 0;
					var n = g.canvas.width - 2 * c, w = a.tc, I = e.label;
					if (a.sc) {
						I = {
							titleBarText : I,
							titleBarTextColor : P.Ma(a.Yd)
						};
						e = d(e);
						e.boxWidth = n;
						e.boxHeight = o;
						a.sc(a, e, I);
						w = s(P.Ha(I.titleBarTextColor), undefined);
						I = I.titleBarText
					}
					g.fillStyle = a.Ud;
					g.fillRect(0, r, g.canvas.width, q);
					ca.Ra(g, I, {
						x : c,
						y : r + m,
						k : n,
						j : o
					}, a.Vd, a.Xd, o, 1, w, true, {})
				}
			}
		};
		return this
	}
	var ka = new (function() {
		this.kd = function(a, b) {
			function f(F) {
				for ( var u = F.length, v = 0; v < u; v++) {
					F[v].next = F[(v + 1) % u];
					F[v].nc = F[(u + v - 1) % u]
				}
			}
			function i(F, u, v, E) {
				z.push( {
					x : F.x,
					y : F.y
				});
				return v > 0 ? -1 : E > 0 ? 1 : u
			}
			function d(F, u, v, E) {
				v && z.push( {
					x : E.x,
					y : E.y
				});
				if (u == 0)
					s++;
				else
					u == 1 && p++;
				return F.next
			}
			var j = a.length, k = b.length, l = a[j - 1], h = b[k - 1], s = 0, p = 0, t = 0, e = true, g, m, c, o, q, r, n, w, I, D, z = [];
			f(a);
			f(b);
			do {
				a = l.nc;
				b = h.nc;
				c = a.x;
				o = a.y;
				q = b.x;
				r = b.y;
				n = l.x;
				w = l.y;
				I = h.x;
				D = h.y;
				n = (n - c) * (D - r) - (I - q) * (w - o);
				n = n < -0.5 ? -1 : n > 0.5 ? 1 : 0;
				q = (h.x - q) * (l.y - r) - (l.x - q) * (h.y - r);
				q = q < -0.5 ? -1 : q > 0.5 ? 1 : 0;
				c = (l.x - c) * (h.y - o) - (h.x - c) * (l.y - o);
				c = c < -0.5 ? -1 : c > 0.5 ? 1 : 0;
				if (a = Q.ac(a, l, b, h, false)) {
					if (t == 0 && e) {
						s = p = 0;
						e = false;
						g = a.x;
						m = a.y;
						z.push( {
							x : g,
							y : m
						})
					}
					t = i(a, t, q, c)
				}
				if (n == 0 && q < 0 && c < 0)
					return;
				else if (n == 0 && q == 0 && c == 0)
					if (t == -1)
						h = d(h, 1, t == 1, h);
					else
						l = d(l, 0, t == -1, l);
				else if (n >= 0)
					if (c > 0)
						l = d(l, 0, t == -1, l);
					else
						h = d(h, 1, t == 1, h);
				else if (q > 0)
					h = d(h, 1, t == 1, h);
				else
					l = d(l, 0, t == -1, l)
			} while ((s < j || p < k) && s < 2 * j && p < 2 * k);
			e || z.push( {
				x : g,
				y : m
			});
			if (t != 0)
				return z
		};
		return this
	}), ea = new (function() {
		function a(d, j) {
			for ( var k = d.slice(0), l = 0; l < d.length; l++) {
				var h = d[l % d.length], s = d[(l + 1) % d.length], p = f(h, s,
						j);
				k = b(k, {
					x : h.x - p.y,
					y : h.y + p.x
				}, {
					x : s.x - p.y,
					y : s.y + p.x
				});
				if (k.length < 3)
					return []
			}
			return k
		}
		function b(d, j, k) {
			function l(m, c) {
				m = m.x * c.y - c.x * m.y;
				return m <= 0.001 && m >= -0.001 ? 0 : m
			}
			if (d.length == 0)
				return d;
			var h = {
				x : j.x - k.x,
				y : j.y - k.y
			}, s = [], p = true, t = true, e;
			for (e = 0; e < d.length; e++) {
				var g = l(h, {
					x : j.x - d[e].x,
					y : j.y - d[e].y
				});
				s.push(g);
				if (g > 0)
					p = false;
				if (g < 0)
					t = false
			}
			if (p)
				return [];
			else if (t)
				return d;
			else {
				h = [];
				for (e = 0; e < d.length; e++) {
					p = (e + 1) % d.length;
					t = s[e];
					g = s[p];
					t >= 0 && h.push(d[e]);
					if (t > 0 && g < 0 || t < 0 && g > 0)
						h.push(i(d[e], d[p], j, k))
				}
				return h
			}
		}
		function f(d, j, k) {
			var l = j.x - d.x;
			d = j.y - d.y;
			j = Math.sqrt(l * l + d * d);
			return {
				x : k * l / j,
				y : k * d / j
			}
		}
		function i(d, j, k, l) {
			var h = d.x;
			d = d.y;
			var s = j.x;
			j = j.y;
			var p = k.x;
			k = k.y;
			var t = l.x;
			l = l.y;
			var e = (h - s) * (k - l) - (d - j) * (p - t);
			if (!(Math.abs(e) < 0.001))
				return {
					x : ((h * j - d * s) * (p - t) - (h - s) * (p * l - k * t))
							/ e,
					y : ((h * j - d * s) * (k - l) - (d - j) * (p * l - k * t))
							/ e
				}
		}
		this.ic = function(d, j) {
			d = d;
			for ( var k = [], l = 0; l < d.length; l++) {
				var h = d[l % d.length], s = d[(l + 1) % d.length], p = d[(l + 2)
						% d.length];
				s = (s.x - h.x) * (p.y - h.y) - (p.x - h.x) * (s.y - h.y);
				k.push(h);
				Math.abs(s) < 0.001 && l++
			}
			d = k;
			a: {
				k = d;
				l = true;
				if (l == undefined)
					l = false;
				h = [];
				for (s = 0; s <= k.length; s++) {
					p = k[s % k.length];
					var t = k[(s + 1) % k.length], e = k[(s + 2) % k.length], g = f(
							p, t, j), m = f(t, e, j);
					if (p = i( {
						x : p.x - g.y,
						y : p.y + g.x
					}, {
						x : t.x - g.y,
						y : t.y + g.x
					}, {
						x : t.x - m.y,
						y : t.y + m.x
					}, {
						x : e.x - m.y,
						y : e.y + m.x
					})) {
						h.push(p);
						if (l && h.length >= 3) {
							p = h[h.length - 3];
							t = h[h.length - 2];
							e = h[h.length - 1];
							if ((t.x - p.x) * (e.y - p.y) - (e.x - p.x)
									* (t.y - p.y) < 0) {
								k = void 0;
								break a
							}
						}
					}
				}
				k = h
			}
			return k || a(d, j)
		};
		return this
	}), ca = new (function() {
		function a(d, j, k, l, h, s, p, t, e, g) {
			e = typeof e != "undefined" ? e : true;
			var m = g.bb;
			if (!m) {
				d.textBaseline = "top";
				h = h;
				s = s;
				var c, o;
				if (s - h <= 1)
					for (c = s; c >= h; c--) {
						o = b(d, j, c, l, c + p, k);
						if (!(o.qb || !o.ya)) {
							m = o;
							break
						}
					}
				else
					for (; s - h > 1;) {
						c = Math.floor((s + h) / 2);
						o = b(d, j, c, l, c + p, k);
						if (o.qb || !o.ya)
							s = c;
						else {
							h = c;
							m = o
						}
					}
				m || (m = o);
				if (m) {
					if (m.qb && m.K.length > 0) {
						d.font = m.na + "px " + l;
						o = m.K[m.K.length - 1];
						for (s = o.text; s.length > 0;) {
							for (j = s.length - 1; j > 0
									&& s.charCodeAt(j) == " ";)
								j--;
							s = s.substring(0, j);
							j = f(d, s + "\u2026", k.k);
							if (j.rc.length == 0) {
								m.K.pop();
								j.x = 0;
								j.y = o.y;
								m.K.push(j);
								break
							}
						}
					}
					o = 0;
					s = m.na + p;
					for (p = 0; p < m.K.length; p++) {
						j = m.K[p];
						o = Math.max(j.y + s, o)
					}
					j = (k.j - o) / 2;
					for (p = 0; p < m.K.length; p++)
						m.K[p].y += j;
					if (e)
						for (p = 0; p < m.K.length; p++) {
							j = m.K[p];
							j.x = (k.k - j.width) / 2
						}
					g.bb = m
				}
			}
			if (m) {
				if(m.na<18)   m.na=18;//ÈÃ×ÖÌå²»»áÌ«Ð¡
				d.font = m.na + "px " + l;
				d.fillStyle = t;
				for (p = 0; p < m.K.length; p++) {
					j = m.K[p];
					d.fillText(j.text, k.x + j.x, k.y + j.y + (i ? 0.1 : -0.1)
							* m.na)
				}
			}
		}
		function b(d, j, k, l, h, s) {
			d.font = k + "px " + l;
			l = 0;
			for ( var p = [], t = true;;) {
				if (j.length == 0 || l + h > s.j)
					break;
				var e = f(d, j, s.k);
				e.x = 0;
				e.y = l;
				p.push(e);
				j = e.rc;
				t = t && e.ya;
				l += h
			}
			return {
				K : p,
				na : k,
				qb : j.length > 0,
				ya : t
			}
		}
		function f(d, j, k) {
			j = j.trim();
			for ( var l = 0, h = j.length + 1; h - l > 1;) {
				var s = Math.floor((h + l) / 2), p = d.measureText(j.substring(
						0, s)).width;
				if (p == k) {
					l = s;
					break
				}
				if (p < k)
					l = s;
				else
					h = s
			}
			k = true;
			if (l < j.length) {
				for (h = l; h > 0 && j.charAt(h) != " ";)
					h--;
				if (k = h > 0)
					l = h
			}
			h = j.substring(0, l);
			return {
				text : h,
				width : d.measureText(h).width,
				rc : j.substring(l).trim(),
				ya : k
			}
		}
		this.Ra = a;
		var i = /Firefox/.test(navigator.userAgent);
		return this
	}), Q = new (function() {
		function a(b, f) {
			var i = b.x - f.x;
			b = b.y - f.y;
			return i * i + b * b
		}
		this.ac = function(b, f, i, d, j) {
			var k = b.x;
			b = b.y;
			var l = f.x - k;
			f = f.y - b;
			var h = i.x, s = i.y;
			i = d.x - h;
			var p = d.y - s;
			d = l * p - i * f;
			if (!(d <= 1.0E-5 && d >= -1.0E-5)) {
				h = h - k;
				s = s - b;
				i = (h * p - i * s) / d;
				d = (h * f - l * s) / d;
				if (0 <= d && (j || d <= 1) && 0 <= i && i <= 1)
					return {
						x : k + l * i,
						y : b + f * i
					}
			}
		};
		this.cb = function(b, f, i) {
			function d(m, c, o) {
				for ( var q = 0; q < m.length; q++) {
					var r = Q.ac(m[q], m[q + 1] || m[0], c, o, true);
					if (r)
						return r
				}
			}
			function j(m, c, o, q, r) {
				var n = o.x - c.x;
				o = o.y - c.y;
				n = Math.sqrt(n * n + o * o);
				if (n > 1.0E-5) {
					o = m.x - c.x;
					c = m.y - c.y;
					c = Math.sqrt(o * o + c * c) / n;
					m.x = q.x + c * (r.x - q.x);
					m.y = q.y + c * (r.y - q.y)
				} else {
					m.x = q.x;
					m.y = q.y
				}
			}
			var k = Q.ia(f), l = Q.ia(i), h, s = l.x - k.x, p = l.y - k.y, t = [];
			for (l = 0; l < i.length; l++) {
				h = i[l];
				t.push( {
					x : h.x - s,
					y : h.y - p
				})
			}
			i = [];
			h = [];
			for (l = 0; l < b.length; l++) {
				var e = b[l], g = d(f, k, e);
				if (g) {
					i.push(g);
					h.push(d(t, k, e))
				} else {
					i.push(null);
					h.push(null)
				}
			}
			for (l = 0; l < b.length; l++) {
				f = i[l];
				t = h[l];
				f && t && j(b[l], k, f, k, t)
			}
			for (l = 0; l < b.length; l++) {
				h = b[l];
				h.x += s;
				h.y += p
			}
		};
		this.Ka = function(b) {
			if (b.length == 0)
				throw "Bounding box of an empty set of points does not exist.";
			var f, i, d, j;
			f = i = b[0].x;
			d = j = b[0].y;
			for ( var k = b.length; --k > 0;) {
				f = Math.min(f, b[k].x);
				i = Math.max(i, b[k].x);
				d = Math.min(d, b[k].y);
				j = Math.max(j, b[k].y)
			}
			return {
				x : f,
				y : d,
				k : i - f,
				j : j - d
			}
		};
		this.jd = function(b) {
			function f(t, e, g, m) {
				var c = 0;
				for (e = e.k; e - c > 5;) {
					var o = (e + c) / 2, q = o * g;
					if (i(t, m.x - o / 2, m.y - q / 2)
							&& i(t, m.x - o / 2 + o, m.y - q / 2)
							&& i(t, m.x - o / 2 + o, m.y - q / 2 + q)
							&& i(t, m.x - o / 2, m.y - q / 2 + q))
						c = o;
					else
						e = o
				}
				return c
			}
			function i(t, e, g) {
				var m = t.length, c, o, q = false;
				c = 0;
				for (o = m - 1; c < m; o = c++)
					if (t[c].y > g != t[o].y > g
							&& e < (t[o].x - t[c].x) * (g - t[c].y)
									/ (t[o].y - t[c].y) + t[c].x)
						q = !q;
				return q
			}
			for ( var d = 0, j = 0, k, l, h = Q.ia(b), s = this.Ka(b), p = 0.05; p < 1; p += 0.095) {
				k = f(b, s, p, h);
				l = k * k * p;
				if (l > j * j * d) {
					j = k;
					d = p
				}
			}
			b = j * d;
			return {
				x : h.x - j / 2,
				y : h.y - b / 2,
				k : j,
				j : b
			}
		};
		this.ia = function(b) {
			for ( var f = 0, i = 0, d = 0, j = 0; j < b.length; j++) {
				var k = b[j], l = b[j + 1] || b[0], h = k.x * l.y - l.x * k.y;
				f += h;
				i += (k.x + l.x) * h;
				d += (k.y + l.y) * h
			}
			return {
				x : i / (3 * f),
				y : d / (3 * f)
			}
		};
		this.ud = function(b) {
			for ( var f = 0, i = 0; i < b.length; i++) {
				var d = b[i], j = b[i + 1] || b[0];
				f += d.x * j.y - j.x * d.y
			}
			return f
		};
		this.jb = function(b) {
			var f, i, d, j;
			for (f = 0; f < b.length; f++) {
				i = b[f];
				i.x = 0.5 + i.x | 0;
				i.y = 0.5 + i.y | 0
			}
			for (f = 0; f < b.length;) {
				for (i = f + 1; i < b.length && a(b[f], b[i]) < 9; i++)
					;
				if (i != f + 1) {
					d = b[f];
					j = b[i - 1];
					d.x = 0.5 + (d.x + j.x) / 2 | 0;
					d.y = 0.5 + (d.y + j.y) / 2 | 0;
					b.splice(f + 1, i - f - 1);
					i--
				}
				f = i
			}
			if (b.length >= 2 && a(b[b.length - 1], b[0]) < 9) {
				d = b[0];
				j = b.pop();
				d.x = 0.5 + (d.x + j.x) / 2 | 0;
				d.y = 0.5 + (d.y + j.y) / 2 | 0
			}
			return b
		};
		this.eb = function(b, f) {
			for ( var i = 0; i < b.length; i++) {
				var d = b[i], j = b[i + 1] || b[0];
				if ((f.y - d.y) * (j.x - d.x) - (f.x - d.x) * (j.y - d.y) < 0)
					return false
			}
			return true
		};
		this.pa = function(b, f, i, d) {
			var j = 1 - b;
			d.x = f.x * b + i.x * j;
			d.y = f.y * b + i.y * j;
			return d
		};
		this.za = a;
		return this
	}), P = new (function() {
		this.kb = function(a) {
			for ( var b = "", f = 0; f < a.length; f++)
				b += String.fromCharCode(a.charCodeAt(f) ^ 1);
			return b
		};
		this.ca = function(a) {
			var b;
			if ((b = /rgba\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*\)/
					.exec(a))
					&& b.length == 5)
				return {
					r : parseFloat(b[1]),
					g : parseFloat(b[2]),
					b : parseFloat(b[3]),
					a : parseFloat(b[4]),
					model : "rgb"
				};
			if ((b = /hsla\(\s*([^,\s]+)\s*,\s*([^,%\s]+)%\s*,\s*([^,\s%]+)%\s*,\s*([^,\s]+)\s*\)/
					.exec(a))
					&& b.length == 5)
				return {
					h : parseFloat(b[1]),
					s : parseFloat(b[2]),
					l : parseFloat(b[3]),
					a : parseFloat(b[4]),
					model : "hsl"
				};
			if ((b = /rgb\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*\)/
					.exec(a))
					&& b.length == 4)
				return {
					r : parseFloat(b[1]),
					g : parseFloat(b[2]),
					b : parseFloat(b[3]),
					a : 1,
					model : "rgb"
				};
			if ((b = /hsl\(\s*([^,\s]+)\s*,\s*([^,\s%]+)%\s*,\s*([^,\s%]+)%\s*\)/
					.exec(a))
					&& b.length == 4)
				return {
					h : parseFloat(b[1]),
					s : parseFloat(b[2]),
					l : parseFloat(b[3]),
					a : 1,
					model : "hsl"
				};
			if ((b = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/
					.exec(a))
					&& b.length == 4)
				return {
					r : parseInt(b[1], 16),
					g : parseInt(b[2], 16),
					b : parseInt(b[3], 16),
					a : 1,
					model : "rgb"
				};
			if ((b = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(a))
					&& b.length == 4)
				return {
					r : parseInt(b[1], 16) * 17,
					g : parseInt(b[2], 16) * 17,
					b : parseInt(b[3], 16) * 17,
					a : 1,
					model : "rgb"
				};
			return {
				r : 0,
				g : 0,
				b : 0,
				a : 1,
				model : "rgb"
			}
		};
		this.Cc = function(a) {
			function b(k, l, h) {
				if (h < 0)
					h += 1;
				if (h > 1)
					h -= 1;
				if (h < 1 / 6)
					return k + (l - k) * 6 * h;
				if (h < 0.5)
					return l;
				if (h < 2 / 3)
					return k + (l - k) * (2 / 3 - h) * 6;
				return k
			}
			if (a.model == "rgb" || a.model == "rgba")
				return Math.sqrt(a.r * a.r * 0.241 + a.g * a.g * 0.691 + a.b
						* a.b * 0.068) / 255;
			else {
				var f, i;
				f = a.l / 100;
				var d = a.s / 100;
				i = a.h / 360;
				if (a.ge == 0)
					f = a = i = f;
				else {
					d = f < 0.5 ? f * (1 + d) : f + d - f * d;
					var j = 2 * f - d;
					f = b(j, d, i + 1 / 3);
					a = b(j, d, i);
					i = b(j, d, i - 1 / 3)
				}
				return Math.sqrt(f * 255 * f * 255 * 0.241 + a * 255 * a * 255
						* 0.691 + i * 255 * i * 255 * 0.068) / 255
			}
		};
		this.ja = function(a) {
			if (a.model == "hsl" || a.model == "hsla")
				return a;
			var b = a.r /= 255, f = a.g /= 255, i = a.b /= 255, d = Math.max(b,
					f, i), j = Math.min(b, f, i), k, l = (d + j) / 2;
			if (d == j)
				k = j = 0;
			else {
				var h = d - j;
				j = l > 0.5 ? h / (2 - d - j) : h / (d + j);
				switch (d) {
				case b:
					k = (f - i) / h + (f < i ? 6 : 0);
					break;
				case f:
					k = (i - b) / h + 2;
					break;
				case i:
					k = (b - f) / h + 4;
					break
				}
				k /= 6
			}
			a.h = k * 360;
			a.s = j * 100;
			a.l = l * 100;
			a.model = "hsl";
			return a
		};
		this.Ha = function(a) {
			if (typeof a.a == "undefined")
				a.a = 1;
			return a
		};
		this.Ma = function(a) {
			var b = {};
			for ( var f in a)
				if (a.hasOwnProperty(f))
					b[f] = a[f];
			return b
		};
		this.Ya = function(a, b) {
			return a && typeof a[b] != "undefined"
		};
		this.Hb = function(a, b, f) {
			return this.Ya(a, b) ? a[b] : f
		};
		this.Zb = function(a, b) {
			for ( var f = 0; f < b.length; f++)
				if (this.Ya(a, b[f]))
					return true;
			return false
		};
		this.Ga = function(a) {
			var b = Date.now();
			a();
			return Date.now() - b
		}
	});
	M.prototype.reset = function() {
		if (!this.P)
			this.P = new this.W;
		if (this.P.G)
			for ( var a = this.P.Va(this.P.G); a;) {
				this.Ja.push(a);
				a = a.z
			}
		this.P.G = null;
		if (!this.la)
			this.la = new this.W;
		this.la.G = this.Sa = null;
		this.ba = [];
		this.cells = []
	};
	M.prototype.sqrt = Math.sqrt;
	M.prototype.abs = Math.abs;
	M.prototype.T = function(a, b) {
		return this.abs(a - b) < 1.0E-9
	};
	M.prototype.Ob = function(a, b) {
		return a - b > 1.0E-9
	};
	M.prototype.fc = function(a, b) {
		return b - a > 1.0E-9
	};
	M.prototype.W = function() {
		this.G = null
	};
	M.prototype.W.prototype.gb = function(a, b) {
		var f;
		if (a) {
			b.F = a;
			if (b.z = a.z)
				a.z.F = b;
			a.z = b;
			if (a.i) {
				for (a = a.i; a.f;)
					a = a.f;
				a.f = b
			} else
				a.i = b;
			f = a
		} else if (this.G) {
			a = this.Va(this.G);
			b.F = null;
			b.z = a;
			a.F = b;
			a.f = b;
			f = a
		} else {
			b.F = b.z = null;
			this.G = b;
			f = null
		}
		b.f = b.i = null;
		b.q = f;
		b.d = true;
		var i;
		for (a = b; f && f.d;) {
			b = f.q;
			if (f === b.f)
				if ((i = b.i) && i.d) {
					f.d = i.d = false;
					b.d = true;
					a = b
				} else {
					if (a === f.i) {
						this.ta(f);
						a = f;
						f = a.q
					}
					f.d = false;
					b.d = true;
					this.ua(b)
				}
			else if ((i = b.f) && i.d) {
				f.d = i.d = false;
				b.d = true;
				a = b
			} else {
				if (a === f.f) {
					this.ua(f);
					a = f;
					f = a.q
				}
				f.d = false;
				b.d = true;
				this.ta(b)
			}
			f = a.q
		}
		this.G.d = false
	};
	M.prototype.W.prototype.oc = function(a) {
		if (a.z)
			a.z.F = a.F;
		if (a.F)
			a.F.z = a.z;
		a.z = a.F = null;
		var b = a.q, f = a.f, i = a.i, d;
		d = f ? i ? this.Va(i) : f : i;
		if (b)
			if (b.f === a)
				b.f = d;
			else
				b.i = d;
		else
			this.G = d;
		var j;
		if (f && i) {
			j = d.d;
			d.d = a.d;
			d.f = f;
			f.q = d;
			if (d !== i) {
				b = d.q;
				d.q = a.q;
				a = d.i;
				b.f = a;
				d.i = i;
				i.q = d
			} else {
				d.q = b;
				b = d;
				a = d.i
			}
		} else {
			j = a.d;
			a = d
		}
		if (a)
			a.q = b;
		if (!j)
			if (a && a.d)
				a.d = false;
			else {
				do {
					if (a === this.G)
						break;
					if (a === b.f) {
						a = b.i;
						if (a.d) {
							a.d = false;
							b.d = true;
							this.ta(b);
							a = b.i
						}
						if (a.f && a.f.d || a.i && a.i.d) {
							if (!a.i || !a.i.d) {
								a.f.d = false;
								a.d = true;
								this.ua(a);
								a = b.i
							}
							a.d = b.d;
							b.d = a.i.d = false;
							this.ta(b);
							a = this.G;
							break
						}
					} else {
						a = b.f;
						if (a.d) {
							a.d = false;
							b.d = true;
							this.ua(b);
							a = b.f
						}
						if (a.f && a.f.d || a.i && a.i.d) {
							if (!a.f || !a.f.d) {
								a.i.d = false;
								a.d = true;
								this.ta(a);
								a = b.f
							}
							a.d = b.d;
							b.d = a.f.d = false;
							this.ua(b);
							a = this.G;
							break
						}
					}
					a.d = true;
					a = b;
					b = b.q
				} while (!a.d);
				if (a)
					a.d = false
			}
	};
	M.prototype.W.prototype.ta = function(a) {
		var b = a.i, f = a.q;
		if (f)
			if (f.f === a)
				f.f = b;
			else
				f.i = b;
		else
			this.G = b;
		b.q = f;
		a.q = b;
		a.i = b.f;
		if (a.i)
			a.i.q = a;
		b.f = a
	};
	M.prototype.W.prototype.ua = function(a) {
		var b = a.f, f = a.q;
		if (f)
			if (f.f === a)
				f.f = b;
			else
				f.i = b;
		else
			this.G = b;
		b.q = f;
		a.q = b;
		a.f = b.i;
		if (a.f)
			a.f.q = a;
		b.i = a
	};
	M.prototype.W.prototype.Va = function(a) {
		for (; a.f;)
			a = a.f;
		return a
	};
	M.prototype.wb = function(a) {
		this.m = a;
		this.ga = []
	};
	M.prototype.wb.prototype.sa = function() {
		for ( var a = this.ga, b = a.length, f; b--;) {
			f = a[b].A;
			if (!f.H || !f.D)
				a.splice(b, 1)
		}
		a.sort(function(i, d) {
			return d.xa - i.xa
		});
		return a.length
	};
	M.prototype.t = function(a, b) {
		this.x = a;
		this.y = b
	};
	M.prototype.xb = function(a, b) {
		this.U = a;
		this.Da = b;
		this.D = this.H = null
	};
	M.prototype.ka = function(a, b, f) {
		this.m = b;
		this.A = a;
		if (f)
			this.xa = Math.atan2(f.y - b.y, f.x - b.x);
		else {
			f = a.D;
			var i = a.H;
			this.xa = a.U === b ? Math.atan2(i.x - f.x, f.y - i.y) : Math
					.atan2(f.x - i.x, i.y - f.y)
		}
	};
	M.prototype.ka.prototype.bd = function() {
		return this.A.U === this.m ? this.A.D : this.A.H
	};
	M.prototype.ka.prototype.ad = function() {
		return this.A.U === this.m ? this.A.H : this.A.D
	};
	M.prototype.ma = function(a, b, f, i) {
		var d = new this.xb(a, b);
		this.ba.push(d);
		f && this.Fa(d, a, b, f);
		i && this.Nd(d, a, b, i);
		this.cells[a.Z].ga.push(new this.ka(d, a, b));
		this.cells[b.Z].ga.push(new this.ka(d, b, a));
		return d
	};
	M.prototype.Lc = function(a, b, f) {
		a = new this.xb(a, null);
		a.D = b;
		a.H = f;
		this.ba.push(a);
		return a
	};
	M.prototype.Fa = function(a, b, f, i) {
		if (!a.D && !a.H) {
			a.D = i;
			a.U = b;
			a.Da = f
		} else if (a.U === f)
			a.H = i;
		else
			a.D = i
	};
	M.prototype.Nd = function(a, b, f, i) {
		this.Fa(a, f, b, i)
	};
	M.prototype.vc = function() {
	};
	M.prototype.Fb = function(a) {
		var b = this.Ja.pop();
		b || (b = new this.vc);
		b.m = a;
		return b
	};
	M.prototype.ec = function(a, b) {
		var f = a.m, i = f.x, d = f.y, j = d - b;
		if (!j)
			return i;
		a = a.F;
		if (!a)
			return -Infinity;
		f = a.m;
		a = f.x;
		f = f.y;
		b = f - b;
		if (!b)
			return a;
		var k = a - i, l = 1 / j - 1 / b, h = k / b;
		if (l)
			return (-h + this.sqrt(h * h - 2 * l
					* (k * k / (-2 * b) - f + b / 2 + d - j / 2)))
					/ l + i;
		return (i + a) / 2
	};
	M.prototype.Ed = function(a, b) {
		var f = a.z;
		if (f)
			return this.ec(f, b);
		a = a.m;
		return a.y === b ? a.x : Infinity
	};
	M.prototype.Pa = function(a) {
		this.aa(a);
		this.P.oc(a);
		this.Ja.push(a)
	};
	M.prototype.Cd = function(a) {
		var b = a.Q, f = b.x, i = b.ub;
		b = new this.t(f, i);
		var d = a.F, j = a.z, k = [ a ], l = Math.abs;
		this.Pa(a);
		for (a = d; a.Q && l(f - a.Q.x) < 1.0E-9 && l(i - a.Q.ub) < 1.0E-9;) {
			d = a.F;
			k.unshift(a);
			this.Pa(a);
			a = d
		}
		k.unshift(a);
		this.aa(a);
		for (d = j; d.Q && l(f - d.Q.x) < 1.0E-9 && l(i - d.Q.ub) < 1.0E-9;) {
			j = d.z;
			k.push(d);
			this.Pa(d);
			d = j
		}
		k.push(d);
		this.aa(d);
		f = k.length;
		for (i = 1; i < f; i++) {
			d = k[i];
			a = k[i - 1];
			this.Fa(d.A, a.m, d.m, b)
		}
		a = k[0];
		d = k[f - 1];
		d.A = this.ma(a.m, d.m, undefined, b);
		this.$(a);
		this.$(d)
	};
	M.prototype.xc = function(a) {
		for ( var b = a.x, f = a.y, i, d, j, k, l = this.P.G; l;) {
			j = this.ec(l, f) - b;
			if (j > 1.0E-9)
				l = l.f;
			else {
				k = b - this.Ed(l, f);
				if (k > 1.0E-9) {
					if (!l.i) {
						i = l;
						break
					}
					l = l.i
				} else {
					if (j > -1.0E-9) {
						i = l.F;
						d = l
					} else if (k > -1.0E-9) {
						i = l;
						d = l.z
					} else
						i = d = l;
					break
				}
			}
		}
		b = this.Fb(a);
		this.P.gb(i, b);
		if (i || d)
			if (i === d) {
				this.aa(i);
				d = this.Fb(i.m);
				this.P.gb(b, d);
				b.A = d.A = this.ma(i.m, b.m);
				this.$(i);
				this.$(d)
			} else if (i && !d)
				b.A = this.ma(i.m, b.m);
			else if (i !== d) {
				this.aa(i);
				this.aa(d);
				f = i.m;
				k = f.x;
				l = f.y;
				var h = a.x - k, s = a.y - l;
				j = d.m;
				var p = j.x - k, t = j.y - l, e = 2 * (h * t - s * p), g = h
						* h + s * s, m = p * p + t * t;
				k = new this.t((t * g - s * m) / e + k, (h * m - p * g) / e + l);
				this.Fa(d.A, f, j, k);
				b.A = this.ma(f, a, undefined, k);
				d.A = this.ma(a, j, undefined, k);
				this.$(i);
				this.$(d)
			}
	};
	M.prototype.wc = function() {
	};
	M.prototype.$ = function(a) {
		var b = a.F, f = a.z;
		if (b && f) {
			var i = b.m;
			b = a.m;
			var d = f.m;
			if (i !== d) {
				f = b.x;
				var j = b.y, k = i.x - f, l = i.y - j;
				i = d.x - f;
				var h = d.y - j;
				d = 2 * (k * h - l * i);
				if (!(d >= -2.0E-12)) {
					var s = k * k + l * l, p = i * i + h * h;
					l = (h * s - l * p) / d;
					k = (k * p - i * s) / d;
					i = k + j;
					(j = this.Eb.pop()) || (j = new this.wc);
					j.arc = a;
					j.m = b;
					j.x = l + f;
					j.y = i + this.sqrt(l * l + k * k);
					j.ub = i;
					a.Q = j;
					a = null;
					for (b = this.la.G; b;)
						if (j.y < b.y || j.y === b.y && j.x <= b.x)
							if (b.f)
								b = b.f;
							else {
								a = b.F;
								break
							}
						else if (b.i)
							b = b.i;
						else {
							a = b;
							break
						}
					this.la.gb(a, j);
					if (!a)
						this.Sa = j
				}
			}
		}
	};
	M.prototype.aa = function(a) {
		var b = a.Q;
		if (b) {
			if (!b.F)
				this.Sa = b.z;
			this.la.oc(b);
			this.Eb.push(b);
			a.Q = null
		}
	};
	M.prototype.Kc = function(a, b) {
		var f = a.H;
		if (f)
			return true;
		var i = a.D;
		f = b.rb;
		var d = b.sb, j = b.vb;
		b = b.tb;
		var k = a.U, l = a.Da, h = k.x;
		k = k.y;
		var s = l.x;
		l = l.y;
		var p = (h + s) / 2, t = (k + l) / 2, e, g;
		if (l !== k) {
			e = (h - s) / (l - k);
			g = t - e * p
		}
		if (e === undefined) {
			if (p < f || p >= d)
				return false;
			if (h > s) {
				if (i) {
					if (i.y >= b)
						return false
				} else
					i = new this.t(p, j);
				f = new this.t(p, b)
			} else {
				if (i) {
					if (i.y < j)
						return false
				} else
					i = new this.t(p, b);
				f = new this.t(p, j)
			}
		} else if (e < -1 || e > 1)
			if (h > s) {
				if (i) {
					if (i.y >= b)
						return false
				} else
					i = new this.t((j - g) / e, j);
				f = new this.t((b - g) / e, b)
			} else {
				if (i) {
					if (i.y < j)
						return false
				} else
					i = new this.t((b - g) / e, b);
				f = new this.t((j - g) / e, j)
			}
		else if (k < l) {
			if (i) {
				if (i.x >= d)
					return false
			} else
				i = new this.t(f, e * f + g);
			f = new this.t(d, e * d + g)
		} else {
			if (i) {
				if (i.x < f)
					return false
			} else
				i = new this.t(d, e * d + g);
			f = new this.t(f, e * f + g)
		}
		a.D = i;
		a.H = f;
		return true
	};
	M.prototype.Gc = function(a, b) {
		var f = a.D.x, i = a.D.y, d = 0, j = 1, k = a.H.x - f, l = a.H.y - i, h = f
				- b.rb;
		if (k === 0 && h < 0)
			return false;
		h = -h / k;
		if (k < 0)
			if (h < d)
				return false;
			else {
				if (h < j)
					j = h
			}
		else if (k > 0)
			if (h > j)
				return false;
			else if (h > d)
				d = h;
		h = b.sb - f;
		if (k === 0 && h < 0)
			return false;
		h = h / k;
		if (k < 0)
			if (h > j)
				return false;
			else {
				if (h > d)
					d = h
			}
		else if (k > 0)
			if (h < d)
				return false;
			else if (h < j)
				j = h;
		h = i - b.vb;
		if (l === 0 && h < 0)
			return false;
		h = -h / l;
		if (l < 0)
			if (h < d)
				return false;
			else {
				if (h < j)
					j = h
			}
		else if (l > 0)
			if (h > j)
				return false;
			else if (h > d)
				d = h;
		h = b.tb - i;
		if (l === 0 && h < 0)
			return false;
		h = h / l;
		if (l < 0)
			if (h > j)
				return false;
			else {
				if (h > d)
					d = h
			}
		else if (l > 0)
			if (h < d)
				return false;
			else if (h < j)
				j = h;
		if (d > 0)
			a.D = new this.t(f + d * k, i + d * l);
		if (j < 1)
			a.H = new this.t(f + j * k, i + j * l);
		return true
	};
	M.prototype.Hc = function(a) {
		for ( var b = this.ba, f = b.length, i, d = Math.abs; f--;) {
			i = b[f];
			if (!this.Kc(i, a) || !this.Gc(i, a) || d(i.D.x - i.H.x) < 1.0E-9
					&& d(i.D.y - i.H.y) < 1.0E-9) {
				i.D = i.H = null;
				b.splice(f, 1)
			}
		}
	};
	M.prototype.Ic = function(a) {
		var b = a.rb, f = a.sb, i = a.vb;
		a = a.tb;
		for ( var d = this.cells, j = d.length, k, l, h, s, p, t, e, g = Math.abs; j--;) {
			k = d[j];
			if (k.sa()) {
				s = k.ga;
				p = s.length;
				for (l = 0; l < p;) {
					h = (l + 1) % p;
					t = s[l].ad();
					h = s[h].bd();
					if (g(t.x - h.x) >= 1.0E-9 || g(t.y - h.y) >= 1.0E-9) {
						if (this.T(t.x, b) && this.fc(t.y, a))
							e = new this.t(b, this.T(h.x, b) ? h.y : a);
						else if (this.T(t.y, a) && this.fc(t.x, f))
							e = new this.t(this.T(h.y, a) ? h.x : f, a);
						else if (this.T(t.x, f) && this.Ob(t.y, i))
							e = new this.t(f, this.T(h.x, f) ? h.y : i);
						else if (this.T(t.y, i) && this.Ob(t.x, b))
							e = new this.t(this.T(h.y, i) ? h.x : b, i);
						p = this.Lc(k.m, t, e);
						s.splice(l + 1, 0, new this.ka(p, k.m, null));
						p = s.length
					}
					l++
				}
			}
		}
	};
	M.prototype.Jc = function(a, b) {
		var f = new Date;
		this.reset();
		a = a.slice(0);
		a.sort(function(s, p) {
			var t = p.y - s.y;
			if (t)
				return t;
			return p.x - s.x
		});
		for ( var i = a.pop(), d = 0, j = Number.MIN_VALUE, k = Number.MIN_VALUE, l = this.cells, h;;) {
			h = this.Sa;
			if (i && (!h || i.y < h.y || i.y === h.y && i.x < h.x)) {
				if (i.x !== j || i.y !== k) {
					l[d] = new this.wb(i);
					i.Z = d++;
					this.xc(i);
					k = i.y;
					j = i.x
				}
				i = a.pop()
			} else if (h)
				this.Cd(h.arc);
			else
				break
		}
		this.Hc(b);
		this.Ic(b);
		b = {
			cells : this.cells,
			ba : this.ba,
			de : (new Date).getTime() - f.getTime()
		};
		this.reset();
		return b
	};
	if (window.CarrotSearchFoamTree.supported) {
		var ia = this;
		Z = (new ga).$a(this, {
			wa : "Carrot Search HTML5 FoamTree",
			Od : Z,
			Oa : {
				id : "foamtree",
				dataObject : null,
				logging : false,
				times : null,
				useFastRenderingRoutines : !window.navigator.userAgent
						.match(/Android.*Safari\/534\.30/),
				backgroundColor : "rgba(0, 0, 0, 0.5)",
				rainbowStartColor : "hsla(0, 100%, 50%, 0.9)",
				rainbowEndColor : "hsla(300, 100%, 50%, 0.9)",
				labelDarkColor : "rgba(0, 0, 0, 0.8)",
				labelLightColor : "rgba(255, 255, 255, 0.8)",
				labelColorThreshold : 0.35,
				groupColorDecorator : null,
				groupGradientType : "lightening",
				groupGradientStrength : 0.25,
				groupGradientRadius : 0.45,
				groupOverlayOpacity : 0.85,
				groupBorderWidth : 6,
				groupInsetWidth : 6,
				groupBorderRadius : 0.35,
				groupBorderWidthScaling : 0.6,
				groupFontFamily : "Impact, Charcoal, sans-serif",
				groupMinFontSize : "4%",
				groupMaxFontSize : "22%",
				groupMaxTotalLabelHeight : 0.65,
				groupLinePadding : 1,
				groupLabelDecorator : null,
				groupSelectionColor : "rgba(255, 255, 255, 0.5)",
				groupSelectionOutlineColor : "rgba(255, 255, 255, 0.9)",
				groupHoverColor : "rgba(255, 255, 255, 0.25)",
				groupHoverOutlineColor : "rgba(255, 255, 255, 0.4)",
				minGroupDiameter : 40,
				aspectRatioImprovementSteps : 1,
				showZeroWeightGroups : true,
				pixelRatio : 1,
				pixelRatioDuringRollout : 1,
				rolloutType : "auto",
				rolloutSpeed : 5,
				rolloutRate : 5,
				siblingRevealingParallelism : 0.95,
				childRevealingParallelism : 0.9,
				groupsVisibleAtRolloutStart : 0,
				explodeDistance : 0.4,
				fadeInTime : 2,
				fadeOutTime : 0.35,
				roundBordersDuringRollout : true,
				drawLabelsDuringRollout : false,
				attributionText : null,
				attributionLogo : null,
				attributionUrl : null,
				maxLabelSizeForTitleBar : 12,
				titleBarFontFamily : "Impact, Charcoal, sans-serif",
				titleBarBackgroundColor : "rgba(0, 0, 0, 0.5)",
				titleBarTextColor : "rgba(255, 255, 255, 0.9)",
				titleBarMinFontSize : 10,
				titleBarMaxFontSize : 40,
				titleBarTextPaddingLeftRight : 20,
				titleBarTextPaddingTopBottom : 15,
				titleBarDecorator : null,
				selection : null,
				open : null,
				imageData : null,
				onRolloutStart : X,
				onRolloutComplete : X,
				onRedraw : X,
				onModelChanged : X,
				onGroupSelectionChanging : X,
				onGroupSelectionChanged : X,
				onGroupHover : X,
				onGroupOpenOrClose : X
			},
			zb : {},
			yb : {
				$c : ha,
				Md : da
			}
		});
		var G = Z.options, x = {};
		da( {});
		var S = new (function(a) {
			function b(A, y) {
				var C = a.qa, B = A.canvas;
				B.setAttribute("width", y.clientWidth * C * B.scale);
				B.setAttribute("height", y.clientHeight * C * B.scale);
				A.scale(B.scale, B.scale)
			}
			function f(A) {
				return function() {
					n && A.apply(this, arguments)
				}
			}
			function i() {
				var A = a.da / 2;
				n.u = {
					x : A,
					y : A,
					k : z.width - A * 2,
					j : z.height - A * 2
				}
			}
			function d() {
				var A = [];
				R.J(n, function(y) {
					y.selected && A.push(c(y.p))
				});
				return {
					groups : A
				}
			}
			function j() {
				var A = [];
				R.J(n, function(y) {
					y.B && A.push(c(y.p))
				});
				return {
					groups : A
				}
			}
			function k(A) {
				var y = P.Hb(A, "format", "image/png");
				A = P.Hb(A, "quality", 0.8);
				return z.toDataURL(y, A)
			}
			function l(A) {
				var y = s(A, "selected");
				if (y) {
					var C = {};
					R.J(n, function(B) {
						if (B.p && (y.all || y.Tb[B.p.id])
								&& B.selected != y.action) {
							R.Aa(B, function(K) {
								if (!B.B || B.selected != y.action) {
									C[K.Z] = K;
									return false
								}
							});
							B.selected = y.action
						}
					});
					n.mc && W.R("rollout", function() {
						for ( var B in C)
							C.hasOwnProperty(B) && D.va(C[B], F, false);
						return true
					}, undefined)
				}
			}
			function h(A) {
				var y = s(A, "open");
				if (y) {
					var C = {};
					R.J(n, function(B) {
						if (B.c && !B.c.I && B.p && (y.all || y.Tb[B.p.id])
								&& B.B != y.action) {
							R.Aa(B, function(K) {
								if (B.B != y.action) {
									C[K.Z] = K;
									return false
								}
							});
							B.B = y.action
						}
					});
					n.mc && W.R("rollout", function() {
						for ( var B in C)
							C.hasOwnProperty(B) && D.va(C[B], F, false);
						return true
					}, undefined)
				}
			}
			function s(A, y) {
				if (!A)
					return null;
				var C = true;
				if (Object.prototype.toString.call(A) == "[object Object]") {
					C = typeof A[y] == "undefined" ? true : A[y];
					if (!A.groups && A.all)
						return {
							action : C,
							all : true
						};
					A = A.groups
				} else
					A = A;
				A = Object.prototype.toString.call(A) == "[object Array]" ? A
						: [ A ];
				y = {};
				for ( var B = 0; A && B < A.length; B++)
					y[A[B]] = true;
				return {
					action : C,
					Tb : y
				}
			}
			function p(A, y) {
				var C = {};
				if (y || a.Pb > 0)
					R.J(n, function(H) {
						H.selected && R.Aa(H, function(L) {
							if (!H.B || H.selected) {
								C[L.Z] = L;
								return false
							}
						})
					});
				var B = g(n, A);
				if (B) {
					B.selected = !B.selected;
					a.kc( {
						group : c(B.p),
						selected : B.selected
					});
					var K = true;
					R.Aa(B, function(H) {
						if (C[H.Z])
							return K = false
					});
					if (K)
						C[B.Z] = B
				}
				y && R.J(n, function(H) {
					if (H.selected && H != B) {
						H.selected = false;
						a.kc( {
							group : c(H.p),
							selected : false
						})
					}
				});
				W.R("rollout", function() {
					for ( var H in C)
						C.hasOwnProperty(H) && D.va(C[H], F, false);
					return true
				}, function() {
					var H = [];
					R.J(n, function(O) {
						O.selected && H.push(c(O.p))
					});
					var L = a.Bc;
					if (L && H.length == 1 && H[0].attribution)
						document.location.href = L;
					else
						a.pd( {
							selectedGroups : H
						})
				});
				return false
			}
			function t(A, y) {
				var C = y ? g(n, A) : m(n, A);
				if (C && C.c && (!y || !C.c.I)) {
					C.B = y;
					W.R("rollout", function() {
						D.va(C, F, false);
						e();
						a.jc( {
							group : C.p,
							open : y
						});
						return true
					}, undefined)
				}
				return false
			}
			function e() {
				J.clearRect(0, 0, E.width, E.height)
			}
			function g(A, y) {
				var C = Number.MAX_VALUE, B = undefined;
				R.N(A, function(K) {
					var H = Q.za(y, K);
					if (H < C) {
						C = H;
						B = K
					}
				});
				if (B)
					return B.B ? g(B.c, y) : Q.eb(B.n, y) ? B : undefined
			}
			function m(A, y) {
				var C = Number.MAX_VALUE, B = undefined;
				for (R.J(A, function(K) {
					var H = Q.za(y, K);
					if (H < C) {
						C = H;
						B = K
					}
				}); !B.B && B.M.parent;)
					B = B.M.parent;
				return B.B ? B : undefined
			}
			function c(A) {
				return A ? A : {
					attribution : true
				}
			}
			function o(A) {
				function y(K, H, L) {
					for ( var O = [], U = 0; U < K.length; U++) {
						var V = K[U], Y = typeof V.weight != "undefined" ? V.weight
								: 1;
						if (a.pc || Y != 0) {
							Y = {
								index : U,
								L : Y,
								p : V,
								M : H
							};
							if (V.groups && V.groups.length > 0)
								Y.c = y(V.groups, {
									parent : Y
								}, L + 1);
							O.push(Y)
						}
					}
					H.e = O;
					H.ha = L;
					return H
				}
				function C(K) {
					var H = 0;
					R.N(K, function(L) {
						H = Math.max(L.L, H)
					});
					H > 0 && R.N(K, function(L) {
						L.L /= H;
						L.c && C(L.c)
					});
					return K
				}
				function B(K) {
					if (!a.pc)
						return K;
					var H = Number.MAX_VALUE, L = 0;
					R.N(K, function(O) {
						O = O.L;
						if (O > 0)
							H = Math.min(O, H);
						else
							L++
					});
					if (H == Number.MAX_VALUE)
						H = 1;
					R.N(K, function(O) {
						if (O.L <= 0)
							O.L = 0.9 * H;
						O.c && B(O.c)
					});
					return K
				}
				return q(C(B(y(A.groups, {}, 0))))
			}
			function q(A) {
				function y(H) {
					R.Ea(H, function(L) {
						L.e.sort(function(O, U) {
							return U.L - O.L
						})
					});
					return H
				}
				var C = a.Ac, B = a.zc;
				R.N(A, function(H, L) {
					if (!H.p) {
						A.e.splice(L, 1);
						return false
					}
				});
				if (C || B) {
					var K = 0;
					R.N(A, function(H) {
						K += H.L
					});
					C = {
						label : C,
						L : K
								* 15
								/ Math.sqrt(z.width * z.width + z.height
										* z.height),
						ee : false,
						M : A
					};
					if (B) {
						C.v = new Image;
						C.v.src = B
					}
					A.e.push(C)
				}
				return y(A)
			}
			var r = this, n, w, I, D, z, F, u, v, E, J, N = {}, T = false;
			P.kb("B`ssnu!Rd`sbi!Gn`lUsdd");
			P.kb("iuuq;..b`ssnurd`sbi/bnl.gn`lusdd");
			this.$a = function(A) {
				z = A;
				z.scale = 1;
				F = z.getContext("2d");
				b(F, z);
				u = document.createElement("canvas");
				u.scale = a.td / a.qa;
				u
						.setAttribute(
								"style",
								"position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;");
				z.parentNode.insertBefore(u, z);
				v = u.getContext("2d");
				b(v, z);
				E = document.createElement("canvas");
				E.scale = 1;
				E
						.setAttribute(
								"style",
								"position: absolute; top: 0; bottom: 0; left: 0; right: 0; z-index: 1; width: 100%; height: 100%; -webkit-touch-callout: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
				u.parentNode.insertBefore(E, u);
				J = E.getContext("2d");
				b(J, z);
				D = new ma(a);
				I = new ja(a);
				D.clear(F);
				A = new fa(E);
				A.ontap = f(function(y) {
					var C = y.V;
					y = E.hb(y.position.x, y.position.y);
					C.shiftKey ? t(y, !C.ctrlKey) : p(y, !C.ctrlKey);
					return false
				});
				A.ondoubletap = A.onhold = A.ontransformend = f(function(y) {
					t(E.hb(y.position.x, y.position.y),
							y.scale == undefined ? true : y.scale > 1)
				});
				if (!("ontouchstart" in window)) {
					E.addEventListener("mousemove", f(function(y) {
						y = E.hb(y.pageX, y.pageY);
						if (!W.Kd("rollout"))
							if (!w || w.B || !Q.eb(w.n, y)) {
								e();
								if (w = g(n, y)) {
									T = false;
									D.Tc(w, J);
									a.db( {
										group : c(w.p)
									})
								} else if (!T) {
									a.db( {
										group : null
									});
									T = true
								}
							}
					}), false);
					E.addEventListener("mouseout", f(function() {
						e();
						w = undefined;
						if (!T) {
							a.db( {
								group : null
							});
							T = true
						}
					}), false)
				}
				document.getElementsByTagName("body")[0].addEventListener(
						"keyup", f(function(y) {
							y.keyCode == 27 && W.R("rollout", function() {
								var C = [];
								R.N(n, function(H) {
									if (H.B) {
										R.J(H.c, function(L) {
											L.B = false
										});
										H.B = false;
										C.push(H)
									}
								});
								for ( var B = 0; B < C.length; B++) {
									var K = C[B];
									D.va(K, F, false);
									a.jc( {
										group : K.p,
										open : false
									})
								}
								return true
							}, undefined)
						}), false)
			};
			this.reload = function(A) {
				if (a.Na) {
					n = o(a.Na);
					i()
				} else
					n = undefined;
				N = {};
				A && a.qd(a.Na)
			};
			this.Bd = function() {
				if (n) {
					N.finalDrawTime = P.Ga(function() {
						e();
						D.X(n, F, false)
					});
					a.lc()
				}
			};
			this.dc = function() {
				if (n) {
					N.finalDrawTime = P.Ga(function() {
						q(n);
						I.fb(n);
						e();
						D.X(n, F, false)
					});
					a.lc()
				}
			};
			this.Dd = function() {
				W.R("rollout", function() {
					b(F, z);
					b(v, z);
					b(J, z);
					if (n) {
						i();
						r.dc()
					}
					return true
				}, undefined)
			};
			this.La = function() {
				I.La(n)
			};
			this.Ec = l;
			this.Oc = d;
			this.Dc = h;
			this.Nc = j;
			this.hd = k;
			this.Td = function() {
				return N
			};
			HTMLElement.prototype.hb = function(A, y) {
				var C = 0, B = 0, K = this;
				do {
					C += K.offsetLeft;
					B += K.offsetTop
				} while (K = K.offsetParent);
				return {
					x : (A - C) * a.qa,
					y : (y - B) * a.qa
				}
			};
			this.ib = function() {
				var A;
				return function() {
					window.clearTimeout(A);
					W.stop();
					D.clear(v);
					W.Gb(u, z, a.Mb);
					if (n)
						A = window.setTimeout(function() {
							var y = a.Hd;
							if (y == "auto") {
								var C = 2E3 / P.Ga(function() {
									I.fb(n);
									D.X(n, F, true)
								});
								y = C > 50 ? "explode" : C > 10 ? "fadein"
										: "none"
							}
							var B = P.Ga(function() {
								I.fb(n);
								D.X(n, F, false)
							}), K = false;
							y != "none" && I.vd(n, y);
							var H = -Math.pow(a.lb, 4) * 0.25 + 1;
							a.sd();
							W.R("rollout", function() {
								var L, O = y == "none";
								if (O)
									L = true;
								else {
									L = I.Pd(n, y);
									D.Sc(n, v, true)
								}
								if (!K && (O || n.pb > H)) {
									K = true;
									W.Gb(z, u, a.Xc)
								}
								return L
							}, function(L, O, U) {
								N.rolloutFramesDrawn = L;
								N.rolloutComputationTime = O;
								N.rolloutTotalTime = U;
								N.finalDrawTime = B;
								a.rd(N)
							})
						}, a.Mb * 1E3 + 50)
				}
			}();
			this.region = function(A) {
				var y;
				n && R.J(n, function(C) {
					if (C.O) {
						if (C.p && C.p.id == A) {
							C = C.O.u;
							y = {
								x : C.x,
								y : C.y,
								w : C.k,
								h : C.j
							};
							return false
						}
					} else
						return false
				});
				return y
			};
			return this
		})(x), $ = Z.Uc(x.id);
		if ($) {
			S.$a($);
			var aa = true;
			this.redraw = function() {
				if (aa) {
					aa = false;
					S.dc()
				} else
					S.Bd()
			};
			var ba = false;
			this.resize = function() {
				var a = G.qa;
				if ($
						&& (ba || $.width != $.clientWidth * a || $.height != $.clientHeight
								* a)) {
					ba = aa = false;
					S.Dd();
					return true
				}
				return false
			};
			this.rollout = S.ib;
			this.region = S.region;
			S.reload(true);
			S.ib()
		}
	}
};
window.CarrotSearchFoamTree.supported = function() {
	var Z = document.createElement("canvas");
	return !!(Z.getContext && Z.getContext("2d"))
}();