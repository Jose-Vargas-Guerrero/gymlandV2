import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import 'html-escaper';
import 'clsx';
import './chunks/astro_DYzw0DtZ.mjs';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".gallery-container[data-astro-cid-z6knrcby]{padding:120px 60px;display:flex;flex-direction:column}.gallery-info[data-astro-cid-z6knrcby]{position:fixed;top:100px;right:200px}.gallery-image[data-astro-cid-z6knrcby]{max-width:50%;height:auto}.gallery-inner[data-astro-cid-z6knrcby]{display:flex;flex-direction:column}h2[data-astro-cid-z6knrcby]{font-family:Montserrat,sans-serif}.sales[data-astro-cid-z6knrcby]{font-family:Montserrat,sans-serif;color:#fff;border-radius:14px;background-color:#000;padding:10px;width:auto;position:relative}p[data-astro-cid-z6knrcby]{font-family:Roboto,sans-serif;font-size:1rem;width:300px}.space[data-astro-cid-z6knrcby]{margin-bottom:30px}.wlink[data-astro-cid-z6knrcby]{font-family:Montserrat,sans-serif;font-weight:700;text-decoration:none;font-size:1rem;color:#fff;background-color:#000;padding:10px 14px;border-radius:20px;transition:background-color .4s,color .4s ease}.wlink[data-astro-cid-z6knrcby]:hover{background-color:#5e5a5a;transition:background-color .3s,color .3s ease}@media screen and (max-width: 768px){.gallery-container[data-astro-cid-z6knrcby]{width:100%;height:120vh;overflow-x:auto;padding:90px 0}.gallery-images[data-astro-cid-z6knrcby]{display:flex;flex-wrap:nowrap;scroll-snap-type:x mandatory;overflow-x:scroll;-webkit-overflow-scrolling:touch;align-items:flex-start}.gallery-inner[data-astro-cid-z6knrcby]{display:flex;flex-direction:row}.gallery-image[data-astro-cid-z6knrcby]{flex:0 0 auto;scroll-snap-align:start;max-width:80%;max-height:30%;height:auto}.gallery-info[data-astro-cid-z6knrcby]{margin-top:40px;position:static;text-align:center;display:flex;justify-content:center;align-items:center}.box[data-astro-cid-z6knrcby]{width:100%;text-align:center}h2[data-astro-cid-z6knrcby]{font-family:Montserrat,sans-serif;color:#000}p[data-astro-cid-z6knrcby]{font-family:Roboto,sans-serif;font-size:1.1rem;color:#000;width:100%}}\n"}],"routeData":{"route":"/products/[name]","isIndex":false,"type":"page","pattern":"^\\/products\\/([^/]+?)\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"src/pages/products/[name].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".products-body[data-astro-cid-ttgomkr6]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-ttgomkr6]{max-width:100vw;height:auto;padding:0 60px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:80px}.product-image[data-astro-cid-ttgomkr6]{width:260px;height:350px}.fade[data-astro-cid-ttgomkr6]{position:absolute;opacity:0;width:260px;height:350px;transition:opacity .2s ease}.fade[data-astro-cid-ttgomkr6]:hover{opacity:1;transition:opacity .3s ease}.imageBox[data-astro-cid-ttgomkr6]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-ttgomkr6]{text-decoration:none;color:#000}.product-name[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:10px 0}.product-type[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:3px 0}.color[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:3px 0;width:200px}.price[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:5px 0}.stock[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;color:#bf2e35;margin:3px 0;font-size:1.1rem}.sales[data-astro-cid-ttgomkr6]{color:#fff;border-radius:14px;background-color:#000;padding:10px;width:auto;position:relative}.box[data-astro-cid-ttgomkr6]{padding:1rem}@media screen and (max-width: 767px){.products-body[data-astro-cid-ttgomkr6]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-ttgomkr6]{max-width:100vw;height:auto;padding:0 60px;display:flex;flex-direction:column;justify-content:center;align-items:center}.product-image[data-astro-cid-ttgomkr6]{width:260px;height:350px}.imageBox[data-astro-cid-ttgomkr6]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-ttgomkr6]{text-decoration:none;color:#000}.product-name[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:10px 0;text-align:left}.product-type[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif}.color[data-astro-cid-ttgomkr6],.price[data-astro-cid-ttgomkr6]{font-family:Roboto,sans-serif;margin:3px 0}}\n"}],"routeData":{"route":"/products","isIndex":true,"type":"page","pattern":"^\\/products\\/?$","segments":[[{"content":"products","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/products/index.astro","pathname":"/products","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".gallery-container[data-astro-cid-255u5wwk]{padding:120px 30px;display:flex;flex-direction:column}.gallery-info[data-astro-cid-255u5wwk]{height:auto;position:fixed;top:100px;right:200px}.gallery-image[data-astro-cid-255u5wwk]{max-width:50%}.gallery-inner[data-astro-cid-255u5wwk]{display:flex;flex-direction:column}h2[data-astro-cid-255u5wwk]{font-family:Montserrat,sans-serif}p[data-astro-cid-255u5wwk]{font-family:Roboto,sans-serif;font-size:1rem;padding:10px 0;width:300px}.space[data-astro-cid-255u5wwk]{margin-bottom:30px}.wlink[data-astro-cid-255u5wwk]{font-family:Montserrat,sans-serif;font-weight:700;text-decoration:none;font-size:1rem;color:#fff;background-color:#000;padding:10px 14px;border-radius:20px;transition:background-color .4s,color .4s ease}.wlink[data-astro-cid-255u5wwk]:hover{background-color:#5e5a5a;transition:background-color .3s,color .3s ease}@media screen and (max-width: 768px){.gallery-container[data-astro-cid-255u5wwk]{width:100%;height:120vh;overflow-x:auto;padding:90px 0}.gallery-images[data-astro-cid-255u5wwk]{display:flex;flex-wrap:nowrap;scroll-snap-type:x mandatory;overflow-x:scroll;-webkit-overflow-scrolling:touch;align-items:flex-start}.gallery-inner[data-astro-cid-255u5wwk]{display:flex;flex-direction:row}.gallery-image[data-astro-cid-255u5wwk]{flex:0 0 auto;scroll-snap-align:start;max-width:80%;max-height:30%;height:auto}.gallery-info[data-astro-cid-255u5wwk]{margin-top:40px;position:static;text-align:center;display:flex;justify-content:center;align-items:center}.box[data-astro-cid-255u5wwk]{width:100%;text-align:center}h2[data-astro-cid-255u5wwk]{font-family:Montserrat,sans-serif;color:#000}p[data-astro-cid-255u5wwk]{font-family:Roboto,sans-serif;font-size:1.1rem;color:#000;width:100%}}\n"}],"routeData":{"route":"/sproducts/[name]","isIndex":false,"type":"page","pattern":"^\\/sproducts\\/([^/]+?)\\/?$","segments":[[{"content":"sproducts","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"src/pages/sproducts/[name].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".products-body[data-astro-cid-2rrezcdg]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-2rrezcdg]{max-width:100vw;height:auto;padding:0 60px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:100px}.product-image[data-astro-cid-2rrezcdg]{width:260px;height:350px}.fade[data-astro-cid-2rrezcdg]{position:absolute;opacity:0;width:260px;height:350px;transition:opacity .2s ease}.fade[data-astro-cid-2rrezcdg]:hover{opacity:1;transition:opacity .3s ease}.imageBox[data-astro-cid-2rrezcdg]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-2rrezcdg]{text-decoration:none;color:#000}.product-name[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:10px 0}.product-type[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:3px 0}.color[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:3px 0;width:200px}.price[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:3px 0}.stock[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;color:#bf2e35;margin:3px 0;font-size:1.1rem}.box[data-astro-cid-2rrezcdg]{padding:1rem}@media screen and (max-width: 767px){.products-body[data-astro-cid-2rrezcdg]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-2rrezcdg]{max-width:100vw;height:auto;padding:0 60px;display:flex;flex-direction:column;justify-content:center;align-items:center}.product-image[data-astro-cid-2rrezcdg]{width:260px;height:350px}.imageBox[data-astro-cid-2rrezcdg]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-2rrezcdg]{text-decoration:none;color:#000}.product-name[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:10px 0;text-align:left}.product-type[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif}.color[data-astro-cid-2rrezcdg],.price[data-astro-cid-2rrezcdg]{font-family:Roboto,sans-serif;margin:3px 0}}\n"}],"routeData":{"route":"/sproducts","isIndex":true,"type":"page","pattern":"^\\/sproducts\\/?$","segments":[[{"content":"sproducts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sproducts/index.astro","pathname":"/sproducts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".gallery-container[data-astro-cid-jwa3xvnc]{padding:120px 30px;display:flex;flex-direction:column}.gallery-info[data-astro-cid-jwa3xvnc]{position:fixed;top:100px;right:200px}.gallery-image[data-astro-cid-jwa3xvnc]{max-width:50%}.gallery-inner[data-astro-cid-jwa3xvnc]{display:flex;flex-direction:column}h2[data-astro-cid-jwa3xvnc]{font-family:Montserrat,sans-serif}.sales[data-astro-cid-jwa3xvnc]{font-family:Montserrat,sans-serif;color:#fff;border-radius:14px;background-color:#000;padding:10px;width:auto;position:relative}p[data-astro-cid-jwa3xvnc]{font-family:Roboto,sans-serif;font-size:1rem;width:300px;padding:10px 0}.space[data-astro-cid-jwa3xvnc]{margin-bottom:30px}.wlink[data-astro-cid-jwa3xvnc]{font-family:Montserrat,sans-serif;font-weight:700;text-decoration:none;font-size:1rem;color:#fff;background-color:#000;padding:10px 14px;border-radius:20px;transition:background-color .4s,color .4s ease}.wlink[data-astro-cid-jwa3xvnc]:hover{background-color:#5e5a5a;transition:background-color .3s,color .3s ease}@media screen and (max-width: 768px){.gallery-container[data-astro-cid-jwa3xvnc]{width:100%;height:120vh;overflow-x:auto;padding:90px 0}.gallery-images[data-astro-cid-jwa3xvnc]{display:flex;flex-wrap:nowrap;scroll-snap-type:x mandatory;overflow-x:scroll;-webkit-overflow-scrolling:touch;align-items:flex-start}.gallery-inner[data-astro-cid-jwa3xvnc]{display:flex;flex-direction:row}.gallery-image[data-astro-cid-jwa3xvnc]{flex:0 0 auto;scroll-snap-align:start;max-width:80%;max-height:30%;height:auto}.gallery-info[data-astro-cid-jwa3xvnc]{margin-top:40px;position:static;text-align:center;display:flex;justify-content:center;align-items:center}.box[data-astro-cid-jwa3xvnc]{width:100%;text-align:center}h2[data-astro-cid-jwa3xvnc]{font-family:Montserrat,sans-serif;color:#000}p[data-astro-cid-jwa3xvnc]{font-family:Roboto,sans-serif;font-size:1.1rem;color:#000;width:100%}}\n"}],"routeData":{"route":"/wbest/[name]","isIndex":false,"type":"page","pattern":"^\\/wbest\\/([^/]+?)\\/?$","segments":[[{"content":"wbest","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"src/pages/wbest/[name].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"inline","content":".products-body[data-astro-cid-6woww5vj]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-6woww5vj]{max-width:100vw;height:auto;padding:0 60px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:100px}.product-image[data-astro-cid-6woww5vj]{width:260px;height:350px}.fade[data-astro-cid-6woww5vj]{position:absolute;opacity:0;width:260px;height:350px;transition:opacity .2s ease}.fade[data-astro-cid-6woww5vj]:hover{opacity:1;transition:opacity .3s ease}.imageBox[data-astro-cid-6woww5vj]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-6woww5vj]{text-decoration:none;color:#000}.product-name[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif;margin:10px 0}.product-type[data-astro-cid-6woww5vj],.color[data-astro-cid-6woww5vj],.price[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif;margin:3px 0}.stock[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif;color:#bf2e35;margin:3px 0;font-size:1.1rem}.sales[data-astro-cid-6woww5vj]{color:#fff;border-radius:14px;background-color:#000;padding:10px;width:auto;position:relative}.box[data-astro-cid-6woww5vj]{padding:1rem}@media screen and (max-width: 767px){.products-body[data-astro-cid-6woww5vj]{margin-top:200px;margin-bottom:200px;padding:0 100px}.products-container[data-astro-cid-6woww5vj]{max-width:100vw;height:auto;padding:0 60px;display:flex;flex-direction:column;justify-content:center;align-items:center}.product-image[data-astro-cid-6woww5vj]{width:260px;height:350px}.imageBox[data-astro-cid-6woww5vj]{width:260px;height:350px;display:flex;box-shadow:#64646f33 0 7px 29px}.image-Link[data-astro-cid-6woww5vj]{text-decoration:none;color:#000}.product-name[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif;margin:10px 0;text-align:left}.product-type[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif}.color[data-astro-cid-6woww5vj],.price[data-astro-cid-6woww5vj]{font-family:Roboto,sans-serif;margin:3px 0}}\n"}],"routeData":{"route":"/wbest","isIndex":true,"type":"page","pattern":"^\\/wbest\\/?$","segments":[[{"content":"wbest","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/wbest/index.astro","pathname":"/wbest","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BaM_ibfh.css"},{"type":"external","src":"/_astro/index.B3oVEq6S.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/[name].astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/[name].astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/[name].astro",{"propagation":"none","containsHead":true}],["C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_XXEPpNlC.mjs","\u0000@astrojs-manifest":"manifest_CfOSDjkT.mjs","C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_Dd74jOYw.mjs","\u0000@astro-page:src/pages/products/[name]@_@astro":"chunks/_name__Kq7gywAm.mjs","\u0000@astro-page:src/pages/products/index@_@astro":"chunks/index_VTIOvjs2.mjs","\u0000@astro-page:src/pages/sproducts/[name]@_@astro":"chunks/_name__ChNhUdN_.mjs","\u0000@astro-page:src/pages/sproducts/index@_@astro":"chunks/index_B3edJYvo.mjs","\u0000@astro-page:src/pages/wbest/[name]@_@astro":"chunks/_name__B3llKOEh.mjs","\u0000@astro-page:src/pages/wbest/index@_@astro":"chunks/index_BJMnMlh4.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_7GKzqRm5.mjs","react-icons/fa":"_astro/fa.WxKW-vXo.js","react-icons/io":"_astro/io.D4imDQT8.js","C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/components/reactComponents/Menu":"_astro/Menu.vfcAvvd3.js","@astrojs/react/client.js":"_astro/client.Bo8v_D3g.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/logo.DSs0V6y6.jpg","/_astro/index.B3oVEq6S.css","/_astro/index.BaM_ibfh.css","/favicon.svg","/favicon1.svg","/_astro/client.Bo8v_D3g.js","/_astro/fa.BR1gvjhG.js","/_astro/fa.WxKW-vXo.js","/_astro/iconBase.BimQ2q1R.js","/_astro/index.B52nOzfP.js","/_astro/index.Dl9oAmxF.css","/_astro/io.D4imDQT8.js","/_astro/Menu.vfcAvvd3.js"],"buildFormat":"directory","checkOrigin":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
