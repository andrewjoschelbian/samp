const products = {
  diamond: [
    { id: 'd1', nama: '86 Diamond', harga: 20000 },
    { id: 'd2', nama: '172 Diamond', harga: 38000 },
    { id: 'd3', nama: '257 Diamond', harga: 55000 },
    { id: 'd4', nama: '344 Diamond', harga: 72000 },
    { id: 'd5', nama: '429 Diamond', harga: 88000 },
    { id: 'd6', nama: '514 Diamond', harga: 105000 },
    { id: 'd7', nama: '706 Diamond', harga: 142000 },
    { id: 'd8', nama: '1018 Diamond', harga: 200000 }
  ],
  skin: [
    { id: 's1', nama: 'Skin Layla - Starry Night', harga: 89000 },
    { id: 's2', nama: 'Skin Miya - Moon Priestess', harga: 89000 },
    { id: 's3', nama: 'Skin Alucard - Fallen Angel', harga: 129000 },
    { id: 's4', nama: 'Skin Fanny - Cyber', harga: 129000 }
  ],
  hero: [
    { id: 'h1', nama: 'Hero Ling', harga: 32000 },
    { id: 'h2', nama: 'Hero Benedetta', harga: 32000 },
    { id: 'h3', nama: 'Hero Aamon', harga: 32000 },
    { id: 'h4', nama: 'Hero Joy', harga: 32000 }
  ]
};

let selectedProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initProductSelection();
  initCheckoutForm();
  initSmoothScroll();
});

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const grids = document.querySelectorAll('.produk-grid');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      grids.forEach(grid => {
        if (grid.id === filter) {
          grid.classList.remove('hidden');
          grid.classList.add('active');
        } else {
          grid.classList.add('hidden');
          grid.classList.remove('active');
        }
      });
    });
  });
}

function initProductSelection() {
  const pilihBtns = document.querySelectorAll('.pilih-btn');
  
  pilihBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.produk-card');
      const productId = card.dataset.id;
      const productType = card.closest('.produk-grid').id;
      
      const productList = products[productType];
      selectedProduct = productList.find(p => p.id === productId);
      
      if (selectedProduct) {
        showCheckout();
      }
    });
  });
}

function showCheckout() {
  document.getElementById('produk').classList.add('hidden');
  document.getElementById('checkout').classList.remove('hidden');
  
  renderOrderSummary();
  
  document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
}

function renderOrderSummary() {
  const summaryEl = document.getElementById('order-summary');
  const totalEl = document.getElementById('total-price');
  
  if (!selectedProduct) return;
  
  summaryEl.innerHTML = `
    <div class="order-item">
      <div class="order-item-info">
        <h4>${selectedProduct.nama}</h4>
        <p>Mobile Legends: Bang Bang</p>
      </div>
      <span class="order-item-price">${formatRupiah(selectedProduct.harga)}</span>
    </div>
  `;
  
  totalEl.textContent = formatRupiah(selectedProduct.harga);
}

function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      product: selectedProduct,
      userId: formData.get('userId'),
      zoneId: formData.get('zoneId'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp'),
      payment: formData.get('payment')
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Memproses...';
    submitBtn.disabled = true;
    
    await simulatePayment(data);
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

async function simulatePayment(data) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const success = Math.random() > 0.1;
  
  if (success) {
    showNotifikasi('Pembayaran berhasil! Diamond akan dikirim ke akun Anda dalam 1-5 menit.', 'success');
    resetCheckout();
  } else {
    showNotifikasi('Pembayaran gagal. Silakan coba lagi atau hubungi support.', 'error');
  }
}

function resetCheckout() {
  selectedProduct = null;
  document.getElementById('checkout-form').reset();
  document.getElementById('checkout').classList.add('hidden');
  document.getElementById('produk').classList.remove('hidden');
}

function showNotifikasi(message, type = 'success') {
  const notif = document.getElementById('notifikasi');
  notif.textContent = message;
  notif.className = `notifikasi ${type}`;
  notif.classList.remove('hidden');
  
  setTimeout(() => {
    notif.classList.add('hidden');
  }, 5000);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const checkout = document.getElementById('checkout');
    if (!checkout.classList.contains('hidden')) {
      resetCheckout();
    }
  }
});