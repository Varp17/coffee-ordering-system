import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../../store/useCartStore';
import { Check, Info, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';

const STEPS = [
  { id: 'base', title: 'Choose Base Roast' },
  { id: 'milk', title: 'Select Milk Base' },
  { id: 'sweetener', title: 'Choose Sweetener' },
  { id: 'toppings', title: 'Toppings & Extras' }
];

const BASES = [
  { id: 'espresso', name: 'Espresso Shot', price: 180, temp: 'hot', desc: 'Double shot of our bold house blend.' },
  { id: 'filter', name: 'South Indian Filter Extract', price: 190, temp: 'hot', desc: 'Aromatically rich 70:30 chicory traditional extract.' },
  { id: 'coldbrew', name: 'Cold Brew Concentrate', price: 210, temp: 'cold', desc: 'Steeped slow for 18 hours. Smooth & chocolatey.' }
];

const MILKS = [
  { id: 'dairy', name: 'Standard Dairy Milk', price: 0, badge: 'preferred', badgeText: 'Most Preferred', desc: 'Creamy, frothy classic cup.' },
  { id: 'oat', name: 'Oat Milk', price: 40, badge: 'recommended', badgeText: 'Recommended', desc: 'Rich, nutty, and plant-based.' },
  { id: 'almond', name: 'Almond Milk', price: 50, badge: 'recommended', badgeText: 'Recommended', desc: 'Subtly sweet, keto-friendly choice.' }
];

const SWEETENERS = [
  { id: 'sugar', name: 'Refined Sugar', price: 0, desc: 'Classic sweetness.' },
  { id: 'jaggery', name: 'Organic Jaggery', price: 15, badge: 'recommended', badgeText: 'Recommended', desc: 'Warm caramel, traditional notes.' },
  { id: 'honey', name: 'Wild Forest Honey', price: 20, badge: 'preferred', badgeText: 'Most Preferred', desc: 'Deep, floral, natural sweetness.' },
  { id: 'none', name: 'No Sweetener', price: 0, desc: 'Keep it clean and unsweetened.' }
];

const TOPPINGS = [
  { id: 'whipped', name: 'Vanilla Whipped Cream', price: 30, desc: 'Thick, premium whipped layer.' },
  { id: 'icecream', name: 'Vanilla Ice Cream Scoop', price: 40, coldOnly: true, desc: 'Create a decadent affogato float.' },
  { id: 'cocoa', name: 'Cocoa Powder Drizzle', price: 10, desc: 'A light dusting of rich dark cocoa.' }
];

export const DrinkBuilder = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    base: BASES[0],
    milk: MILKS[0],
    sweetener: SWEETENERS[0],
    toppings: []
  });

  const addItem = useCartStore((state) => state.addItem);

  // Dynamic compatibility engine
  const isColdOnlyIncompatible = (topping) => {
    return topping.coldOnly && selections.base.temp !== 'cold';
  };

  const handleSelect = (category, item) => {
    if (category === 'toppings') {
      if (isColdOnlyIncompatible(item)) return; // Incompatible check
      const exists = selections.toppings.find((t) => t.id === item.id);
      if (exists) {
        setSelections({
          ...selections,
          toppings: selections.toppings.filter((t) => t.id !== item.id)
        });
      } else {
        setSelections({
          ...selections,
          toppings: [...selections.toppings, item]
        });
      }
    } else {
      // Auto-validate toppings compatibility if base changes
      if (category === 'base' && item.temp !== 'cold') {
        setSelections({
          ...selections,
          base: item,
          toppings: selections.toppings.filter((t) => !t.coldOnly)
        });
      } else {
        setSelections({ ...selections, [category]: item });
      }
    }
  };

  // Pricing Engine
  const calculateTotalPrice = () => {
    const basePrice = selections.base.price;
    const milkPrice = selections.milk.price;
    const sweetenerPrice = selections.sweetener.price;
    const toppingsPrice = selections.toppings.reduce((sum, t) => sum + t.price, 0);
    return basePrice + milkPrice + sweetenerPrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    const customDrinkName = `Custom ${selections.base.name}`;
    const price = calculateTotalPrice();

    const mockProduct = {
      id: `custom-${selections.base.id}`,
      name: customDrinkName,
      image_url: '/images/products/cold-brew.png'
    };

    const mockVariant = {
      id: `custom-var-${Date.now()}`,
      name: `Custom Base (${selections.milk.name})`,
      price
    };

    addItem(mockProduct, mockVariant, 1);
    if (onClose) onClose();
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const [[step, direction], setStep] = useState([0, 0]);

  const paginate = (newDirection) => {
    const nextStep = currentStep + newDirection;
    if (nextStep >= 0 && nextStep < STEPS.length) {
      setStep([nextStep, newDirection]);
      setCurrentStep(nextStep);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800">
      {/* Head */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Create Your Own Drink</h2>
          <p className="text-sm text-neutral-500">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-neutral-400">Total Price</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-500">₹{calculateTotalPrice()}</div>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center space-x-2 my-6">
        {STEPS.map((s, idx) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx <= currentStep ? 'bg-amber-600 dark:bg-amber-500' : 'bg-neutral-200 dark:bg-neutral-800'
            }`}
          />
        ))}
      </div>

      {/* Main Body with Slides */}
      <div className="flex-1 overflow-hidden relative min-h-[360px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 flex flex-col space-y-4 overflow-y-auto"
          >
            {/* Step 1: Base */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BASES.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('base', item)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all hover:scale-[1.02] ${
                      selections.base.id === item.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                      {selections.base.id === item.id && <Check className="w-5 h-5 text-amber-500" />}
                    </div>
                    <p className="text-xs text-neutral-400 mb-4">{item.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.temp === 'cold' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {item.temp.toUpperCase()}
                      </span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">₹{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Milk */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MILKS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('milk', item)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all relative hover:scale-[1.02] ${
                      selections.milk.id === item.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    {item.badge && (
                      <span className={`absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        item.badge === 'recommended' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {item.badgeText}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-2 mt-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                      {selections.milk.id === item.id && <Check className="w-5 h-5 text-amber-500" />}
                    </div>
                    <p className="text-xs text-neutral-400 mb-4">{item.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-xs text-neutral-400">Extra charge</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">+{item.price > 0 ? `₹${item.price}` : 'Free'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Sweetener */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SWEETENERS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('sweetener', item)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all relative hover:scale-[1.02] ${
                      selections.sweetener.id === item.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    {item.badge && (
                      <span className={`absolute -top-2.5 left-4 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        item.badge === 'recommended' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {item.badgeText}
                      </span>
                    )}
                    <div className="flex justify-between items-center mb-2 mt-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                      {selections.sweetener.id === item.id && <Check className="w-5 h-5 text-amber-500" />}
                    </div>
                    <p className="text-xs text-neutral-400 mb-4">{item.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-xs text-neutral-400">Extra charge</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">+{item.price > 0 ? `₹${item.price}` : 'Free'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Toppings */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TOPPINGS.map((item) => {
                  const isSelected = selections.toppings.some((t) => t.id === item.id);
                  const isIncompatible = isColdOnlyIncompatible(item);

                  return (
                    <div
                      key={item.id}
                      onClick={() => !isIncompatible && handleSelect('toppings', item)}
                      className={`border rounded-xl p-4 transition-all relative ${
                        isIncompatible
                          ? 'border-neutral-200 bg-neutral-100 dark:bg-neutral-900 opacity-40 cursor-not-allowed'
                          : 'cursor-pointer hover:scale-[1.02]'
                      } ${
                        isSelected && !isIncompatible
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                          : !isIncompatible
                          ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                          : ''
                      }`}
                    >
                      {isIncompatible && (
                        <span className="absolute -top-2.5 left-4 text-[9px] bg-neutral-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                          <Info className="w-3 h-3" /> Cold Bases Only
                        </span>
                      )}
                      <div className="flex justify-between items-center mb-2 mt-1">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{item.name}</span>
                        {isSelected && !isIncompatible && <Check className="w-5 h-5 text-amber-500" />}
                      </div>
                      <p className="text-xs text-neutral-400 mb-4">{item.desc}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span className="text-xs text-neutral-400">Price</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">+₹{item.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-6">
        <button
          onClick={() => paginate(-1)}
          disabled={currentStep === 0}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${
            currentStep === 0
              ? 'text-neutral-300 border-neutral-200 dark:text-neutral-700 dark:border-neutral-800 cursor-not-allowed'
              : 'text-neutral-700 border-neutral-300 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {currentStep === STEPS.length - 1 ? (
          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <button
            onClick={() => paginate(1)}
            className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 px-6 py-2 rounded-xl text-sm font-semibold shadow"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DrinkBuilder;
