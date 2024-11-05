/* empty css                          */
import { e as createComponent, r as renderTemplate, i as renderComponent, m as maybeRenderHead, g as addAttribute } from '../astro_DYzw0DtZ.mjs';
import 'kleur/colors';
import 'html-escaper';
import { a as gymsharkProducts, $ as $$Footer, b as $$Layout, w as wproducts, c as wproducts$1 } from './_name__t7SRIsZ_.mjs';
/* empty css                          */
/* empty css                          */
/* empty css                          */
/* empty css                          */

const $$Index$3 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "gymshark products", "data-astro-cid-ttgomkr6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="products-body" data-astro-cid-ttgomkr6> <div class="products-container" data-astro-cid-ttgomkr6> ${gymsharkProducts.map((p) => renderTemplate`<div class="box"${addAttribute(p.color, "id")} data-astro-cid-ttgomkr6> <a class="image-Link"${addAttribute("/products/" + p.name, "href")} data-astro-cid-ttgomkr6> <div class="imageBox" data-astro-cid-ttgomkr6> <img loading="lazy" class="product-image"${addAttribute(p.image1, "src")}${addAttribute(p.name, "alt")} data-astro-cid-ttgomkr6> <img loading="lazy" class="product-image fade"${addAttribute(p.image2, "src")}${addAttribute(p.name, "alt")} data-astro-cid-ttgomkr6> </div> <h4 class="product-name" data-astro-cid-ttgomkr6>${p.productName}</h4> <strong class="stock" data-astro-cid-ttgomkr6>${p.stock}</strong> <p class="product-type" data-astro-cid-ttgomkr6>${p.category}</p> <p class="color" data-astro-cid-ttgomkr6>${p.color}</p> <p class="color" data-astro-cid-ttgomkr6>Size: ${p.size}</p> <strong class="price" data-astro-cid-ttgomkr6>L.${p.price} ${p.type}</strong> <br data-astro-cid-ttgomkr6> <br data-astro-cid-ttgomkr6> ${p.sales && renderTemplate`<strong class="price sales" data-astro-cid-ttgomkr6>Oferta: ${p.packet} L. ${p.sales}</strong>`} </a> </div>`)} </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-ttgomkr6": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/index.astro", void 0);

const $$file$3 = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/products/index.astro";
const $$url$3 = "/products";

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$3,
  file: $$file$3,
  url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index$2 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "gymshark products", "data-astro-cid-2rrezcdg": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="products-body" data-astro-cid-2rrezcdg> <div class="products-container" data-astro-cid-2rrezcdg> ${wproducts.map((p) => renderTemplate`<div class="box"${addAttribute(p.color, "id")} data-astro-cid-2rrezcdg> <a class="image-Link"${addAttribute("/sproducts/" + p.name, "href")} data-astro-cid-2rrezcdg> <div class="imageBox" data-astro-cid-2rrezcdg> <img loading="lazy" class="product-image"${addAttribute(p.image1, "src")}${addAttribute(p.name, "alt")} data-astro-cid-2rrezcdg> <img loading="lazy" class="product-image fade"${addAttribute(p.image2, "src")}${addAttribute(p.name, "alt")} data-astro-cid-2rrezcdg> </div> <h4 class="product-name" data-astro-cid-2rrezcdg>${p.productName}</h4> <strong class="stock" data-astro-cid-2rrezcdg>${p.stock}</strong> <p class="product-type" data-astro-cid-2rrezcdg>${p.category}</p> <p class="color" data-astro-cid-2rrezcdg>${p.color}</p> <p class="color" data-astro-cid-2rrezcdg>Size: ${p.size}</p> <strong class="price" data-astro-cid-2rrezcdg>L.${p.price}</strong> </a> </div>`)} </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-2rrezcdg": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/index.astro", void 0);

const $$file$2 = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/sproducts/index.astro";
const $$url$2 = "/sproducts";

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$2,
  file: $$file$2,
  url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "gymshark products", "data-astro-cid-6woww5vj": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="products-body" data-astro-cid-6woww5vj> <div class="products-container" data-astro-cid-6woww5vj> ${wproducts$1.map((p) => renderTemplate`<div class="box"${addAttribute(p.color, "id")} data-astro-cid-6woww5vj> <a class="image-Link"${addAttribute("/wbest/" + p.name, "href")} data-astro-cid-6woww5vj> <div class="imageBox" data-astro-cid-6woww5vj> <img loading="lazy" class="product-image"${addAttribute(p.image1, "src")}${addAttribute(p.name, "alt")} data-astro-cid-6woww5vj> <img loading="lazy" class="product-image fade"${addAttribute(p.image2, "src")}${addAttribute(p.name, "alt")} data-astro-cid-6woww5vj> </div> <h4 class="product-name" data-astro-cid-6woww5vj>${p.productName}</h4> <strong class="stock" data-astro-cid-6woww5vj>${p.stock}</strong> <p class="product-type" data-astro-cid-6woww5vj>${p.category}</p> <p class="color" data-astro-cid-6woww5vj>${p.color}</p> <p class="color" data-astro-cid-6woww5vj>Size: ${p.size}</p> <strong class="price" data-astro-cid-6woww5vj>L.${p.price}</strong> <br data-astro-cid-6woww5vj> <br data-astro-cid-6woww5vj> ${p.sales && renderTemplate`<strong class="price sales" data-astro-cid-6woww5vj>Oferta: ${p.packet} L. ${p.sales}</strong>`} </a> </div>`)} </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-6woww5vj": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/index.astro", void 0);

const $$file$1 = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/wbest/index.astro";
const $$url$1 = "/wbest";

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index$1,
  file: $$file$1,
  url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "gymland", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="herosales" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>¡Comienza el año con estilo! Renueva tu año, viste con confianza!</h2> <a href="/products" class="more" data-astro-cid-j7pv25f6>Ver Productos</a> </div> <div class="hero" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>¡Bienvenidos a nuestro catálogo GYMLANDHN!</h2> <p data-astro-cid-j7pv25f6>Descubre un mundo de estilo y comodidad en donde la moda deportiva se encuentra con la funcionalidad</p> <a href="/products" class="more" data-astro-cid-j7pv25f6>Ver Productos</a> </div> <div class="banner1" data-astro-cid-j7pv25f6> <h2 class="bannerTitle1" data-astro-cid-j7pv25f6>Poder y Estilo con Women's Best</h2> <p class="bannerText1" data-astro-cid-j7pv25f6>Acentúa tus curvas naturales</p> <a href="/wbest" class="more2" data-astro-cid-j7pv25f6>Ver Productos</a> </div> <div class="banner" data-astro-cid-j7pv25f6> <h2 class="bannerTitle" data-astro-cid-j7pv25f6>Eleva tu Día a Día</h2> <p class="bannerText" data-astro-cid-j7pv25f6>Los productos básicos y cómodos de Gymshark te acompañan en el camino</p> <a href="/products" class="more2" data-astro-cid-j7pv25f6>Ver Productos</a> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-j7pv25f6": true })} ` })} `;
}, "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/index.astro", void 0);

const $$file = "C:/Users/frava/OneDrive/Escritorio/proyectos/gymlandV2/src/pages/index.astro";
const $$url = "";

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { index$2 as a, index$1 as b, index as c, index$3 as i };
