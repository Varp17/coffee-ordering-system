import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Coffee, Droplets, IceCreamBowl, Milk, Sparkles, Star, Share2 } from 'lucide-react';
import './CustomDrink.css';
import { formatCurrency } from '../../../utils/formatters';
import AnimatedCounter from '../../../components/Motion/AnimatedCounter';
import { useAuthStore } from '../../../store/useAuthStore';
import { customDrinkService } from '../../../services/customDrinks';
import toast from 'react-hot-toast';

const ASSETS = {
  finishedLatte: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=900&auto=format&fit=crop&q=88',
  icedLatte: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=900&auto=format&fit=crop&q=88',
  coldBrew: 'https://images.unsplash.com/photo-1461023235402-278239b9b242?w=900&auto=format&fit=crop&q=88',
  matcha: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=900&auto=format&fit=crop&q=88',
};

const INGREDIENTS = {
  sizes: [
    { id: 'S', name: 'Small', label: '250 ml', price: -30 },
    { id: 'M', name: 'Regular', label: '350 ml', price: 0 },
    { id: 'L', name: 'Large', label: '450 ml', price: 40 },
  ],
  bases: [
    { id: 'espresso', name: 'Espresso', price: 150, color: '#3b1f13', image: ASSETS.icedLatte },
    { id: 'cold-brew', name: 'Cold Brew', price: 180, color: '#221007', image: ASSETS.coldBrew },
    { id: 'matcha', name: 'Matcha', price: 200, color: '#78945b', image: ASSETS.matcha },
  ],
  milks: [
    { id: 'whole', name: 'Whole Milk', price: 0, visual: '#fff6e8' },
    { id: 'oat', name: 'Oat Milk', price: 60, visual: '#f4e4c7' },
    { id: 'almond', name: 'Almond Milk', price: 50, visual: '#f8ead7' },
    { id: 'none', name: 'No Milk', price: 0, visual: 'transparent' },
  ],
  syrups: [
    { id: 'vanilla', name: 'Vanilla Syrup', price: 30 },
    { id: 'caramel', name: 'Caramel Syrup', price: 30 },
    { id: 'hazelnut', name: 'Hazelnut Syrup', price: 40 },
  ],
  toppings: [
    { id: 'whipped-cream', name: 'Whipped Cream', price: 25, kind: 'foam' },
    { id: 'cold-foam', name: 'Cold Foam', price: 35, kind: 'foam' },
    { id: 'ice', name: 'Ice', price: 0, kind: 'ice' },
  ],
};

const defaultSelection = {
  size: 'M',
  base: 'espresso',
  milk: 'whole',
  syrups: [],
  toppings: [],
};

const getById = (items, id) => items.find((item) => item.id === id);

function DrinkPreview({ selection, total, stage, isAdding }) {
  const base = getById(INGREDIENTS.bases, selection.base);
  const milk = getById(INGREDIENTS.milks, selection.milk);
  const hasMilk = milk?.id !== 'none';
  const hasIce = selection.toppings.includes('ice');
  const hasFoam = selection.toppings.some((id) => getById(INGREDIENTS.toppings, id)?.kind === 'foam');
  const hasSyrup = selection.syrups.length > 0;

  return (
    <div className="drink-preview-stage">
      <motion.div
        className="asset-backdrop"
        key={base?.id}
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 0.24, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{ backgroundImage: `url(${base?.image || ASSETS.finishedLatte})` }}
      />

      <motion.div className="real-drink-compositor" layout>
        <motion.img
          key={base?.id}
          className="drink-photo"
          src={base?.image || ASSETS.finishedLatte}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: selection.size === 'S' ? 0.94 : selection.size === 'L' ? 1.05 : 1 }}
          transition={{ duration: 0.35 }}
        />
        <div className="photo-glass-highlight" />
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              className="pour-stream coffee-stream"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
          {stage >= 2 && hasMilk && (
            <motion.div
              className="pour-stream milk-stream"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hasMilk && stage >= 1 && (
            <motion.div
              className="photo-milk-swirl"
              key={`${base?.id}-${milk.id}-swirl`}
              initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hasSyrup && (
            <motion.div className="photo-syrup" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hasFoam && hasMilk && (
            <motion.div className="photo-foam" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {hasIce && (
            <motion.div className="ice-cubes photo-ice-cubes" initial="hidden" animate="show" exit="hidden">
              {[0, 1, 2, 3].map((cube) => (
                <motion.span
                  key={cube}
                  className={`ice-cube cube-${cube}`}
                  variants={{
                    hidden: { opacity: 0, y: -110, rotate: -25 },
                    show: { opacity: 1, y: 0, rotate: cube * 13 - 16 },
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 17, delay: cube * 0.07 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      <div className="preview-step-card">
        <span>Step {stage + 1}</span>
        <strong>{stage === 0 ? 'Pick the base' : stage === 1 ? 'Blend the milk' : 'Finish the drink'}</strong>
      </div>

      <motion.div className="live-price-tag" key={total} initial={{ y: 12 }} animate={{ y: 0 }}>
        <AnimatedCounter value={total} />
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            className="added-confirmation"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
          >
            <Check size={34} />
            Added to order
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionButton({ active, disabled, item, onClick, icon: Icon }) {
  return (
    <button className={`option-chip ${active ? 'active' : ''}`} disabled={disabled} onClick={onClick}>
      {Icon && <Icon size={20} strokeWidth={2.2} />}
      <span>{item.name}</span>
      {item.label && <span className="chip-meta">{item.label}</span>}
      {item.price !== 0 && <span className="chip-price">{item.price > 0 ? '+' : ''}{formatCurrency(item.price)}</span>}
    </button>
  );
}

function StepPanel({ stage, selection, selectBase, selectMilk, setSelection, toggleListItem }) {
  if (stage === 0) {
    return (
      <motion.div className="ingredient-category focused" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h3>Choose Base <span className="category-selection-hint">Required</span></h3>
        <div className="options-chip-list">
          {INGREDIENTS.bases.map((item) => (
            <OptionButton key={item.id} item={item} active={selection.base === item.id} onClick={() => selectBase(item.id)} icon={Coffee} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (stage === 1) {
    return (
      <motion.div className="ingredient-category focused" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h3>Choose Milk <span className="category-selection-hint">Required</span></h3>
        <div className="options-chip-list">
          {INGREDIENTS.milks.map((item) => {
            const disabled = selection.base === 'matcha' && !['oat', 'none'].includes(item.id);
            return (
              <OptionButton
                key={item.id}
                item={item}
                active={selection.milk === item.id}
                disabled={disabled}
                onClick={() => selectMilk(item.id)}
                icon={item.id === 'none' ? Droplets : Milk}
              />
            );
          })}
        </div>
        {selection.base === 'matcha' && (
          <p className="rule-note">Matcha pairs with oat milk by default; dairy options are disabled for this recipe.</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div className="finish-grid" layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="ingredient-category compact">
        <h3>Cup Size</h3>
        <div className="options-chip-list">
          {INGREDIENTS.sizes.map((item) => (
            <OptionButton key={item.id} item={item} active={selection.size === item.id} onClick={() => setSelection((prev) => ({ ...prev, size: item.id }))} />
          ))}
        </div>
      </div>

      <div className="ingredient-category focused">
        <h3>Add Syrups <span className="category-selection-hint">Optional</span></h3>
        <div className="options-chip-list">
          {INGREDIENTS.syrups.map((item) => (
            <OptionButton key={item.id} item={item} active={selection.syrups.includes(item.id)} onClick={() => toggleListItem('syrups', item.id)} icon={Sparkles} />
          ))}
        </div>
      </div>

      <div className="ingredient-category">
        <h3>Add Toppings <span className="category-selection-hint">Optional</span></h3>
        <div className="options-chip-list">
          {INGREDIENTS.toppings.map((item) => {
            const disabled = selection.milk === 'none' && item.kind === 'foam';
            return (
              <OptionButton
                key={item.id}
                item={item}
                active={selection.toppings.includes(item.id)}
                disabled={disabled}
                onClick={() => toggleListItem('toppings', item.id)}
                icon={item.kind === 'ice' ? IceCreamBowl : Sparkles}
              />
            );
          })}
        </div>
        {selection.milk === 'none' && <p className="rule-note">Foam toppings need milk and are unavailable for black drinks.</p>}
      </div>
    </motion.div>
  );
}

const CustomDrink = ({ onBack, onAddToCart }) => {
  const [drinkName, setDrinkName] = useState('My Custom Brew');
  const [stage, setStage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [selection, setSelection] = useState(defaultSelection);
  const { isAuthenticated } = useAuthStore();
  const [importingInfo, setImportingInfo] = useState(null);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  useEffect(() => {
    const loadSharedDrink = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get('import') || params.get('custom');
      if (sharedId) {
        try {
          const res = await customDrinkService.getById(sharedId);
          if (res && res.ingredients) {
            const recipe = typeof res.ingredients === 'string' ? JSON.parse(res.ingredients) : res.ingredients;
            
            // Map ingredients back to selected visual options
            const newSelection = { ...defaultSelection };
            
            // Base
            if (recipe.some(i => i.ingredient_id === 1)) newSelection.base = 'cold-brew';
            else if (recipe.some(i => i.ingredient_id === 2)) newSelection.base = 'espresso';
            
            // Milk
            if (recipe.some(i => i.ingredient_id === 4)) newSelection.milk = 'whole';
            else if (recipe.some(i => i.ingredient_id === 5)) newSelection.milk = 'oat';
            else if (recipe.some(i => i.ingredient_id === 6)) newSelection.milk = 'almond';
            else newSelection.milk = 'none';

            // Syrups
            const syrups = [];
            if (recipe.some(i => i.ingredient_id === 9)) syrups.push('vanilla');
            if (recipe.some(i => i.ingredient_id === 10)) syrups.push('caramel');
            if (recipe.some(i => i.ingredient_id === 11)) syrups.push('hazelnut');
            newSelection.syrups = syrups;

            // Toppings
            const toppings = [];
            if (recipe.some(i => i.ingredient_id === 14)) toppings.push('whipped-cream');
            if (recipe.some(i => i.ingredient_id === 20)) toppings.push('cold-foam');
            if (recipe.some(i => i.ingredient_id === 17)) toppings.push('ice');
            newSelection.toppings = toppings;

            setSelection(newSelection);
            setDrinkName(res.name);
            setImportingInfo(`Importing Shared Coffee: "${res.name}"`);
            setStage(2);
            toast.success(`Loaded shared coffee recipe: "${res.name}"! ☕`);
          }
        } catch (err) {
          console.error('Failed to import custom drink:', err);
          toast.error('Could not load the shared coffee configuration.');
        }
      }
    };
    loadSharedDrink();
  }, []);

  const handleSaveFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save custom creations to your favorites! ⭐');
      return;
    }
    
    setIsSavingFavorite(true);
    try {
      const baseProductId = selection.base === 'cold-brew' ? 8 : 9; // 8 = Custom Cold Brew, 9 = Custom Latte
      const ingredientsList = [];
      
      // Base
      if (selection.base === 'cold-brew') {
        ingredientsList.push({ ingredient_id: 1, quantity: 120 });
      } else {
        ingredientsList.push({ ingredient_id: 2, quantity: 60 });
      }

      // Milk
      if (selection.milk === 'whole') ingredientsList.push({ ingredient_id: 4, quantity: 150 });
      else if (selection.milk === 'oat') ingredientsList.push({ ingredient_id: 5, quantity: 150 });
      else if (selection.milk === 'almond') ingredientsList.push({ ingredient_id: 6, quantity: 150 });

      // Syrups
      if (selection.syrups.includes('vanilla')) ingredientsList.push({ ingredient_id: 9, quantity: 15 });
      if (selection.syrups.includes('caramel')) ingredientsList.push({ ingredient_id: 10, quantity: 15 });
      if (selection.syrups.includes('hazelnut')) ingredientsList.push({ ingredient_id: 11, quantity: 15 });

      // Toppings
      if (selection.toppings.includes('whipped-cream')) ingredientsList.push({ ingredient_id: 14, quantity: 30 });
      if (selection.toppings.includes('cold-foam')) ingredientsList.push({ ingredient_id: 20, quantity: 20 });
      if (selection.toppings.includes('ice')) ingredientsList.push({ ingredient_id: 17, quantity: 5 });

      await customDrinkService.create({
        base_product_id: baseProductId,
        name: drinkName.trim() || 'My Favorite Brew',
        ingredients: ingredientsList
      });

      toast.success('Creation saved to your Favorites! ⭐');
    } catch (err) {
      console.error('Failed to save favorite:', err);
      toast.error(err.message || 'Error saving custom drink to favorites.');
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const base = getById(INGREDIENTS.bases, selection.base);
  const milk = getById(INGREDIENTS.milks, selection.milk);
  const requiredSelectionsMade = Boolean(base && milk && selection.size);

  const total = useMemo(() => {
    const sizePrice = getById(INGREDIENTS.sizes, selection.size)?.price || 0;
    const basePrice = getById(INGREDIENTS.bases, selection.base)?.price || 0;
    const milkPrice = getById(INGREDIENTS.milks, selection.milk)?.price || 0;
    const syrupsPrice = selection.syrups.reduce((sum, id) => sum + (getById(INGREDIENTS.syrups, id)?.price || 0), 0);
    const toppingsPrice = selection.toppings.reduce((sum, id) => sum + (getById(INGREDIENTS.toppings, id)?.price || 0), 0);
    return Math.max(0, sizePrice + basePrice + milkPrice + syrupsPrice + toppingsPrice);
  }, [selection]);

  const activeReceiptItems = useMemo(() => {
    const list = [];
    const baseItem = getById(INGREDIENTS.bases, selection.base);
    if (baseItem) {
      list.push({ name: `${baseItem.name} Base`, price: baseItem.price });
    }
    const sizeItem = getById(INGREDIENTS.sizes, selection.size);
    if (sizeItem) {
      list.push({ name: `${sizeItem.name} Size`, price: sizeItem.price });
    }
    const milkItem = getById(INGREDIENTS.milks, selection.milk);
    if (milkItem && milkItem.id !== 'none') {
      list.push({ name: milkItem.name, price: milkItem.price });
    }
    selection.syrups.forEach(id => {
      const item = getById(INGREDIENTS.syrups, id);
      if (item) list.push({ name: item.name, price: item.price });
    });
    selection.toppings.forEach(id => {
      const item = getById(INGREDIENTS.toppings, id);
      if (item) list.push({ name: item.name, price: item.price });
    });
    return list;
  }, [selection]);

  const selectBase = (id) => {
    setSelection((prev) => ({
      ...prev,
      base: id,
      milk: id === 'matcha' && !['oat', 'none'].includes(prev.milk) ? 'oat' : prev.milk,
    }));
    setStage(1);
  };

  const selectMilk = (id) => {
    setSelection((prev) => ({ ...prev, milk: id, toppings: id === 'none' ? prev.toppings.filter((toppingId) => getById(INGREDIENTS.toppings, toppingId)?.kind !== 'foam') : prev.toppings }));
    setStage(2);
  };

  const toggleListItem = (key, id) => {
    setSelection((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((itemId) => itemId !== id) : [...prev[key], id],
    }));
    setStage(2);
  };

  const addToOrder = () => {
    if (stage < 2 || !requiredSelectionsMade || isAdding) return;

    const cleanName = drinkName.trim() || `Custom ${base.name}`;
    const customization = {
      size: selection.size,
      base: base.name,
      milk: milk.name,
      syrups: selection.syrups.map((id) => getById(INGREDIENTS.syrups, id)?.name).filter(Boolean),
      toppings: selection.toppings.map((id) => getById(INGREDIENTS.toppings, id)?.name).filter(Boolean),
    };

    setIsAdding(true);
    window.setTimeout(() => {
      onAddToCart({
        id: `custom-${Date.now()}`,
        name: cleanName,
        price: total,
        qty: 1,
        isCustom: true,
        customization,
      });
    }, 650);
  };

  return (
    <div className="kiosk-custom-drink">
      <aside className="custom-preview-panel">
        <DrinkPreview selection={selection} total={total} stage={stage} isAdding={isAdding} />
      </aside>

      <section className="custom-main">
        {importingInfo && (
          <div className="importing-banner">
            <Sparkles size={16} />
            <span>{importingInfo}</span>
          </div>
        )}

        <div className="custom-title-row">
          <div>
            <span className="eyebrow">Your Own Drink</span>
            <h2>Build a custom coffee</h2>
          </div>
          <button className="text-back-btn" onClick={onBack}>Back to menu</button>
        </div>

        <div className="naming-section">
          <label htmlFor="custom-drink-name">Drink name</label>
          <input
            id="custom-drink-name"
            type="text"
            maxLength={36}
            value={drinkName}
            onChange={(event) => setDrinkName(event.target.value)}
            className="drink-name-input"
            onFocus={(event) => event.target.select()}
          />
        </div>

        <div className="builder-stepper" aria-label="Customization progress">
          {['Base', 'Milk', 'Finish'].map((label, index) => (
            <button key={label} className={`step-pill ${stage >= index ? 'active' : ''}`} onClick={() => setStage(index)}>
              {index + 1}. {label}
            </button>
          ))}
        </div>

        <div className="ingredients-flow">
          <AnimatePresence mode="wait">
            <StepPanel
              key={stage}
              stage={stage}
              selection={selection}
              selectBase={selectBase}
              selectMilk={selectMilk}
              setSelection={setSelection}
              toggleListItem={toggleListItem}
            />
          </AnimatePresence>
        </div>

        {/* Detailed Recipe Pricing Breakdown */}
        <div className="receipt-breakdown-card">
          <div className="receipt-header">
            <span>Selected Customization Recipe Breakdown</span>
          </div>
          <div className="receipt-items">
            {activeReceiptItems.map((item, index) => (
              <div key={index} className="receipt-item-row">
                <span className="receipt-item-name">{item.name}</span>
                <span className="receipt-item-dots"></span>
                <span className="receipt-item-price">
                  {item.price > 0 ? `+${formatCurrency(item.price)}` : item.price < 0 ? `-${formatCurrency(Math.abs(item.price))}` : 'Included'}
                </span>
              </div>
            ))}
            {activeReceiptItems.length === 0 && (
              <div className="receipt-empty">No ingredients selected yet.</div>
            )}
          </div>
        </div>

        <div className="build-actions">
          <button className="step-nav-btn" disabled={stage === 0 || isAdding} onClick={() => setStage((current) => Math.max(0, current - 1))}>Back</button>
          {stage < 2 && (
            <button className="step-nav-btn primary-step" onClick={() => setStage((current) => Math.min(2, current + 1))}>Next</button>
          )}
          
          <button 
            type="button" 
            className="step-nav-btn favorite-step-btn" 
            disabled={isSavingFavorite || !requiredSelectionsMade}
            onClick={handleSaveFavorite}
          >
            <Star size={16} className="star-icon" />
            {isSavingFavorite ? 'Saving...' : 'Save Favorite'}
          </button>

          <div className="action-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          
          <motion.button
            whileTap={requiredSelectionsMade ? { scale: 0.98 } : {}}
            className="add-order-btn"
            disabled={stage < 2 || !requiredSelectionsMade || isAdding}
            onClick={addToOrder}
          >
            {isAdding ? 'Adding...' : stage < 2 ? 'Finish Steps' : 'Add to Order'}
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default CustomDrink;
