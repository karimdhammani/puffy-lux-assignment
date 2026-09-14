(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = n => '$' + Number(n).toLocaleString('en-US');
  const announce = text => { $('pf-live').textContent = text; };
  const cards = [...document.querySelectorAll('.pf-size-card')];
  let selected = cards.find(card => card.dataset.size === 'queen');
  const sizesDialog = $('pf-sizes');
  function selectSize(card) {
    selected = card;
    cards.forEach(item => {
      item.setAttribute('aria-checked', String(item === card));
      item.tabIndex = item === card ? 0 : -1;
    });
    $('pf-price').textContent = money(card.dataset.price);
    $('pf-value').textContent = money(Number(card.dataset.price) + 1350);
    $('pf-size-name').textContent = card.dataset.label;
    $('pf-size-dims').textContent = `${card.dataset.width}" × ${card.dataset.length}"`;
    $('dialog-selection').textContent = card.dataset.label;
    announce(`${card.dataset.label}, ${money(card.dataset.price)}, selected.`);
  }
  cards.forEach(card => card.addEventListener('click', () => selectSize(card)));
  $('pf-sizes-grid').addEventListener('keydown', event => {
    const keys = ['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let index = cards.indexOf(selected);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = cards.length - 1;
    else index = (index + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + cards.length) % cards.length;
    selectSize(cards[index]); cards[index].focus();
  });
  $('pf-size-open').addEventListener('click', () => { sizesDialog.showModal(); selected.focus(); });
  $('pf-sizes-close').addEventListener('click', () => sizesDialog.close());
  $('pf-sizes-confirm').addEventListener('click', () => sizesDialog.close());
  $('size-guide-open').addEventListener('click', () => $('size-guide').showModal());

  const thumbs = [...document.querySelectorAll('.pf-thumb')];
  const media = $('pf-media'), range = $('pf-handle'), hero = $('pf-hero');
  let slide = 0, revealOn = false, animation = 0;
  function applyReveal(percent) {
    const value = Math.max(0, Math.min(100, percent));
    // Exterior stays on the left; the full-size cutaway is clipped on its left edge.
    media.style.setProperty('--pos', (100 - value) + '%');
    range.value = String(value);
    range.setAttribute('aria-valuetext', `${Math.round(value)}% X-ray visible on the right`);
    media.querySelector('.pf-media__grip').style.transform = `translate(${value === 100 ? '0' : value === 0 ? '-100%' : '-50%'}, -50%)`;
  }
  function setReveal(on, animate = false) {
    cancelAnimationFrame(animation);
    revealOn = on;
    media.classList.toggle('is-revealing', on);
    $('pf-reveal').hidden = !on;
    $('pf-reveal-btn').setAttribute('aria-expanded', String(on));
    $('pf-reveal-label').textContent = on ? 'Close X-ray' : "See what's inside";
    $('pf-reveal-icon').src = `system/icons/${on ? 'close-ink' : 'layers-ink'}.svg`;
    hero.alt = on ? 'Puffy Lux exterior on the left and illustrated interior layers on the right. Drag left to reveal more.' : thumbs[0].dataset.alt;
    if (!on) { applyReveal(0); return; }
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { applyReveal(50); return; }
    applyReveal(0);
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 550);
      applyReveal(50 * (1 - Math.pow(1 - t, 3)));
      if (t < 1) animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
  }
  function showImage(index) {
    slide = (index + thumbs.length) % thumbs.length;
    setReveal(false);
    hero.src = thumbs[slide].dataset.src;
    hero.alt = thumbs[slide].dataset.alt;
    $('pf-award').hidden = slide !== 0;
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('is-current', i === slide);
      thumb.setAttribute('aria-current', String(i === slide));
    });
    announce(thumbs[slide].getAttribute('aria-label'));
  }
  thumbs.forEach((thumb,i) => thumb.addEventListener('click', () => showImage(i)));
  $('pf-prev').addEventListener('click', () => showImage(slide - 1));
  $('pf-next').addEventListener('click', () => showImage(slide + 1));
  $('pf-reveal-btn').addEventListener('click', () => {
    if (!revealOn) {
      showImage(0); setReveal(true, true); range.focus({preventScroll:true});
      announce('X-ray view open. Drag left or use the left arrow key to reveal the mattress interior.');
    } else setReveal(false);
  });
  range.addEventListener('input', () => { cancelAnimationFrame(animation); applyReveal(Number(range.value)); });
  range.addEventListener('keydown', event => {
    const step = event.shiftKey ? 10 : 2;
    const changes = {ArrowLeft:step, ArrowUp:step, ArrowRight:-step, ArrowDown:-step};
    if (!(event.key in changes) && !['Home','End'].includes(event.key)) return;
    event.preventDefault(); cancelAnimationFrame(animation);
    applyReveal(event.key === 'Home' ? 0 : event.key === 'End' ? 100 : Number(range.value) + changes[event.key]);
  });
  // Pointer capture gives exact image coordinates and retains drag outside the image.
  let drag = null;
  const fromPointer = event => {
    const bounds = media.getBoundingClientRect();
    applyReveal(100 - ((event.clientX - bounds.left) / bounds.width) * 100);
  };
  range.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    cancelAnimationFrame(animation); drag = event.pointerId;
    range.setPointerCapture(event.pointerId); range.focus({preventScroll:true});
    event.preventDefault(); fromPointer(event);
  });
  range.addEventListener('pointermove', event => { if (drag === event.pointerId) { event.preventDefault(); fromPointer(event); } });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => range.addEventListener(type, () => { drag = null; }));
  range.addEventListener('click', event => event.preventDefault());
  setReveal(false);

  const galleryNames = ['Evening skyline','Layer construction','Quilted cover detail','Pressure relief','Mattress details','Eight-layer construction','Comfort and support','Cooling layer','Edge support','Puffy Lux lifestyle','Mattress overview'];
  // Eleven product views, with the generated evening hero replacing the original first image.
  for (let i=1;i<=11;i++) {
    const button = document.createElement('button'); button.type = 'button';
    const img = document.createElement('img'); img.src = i === 1 ? 'assets/normal.png' : `assets/${String(i).padStart(2,'0')}.jpg`; img.alt = ''; img.loading = 'lazy';
    const label = document.createElement('span'); label.textContent = `${String(i).padStart(2,'0')} · ${galleryNames[i-1]}`;
    button.append(img,label);
    button.addEventListener('click', () => {
      setReveal(false); hero.src = img.src; hero.alt = galleryNames[i-1];
      const matching = thumbs.findIndex(t => new URL(t.dataset.src,location.href).href === img.src);
      slide = matching >= 0 ? matching : 0;
      thumbs.forEach((t,j) => { t.classList.toggle('is-current',j===matching); t.setAttribute('aria-current',String(j===matching)); });
      $('pf-award').hidden = i !== 1;
      $('gallery-dialog').close(); $('gallery-open').focus();
    });
    $('full-gallery').append(button);
  }
  $('gallery-open').addEventListener('click', () => $('gallery-dialog').showModal());

  const cart = new Map();
  function paintCart() {
    const content = $('cart-content'); content.replaceChildren();
    if (!cart.size) { const p = document.createElement('p'); p.textContent = 'Your cart is empty. Choose a size to try the Add to Cart interaction.'; content.append(p); }
    let count = 0;
    cart.forEach((item,key) => {
      count += item.quantity;
      const row = document.createElement('div'); row.className = 'cart-line';
      const img = document.createElement('img'); img.src = 'assets/normal.png'; img.alt = 'Puffy Lux Hybrid';
      const detail = document.createElement('p');
      const title = document.createElement('b'); title.textContent = `Puffy Lux Hybrid · ${item.label}`;
      const price = document.createElement('span'); price.textContent = `${money(item.price)} × ${item.quantity}`;
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'cart-remove'; remove.textContent = 'Remove'; remove.setAttribute('aria-label',`Remove ${item.label} from cart`);
      remove.addEventListener('click', () => { cart.delete(key); paintCart(); announce(`${item.label} removed from cart.`); });
      detail.append(title,price,remove); row.append(img,detail); content.append(row);
    });
    $('cart-open').setAttribute('aria-label',`Cart, ${count} ${count===1?'item':'items'}`);
  }
  function addToCart() {
    const data = selected.dataset;
    const existing = cart.get(data.size);
    cart.set(data.size,{label:data.label, price:Number(data.price),quantity:existing ? existing.quantity+1 : 1});
    if (sizesDialog.open) sizesDialog.close();
    paintCart(); $('cart-dialog').showModal();
    announce(`${data.label} added to the prototype cart.`);
  }
  $('pf-add').addEventListener('click',addToCart);
  $('dialog-add').addEventListener('click',addToCart);
  $('cart-open').addEventListener('click',() => { paintCart(); $('cart-dialog').showModal(); });
  $('pf-offer').addEventListener('click',() => { $('pf-offer').title = 'The Royal upgrade and two pillows plus two sleep masks are included in the assignment offer.'; announce($('pf-offer').title); });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click',() => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
})();
