var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    activeEffectScope: () => activeEffectScope,
    computed: () => computed,
    effect: () => effect,
    effectScope: () => effectScope,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    recordEffectScope: () => recordEffectScope,
    ref: () => ref,
    toReactive: () => toReactive,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/reactivity/src/effectScope.ts
  function recordEffectScope(effect3) {
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(effect3);
    }
  }
  var activeEffectScope;
  var EffectScope = class {
    constructor(detached) {
      this.effects = [];
      this.active = true;
      this.scopes = [];
      console.log(activeEffectScope);
      if (!detached && activeEffectScope) {
        activeEffectScope.scopes.push(this);
      }
    }
    run(fn) {
      if (this.active) {
        try {
          this.parent = activeEffectScope;
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = this.parent;
        }
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        this.effects.forEach((effect3) => effect3.stop());
      }
      if (this.scopes) {
        this.scopes.forEach((scopesEffect) => scopesEffect.stop());
      }
    }
  };
  function effectScope(detached) {
    return new EffectScope(detached);
  }

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  function cleanEffect(effect3) {
    let deps = effect3.deps;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    effect3.deps.length = 0;
  }
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
      recordEffectScope(this);
    }
    run() {
      if (!this.active) {
        return this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          cleanEffect(this);
          return this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = null;
        }
      }
    }
    stop() {
      if (this.active)
        this.active = false;
      cleanEffect(this);
    }
  };
  var targetkMap = /* @__PURE__ */ new WeakMap();
  function trigger(target, key, value) {
    let depsMap = targetkMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    traggeEffect(effects);
  }
  function traggeEffect(effects) {
    if (effects) {
      effects = new Set(effects);
      effects.forEach((effect3) => {
        if (effect3 !== activeEffect) {
          if (effect3.scheduler) {
            effect3.scheduler();
          } else {
            effect3.run();
          }
        }
      });
    }
  }
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetkMap.get(target);
      if (!depsMap) {
        targetkMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffect(deps);
    }
  }
  function trackEffect(deps) {
    let shouleTrack = !deps.has(activeEffect);
    if (shouleTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["_v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/baseHandler.ts
  function isReactive(value) {
    return value && value["_v_isReactive" /* IS_REACTIVE */];
  }
  var baseHandler = {
    get(target, key, receiver) {
      if (key === "_v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, key);
      let res = Reflect.get(target, key, receiver);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = true;
      if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver);
        trigger(target, key, value);
      }
      return result;
    }
  };

  // packages/reactivity/src/watch.ts
  function traversal(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject(value)) {
      return value;
    }
    if (set.has(value)) {
      return value;
    }
    set.add(value);
    for (let key in value) {
      traversal(value[key], set);
    }
    return value;
  }
  function watch(source, cb) {
    let get;
    if (isReactive(source)) {
      console.log("\u662F\u54CD\u5E94\u5F0F\u5BF9\u8C61");
      get = () => traversal(source);
    } else if (isFunction(source)) {
      get = source;
    }
    let oldValue;
    const job = () => {
      let newValue = effect3.run();
      cb(newValue, oldValue);
    };
    const effect3 = new ReactiveEffect(get, job);
    oldValue = effect3.run();
  }

  // packages/reactivity/src/computed.ts
  function computed(getterOrOptions) {
    let isGetter = isFunction(getterOrOptions);
    let getter, setter;
    let fn = () => console.warn("computed is readonly");
    if (isGetter) {
      getter = getterOrOptions;
      setter = fn;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set || fn;
    }
    return new ComputedRefImpl(getter, setter);
  }
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this._dirty = true;
      this._v_isRef = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          traggeEffect(this.deps);
        }
      });
    }
    get value() {
      if (activeEffect) {
        trackEffect(this.deps || (this.deps = /* @__PURE__ */ new Set()));
      }
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(newValue) {
      this.setter(newValue);
    }
  };

  // packages/reactivity/src/ref.ts
  function ref(value) {
    return new RefImpl(value);
  }
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }
  function toRef(object, key) {
    return new ObjectRefImpl(object, key);
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, receiver) {
        let r = Reflect.get(target, key, receiver);
        return r._v_isRef ? r.value : r;
      },
      set(target, key, value, receiver) {
        if (target[key]._v_isRef) {
          target[key].value = value;
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      }
    });
  }
  function toRefs(object) {
    let result = {};
    for (let key in object) {
      result[key] = new ObjectRefImpl(object, key);
    }
    return result;
  }
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this._v_isRef = true;
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffect(this.dep || (this.dep = /* @__PURE__ */ new Set()));
      return this._value;
    }
    set value(newValue) {
      if (newValue != this.rawValue) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
        traggeEffect(this.dep);
      }
    }
  };
  var ObjectRefImpl = class {
    constructor(object, key) {
      this.object = object;
      this.key = key;
      this._v_isRef = true;
    }
    get value() {
      return this.object[this.key];
    }
    set value(newValue) {
      this.object[this.key] = newValue;
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
