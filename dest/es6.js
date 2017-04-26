'use strict';var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, d, e) {
  if (e.get || e.set) {
    throw new TypeError("ES3 does not support getters and setters.");
  }
  a != Array.prototype && a != Object.prototype && (a[d] = e.value);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(a) {
  return $jscomp.SYMBOL_PREFIX + (a || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(a) {
  var d = 0;
  return $jscomp.iteratorPrototype(function() {
    return d < a.length ? {done:!1, value:a[d++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.makeIterator = function(a) {
  $jscomp.initSymbolIterator();
  var d = a[Symbol.iterator];
  return d ? d.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.polyfill = function(a, d, e, c) {
  if (d) {
    e = $jscomp.global;
    a = a.split(".");
    for (c = 0;c < a.length - 1;c++) {
      var g = a[c];
      g in e || (e[g] = {});
      e = e[g];
    }
    a = a[a.length - 1];
    c = e[a];
    d = d(c);
    d != c && null != d && $jscomp.defineProperty(e, a, {configurable:!0, writable:!0, value:d});
  }
};
$jscomp.EXPOSE_ASYNC_EXECUTOR = !0;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
  function d() {
    this.batch_ = null;
  }
  if (a && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return a;
  }
  d.prototype.asyncExecute = function(b) {
    null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());
    this.batch_.push(b);
    return this;
  };
  d.prototype.asyncExecuteBatch_ = function() {
    var b = this;
    this.asyncExecuteFunction(function() {
      b.executeBatch_();
    });
  };
  var e = $jscomp.global.setTimeout;
  d.prototype.asyncExecuteFunction = function(b) {
    e(b, 0);
  };
  d.prototype.executeBatch_ = function() {
    for (;this.batch_ && this.batch_.length;) {
      var b = this.batch_;
      this.batch_ = [];
      for (var f = 0;f < b.length;++f) {
        var a = b[f];
        delete b[f];
        try {
          a();
        } catch (k) {
          this.asyncThrow_(k);
        }
      }
    }
    this.batch_ = null;
  };
  d.prototype.asyncThrow_ = function(b) {
    this.asyncExecuteFunction(function() {
      throw b;
    });
  };
  var c = function(b) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    var f = this.createResolveAndReject_();
    try {
      b(f.resolve, f.reject);
    } catch (h) {
      f.reject(h);
    }
  };
  c.prototype.createResolveAndReject_ = function() {
    function b(b) {
      return function(c) {
        a || (a = !0, b.call(f, c));
      };
    }
    var f = this, a = !1;
    return {resolve:b(this.resolveTo_), reject:b(this.reject_)};
  };
  c.prototype.resolveTo_ = function(b) {
    if (b === this) {
      this.reject_(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (b instanceof c) {
        this.settleSameAsPromise_(b);
      } else {
        var a;
        a: {
          switch(typeof b) {
            case "object":
              a = null != b;
              break a;
            case "function":
              a = !0;
              break a;
            default:
              a = !1;
          }
        }
        a ? this.resolveToNonPromiseObj_(b) : this.fulfill_(b);
      }
    }
  };
  c.prototype.resolveToNonPromiseObj_ = function(b) {
    var a = void 0;
    try {
      a = b.then;
    } catch (h) {
      this.reject_(h);
      return;
    }
    "function" == typeof a ? this.settleSameAsThenable_(a, b) : this.fulfill_(b);
  };
  c.prototype.reject_ = function(b) {
    this.settle_(2, b);
  };
  c.prototype.fulfill_ = function(b) {
    this.settle_(1, b);
  };
  c.prototype.settle_ = function(b, a) {
    if (0 != this.state_) {
      throw Error("Cannot settle(" + b + ", " + a | "): Promise already settled in state" + this.state_);
    }
    this.state_ = b;
    this.result_ = a;
    this.executeOnSettledCallbacks_();
  };
  c.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var b = this.onSettledCallbacks_, a = 0;a < b.length;++a) {
        b[a].call(), b[a] = null;
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var g = new d;
  c.prototype.settleSameAsPromise_ = function(a) {
    var b = this.createResolveAndReject_();
    a.callWhenSettled_(b.resolve, b.reject);
  };
  c.prototype.settleSameAsThenable_ = function(a, c) {
    var b = this.createResolveAndReject_();
    try {
      a.call(c, b.resolve, b.reject);
    } catch (k) {
      b.reject(k);
    }
  };
  c.prototype.then = function(a, d) {
    function b(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          f(a(b));
        } catch (l) {
          e(l);
        }
      } : b;
    }
    var f, e, g = new c(function(a, b) {
      f = a;
      e = b;
    });
    this.callWhenSettled_(b(a, f), b(d, e));
    return g;
  };
  c.prototype.catch = function(a) {
    return this.then(void 0, a);
  };
  c.prototype.callWhenSettled_ = function(a, c) {
    function b() {
      switch(d.state_) {
        case 1:
          a(d.result_);
          break;
        case 2:
          c(d.result_);
          break;
        default:
          throw Error("Unexpected state: " + d.state_);
      }
    }
    var d = this;
    null == this.onSettledCallbacks_ ? g.asyncExecute(b) : this.onSettledCallbacks_.push(function() {
      g.asyncExecute(b);
    });
  };
  c.resolve = function(a) {
    return a instanceof c ? a : new c(function(b, c) {
      b(a);
    });
  };
  c.reject = function(a) {
    return new c(function(b, c) {
      c(a);
    });
  };
  c.race = function(a) {
    return new c(function(b, d) {
      for (var e = $jscomp.makeIterator(a), f = e.next();!f.done;f = e.next()) {
        c.resolve(f.value).callWhenSettled_(b, d);
      }
    });
  };
  c.all = function(a) {
    var b = $jscomp.makeIterator(a), d = b.next();
    return d.done ? c.resolve([]) : new c(function(a, e) {
      function f(b) {
        return function(c) {
          g[b] = c;
          h--;
          0 == h && a(g);
        };
      }
      var g = [], h = 0;
      do {
        g.push(void 0), h++, c.resolve(d.value).callWhenSettled_(f(g.length - 1), e), d = b.next();
      } while (!d.done);
    });
  };
  $jscomp.EXPOSE_ASYNC_EXECUTOR && (c.$jscomp$new$AsyncExecutor = function() {
    return new d;
  });
  return c;
}, "es6-impl", "es3");
var module$src$es6$bar = {}, whilst$$module$src$es6$bar = require("whilst"), assert$$module$src$es6$bar = require("assert"), result$$module$src$es6$bar = [], i$$module$src$es6$bar = 0;
whilst$$module$src$es6$bar(function() {
  return 3 > i$$module$src$es6$bar;
}, function() {
  result$$module$src$es6$bar.push(i$$module$src$es6$bar);
  return Promise.resolve(i$$module$src$es6$bar++);
}).then(function(a) {
  assert$$module$src$es6$bar.deepEqual(result$$module$src$es6$bar, [0, 1, 2]);
  assert$$module$src$es6$bar.equal(a, 2);
});
var $jscompDefaultExport$$module$src$es6$bar = "bar";
module$src$es6$bar.default = $jscompDefaultExport$$module$src$es6$bar;
var module$src$es6$foo = {}, $jscompDefaultExport$$module$src$es6$foo = "foo";
module$src$es6$foo.default = $jscompDefaultExport$$module$src$es6$foo;
var module$src$es6$baz = {};
console.log(module$src$es6$foo.default);
console.log(module$src$es6$bar.default);
var $jscompDefaultExport$$module$src$es6$baz = module$src$es6$foo.default + "/" + module$src$es6$bar.default;
module$src$es6$baz.default = $jscompDefaultExport$$module$src$es6$baz;

