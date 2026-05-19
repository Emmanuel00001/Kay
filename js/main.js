const currencies = {
    NG: { code: 'NGN', symbol: '₦', rate: 1650 },   // Nigeria  
    US: { code: 'USD', symbol: '$', rate: 1.09 },    // United States
    GB: { code: 'GBP', symbol: '£', rate: 0.86 },    // United Kingdom
    IE: { code: 'EUR', symbol: '€', rate: 1 },        // Ireland (base)
    ZA: { code: 'ZAR', symbol: 'R', rate: 21.5 },    // South Africa
    GH: { code: 'GHS', symbol: 'GH₵', rate: 16.2 },  // Ghana
    KE: { code: 'KES', symbol: 'KSh', rate: 140 },   // Kenya
    CA: { code: 'CAD', symbol: 'CA$', rate: 1.48 },  // Canada
    AU: { code: 'AUD', symbol: 'A$', rate: 1.65 },   // Australia
    DE: { code: 'EUR', symbol: '€', rate: 1 },        // Germany
    FR: { code: 'EUR', symbol: '€', rate: 1 },        // France
};

let userCurrency = { code: 'EUR', symbol: '€', rate: 1 };

async function detectCurrency() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const countryCode = data.country_code;

        if (currencies[countryCode]) {
            userCurrency = currencies[countryCode];
        }
    } catch (e) {
        // If detection fails, keep default EUR
        console.log('Currency detection failed, using EUR');
    }

    updateAllPrices();
}

function convertPrice(eurPrice) {
    const converted = eurPrice * userCurrency.rate;
    return userCurrency.symbol + converted.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function updateAllPrices() {
    const priceEls = document.querySelectorAll('[data-price]');
    priceEls.forEach(el => {
        const eurPrice = parseFloat(el.getAttribute('data-price'));
        el.textContent = convertPrice(eurPrice);
    });
}

async function detectCurrency() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const countryCode = data.country_code;

        if (currencies[countryCode]) {
            userCurrency = currencies[countryCode];
        }
    } catch (e) {
        try {
            const res2 = await fetch('https://api.country.is/');
            const data2 = await res2.json();
            const countryCode = data2.country;

            if (currencies[countryCode]) {
                userCurrency = currencies[countryCode];
            }
        } catch (e2) {
            console.log('Currency detection failed, using EUR');
        }
    }

    setTimeout(() => {
        updateAllPrices();
    }, 100);
}

function getCart() {
    return JSON.parse(localStorage.getItem('Kay-cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('Kay-cart', JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showNotification(product.name + ' added to cart');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
}

function updateQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    saveCart(cart);
    updateCartCount();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartCount() {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const count = getCartCount();
        countEl.textContent = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #0a0a0a;
        color: #f8f5f0;
        padding: 16px 24px;
        font-family: 'Jost', sans-serif;
        font-size: 13px;
        letter-spacing: 1px;
        z-index: 9999;
        border-left: 3px solid #c9a96e;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
}

const products = [
    {
        id: 1,
        name: "Milano Leather Tote",
        category: "bags",
        price: 485,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        description: "Hand-crafted full-grain leather tote bag. Made in Milan with traditional Italian craftsmanship. Spacious interior with suede lining.",
        colors: ["Black", "Tan", "Burgundy"],
        featured: true
    },
    {
        id: 2,
        name: "Roma Stiletto",
        category: "shoes",
        price: 320,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
        description: "Elegant Italian leather stiletto. Hand-stitched with premium calfskin leather. A statement piece for every occasion.",
        colors: ["Black", "Nude", "Red"],
        featured: true
    },
    {
        id: 3,
        name: "Venezia Clutch",
        category: "purses",
        price: 215,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
        description: "Compact evening clutch in smooth Italian leather. Gold-tone hardware. Detachable chain strap.",
        colors: ["Black", "Gold", "Silver"],
        featured: true
    },
    {
        id: 4,
        name: "Firenze Loafer",
        category: "shoes",
        price: 275,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
        description: "Classic Italian loafer in supple leather. Rubber sole for comfort. Timeless design inspired by Florentine craftsmanship.",
        colors: ["Brown", "Black", "Navy"],
        featured: false
    },
    {
        id: 5,
        name: "Napoli Shoulder Bag",
        category: "bags",
        price: 395,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        description: "Structured shoulder bag in pebbled leather. Adjustable strap. Gold hardware. Perfect for day to evening.",
        colors: ["Black", "Camel"],
        featured: false
    },
    {
        id: 6,
        name: "Capri Mini Bag",
        category: "purses",
        price: 185,
        image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
        description: "Adorable mini bag with chain strap. Smooth Italian leather. Magnetic closure. The perfect going-out companion.",
        colors: ["Black", "Pink", "White"],
        featured: true
    },
    {
        id: 7,
        name: "Torino Block Heel",
        category: "shoes",
        price: 290,
        image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
        description: "Comfortable block heel in Italian suede. Ankle strap with gold buckle. Perfect balance of style and comfort.",
        colors: ["Beige", "Black", "Rust"],
        featured: false
    },
    {
        id: 8,
        name: "Amalfi Crossbody",
        category: "bags",
        price: 265,
        image: "https://th.bing.com/th/id/R.7bbf5292d66b504e44f12db0a440003f?rik=0dYc%2bUAvRxFdvg&riu=http%3a%2f%2falejandracollective.com.au%2fcdn%2fshop%2ffiles%2fAmalfi.jpg%3fv%3d1758624174%26width%3d2048&ehk=qWO1iqMRy8dOki970Y15HFQjNWwLo6%2bNg2OIHH82U7A%3d&risl=&pid=ImgRaw&r=0",
        description: "Lightweight crossbody in smooth leather. Long adjustable strap. Multiple interior pockets. Inspired by the Amalfi coast.",
        colors: ["Tan", "Black", "White"],
        featured: false
    }
];

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});