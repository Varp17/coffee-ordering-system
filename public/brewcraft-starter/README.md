# BrewCraft — Custom Coffee Drink Builder

A full-scale, responsive coffee drink customizer with **live 3D canvas animation**, ingredient photo cards, WhatsApp sharing, and cart management.

---

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## Project Structure

```
brewcraft/
├── index.html                  # Entry HTML
├── vite.config.js              # Vite config
├── package.json
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # Page routing (Hero → Builder)
    ├── index.css               # Global CSS variables + reset
    ├── store/
    │   └── drinkStore.js       # Zustand state: all drink logic, pricing, cart, WhatsApp
    ├── components/
    │   ├── CupCanvas.jsx       # 3D animated cup (Canvas API, no WebGL needed)
    │   ├── Selector.jsx        # Ingredient selection UI
    │   ├── Selector.module.css
    │   ├── Summary.jsx         # Live summary panel + actions
    │   ├── Summary.module.css
    │   ├── Hero.jsx            # Landing page hero
    │   └── Hero.module.css
    └── pages/
        ├── Builder.jsx         # Main builder layout
        └── Builder.module.css
```

---

## Features Built

- Live 3D cup preview — canvas animation updates on every ingredient change
- Pour stream animation with particle splash effects
- Ice cube rendering for iced drinks
- Foam layer + chocolate/caramel drizzle rendering
- Ingredient photo cards (Unsplash CDN — swap with your own)
- Size selector (Small/Medium/Large) — auto-adjusts price
- Temperature selector (Hot/Iced/Blend)
- Custom drink name input
- Add to cart (local state — connect to backend below)
- WhatsApp share with full order details
- Fully responsive (mobile-first, stacks on small screens)

---

## How to Customize

### Change menu items
Edit `src/store/drinkStore.js` — the `MENU` object at the top.
Each item has: `id`, `label`, `price`, `color` (for cup rendering), `img` (URL or null).

### Change colors / theme
Edit `src/index.css` — all colors are CSS variables under `:root {}`.
- `--gold` — main accent color
- `--bg` — page background
- `--surface` — card surfaces

### Add your own photos
Replace Unsplash URLs in `drinkStore.js` with:
- Your own hosted images on Cloudinary (recommended)
- Local files in `src/assets/` imported as modules

---

## Connecting a Backend (Week 4)

### Option A: Supabase (recommended, free tier)

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

In `drinkStore.js`, replace `addToCart` with:
```js
addToCart: async () => {
  const s = get()
  const order = { name: s.name, base: s.base.id, milk: s.milk.id,
    syrups: s.syrups.map(x=>x.id), toppings: s.toppings.map(x=>x.id),
    size: s.size.id, temp: s.temp.id, price: s.price }
  await supabase.from('orders').insert(order)
  set((st) => ({ cart: [...st.cart, { ...order, id: Date.now() }] }))
}
```

Create `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Supabase SQL to create orders table:
```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  base text,
  milk text,
  syrups text[],
  toppings text[],
  size text,
  temp text,
  price integer,
  status text default 'pending'
);
```

---

## Deploy to Vercel (free, 2 minutes)

```bash
npm install -g vercel
vercel
# Follow prompts — auto-detects Vite
# Set env vars in Vercel dashboard
```

Or connect your GitHub repo to Vercel for auto-deploy on every push.

---

## Upgrade: True WebGL 3D Cup with Three.js

The current cup uses Canvas 2D which works great on all devices. To upgrade to full Three.js:

```bash
npm install @react-three/fiber @react-three/drei
```

Replace `CupCanvas.jsx` with a `<Canvas>` component:
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function CupCanvas3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 2]} intensity={1.2} color="#e8c090" />
      <CupMesh />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
```

Download a free cup GLB from sketchfab.com and load with `useGLTF`.

---

## Upgrade: Lottie Pour Animations

1. Download coffee pour JSON from lottiefiles.com
2. `npm install lottie-react`
3. Trigger on ingredient change:
```jsx
import Lottie from 'lottie-react'
import pourData from '../assets/coffee-pour.json'
<Lottie animationData={pourData} loop={false} />
```

---

## Performance Tips for Mobile

- Images: add `loading="lazy"` (already set) + use WebP format
- Canvas: set `devicePixelRatio` cap at 2 (already set)
- Animations: use `will-change: transform` on animated elements
- Bundle: run `npm run build` and check size with `npx vite-bundle-visualizer`

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Vercel hosting | Free | ₹0 |
| Supabase database | Free (500MB) | ₹0 |
| Cloudinary images | Free (25GB) | ₹0 |
| Domain (Namecheap) | .in domain | ~₹800/yr |
| **Total year 1** | | **~₹800** |

---

## Estimated Timeline

| Week | Deliverable |
|------|-------------|
| 1 | This starter running locally + UI customized to client brand |
| 2 | Supabase connected + admin order dashboard |
| 3 | Polish animations, add Lottie pours, photo upgrade |
| 4 | Vercel deploy + mobile QA + client handoff |
