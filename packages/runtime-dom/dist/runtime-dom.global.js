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
    Text: () => Text,
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    effect: () => effect,
    h: () => h,
    isSameVNode: () => isSameVNode,
    isVnode: () => isVnode,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
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

  // packages/runtime-core/src/createVNode.ts
  var Text = Symbol("Text");
  function isVnode(val) {
    return val.__v_isVNode;
  }
  function isSameVNode(v1, v2) {
    return v1.type === v2.type && v1.key == v2.key;
  }
  function createVNode(type, props = null, children = null) {
    let shapFlag = isString(type) ? shapeFlags.ELEMENT : 0;
    const vnode = {
      __v_isVNode: true,
      type,
      props,
      children,
      key: props && props.key,
      el: null,
      shapFlag
    };
    if (children) {
      let temp = 0;
      if (isArray(children)) {
        temp = shapeFlags.ARRAY_CHILDREN;
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

  // packages/runtime-core/src/renderer.ts
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
    function mountChildren(children, container) {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children, i);
        patch(null, child, container);
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
    function mountElement(vnode, dom, anchor) {
      let { type, props, children, shapFlag } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (props) {
        patchProps(null, props, el);
      }
      if (shapFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      }
      if (shapFlag & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, el);
      }
      hostInsert(el, dom, anchor);
    }
    function processText(preVnode, vnode, dom) {
      if (preVnode == null) {
        hostInsert(vnode.el = hostCreateTextNode(vnode.children), dom);
      }
    }
    function unmountChildren(children) {
      children.forEach((child) => {
        unmount(child);
      });
    }
    function patchKeyedChildren(c1, c2, el) {
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
          patch(n1, n2, el);
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
            patch(null, c2[i], el, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            unmount(c1[i]);
            i++;
          }
        }
      }
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
          unmount(oldVNode);
        } else {
          seq[newIndex - s2] = i2 + 1;
          patch(oldVNode, c2[newIndex], el);
        }
      }
      console.log(seq);
      for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
        const currentIndex = s2 + i2;
        const child = c2[currentIndex];
        const anchor = currentIndex + 1 <= c2.length ? c2[currentIndex + 1].el : null;
        if (seq[i2] === 0) {
          patch(null, child, el, anchor);
        } else {
          hostInsert(child.el, el, anchor);
        }
      }
      console.log(keyToNewIndexMap);
    }
    function patchChild(preVnode, vnode, el) {
      let c1 = preVnode.children;
      let c2 = vnode.children;
      const preShapFlag = preVnode.shapFlag;
      const ShapFlag = vnode.shapFlag;
      if (ShapFlag & 8 /* TEXT_CHILDREN */) {
        if (preShapFlag & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1);
        }
        if (c1 !== c2) {
          hostSetElementText(el, c2);
        }
      } else {
        if (preShapFlag & 16 /* ARRAY_CHILDREN */) {
          if (ShapFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(c1, c2, el);
          } else {
            unmountChildren(c1);
          }
        } else {
          if (preShapFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(el, "");
          }
          if (ShapFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(c2, el);
          }
        }
      }
    }
    function patchElement(preVnode, vnode) {
      let el = vnode.el = preVnode.el;
      let oldProps = preVnode.props;
      let newProps = vnode.props;
      patchProps(oldProps, newProps, el);
      patchChild(preVnode, vnode, el);
    }
    function processElement(preVnode, vnode, dom, anchor) {
      if (preVnode == null) {
        mountElement(vnode, dom, anchor);
      } else {
        patchElement(preVnode, vnode);
      }
    }
    function unmount(preVnode) {
      hostRemove(preVnode.el);
    }
    function patch(preVnode, vnode, dom, anchor = null) {
      if (preVnode && !isSameVNode(preVnode, vnode)) {
        unmount(preVnode);
        preVnode = null;
      }
      const { type, shapFlag } = vnode;
      switch (type) {
        case Text:
          processText(preVnode, vnode, dom);
          break;
        default:
          if (shapFlag & 1 /* ELEMENT */) {
            processElement(preVnode, vnode, dom, anchor);
          }
      }
    }
    function render2(vnode, container) {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode);
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
