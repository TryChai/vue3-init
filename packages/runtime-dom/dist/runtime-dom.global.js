var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
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

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragement: () => Fragement,
    KeepAlive: () => KeepAlive,
    LifeCycle: () => LifeCycle,
    Text: () => Text,
    activeEffectScope: () => activeEffectScope,
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    defineAsyncComponent: () => defineAsyncComponent,
    effect: () => effect,
    effectScope: () => effectScope,
    getCurrentInstance: () => getCurrentInstance,
    h: () => h,
    inject: () => inject,
    isSameVNode: () => isSameVNode,
    isVnode: () => isVnode,
    onBeforeMount: () => onBeforeMount,
    onMounted: () => onMounted,
    onUpdated: () => onUpdated,
    provide: () => provide,
    proxyRefs: () => proxyRefs,
    queueJob: () => queueJob,
    reactive: () => reactive,
    recordEffectScope: () => recordEffectScope,
    ref: () => ref,
    render: () => render,
    shapeFlags: () => shapeFlags,
    toReactive: () => toReactive,
    toRef: () => toRef,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    insert(element, container, anchor = null) {
      container.insertBefore(element, anchor);
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    querySelector(selectors) {
      return document.querySelector(selectors);
    },
    parentNode(child) {
      return child.parentNode;
    },
    nextSibling(child) {
      return child.nextSibling;
    },
    setText(element, text) {
      element.nodeValue = text;
    },
    setElementText(element, text) {
      element.textContent = text;
    }
  };

  // packages/runtime-dom/src/patch-prop/pacthEvent.ts
  function createInvoker(preValue) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = preValue;
    return invoker;
  }
  function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const exitingInvoker = invokers[eventName];
    if (exitingInvoker && nextValue) {
      exitingInvoker.value = nextValue;
    } else {
      const eName = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = createInvoker(nextValue);
        invokers[eventName] = invoker;
        el.addEventListener(eName, invoker);
      } else if (exitingInvoker) {
        el.removgeEventListener(eName, exitingInvoker);
        invokers[eventName] = null;
      }
    }
  }

  // packages/runtime-dom/src/patch-prop/patchAttr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }

  // packages/runtime-dom/src/patch-prop/patchClass.ts
  function patchClass(el, nextValue) {
    if (nextValue == null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/patch-prop/patchStyle.ts
  function patchStyle(el, preValue, nextValue) {
    preValue = preValue ? preValue : {};
    nextValue = nextValue ? nextValue : {};
    const style = el.style;
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] == null) {
          style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/on[^a-z]/g.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function";
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isArray = Array.isArray;
  var isNumber = (value) => {
    return typeof value === "number";
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = (obj, key) => hasOwnProperty.call(obj, key);
  function invokerFns(fns) {
    for (let i = 0; i < fns.length; i++) {
      fns[i]();
    }
  }

  // packages/runtime-core/src/createVNode.ts
  var Text = Symbol("Text");
  var Fragement = Symbol("Fragement");
  function isVnode(val) {
    return val.__v_isVNode;
  }
  function isSameVNode(v1, v2) {
    return v1.type === v2.type && v1.key == v2.key;
  }
  function createVNode(type, props = null, children = null) {
    let shapFlag = isString(type) ? shapeFlags.ELEMENT : isObject(type) ? shapeFlags.STATEFUL_COMPONENT : 0;
    const vnode = {
      __v_isVNode: true,
      type,
      props,
      component: null,
      children,
      key: props && props.key,
      el: null,
      shapFlag
    };
    if (children != void 0) {
      let temp = 0;
      if (isArray(children)) {
        temp = shapeFlags.ARRAY_CHILDREN;
      } else if (isObject(children)) {
        temp = shapeFlags.SLOTS_CHILDREN;
      } else {
        children = String(children);
        temp = shapeFlags.TEXT_CHILDREN;
      }
      vnode.shapFlag |= temp;
    }
    return vnode;
  }
  var shapeFlags = /* @__PURE__ */ ((shapeFlags2) => {
    shapeFlags2[shapeFlags2["ELEMENT"] = 1] = "ELEMENT";
    shapeFlags2[shapeFlags2["FUNCTION_COMPONENT"] = 2] = "FUNCTION_COMPONENT";
    shapeFlags2[shapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    shapeFlags2[shapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    shapeFlags2[shapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    shapeFlags2[shapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
    shapeFlags2[shapeFlags2["TELEPORT"] = 64] = "TELEPORT";
    shapeFlags2[shapeFlags2["SUSPENSE"] = 128] = "SUSPENSE";
    shapeFlags2[shapeFlags2["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
    shapeFlags2[shapeFlags2["COMPONENT_KEEP_ALIVE"] = 512] = "COMPONENT_KEEP_ALIVE";
    shapeFlags2[shapeFlags2["COMPONENT"] = 6] = "COMPONENT";
    return shapeFlags2;
  })(shapeFlags || {});

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

  // packages/runtime-core/src/h.ts
  function h(type, propOrChildren, children) {
    const l = arguments.length;
    if (l == 2) {
      if (isObject(propOrChildren) && !isArray(propOrChildren)) {
        if (isVnode(propOrChildren)) {
          return createVNode(type, null, [propOrChildren]);
        }
        return createVNode(type, propOrChildren);
      } else {
        return createVNode(type, null, propOrChildren);
      }
    } else {
      if (l == 3 && isVnode(children)) {
        children = [children];
      } else if (l > 3) {
        children = Array.from(arguments).slice(2);
      }
      return createVNode(type, propOrChildren, children);
    }
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var isFlushing = false;
  var resolvePromsie = Promise.resolve();
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlushing) {
      isFlushing = true;
      resolvePromsie.then(() => {
        isFlushing = false;
        let copyQueue = queue.slice(0);
        queue.length = 0;
        for (let i = 0; i < copyQueue.length; i++) {
          let job2 = copyQueue[i];
          job2();
        }
        copyQueue.length = 0;
      });
    }
  }

  // packages/runtime-core/src/component.ts
  var instance = null;
  var getCurrentInstance = () => instance;
  var setCurrentInstance = (i) => instance = i;
  function createComponentInstance(vnode, parent) {
    let instance2 = {
      ctx: {},
      data: null,
      vnode,
      subTree: null,
      isMounted: false,
      update: null,
      render: null,
      propsOptions: vnode.type.props || {},
      props: {},
      attrs: {},
      proxy: null,
      setupState: {},
      slots: {},
      exposed: {},
      parent,
      provides: parent ? parent.provides : /* @__PURE__ */ Object.create(null)
    };
    return instance2;
  }
  function initProps(instance2, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance2.propsOptions;
    if (rawProps) {
      for (let key in rawProps) {
        const value = rawProps[key];
        if (key in options) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance2.props = reactive(props);
    instance2.attrs = attrs;
  }
  var publicProperties = {
    $attrs: (instance2) => instance2.attrs,
    $slots: (instance2) => instance2.slots
  };
  var instanceProxy = {
    get(target, key, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        return data[key];
      } else if (setupState && hasOwn(setupState, key)) {
        return setupState[key];
      } else if (props && hasOwn(props, key)) {
        return props[key];
      }
      let getter = publicProperties[key];
      if (getter) {
        return getter(target);
      }
    },
    set(target, key, value, receiver) {
      const { data, props, setupState } = target;
      if (data && hasOwn(data, key)) {
        data[key] = value;
      } else if (setupState && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (props && hasOwn(props, key)) {
        console.warn("props no update");
        return;
      }
      return true;
    }
  };
  function initSlots(instance2, children) {
    if (instance2.vnode.shapFlag & 32 /* SLOTS_CHILDREN */) {
      instance2.slots = children;
    }
  }
  function setupComponent(instance2) {
    let { type, props, children } = instance2.vnode;
    let { data, render: render2, setup } = type;
    initProps(instance2, props);
    initSlots(instance2, children);
    instance2.proxy = new Proxy(instance2, instanceProxy);
    if (data) {
      if (!isFunction(data)) {
        return;
      }
      instance2.data = reactive(data.call());
    }
    if (setup) {
      const context = {
        emit: (eventName, ...args) => {
          const name = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
          const invoker = instance2.vnode.props[name];
          invoker && invoker(...args);
        },
        attrs: instance2.attrs,
        slots: instance2.slots,
        expose: (exposed) => {
          instance2.exposed = exposed || {};
        }
      };
      setCurrentInstance(instance2);
      const setupResult = setup(instance2.props, context);
      setCurrentInstance(null);
      if (isFunction(setupResult)) {
        instance2.render = setupResult;
      } else if (isObject(setupResult)) {
        instance2.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance2.render) {
      if (render2) {
        instance2.render = render2;
      } else {
      }
    }
  }

  // packages/runtime-core/src/renderer.ts
  function getSequence(arr) {
    let len = arr.length;
    let p = arr.slice();
    let result = [0];
    let lastIndex;
    let start, end, middle;
    for (let i2 = 0; i2 < len; i2++) {
      const arrI = arr[i2];
      if (arrI !== 0) {
        lastIndex = result[result.length - 1];
        if (arr[lastIndex] < arrI) {
          result.push(i2);
          p[i2] = lastIndex;
          continue;
        }
        start = 0;
        end = result.length - 1;
        while (start < end) {
          middle = Math.floor((start + end) / 2);
          if (arr[result[middle]] < arrI) {
            start = middle + 1;
          } else {
            end = middle;
          }
        }
        if (arrI < arr[result[end]]) {
          p[i2] = result[end - 1];
          result[end] = i2;
        }
      }
    }
    let i = result.length;
    let last = result[i - 1];
    while (i-- > 0) {
      result[i] = last;
      last = p[last];
    }
    return result;
  }
  function createRenderer(options) {
    let {
      createElement: hostCreateElement,
      createTextNode: hostCreateTextNode,
      insert: hostInsert,
      remove: hostRemove,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setText: hostSetText,
      setElementText: hostSetElementText,
      patchProp: hostPatchProp
    } = options;
    function normalize(children, i) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVNode(Text, null, children[i]);
      }
      return children[i];
    }
    function mountChildren(children, container, parent) {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children, i);
        patch(null, child, container, null, parent);
      }
    }
    function patchProps(oldProps, newProps, el) {
      oldProps = oldProps == null ? {} : oldProps;
      newProps = newProps == null ? {} : newProps;
      for (let key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (let key in oldProps) {
        if (newProps[key] == null) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
    function mountElement(vnode, dom, anchor, parent) {
      let { type, props, children, shapFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        patchProps(null, props, el);
      }
      if (shapFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      }
      if (shapFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el, parent);
      }
      hostInsert(el, dom, anchor);
    }
    function processText(preVnode, vnode, dom) {
      if (preVnode == null) {
        hostInsert(vnode.el = hostCreateTextNode(vnode.children), dom);
      } else {
        const el = vnode.el = preVnode.el;
        if (vnode.children !== preVnode.children) {
          hostSetText(el, vnode.children);
        }
      }
    }
    function unmountChildren(children, parent) {
      children.forEach((child) => {
        unmount(child, parent);
      });
    }
    function patchKeyedChildren(c1, c2, el, parent) {
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = c2.length - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVNode(n1, n2)) {
          patch(n1, n2, el, parent);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          while (i <= e2) {
            const nextPos = e2 + 1;
            let anchor = c2.length <= nextPos ? null : c2[nextPos].el;
            patch(null, c2[i], el, anchor, parent);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            unmount(c1[i], parent);
            i++;
          }
        }
      } else {
        let s1 = i;
        let s2 = i;
        let toBePatched = e2 - s2 + 1;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (let i2 = s2; i2 <= e2; i2++) {
          keyToNewIndexMap.set(c2[i2].key, i2);
        }
        const seq = new Array(toBePatched).fill(0);
        for (let i2 = s1; i2 <= e1; i2++) {
          const oldVNode = c1[i2];
          let newIndex = keyToNewIndexMap.get(oldVNode.key);
          if (newIndex == null) {
            unmount(oldVNode, parent);
          } else {
            seq[newIndex - s2] = i2 + 1;
            patch(oldVNode, c2[newIndex], el);
          }
        }
        let incr = getSequence(seq);
        let j = incr.length - 1;
        for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
          const currentIndex = s2 + i2;
          const child = c2[currentIndex];
          const anchor = currentIndex + 1 <= c2.length ? c2[currentIndex + 1].el : null;
          if (seq[i2] === 0) {
            patch(null, child, el, anchor);
          } else {
            if (i2 != incr[j]) {
              hostInsert(child.el, el, anchor);
            } else {
              j--;
            }
          }
        }
      }
    }
    function patchChild(preVnode, vnode, el, parent) {
      let c1 = preVnode.children;
      let c2 = vnode.children;
      const preShapFlag = preVnode.shapFlag;
      const ShapFlag = vnode.shapFlag;
      if (ShapFlag & 8 /* TEXT_CHILDREN */) {
        if (preShapFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1, parent);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (preShapFlag & 16 /* ARRAY_CHILDREN */) {
          if (ShapFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(c1, c2, el, parent);
          } else {
            unmountChildren(c1, parent);
          }
        } else {
          if (preShapFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (ShapFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el, parent);
          }
        }
      }
    }
    function patchElement(preVnode, vnode, parent) {
      let el = vnode.el = preVnode.el;
      let oldProps = preVnode.props;
      let newProps = vnode.props;
      patchProps(oldProps, newProps, el);
      patchChild(preVnode, vnode, el, parent);
    }
    function processElement(preVnode, vnode, dom, anchor, parent) {
      if (preVnode == null) {
        mountElement(vnode, dom, anchor, parent);
      } else {
        patchElement(preVnode, vnode, parent);
      }
    }
    function unmount(preVnode, parent) {
      let { shapFlag, component } = preVnode;
      if (shapFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        parent.ctx.deactivated(preVnode);
      }
      if (preVnode.type === Fragement) {
        return unmountChildren(preVnode.children, parent);
      } else if (shapFlag & 6 /* COMPONENT */) {
        return unmount(component.subTree, parent);
      }
      hostRemove(preVnode.el);
    }
    function processFragement(preVnode, vnode, dom, parent) {
      if (preVnode == null) {
        mountChildren(vnode.children, dom, parent);
      } else {
        patchKeyedChildren(preVnode.children, vnode.children, dom, parent);
      }
    }
    function updateComponentPreRender(instance2, next) {
      instance2.next = null;
      instance2.vnode = next;
      updateProps(instance2, instance2.props, next.props);
      Object.assign(instance2.slots, next.children);
    }
    function setupRenderEffect(instance2, dom, anchor) {
      const componentUpdate = () => {
        const { render: render3, data, proxy } = instance2;
        if (!instance2.isMounted) {
          const { bm, m } = instance2;
          if (bm) {
            invokerFns(bm);
          }
          const subTree = render3.call(proxy);
          patch(null, subTree, dom, anchor, instance2);
          instance2.subTree = subTree;
          instance2.isMounted = true;
          if (m) {
            invokerFns(m);
          }
        } else {
          let next = instance2.next;
          if (next) {
            updateComponentPreRender(instance2, next);
          }
          const subTree = render3.call(proxy);
          patch(instance2.subTree, subTree, dom, anchor, instance2);
          if (instance2.u) {
            invokerFns(instance2.u);
          }
          instance2.subTree = subTree;
        }
      };
      const effect3 = new ReactiveEffect(componentUpdate, () => queueJob(instance2.update));
      let update = instance2.update = effect3.run.bind(effect3);
      update();
    }
    function mountComponent(vnode, dom, anchor, parent) {
      const instance2 = vnode.component = createComponentInstance(vnode, parent);
      instance2.ctx.renderer = {
        createElement: hostCreateElement,
        move(vnode2, container) {
          hostInsert(vnode2.component.subTree.el, container);
        },
        unmount
      };
      setupComponent(instance2);
      setupRenderEffect(instance2, dom, anchor);
    }
    function hasChange(preProps, nextProps) {
      for (let key in nextProps) {
        if (nextProps[key] != preProps[key]) {
          return true;
        }
      }
      return false;
    }
    function updateProps(instance2, preProps, nextProps) {
      if (hasChange(preProps, nextProps)) {
        for (let key in nextProps) {
          instance2.props[key] = nextProps[key];
        }
        for (let key in instance2.props) {
          if (!(key in nextProps)) {
            delete instance2.props[key];
          }
        }
      }
    }
    function shouldComponentUpdate(preVnode, vnode) {
      const preProps = preVnode.props;
      const nextProps = vnode.props;
      if (hasChange(preProps, nextProps)) {
        return true;
      }
      if (preVnode.children || vnode.children) {
        return true;
      }
      return false;
    }
    function updateComponent(preVnode, vnode) {
      const instance2 = vnode.component = preVnode.component;
      if (shouldComponentUpdate(preVnode, vnode)) {
        instance2.next = vnode;
        instance2.update();
      } else {
        instance2.vnode = vnode;
      }
    }
    function processComponent(preVnode, vnode, dom, anchor, parent) {
      if (preVnode == null) {
        if (vnode.shapFlag & 512 /* COMPONENT_KEEP_ALIVE */) {
          parent.ctx.activated(vnode, dom, anchor);
        } else {
          mountComponent(vnode, dom, anchor, parent);
        }
      } else {
        updateComponent(preVnode, vnode);
      }
    }
    function patch(preVnode, vnode, dom, anchor = null, parent = null) {
      if (preVnode && !isSameVNode(preVnode, vnode)) {
        unmount(preVnode, parent);
        preVnode = null;
      }
      const { type, shapFlag } = vnode;
      switch (type) {
        case Text:
          processText(preVnode, vnode, dom);
          break;
        case Fragement:
          processFragement(preVnode, vnode, dom, parent);
          break;
        default:
          if (shapFlag & 1 /* ELEMENT */) {
            processElement(preVnode, vnode, dom, anchor, parent);
          } else if (shapFlag & 4 /* STATEFUL_COMPONENT */) {
            processComponent(preVnode, vnode, dom, anchor, parent);
          }
      }
    }
    function render2(vnode, container) {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null);
        }
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
    }
    return {
      render: render2
    };
  }

  // packages/runtime-core/src/apiLifeCycle.ts
  var LifeCycle = /* @__PURE__ */ ((LifeCycle2) => {
    LifeCycle2["BEFORE_MOUNT"] = "bm";
    LifeCycle2["MOUNTED"] = "m";
    LifeCycle2["UPDATED"] = "u";
    return LifeCycle2;
  })(LifeCycle || {});
  function createInvoker2(type) {
    return function(hook, currentInstance = instance) {
      if (currentInstance) {
        const lifeCycles = currentInstance[type] || (currentInstance[type] = []);
        const wrapHook = () => {
          setCurrentInstance(currentInstance);
          hook.call(currentInstance);
          setCurrentInstance(null);
        };
        lifeCycles.push(wrapHook);
      }
    };
  }
  var onBeforeMount = createInvoker2("bm" /* BEFORE_MOUNT */);
  var onMounted = createInvoker2("m" /* MOUNTED */);
  var onUpdated = createInvoker2("u" /* UPDATED */);

  // packages/runtime-core/src/apiInject.ts
  function provide(key, value) {
    if (!instance)
      return;
    let parentProvides = instance.parent && instance.parent.provides;
    let currentProvides = instance.provides;
    if (currentProvides === parentProvides) {
      currentProvides = instance.provides = Object.create(parentProvides);
    }
    currentProvides[key] = value;
  }
  function inject(key, defaultValue) {
    var _a;
    if (!instance)
      return;
    const provides = (_a = instance.parent) == null ? void 0 : _a.provides;
    if (provides && key in provides) {
      return provides[key];
    } else {
      return defaultValue;
    }
  }

  // packages/runtime-core/src/defineAsyncComponent.ts
  function defineAsyncComponent(loaderOptions) {
    if (typeof loaderOptions === "function") {
      loaderOptions = {
        loader: loaderOptions
      };
    }
    let Componet = null;
    return {
      setup() {
        const {
          loader,
          timeout,
          errorComponent,
          delay,
          loadingComponent,
          onError
        } = loaderOptions;
        const loaded = ref(false);
        const error = ref(false);
        const loading = ref(false);
        if (timeout) {
          setTimeout(() => {
            error.value = true;
          }, timeout);
        }
        let timer;
        if (delay) {
          timer = setTimeout(() => {
            loading.value = true;
          }, delay);
        } else {
          loading.value = true;
        }
        function load() {
          return loader().catch((err) => {
            if (onError) {
              return new Promise((resolve, reject) => {
                const retry = () => resolve(load());
                const fail = () => reject();
                onError(retry, fail);
              });
            } else {
              throw new Error();
            }
          });
        }
        load().then((v) => {
          loaded.value = true;
          Componet = v;
        }).catch((err) => {
          error.value = true;
        }).finally(() => {
          loading.value = false;
          clearTimeout(timer);
        });
        return () => {
          if (loaded.value) {
            return h(Componet);
          } else if (error.value && errorComponent) {
            return h(errorComponent);
          } else if (loading.value && loadingComponent) {
            return h(loadingComponent);
          } else {
            return h(Fragement, []);
          }
        };
      }
    };
  }

  // packages/runtime-core/src/keepAlive.ts
  var resetFlag = (vnode) => {
    if (vnode.shapFlag & 512 /* COMPONENT_KEEP_ALIVE */) {
      vnode.shapFlag -= 512 /* COMPONENT_KEEP_ALIVE */;
    }
    if (vnode.shapFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
      vnode.shapFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
    }
  };
  var KeepAlive = {
    __isKeepAlive: true,
    props: {
      max: {}
    },
    setup(props, { slots }) {
      const instance2 = getCurrentInstance();
      let { createElement, move, unmount } = instance2.ctx.renderer;
      const keys = /* @__PURE__ */ new Set();
      const cache = /* @__PURE__ */ new Map();
      const pruneCacheEntry = (vnode) => {
        const subTree = cache.get(vnode);
        unmount(subTree, subTree.component.parent);
        resetFlag(subTree);
        cache.delete(vnode);
        keys.delete(vnode);
      };
      let storageContainer = createElement("div");
      instance2.ctx.activated = (vnode, dom, anchor) => {
        move(vnode, dom, anchor);
      };
      instance2.ctx.deactivated = (n1) => {
        move(n1, storageContainer);
      };
      let pendingCacheKey = null;
      const cacheSubTree = () => {
        cache.set(pendingCacheKey, instance2.subTree);
      };
      onMounted(cacheSubTree);
      onUpdated(cacheSubTree);
      return () => {
        let vnode = slots.default();
        if (!(vnode.shapFlag & 6 /* COMPONENT */)) {
          return vnode;
        }
        let comp = vnode.type;
        let key = vnode.key == null ? comp : vnode.key;
        pendingCacheKey = key;
        let cacheVNode = cache.get(key);
        if (cacheVNode) {
          vnode.component = cacheVNode.component;
          vnode.shapFlag |= 512 /* COMPONENT_KEEP_ALIVE */;
        } else {
          keys.add(key);
          let { max } = props;
          if (max && keys.size > max) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
        return vnode;
      };
    }
  };

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadValues({
    patchProp
  }, nodeOps);
  function render(vnode, container) {
    let { render: render2 } = createRenderer(renderOptions);
    render2(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
