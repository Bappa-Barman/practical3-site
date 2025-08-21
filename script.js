// Demo product data (diamond packs)
const products = [
  { id: 1, title: "Diamond Pack - Small (50)", price: 49, desc: "50 diamonds instant topup." },
  { id: 2, title: "Diamond Pack - Medium (150)", price: 129, desc: "150 diamonds + bonus 10%" },
  { id: 3, title: "Diamond Pack - Large (500)", price: 399, desc: "500 diamonds + bonus 25%" },
  { id: 4, title: "Diamond Pack - Mega (1200)", price: 899, desc: "Best value for heavy players" }
];

let cart = [];

/* ---------- UI elements ---------- */
const productsSection = document.getElementById("productsSection");
const cartSection = document.getElementById("cartSection");
const cartListEl = document.getElementById("cartList");
const subtotalEl = document.getElementById("subtotal");
const cartCountEl = document.getElementById("cartCount");
const viewCartBtn = document.getElementById("viewCartBtn");
const viewProductsBtn = document.getElementById("viewProductsBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMessage = document.getElementById("checkoutMessage");

/* ---------- render products ---------- */
function renderProducts(){
  productsSection.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="badge">Instant</div>
      <div class="product-title">${p.title}</div>
      <div class="muted">${p.desc}</div>
      <div class="price">₹${p.price}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="primary" data-id="${p.id}">Add to cart</button>
        <button class="ghost" onclick="alert('This is a demo. No real recharge is performed.')">Info</button>
      </div>
    `;
    productsSection.appendChild(card);
  });

  // attach add-to-cart handlers
  document.querySelectorAll(".card .primary").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const id = Number(e.target.dataset.id);
      addToCart(id);
    });
  });
}

/* ---------- cart logic ---------- */
function addToCart(productId){
  const existing = cart.find(c=>c.id===productId);
  if(existing){
    existing.qty += 1;
  } else {
    const p = products.find(x=>x.id===productId);
    cart.push({ id:p.id, title:p.title, price:p.price, qty:1 });
  }
  saveAndRenderCart();
}

function removeFromCart(productId){
  cart = cart.filter(c=>c.id!==productId);
  saveAndRenderCart();
}

function changeQty(productId, delta){
  const item = cart.find(c=>c.id===productId);
  if(!item) return;
  item.qty += delta;
  if(item.qty < 1) removeFromCart(productId);
  saveAndRenderCart();
}

function saveAndRenderCart(){
  // simple persistence using localStorage (keeps during browser session)
  localStorage.setItem("shop_demo_cart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartListEl.innerHTML = "";
  if(cart.length === 0){
    cartListEl.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach(item=>{
      const row = document.createElement("div");
      row.className = "cart-list-item";
      row.innerHTML = `
        <div style="flex:1">
          <div class="cart-item-name">${item.title}</div>
          <div class="muted">₹${item.price} × ${item.qty}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="ghost" data-action="dec" data-id="${item.id}">−</button>
          <button class="ghost" data-action="inc" data-id="${item.id}">+</button>
          <button class="ghost" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      cartListEl.appendChild(row);
    });

    // attach handlers
    cartListEl.querySelectorAll("button").forEach(b=>{
      const id = Number(b.dataset.id);
      const action = b.dataset.action;
      if(action === "inc") b.addEventListener("click", ()=> changeQty(id, 1));
      if(action === "dec") b.addEventListener("click", ()=> changeQty(id, -1));
      if(action === "remove") b.addEventListener("click", ()=> removeFromCart(id));
    });
  }

  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  subtotalEl.textContent = `₹${subtotal}`;
  cartCountEl.textContent = cart.reduce((s,i)=> s + i.qty, 0);
}

/* ---------- navigation handlers ---------- */
viewCartBtn.addEventListener("click", ()=>{
  productsSection.classList.add("hidden");
  cartSection.classList.remove("hidden");
  document.getElementById("about").classList.add("hidden");
});

viewProductsBtn.addEventListener("click", ()=>{
  productsSection.classList.remove("hidden");
  cartSection.classList.add("hidden");
  document.getElementById("about").classList.remove("hidden");
});

/* ---------- checkout (demo) ---------- */
checkoutBtn.addEventListener("click", ()=>{
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }
  // simulate order
  const subtotal = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  checkoutMessage.classList.remove("hidden");
  checkoutMessage.textContent = `Checkout simulated. Order total: ₹${subtotal}. (Demo only — no real payment.)`;
  cart = [];
  saveAndRenderCart();
});

/* ---------- init ---------- */
function init(){
  // load saved cart
  const saved = localStorage.getItem("shop_demo_cart");
  if(saved) cart = JSON.parse(saved);

  renderProducts();
  renderCart();
}

init();
