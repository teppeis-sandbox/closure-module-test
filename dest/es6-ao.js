'use strict';var h = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, c, f) {
  if (f.get || f.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  a != Array.prototype && a != Object.prototype && (a[c] = f.value);
}, k = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;
function l() {
  l = function() {
  };
  k.Symbol || (k.Symbol = m);
}
var n = 0;
function m(a) {
  return "jscomp_symbol_" + (a || "") + n++;
}
function p() {
  l();
  var a = k.Symbol.iterator;
  a || (a = k.Symbol.iterator = k.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && h(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return q(this);
  }});
  p = function() {
  };
}
function q(a) {
  var c = 0;
  return t(function() {
    return c < a.length ? {done:!1, value:a[c++]} : {done:!0};
  });
}
function t(a) {
  p();
  a = {next:a};
  a[k.Symbol.iterator] = function() {
    return this;
  };
  return a;
}
function u(a) {
  p();
  var c = a[Symbol.iterator];
  return c ? c.call(a) : q(a);
}
for (var v = k, w = ["Promise"], x = 0;x < w.length - 1;x++) {
  var y = w[x];
  y in v || (v[y] = {});
  v = v[y];
}
var z = w[w.length - 1], B = v[z], C = function() {
  function a(b) {
    this.b = 0;
    this.h = void 0;
    this.a = [];
    var a = this.f();
    try {
      b(a.resolve, a.reject);
    } catch (e) {
      a.reject(e);
    }
  }
  function c() {
    this.a = null;
  }
  if (B) {
    return B;
  }
  c.prototype.b = function(b) {
    this.a || (this.a = [], this.f());
    this.a.push(b);
  };
  c.prototype.f = function() {
    var b = this;
    this.c(function() {
      b.h();
    });
  };
  var f = k.setTimeout;
  c.prototype.c = function(b) {
    f(b, 0);
  };
  c.prototype.h = function() {
    for (;this.a && this.a.length;) {
      var b = this.a;
      this.a = [];
      for (var a = 0;a < b.length;++a) {
        var e = b[a];
        delete b[a];
        try {
          e();
        } catch (g) {
          this.g(g);
        }
      }
    }
    this.a = null;
  };
  c.prototype.g = function(a) {
    this.c(function() {
      throw a;
    });
  };
  a.prototype.f = function() {
    function a(a) {
      return function(b) {
        e || (e = !0, a.call(d, b));
      };
    }
    var d = this, e = !1;
    return {resolve:a(this.o), reject:a(this.g)};
  };
  a.prototype.o = function(b) {
    if (b === this) {
      this.g(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (b instanceof a) {
        this.s(b);
      } else {
        var d;
        a: {
          switch(typeof b) {
            case "object":
              d = null != b;
              break a;
            case "function":
              d = !0;
              break a;
            default:
              d = !1;
          }
        }
        d ? this.m(b) : this.i(b);
      }
    }
  };
  a.prototype.m = function(a) {
    var b = void 0;
    try {
      b = a.then;
    } catch (e) {
      this.g(e);
      return;
    }
    "function" == typeof b ? this.u(b, a) : this.i(a);
  };
  a.prototype.g = function(a) {
    this.j(2, a);
  };
  a.prototype.i = function(a) {
    this.j(1, a);
  };
  a.prototype.j = function(a, d) {
    if (0 != this.b) {
      throw Error("Cannot settle(" + a + ", " + d | "): Promise already settled in state" + this.b);
    }
    this.b = a;
    this.h = d;
    this.l();
  };
  a.prototype.l = function() {
    if (this.a) {
      for (var a = this.a, d = 0;d < a.length;++d) {
        a[d].call(), a[d] = null;
      }
      this.a = null;
    }
  };
  var A = new c;
  a.prototype.s = function(a) {
    var b = this.f();
    a.c(b.resolve, b.reject);
  };
  a.prototype.u = function(a, d) {
    var b = this.f();
    try {
      a.call(d, b.resolve, b.reject);
    } catch (g) {
      b.reject(g);
    }
  };
  a.prototype.then = function(b, d) {
    function e(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          g(a(b));
        } catch (G) {
          c(G);
        }
      } : b;
    }
    var g, c, f = new a(function(a, b) {
      g = a;
      c = b;
    });
    this.c(e(b, g), e(d, c));
    return f;
  };
  a.prototype.catch = function(a) {
    return this.then(void 0, a);
  };
  a.prototype.c = function(a, d) {
    function b() {
      switch(c.b) {
        case 1:
          a(c.h);
          break;
        case 2:
          d(c.h);
          break;
        default:
          throw Error("Unexpected state: " + c.b);
      }
    }
    var c = this;
    this.a ? this.a.push(function() {
      A.b(b);
    }) : A.b(b);
  };
  a.resolve = function(b) {
    return b instanceof a ? b : new a(function(a) {
      a(b);
    });
  };
  a.reject = function(b) {
    return new a(function(a, c) {
      c(b);
    });
  };
  a.b = function(b) {
    return new a(function(c, e) {
      for (var d = u(b), f = d.next();!f.done;f = d.next()) {
        a.resolve(f.value).c(c, e);
      }
    });
  };
  a.a = function(b) {
    var c = u(b), e = c.next();
    return e.done ? a.resolve([]) : new a(function(b, d) {
      function f(a) {
        return function(c) {
          g[a] = c;
          r--;
          r || b(g);
        };
      }
      var g = [], r = 0;
      do {
        g.push(void 0), r++, a.resolve(e.value).c(f(g.length - 1), d), e = c.next();
      } while (!e.done);
    });
  };
  a.$jscomp$new$AsyncExecutor = function() {
    return new c;
  };
  return a;
}();
C != B && null != C && h(v, z, {configurable:!0, writable:!0, value:C});
var D = require("whilst"), E = require("assert"), F = [], H = 0;
D(function() {
  return 3 > H;
}, function() {
  F.push(H);
  return Promise.resolve(H++);
}).then(function(a) {
  E.v(F, [0, 1, 2]);
  E.w(a, 2);
});
console.log("foo");
console.log("bar");

