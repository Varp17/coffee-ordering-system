import { create } from 'zustand'

export const MENU = {
  bases: [
    { id: 'espresso',   label: 'Espresso',   price: 100, color: '#1a0800', dark: '#0a0400', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=120&q=80', desc: 'Rich & bold' },
    { id: 'coldbrew',   label: 'Cold Brew',  price: 120, color: '#2e1205', dark: '#180800', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&q=80', desc: 'Smooth & mellow' },
    { id: 'matcha',     label: 'Matcha',     price: 150, color: '#3d5c2a', dark: '#1e3010', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=120&q=80', desc: 'Earthy & fresh' },
    { id: 'chai',       label: 'Masala Chai',price: 90,  color: '#7a3010', dark: '#3d1808', img: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=120&q=80', desc: 'Spiced & warm' },
  ],
  milks: [
    { id: 'whole',   label: 'Whole Milk',   price: 0,  color: '#f5f0e8', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&q=80' },
    { id: 'oat',     label: 'Oat Milk',     price: 50, color: '#d4b87a', img: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=120&q=80' },
    { id: 'almond',  label: 'Almond Milk',  price: 50, color: '#e8c89a', img: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=120&q=80' },
    { id: 'coconut', label: 'Coconut Milk', price: 60, color: '#f0e8d8', img: 'https://images.unsplash.com/photo-1559181567-c3190100191e?w=120&q=80' },
    { id: 'none',    label: 'No Milk',      price: 0,  color: '#3a2010', img: null },
  ],
  syrups: [
    { id: 'vanilla',   label: 'Vanilla',   price: 30, color: '#f5e090' },
    { id: 'caramel',   label: 'Caramel',   price: 30, color: '#c87820' },
    { id: 'hazelnut',  label: 'Hazelnut',  price: 30, color: '#8b4513' },
    { id: 'lavender',  label: 'Lavender',  price: 35, color: '#9878c8' },
    { id: 'rose',      label: 'Rose',      price: 35, color: '#e08090' },
  ],
  toppings: [
    { id: 'whipped',   label: 'Whipped Cream',    price: 20, color: '#fffaf0' },
    { id: 'chocdrizzle',label: 'Choco Drizzle',   price: 15, color: '#5a1e00' },
    { id: 'cinnamon',  label: 'Cinnamon Dust',    price: 10, color: '#c84020' },
    { id: 'carameldrizzle', label: 'Caramel Drizzle', price: 15, color: '#c87820' },
    { id: 'cocoapowder',label: 'Cocoa Powder',    price: 10, color: '#3a1800' },
  ],
  sizes: [
    { id: 'small',  label: 'Small',  oz: '8oz',  multiplier: 0.85 },
    { id: 'medium', label: 'Medium', oz: '12oz', multiplier: 1.0 },
    { id: 'large',  label: 'Large',  oz: '16oz', multiplier: 1.2 },
  ],
  temps: [
    { id: 'hot',   label: 'Hot',   icon: '♨' },
    { id: 'iced',  label: 'Iced',  icon: '❄' },
    { id: 'blend', label: 'Blend', icon: '〜' },
  ]
}

const DEFAULT = {
  name: 'My Custom Brew',
  base: MENU.bases[1],
  milk: MENU.milks[2],
  syrups: [MENU.syrups[0]],
  toppings: [MENU.toppings[1]],
  size: MENU.sizes[1],
  temp: MENU.temps[0],
}

function calcPrice(state) {
  const base = state.base?.price || 0
  const milk = state.milk?.price || 0
  const syrups = (state.syrups || []).reduce((s, x) => s + x.price, 0)
  const tops = (state.toppings || []).reduce((s, x) => s + x.price, 0)
  const mul = state.size?.multiplier || 1
  return Math.round((base + milk + syrups + tops) * mul)
}

export const useDrinkStore = create((set, get) => ({
  ...DEFAULT,
  price: calcPrice(DEFAULT),
  cart: [],
  animTrigger: 0,

  setName: (name) => set({ name }),
  setBase: (base) => set((s) => { const n = { ...s, base }; return { ...n, price: calcPrice(n), animTrigger: s.animTrigger + 1 } }),
  setMilk: (milk) => set((s) => { const n = { ...s, milk }; return { ...n, price: calcPrice(n), animTrigger: s.animTrigger + 1 } }),
  setSize: (size) => set((s) => { const n = { ...s, size }; return { ...n, price: calcPrice(n) } }),
  setTemp: (temp) => set({ temp }),

  toggleSyrup: (syrup) => set((s) => {
    const has = s.syrups.find(x => x.id === syrup.id)
    const syrups = has ? s.syrups.filter(x => x.id !== syrup.id) : [...s.syrups, syrup]
    const n = { ...s, syrups }
    return { ...n, price: calcPrice(n), animTrigger: s.animTrigger + 1 }
  }),

  toggleTopping: (topping) => set((s) => {
    const has = s.toppings.find(x => x.id === topping.id)
    const toppings = has ? s.toppings.filter(x => x.id !== topping.id) : [...s.toppings, topping]
    const n = { ...s, toppings }
    return { ...n, price: calcPrice(n), animTrigger: s.animTrigger + 1 }
  }),

  addToCart: () => set((s) => ({
    cart: [...s.cart, {
      id: Date.now(),
      name: s.name,
      base: s.base,
      milk: s.milk,
      syrups: [...s.syrups],
      toppings: [...s.toppings],
      size: s.size,
      temp: s.temp,
      price: s.price,
      qty: 1,
    }]
  })),

  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter(x => x.id !== id) })),
  clearCart: () => set({ cart: [] }),

  shareOnWhatsApp: () => {
    const s = get()
    const msg = `🍵 *${s.name}*\nBase: ${s.base?.label}\nMilk: ${s.milk?.label}\nSyrups: ${s.syrups.map(x=>x.label).join(', ') || 'none'}\nToppings: ${s.toppings.map(x=>x.label).join(', ') || 'none'}\nSize: ${s.size?.label} (${s.size?.oz})\nTemp: ${s.temp?.label}\n💰 Total: ₹${s.price}\n\n_Crafted at BrewCraft ☕_`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }
}))
