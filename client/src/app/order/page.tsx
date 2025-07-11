'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin, Clock, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'main' | 'dessert' | 'beverage';
  dietaryInfo: string[];
  image: string;
  isCustomizable?: boolean;
  pricing?: { small: number; large: number };
  flavors?: string[];
  hasMultipleSizes?: boolean;
  sizes?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    platters?: {
      itemCount: number;
      discount: number;
      description: string;
      piecesPerOption?: number;
      totalPieces?: number;
      type?: 'mixed' | 'nigiri' | 'sashimi';
    };
  }>;
  platters?: {
    itemCount: number;
    discount: number;
    description: string;
    piecesPerOption?: number;
    totalPieces?: number;
    type?: 'mixed' | 'nigiri' | 'sashimi';
  };
};

// Available sushi items for platter selection (not shown in main menu)
const availableSushiItems = [
  // Basic Rolls
  { id: 'avokyu-roll', name: 'Avokyu Roll', description: 'Avocado and cucumber wrapped in rice and seaweed.', price: 4.75, category: 'main' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/on-demand-avokyu-roll.jpg' },
  { id: 'cucumber-roll', name: 'Cucumber Roll', description: 'Simple and fresh cucumber roll.', price: 3.95, category: 'main' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/on-demand-veggie-roll.jpg' },
  { id: 'negihama-roll', name: 'Negihama Roll', description: 'Yellowtail and green onion roll.', price: 5.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-negihama-roll.jpg' },
  { id: 'sake-maki-roll', name: 'Sake Maki Roll', description: 'Classic salmon roll.', price: 5.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-saki-maki-roll.jpg' },
  { id: 'salmon-skin-hand-roll', name: 'Salmon Skin Hand Roll', description: 'Salmon skin with cucumber and avocado.', price: 9.00, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-salmon-skin-hand-roll.jpg' },
  { id: 'shrimp-tempura-roll', name: 'Shrimp Tempura Roll', description: 'Shrimp tempura, avocado, cucumber, and unagi sauce.', price: 8.00, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-crab-tempura-crunch-roll.jpg' },
  { id: 'tuna-roll', name: 'Tuna Roll', description: 'Fresh tuna with rice and seaweed.', price: 5.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-tuna-roll.jpg' },
  { id: 'salmon-skin-roll', name: 'Salmon Skin Roll', description: 'Crispy salmon skin with savory sauce.', price: 9.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-salmon-skin-hand-roll.jpg' },

  // Specialty Rolls
  { id: '007-roll', name: '007 Roll', description: 'Specialty roll with premium ingredients.', price: 10.35, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'alaskan-roll', name: 'Alaskan Roll', description: 'Fresh salmon and avocado roll.', price: 8.06, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-alaskan-roll.jpg' },
  { id: 'baked-scallops-roll', name: 'Baked Scallops Roll', description: 'Baked scallops with special sauce.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'batman-burrito', name: 'Batman Burrito', description: 'Large sushi burrito with multiple fillings.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'blackjack-roll', name: 'Blackjack Roll', description: 'Bold flavors with spicy kick.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-blackjack-roll.jpg' },
  { id: 'boss-coskey-roll', name: 'Boss Coskey Roll', description: 'Chef\'s special creation.', price: 9.90, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'california-roll', name: 'California Roll', description: 'Classic crab, avocado, and cucumber roll.', price: 7.20, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-cali-roll.jpg' },
  { id: 'caterpillar-roll', name: 'Caterpillar Roll', description: 'Eel and cucumber topped with avocado.', price: 8.10, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-caterpillar-roll.jpg' },
  { id: 'chanel-roll', name: 'Chanel Roll', description: 'Elegant roll with premium ingredients.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-chanel-roll.jpg' },
  { id: 'crab-tempura-crunch-roll', name: 'Crab Tempura Crunch Roll', description: 'Crispy crab tempura with crunch.', price: 9.90, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-crab-tempura-crunch-roll.jpg' },
  { id: 'crispy-rice-roll', name: 'Crispy Rice Roll', description: 'Crispy rice topped with fresh fish.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-crispy-rice-roll.jpg' },
  { id: 'dexter-dragon-roll', name: 'Dexter Dragon Roll', description: 'Dragon-style roll with eel and avocado.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-dexter-dragon-roll.jpg' },
  { id: 'dont-be-like-mason-roll', name: "Don't Be Like Mason Roll", description: 'Unique house special roll.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-dont-be-like-mason-roll.jpg' },
  { id: 'double-dragon-roll', name: 'Double Dragon Roll', description: 'Double portion of dragon roll goodness.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-dragon-dragon-roll.jpg' },
  { id: 'double-yellowtail-roll', name: 'Double Yellowtail Roll', description: 'Extra yellowtail for fish lovers.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-double-yellowtail-roll.jpg' },
  { id: 'fire-down-below-roll', name: 'Fire Down Below Roll', description: 'Spicy roll with heat from below.', price: 10.35, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-fire-down-below-roll.jpg' },
  { id: 'fire-tempura-crunch-roll', name: 'Fire Tempura Crunch Roll', description: 'Spicy tempura with extra crunch.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-fire-tempura-crunch-roll.jpg' },
  { id: 'fleury-fire-roll', name: 'Fleury Fire Roll', description: 'Fiery roll with bold flavors.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-fleury-fire-roll.jpg' },
  { id: 'flying-hawaiian-roll', name: 'Flying Hawaiian Roll', description: 'Tropical flavors with pineapple.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-flying-hawaiin-roll.jpg' },
  { id: 'futomaki-roll', name: 'Futomaki Roll', description: 'Large traditional Japanese roll.', price: 8.10, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-futomaki-roll.jpg' },
  { id: 'gg-special-roll', name: 'GG Special Roll', description: 'House specialty with premium ingredients.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-gg-special-roll.jpg' },
  { id: 'golden-cali-roll', name: 'Golden Cali Roll', description: 'California roll with golden touch.', price: 9.00, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-golden-cali-roll.jpg' },
  { id: 'golden-knight-roll', name: 'Golden Knight Roll', description: 'Noble roll with golden ingredients.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-knight-hawk-roll.jpg' },
  { id: 'golden-tiger-roll', name: 'Golden Tiger Roll', description: 'Tiger roll with golden accents.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-golden-tiger-roll.jpg' },
  { id: 'habanero-roll', name: 'Habanero Roll', description: 'Extra spicy roll with habanero.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-habanero-roll.jpg' },
  { id: 'hawaiian-roll', name: 'Hawaiian Roll', description: 'Tropical roll with island flavors.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-hawaiin-roll.jpg' },
  { id: 'heart-attack-roll', name: 'Heart Attack Roll', description: 'Intensely flavorful roll.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'hulk-burrito', name: 'Hulk Burrito', description: 'Massive sushi burrito.', price: 13.46, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'japanese-lasagna-roll', name: 'Japanese Lasagna Roll', description: 'Layered roll like lasagna.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'johnny-roll', name: 'Johnny Roll', description: 'Signature roll with special sauce.', price: 13.46, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-johnny-roll.jpg' },
  { id: 'kelly-crunch-roll', name: 'Kelly Crunch Roll', description: 'Crunchy roll with tempura flakes.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-kelly-crunch-roll.jpg' },
  { id: 'kiss-of-fire-roll', name: 'Kiss Of Fire Roll', description: 'Spicy roll with fiery kiss.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-kiss-of-fire-roll.jpg' },
  { id: 'knight-hawk-roll', name: 'Knight Hawk Roll', description: 'Bold roll with sharp flavors.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-knight-hawk-roll.jpg' },
  { id: 'knight-time-roll', name: 'Knight Time Roll', description: 'Evening special roll.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-knight-time-roll.jpg' },
  { id: 'kristen-special-roll', name: 'Kristen Special Roll', description: 'Chef Kristen\'s signature creation.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-kristen-special-roll.jpg' },
  { id: 'lilly-roll', name: 'Lilly Roll', description: 'Delicate roll with elegant presentation.', price: 9.90, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-lilly-roll.jpg' },
  { id: 'lisa-lisa-roll', name: 'Lisa Lisa Roll', description: 'Double the flavor, double the fun.', price: 7.16, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-lisa-lisa-roll.jpg' },
  { id: 'ods-hand-roll', name: 'ODS Hand Roll', description: 'Hand-rolled specialty.', price: 13.46, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-ods1-roll.jpg' },
  { id: 'ods1-roll', name: 'ODS1 Roll', description: 'First in the ODS series.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-ods1-roll.jpg' },
  { id: 'ods2-roll', name: 'ODS2 Roll', description: 'Second in the ODS series.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-ods1-roll.jpg' },
  { id: 'on-demand-roll', name: 'On Demand Roll', description: 'Our signature house roll.', price: 11.70, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-on-demand-roll.jpg' },
  { id: 'orange-blossom-roll', name: 'Orange Blossom Roll', description: 'Citrusy roll with orange accents.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-orange-blossom-roll.jpg' },
  { id: 'philly-roll', name: 'Philly Roll', description: 'Philadelphia-style with cream cheese.', price: 7.16, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-philly-roll.jpg' },
  { id: 'playboy-roll', name: 'Playboy Roll', description: 'Luxurious roll with premium toppings.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-playboy-roll.jpg' },
  { id: 'rainbow-roll', name: 'Rainbow Roll', description: 'Colorful roll with assorted fish.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-rainbow-roll.jpg' },
  { id: 'salmon-avocado-roll', name: 'Salmon Avocado Roll', description: 'Fresh salmon with creamy avocado.', price: 8.06, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-salmon-avocado-roll.jpg' },
  { id: 'sammy-special-roll', name: 'Sammy Special Roll', description: 'Chef Sammy\'s signature creation.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'sashimi-roll', name: 'Sashimi Roll', description: 'Fresh sashimi wrapped in rice.', price: 13.46, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-sashimi-roll.jpg' },
  { id: 'sexy-gg-roll', name: 'Sexy GG Roll', description: 'Seductive flavors in every bite.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-gg-special-roll.jpg' },
  { id: 'something-wrong-roll', name: 'Something Wrong Roll', description: 'Mysteriously delicious roll.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'southern-highlands-roll', name: 'Southern Highlands Roll', description: 'Southern-inspired sushi roll.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'spicy-crab-roll', name: 'Spicy Crab Roll', description: 'Spicy crab with kick.', price: 7.20, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-spicy-crab-roll.jpg' },
  { id: 'spicy-crabby-salmon-lemon-roll', name: 'Spicy Crabby Salmon Lemon Roll', description: 'Spicy crab and salmon with lemon.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-spicy-crabby-salmon-lemon-roll.jpg' },
  { id: 'spicy-tataki-roll', name: 'Spicy Tataki Roll', description: 'Seared fish with spicy sauce.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-spicy-tuna-roll.jpg' },
  { id: 'spicy-tuna-roll', name: 'Spicy Tuna Roll', description: 'Spicy tuna with mayo and sriracha.', price: 7.16, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-spicy-tuna-roll.jpg' },
  { id: 'spider-roll', name: 'Spider Roll', description: 'Soft shell crab tempura roll.', price: 9.90, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-spider-roll.jpg' },
  { id: 'the-cros-roll', name: 'The Cros Roll', description: 'Signature house creation.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'tiger-roll', name: 'Tiger Roll', description: 'Striped roll with bold flavors.', price: 12.56, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-tiger-roll.jpg' },
  { id: 'tnt-natasha-roll', name: 'TNT Natasha Roll', description: 'Explosive flavors that pack a punch.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'too-hot-too-sexy-roll', name: 'Too Hot Too Sexy Roll', description: 'Dangerously spicy and irresistible.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' },
  { id: 'tuna-cali', name: 'Tuna Cali', description: 'Tuna version of California roll.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-tuna-everywhere.jpg' },
  { id: 'veggie-roll', name: 'Veggie Roll', description: 'Fresh vegetables wrapped in rice.', price: 8.10, category: 'main' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/on-demand-veggie-roll.jpg' },
  { id: 'wet-dream-roll', name: 'Wet Dream Roll', description: 'Indulgent roll of your dreams.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-wet-dream-roll.jpg' },
  { id: 'whos-your-mother-roll', name: "Who's Your Mother Roll", description: 'Bold roll with attitude.', price: 12.60, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-007-roll.jpg' }
];

// Available nigiri options for nigiri platters
const availableNigiriOptions = [
  { id: 'ahi-nigiri', name: 'Ahi Nigiri', description: 'Premium ahi tuna over rice.', price: 11.79, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-ahi.jpg?v=1' },
  { id: 'albacore-nigiri', name: 'Albacore Nigiri', description: 'White tuna over seasoned rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-albacore.jpg?v=1' },
  { id: 'ebi-shrimp-nigiri', name: 'Ebi (Shrimp) Nigiri', description: 'Cooked shrimp over rice.', price: 11.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-ebi(shrimp).jpg?v=1' },
  { id: 'escolar-super-white-nigiri', name: 'Escolar (Super White) Nigiri', description: 'Buttery super white fish over rice.', price: 12.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-escolar(Super White).jpg?v=1' },
  { id: 'garlic-tuna-nigiri', name: 'Garlic Tuna Nigiri', description: 'Ahi tuna with garlic seasoning over rice.', price: 12.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Garlic-Tuna.jpg?v=1' },
  { id: 'hamachi-yellowtail-nigiri', name: 'Hamachi (Yellowtail) Nigiri', description: 'Fresh yellowtail over rice.', price: 12.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Hamachi(yellowtail).jpg?v=1' },
  { id: 'hirame-halibut-nigiri', name: 'Hirame (Halibut) Nigiri', description: 'Delicate halibut over rice.', price: 13.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-hirame(halibut).jpg?v=1' },
  { id: 'salmon-nigiri', name: 'Salmon (Sake) Nigiri', description: 'Fresh Atlantic salmon over rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-salmon(sake).jpg?v=1' },
  { id: 'salmon-heaven-nigiri', name: 'Salmon Heaven Nigiri', description: 'Premium salmon preparation over rice.', price: 12.75, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-salmon-heaven.jpg?v=1' },
  { id: 'smoked-paprika-salmon-nigiri', name: 'Smoked Paprika Salmon Nigiri', description: 'Salmon with smoked paprika over rice.', price: 12.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Smoked-Paprika-Salmon.jpg?v=1' },
  { id: 'tamago-sweet-egg-nigiri', name: 'Tamago (Sweet Egg) Nigiri', description: 'Sweet Japanese omelet over rice.', price: 7.88, category: 'main' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/nigiri/on-demand-nigiri-Tamago(Sweet egg).jpg?v=1' },
  { id: 'unagi-eel-nigiri', name: 'Unagi (Eel) Nigiri', description: 'Grilled eel with sweet sauce over rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-unagi(eel).jpg?v=1' },
  { id: 'yuzu-yellowtail-nigiri', name: 'Yuzu Yellowtail Nigiri', description: 'Yellowtail with yuzu citrus over rice.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-yuzu-yellowtail.jpg?v=1' }
];

// Available sashimi options for sashimi platters
const availableSashimiOptions = [
  { id: 'ahi-sashimi', name: 'Ahi Sashimi', description: 'Premium ahi tuna slices.', price: 12.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Ahi.jpg?v=1' },
  { id: 'albacore-sashimi', name: 'Albacore Sashimi', description: 'White tuna sashimi slices.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Albacore.jpg?v=1' },
  { id: 'ebi-shrimp-sashimi', name: 'Ebi (Shrimp) Sashimi', description: 'Cooked shrimp sashimi.', price: 10.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Ebi(Shrimp).jpg?v=1' },
  { id: 'garlic-tuna-sashimi', name: 'Garlic Tuna Sashimi', description: 'Ahi tuna with garlic seasoning.', price: 13.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Garlic-Tuna.jpg?v=1' },
  { id: 'hamachi-yellowtail-sashimi', name: 'Hamachi (Yellowtail) Sashimi', description: 'Fresh yellowtail sashimi.', price: 13.05, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Hamachi(YellowTail).jpg?v=1' },
  { id: 'salmon-sake-sashimi', name: 'Salmon (Sake) Sashimi', description: 'Fresh Atlantic salmon sashimi.', price: 12.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Salmon(Sake).jpg?v=1' }
];

// Individual sandwich options for sampler plate
const capriottisIndividualSandwiches = [
  { id: 'bobbie', name: 'The Bobbie®', isWagyu: false, image: '/menu/sandwiches/Bobbie-sand.webp' },
  { id: 'cole-turkey', name: 'Cole Turkey®', isWagyu: false, image: '/menu/sandwiches/cole-turkey.webp' },
  { id: 'wagyu-slaw', name: 'American Wagyu Slaw Be Jo®', isWagyu: true, image: '/menu/sandwiches/american-waygu-slaw-sand.webp' },
  { id: 'wagyu-roast', name: 'American Wagyu Roast Beef', isWagyu: true, image: '/menu/sandwiches/american-waygu-club-sand.webp' },
  { id: 'veggie-turkey', name: 'Veggie Turkey', isWagyu: false, image: '/menu/sandwiches/plant-based-turkey-sand.webp' },
  { id: 'veggie-cole', name: 'Veggie Cole Turkey®', isWagyu: false, image: '/menu/sandwiches/plant-based-cole-sand.webp' },
  { id: 'homemade-turkey', name: 'Homemade Turkey Sub', isWagyu: false, image: '/menu/sandwiches/home-made-turkey.webp' },
  { id: 'italian-sub', name: 'Italian Sub', isWagyu: false, image: '/menu/sandwiches/italian-sand.webp' },
  { id: 'tuna-sub', name: 'Tuna Sub', isWagyu: false, image: '/menu/sandwiches/tuna-sand.webp' },
  { id: 'blt', name: 'The BLT', isWagyu: false, image: '/menu/sandwiches/blt-sand.webp' },
  { id: 'classic-club', name: 'Classic Club', isWagyu: false, image: '/menu/sandwiches/classic-club.webp' },
  { id: 'wagyu-club', name: 'Wagyu Club', isWagyu: true, image: '/menu/sandwiches/american-waygu-club-sand.webp' }
];

// Restaurant menu data
const restaurantMenus = {
  "capriottis": {
    name: "Capriotti's Sandwich Shop",
    items: [
      {
        id: 'cap1',
        name: 'The Bobbie® Party Tray',
        description: 'A tray loaded with the greatest sandwich in America. Homemade turkey, cranberry sauce, stuffing and mayo.',
        price: 0, // Price will be shown in size selection modal
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Bobbie-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap2',
        name: 'Little Italy Party Tray',
        description: 'Paying homage to our heritage, this tray is loaded with nothing but tasty Italian subs (served with a side of pickles, hot and sweet peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Little-Italy-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap3',
        name: 'Delaware\'s Finest Party Tray',
        description: 'An assortment of our Cap\'s classics: The Bobbie®, Slaw Be Jo®, and the Italian sub (served with pickles, hot and sweet peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-DelawaresFinest-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap4',
        name: 'Turkey Lovers Party Tray',
        description: 'Assortment of our delicious oven-roasted turkey subs: The Bobbie®, Cole Turkey®, and the Homemade Turkey sub (served with a side of mayo, mustard, pickles and peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Turkey-Lovers-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap5',
        name: 'Vegetarian Party Tray',
        description: 'Assortment of our delicious vegetarian subs made with meatless products and veggies: Veggie Turkey, Veggie Cole Turkey®, and Cheese sub.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/Capriottis-Vegetarian-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.49 }
      },
      {
        id: 'cap6',
        name: 'American Wagyu Party Tray',
        description: 'A tray of our finest American Wagyu beef subs: The American Wagyu Slaw Be Jo® and the American Wagyu Roast Beef.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Waygu-Tray.webp',
        isCustomizable: true,
        pricing: { small: 80.99, large: 101.99 }
      },
      {
        id: 'cap7',
        name: 'The Club Party Tray',
        description: 'Classic club sandwich with turkey, ham, and bacon.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Club-Tray.webp',
        isCustomizable: true,
        pricing: { small: 81.59, large: 103.29 }
      },

      {
        id: 'cap-sampler',
        name: 'Sampler Plate',
        description: 'Choose your own combination of our signature sandwiches. Perfect for trying multiple favorites!',
        price: 73.99, // Base price for small (Build Your Own pricing)
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Bobbie-Tray.webp', // Placeholder until you provide sampler image
        isCustomizable: true
      },
      {
        id: 'cap-cookie-tray',
        name: 'Cookie Tray',
        description: 'Fresh baked cookies - chocolate chip, oatmeal raisin, and sugar cookies.',
        price: 21.99,
        category: 'dessert' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-cookie-tray.webp'
      },
      {
        id: 'cap-cookie-brookie-tray',
        name: 'Cookie/Brookie Tray',
        description: 'Delicious combination of cookies and brownies for the perfect sweet treat.',
        price: 24.99,
        category: 'dessert' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Cookie-brookie-Tray.webp'
      },
      {
        id: 'cap-soda',
        name: '20oz Bottle',
        description: 'Choose from our selection of refreshing beverages.',
        price: 3.29,
        category: 'beverage' as const,
        dietaryInfo: [],
        image: '/menu/sandwiches/soda-bottles.webp',
        isCustomizable: true,
        flavors: ['Mountain Dew', 'Pepsi', 'Pepsi No Sugar', 'Blue Gatorade']
      }
    ]
  },
  "sushi": {
    name: "Sushi on Demand",
    items: [
      {
        id: 'sushi-platter',
        name: 'Sushi Platter',
        description: 'Pick your platter size and select rolls, Sashimi, or Nigiri with 10% off',
        price: 0, // Will be calculated based on size selection
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center',
        isCustomizable: true,
        hasMultipleSizes: true,
        sizes: [
          {
            id: 'platter-5',
            name: '5 Item Platter',
            price: 44.99,
            description: 'Choose 5 items from our selection of rolls, sashimi, and nigiri',
            platters: {
              itemCount: 5,
              discount: 0.10,
              description: 'Choose 5 items from our selection of rolls, sashimi, and nigiri'
            }
          },
          {
            id: 'platter-8',
            name: '8 Item Platter',
            price: 71.99,
            description: 'Choose 8 items from our selection of rolls, sashimi, and nigiri',
            platters: {
              itemCount: 8,
              discount: 0.10,
              description: 'Choose 8 items from our selection of rolls, sashimi, and nigiri'
            }
          },
          {
            id: 'platter-10',
            name: '10 Item Platter',
            price: 89.99,
            description: 'Choose 10 items from our selection of rolls, sashimi, and nigiri',
            platters: {
              itemCount: 10,
              discount: 0.10,
              description: 'Choose 10 items from our selection of rolls, sashimi, and nigiri'
            }
          }
        ]
      },
      {
        id: 'sushi-nigiri-platter',
        name: 'Nigiri Platter',
        description: 'Choose your nigiri selections and platter size',
        price: 0, // Will be set by size selection
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Sushi/nigiri/on-demand-nigiri-Garlic-Tuna.jpg',
        isCustomizable: true,
        hasMultipleSizes: true,
        sizes: [
          {
            id: 'nigiri-20',
            name: '20 Piece Nigiri Platter',
            price: 50.00,
            description: 'Choose 4 nigiri options and get 5 pieces of each (20 total pieces)',
            platters: {
              itemCount: 4,
              piecesPerOption: 5,
              totalPieces: 20,
              discount: 0,
              description: 'Choose 4 nigiri options and get 5 pieces of each (20 total pieces)',
              type: 'nigiri'
            }
          },
          {
            id: 'nigiri-40',
            name: '40 Piece Nigiri Platter',
            price: 95.00,
            description: 'Choose 8 nigiri options and get 5 pieces of each (40 total pieces)',
            platters: {
              itemCount: 8,
              piecesPerOption: 5,
              totalPieces: 40,
              discount: 0,
              description: 'Choose 8 nigiri options and get 5 pieces of each (40 total pieces)',
              type: 'nigiri'
            }
          },
          {
            id: 'nigiri-100',
            name: '100 Piece Nigiri Platter',
            price: 200.00,
            description: 'Choose 10 nigiri options and get 10 pieces of each (100 total pieces)',
            platters: {
              itemCount: 10,
              piecesPerOption: 10,
              totalPieces: 100,
              discount: 0,
              description: 'Choose 10 nigiri options and get 10 pieces of each (100 total pieces)',
              type: 'nigiri'
            }
          }
        ]
      },
      {
        id: 'sushi-sashimi-platter',
        name: 'Sashimi Platter',
        description: 'Choose your sashimi selections and platter size',
        price: 0, // Will be set by size selection
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Salmon(Sake).jpg',
        isCustomizable: true,
        hasMultipleSizes: true,
        sizes: [
          {
            id: 'sashimi-18',
            name: '18 Piece Sashimi Platter',
            price: 55.00,
            description: 'Choose 3 sashimi options and get 6 pieces of each (18 total pieces)',
            platters: {
              itemCount: 3,
              piecesPerOption: 6,
              totalPieces: 18,
              discount: 0,
              description: 'Choose 3 sashimi options and get 6 pieces of each (18 total pieces)',
              type: 'sashimi'
            }
          },
          {
            id: 'sashimi-30',
            name: '30 Piece Sashimi Platter',
            price: 95.00,
            description: 'Choose 5 sashimi options and get 6 pieces of each (30 total pieces)',
            platters: {
              itemCount: 5,
              piecesPerOption: 6,
              totalPieces: 30,
              discount: 0,
              description: 'Choose 5 sashimi options and get 6 pieces of each (30 total pieces)',
              type: 'sashimi'
            }
          },
          {
            id: 'sashimi-60',
            name: '60 Piece Sashimi Platter',
            price: 185.00,
            description: 'Choose all 6 sashimi options and get 10 pieces of each (60 total pieces)',
            platters: {
              itemCount: 6,
              piecesPerOption: 10,
              totalPieces: 60,
              discount: 0,
              description: 'Choose all 6 sashimi options and get 10 pieces of each (60 total pieces)',
              type: 'sashimi'
            }
          }
        ]
      },




      {
        id: 'sushi6',
        name: 'Green Tea',
        description: 'Hot or iced traditional Japanese green tea',
        price: 2.99,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center'
      }
    ]
  },
  "pizza": {
    name: "Pizza Place",
    items: [
      {
        id: 'pizza1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil on thin crust',
        price: 14.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese',
        price: 16.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza3',
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, peppers, onions, mushrooms, olives',
        price: 19.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza4',
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 6.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1619985632461-f33748ef8d3d?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 7.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza6',
        name: 'Italian Soda',
        description: 'Sparkling water with Italian syrup flavors',
        price: 3.49,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop&crop=center'
      }
    ]
  }
};

interface CartItem extends OrderItem {
  id: string;
  image?: string;
}

export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment-related state
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Sampler plate state
  const [showSamplerModal, setShowSamplerModal] = useState(false);
  const [samplerSize, setSamplerSize] = useState<'small' | 'large'>('small');
  const [selectedSandwiches, setSelectedSandwiches] = useState<{id: string, count: number}[]>([]);
  const samplerModalRef = useRef<HTMLDivElement>(null);

  // Tray size selection state
  const [showTrayModal, setShowTrayModal] = useState(false);
  const [selectedTray, setSelectedTray] = useState<any>(null);
  const [trayQuantities, setTrayQuantities] = useState<{small: number, large: number}>({small: 0, large: 0});
  const trayModalRef = useRef<HTMLDivElement>(null);

  // Soda flavor selection state
  const [showSodaModal, setShowSodaModal] = useState(false);
  const [selectedSoda, setSelectedSoda] = useState<any>(null);
  const [sodaQuantities, setSodaQuantities] = useState<{[key: string]: number}>({});
  const sodaModalRef = useRef<HTMLDivElement>(null);

  // Sushi platter selection state
  const [showSushiPlatterModal, setShowSushiPlatterModal] = useState(false);
  const [selectedSushiPlatter, setSelectedSushiPlatter] = useState<any>(null);
  const [selectedPlatterSize, setSelectedPlatterSize] = useState<any>(null);
  const [sushiPlatterSelections, setSushiPlatterSelections] = useState<any[]>([]);
  const sushiPlatterModalRef = useRef<HTMLDivElement>(null);

  // Nigiri platter selection state
  const [showNigiriPlatterModal, setShowNigiriPlatterModal] = useState(false);
  const [selectedNigiriPlatter, setSelectedNigiriPlatter] = useState<any>(null);
  const [selectedNigiriSize, setSelectedNigiriSize] = useState<any>(null);
  const [nigiriPlatterSelections, setNigiriPlatterSelections] = useState<any[]>([]);
  const nigiriPlatterModalRef = useRef<HTMLDivElement>(null);

  // Sashimi platter selection state
  const [showSashimiPlatterModal, setShowSashimiPlatterModal] = useState(false);
  const [selectedSashimiPlatter, setSelectedSashimiPlatter] = useState<any>(null);
  const [selectedSashimiSize, setSelectedSashimiSize] = useState<any>(null);
  const [sashimiPlatterSelections, setSashimiPlatterSelections] = useState<any[]>([]);
  const sashimiPlatterModalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when required items are selected
  useEffect(() => {
    if (selectedPlatterSize && sushiPlatterSelections.length === selectedPlatterSize.platters?.itemCount) {
      setTimeout(() => {
        if (sushiPlatterModalRef.current) {
          sushiPlatterModalRef.current.scrollTo({
            top: sushiPlatterModalRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300); // Small delay to ensure the UI has updated
    }
  }, [sushiPlatterSelections.length, selectedPlatterSize]);

  // Auto-scroll to bottom when required nigiri items are selected
  useEffect(() => {
    if (selectedNigiriSize && nigiriPlatterSelections.length === selectedNigiriSize.platters?.itemCount) {
      setTimeout(() => {
        if (nigiriPlatterModalRef.current) {
          nigiriPlatterModalRef.current.scrollTo({
            top: nigiriPlatterModalRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300); // Small delay to ensure the UI has updated
    }
  }, [nigiriPlatterSelections.length, selectedNigiriSize]);

  // Auto-scroll to bottom when required sashimi items are selected
  useEffect(() => {
    if (selectedSashimiSize && sashimiPlatterSelections.length === selectedSashimiSize.platters?.itemCount) {
      setTimeout(() => {
        if (sashimiPlatterModalRef.current) {
          sashimiPlatterModalRef.current.scrollTo({
            top: sashimiPlatterModalRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 300); // Small delay to ensure the UI has updated
    }
  }, [sashimiPlatterSelections.length, selectedSashimiSize]);

  // Calculate sampler price with Wagyu upcharges
  const calculateSamplerPrice = () => {
    const basePrice = samplerSize === 'small' ? 73.99 : 97.99;
    const wagyuUpcharge = 7.29;

    const wagyuCount = selectedSandwiches.reduce((count, item) => {
      const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
      // Only count Wagyu sandwiches
      return sandwich?.isWagyu ? count + item.count : count;
    }, 0);

    return basePrice + (wagyuCount * wagyuUpcharge);
  };

  // Calculate dynamic platter price based on selected items
  const calculatePlatterPrice = (selections: any[], piecesPerOption: number) => {
    return selections.reduce((total, item) => {
      return total + item.price;
    }, 0);
  };

  // Handle form submission (proceed to payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!deliveryInfo.date || !deliveryInfo.time || !deliveryInfo.address.street || !deliveryInfo.address.city || !deliveryInfo.address.state || !deliveryInfo.address.zipCode) {
      setErrorMessage('Please fill in all required delivery information.');
      setShowErrorModal(true);
      return;
    }

    // Check if delivery is at least 12 hours in advance
    const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    if (deliveryDateTime < twelveHoursFromNow) {
      setErrorMessage('Orders must be placed at least 12 hours in advance of the delivery time.');
      setShowErrorModal(true);
      return;
    }

    // Check authentication before proceeding to payment
    if (!isAuthenticated) {
      setErrorMessage('Please log in to place an order.');
      setShowErrorModal(true);
      return;
    }

    // Proceed to payment
    setShowPayment(true);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true);

    try {
      // Create order with payment information
      const orderData: CreateOrderData = {
        items: cart.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          dietaryInfo: item.dietaryInfo
        })),
        deliveryDate: deliveryInfo.date,
        deliveryTime: deliveryInfo.time,
        deliveryAddress: {
          street: deliveryInfo.address.street,
          city: deliveryInfo.address.city,
          state: deliveryInfo.address.state,
          zipCode: deliveryInfo.address.zipCode
        },
        specialInstructions: deliveryInfo.specialInstructions,
        paymentIntentId: paymentIntentId
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Order created successfully
        setShowSuccessModal(true);
        setCart([]);
        setDeliveryInfo({
          date: '',
          time: '',
          address: { street: '', city: '', state: 'NV', zipCode: '' },
          specialInstructions: ''
        });
        setShowPayment(false);
        setPaymentIntentId(null);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create order. Please contact support.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.log('handlePaymentError called with:', error);
    setErrorMessage(`Payment failed: ${error}`);
    setShowErrorModal(true);
    setIsProcessingPayment(false);
  };

  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      city: '',
      state: 'NV', // Default to Nevada since this is CaterLV
      zipCode: ''
    },
    specialInstructions: ''
  });

  // Pre-fill date and time from URL parameters if coming from schedule page
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

    if (dateParam || timeParam) {
      setDeliveryInfo(prev => ({
        ...prev,
        ...(dateParam && { date: dateParam }),
        ...(timeParam && { time: timeParam })
      }));
    }
  }, [searchParams]);

  // Handle click outside time picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTimePicker]);

  // Generate time options (every 30 minutes from 6:00 AM to 10:00 PM)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Handle time selection
  const handleTimeSelect = (timeValue: string) => {
    setDeliveryInfo({ ...deliveryInfo, time: timeValue });
    setShowTimePicker(false);
  };

  const currentMenu = restaurantMenus[selectedRestaurant].items;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add item to cart
  const addToCart = (menuItem: typeof currentMenu[0]) => {
    const existingItem = cart.find(item => item.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        quantity: 1,
        price: menuItem.price,
        category: menuItem.category,
        dietaryInfo: menuItem.dietaryInfo as any
      }]);
    }
  };

  // Add item to cart with specific quantity
  const addToCartWithQuantity = (menuItem: typeof currentMenu[0], quantity: number) => {
    if (quantity <= 0) return;

    const existingItem = cart.find(item => item.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        quantity: quantity,
        price: menuItem.price,
        category: menuItem.category,
        dietaryInfo: menuItem.dietaryInfo as any
      }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== itemId));
    }
  };

  // Handle restaurant selection with auto-scroll
  const handleRestaurantSelection = (restaurant: keyof typeof restaurantMenus) => {
    setSelectedRestaurant(restaurant);
    setCart([]); // Clear cart when switching restaurants

    // Smooth scroll to menu section after a brief delay
    setTimeout(() => {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300); // Small delay to allow state update
  };

  // Add item from cart (increment quantity)
  const addItemFromCart = (cartItem: CartItem) => {
    setCart(cart.map(item =>
      item.id === cartItem.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  return (
    <div className="flex min-h-screen flex-col font-sans" style={{
      color: 'rgb(15, 15, 15)',
      backgroundColor: 'rgb(255, 255, 255)'
    }}>
      <Navigation />

      {/* Hero Section */}
      <div style={{ backgroundColor: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(113, 113, 122)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Order <span style={{ color: 'rgb(113, 113, 122)' }}>Premium</span> Catering
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(15, 15, 15)' }}>
              Experience exceptional catering from Las Vegas's finest restaurants
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                1
              </div>
              <span className="ml-3 text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>Select Restaurant</span>
            </div>
            <div className="w-16 h-1 rounded" style={{ backgroundColor: 'rgb(15, 15, 15)' }}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                cart.length > 0 ? 'text-white' : ''
              }`} style={{
                backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)',
                color: cart.length > 0 ? 'white' : 'white'
              }}>
                2
              </div>
              <span className={`ml-3 text-lg font-semibold`} style={{
                color: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>Build Your Order</span>
            </div>
            <div className={`w-16 h-1 rounded`} style={{
              backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
            }}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white`} style={{
                backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>
                3
              </div>
              <span className={`ml-3 text-lg font-semibold`} style={{
                color: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>Complete Order</span>
            </div>
          </div>
        </div>

        {/* Step 1: Restaurant Selection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Step 1: Choose Your <span style={{ color: 'rgb(113, 113, 122)' }}>Restaurant</span>
            </h2>
            <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>Select from our curated collection of premium catering partners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Capriotti's Option */}
            <div
              onClick={() => handleRestaurantSelection('capriottis')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'capriottis'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'capriottis'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'capriottis'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🥪</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Capriotti's
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Sandwich Shop
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Premium catering trays, box lunches & gourmet salads
                </p>
                {selectedRestaurant === 'capriottis' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sushi on Demand Option */}
            <div
              onClick={() => handleRestaurantSelection('sushi')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'sushi'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'sushi'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'sushi'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🍣</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'sushi' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Sushi on Demand
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'sushi' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Japanese Cuisine
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'sushi' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Fresh sushi boats, custom platters & premium rolls
                </p>
                {selectedRestaurant === 'sushi' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pizza Place Option */}
            <div
              onClick={() => handleRestaurantSelection('pizza')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'pizza'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'pizza'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'pizza'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🍕</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'pizza' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Pizza Place
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'pizza' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Italian Cuisine
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'pizza' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Artisan pizzas, appetizers & Italian desserts
                </p>
                {selectedRestaurant === 'pizza' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Menu Selection */}
        <div id="menu-section" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Step 2: Build Your <span style={{ color: 'rgb(113, 113, 122)' }}>Order</span>
            </h2>
            <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
              Explore the menu from <span className="font-semibold" style={{ color: 'rgb(113, 113, 122)' }}>{restaurantMenus[selectedRestaurant].name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Main Items Section */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                    🍽️
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Main Items</h3>
                    <p style={{ color: 'rgb(113, 113, 122)' }}>Premium entrees and signature dishes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.filter(item => item.category === 'main').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                      style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        border: '2px solid rgb(113, 113, 122)'
                      }}
                    >
                      {item.image && (
                        <div className="h-40 w-full overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                        </div>
                      )}

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold transition-colors duration-200" style={{
                            color: 'rgb(15, 15, 15)'
                          }}>
                            {item.name}
                          </h4>
                          {!('isCustomizable' in item && item.isCustomizable) && (
                            <div className="text-right">
                              <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

                        {/* Dietary Info */}
                        {item.dietaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.dietaryInfo.map((info) => (
                              <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                {info}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="flex items-center justify-between mt-auto">
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                              >
                                <Minus size={18} />
                              </button>
                              <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                              <button
                                onClick={() => {
                                  if (item.id === 'cap-sampler') {
                                    setShowSamplerModal(true);
                                  } else if (item.id === 'cap-soda') {
                                    setSelectedSoda(item);
                                    const initialQuantities: {[key: string]: number} = {};
                                    if ('flavors' in item && item.flavors) {
                                      (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                    }
                                    setSodaQuantities(initialQuantities);
                                    setShowSodaModal(true);
                                  } else if (item.id.startsWith('sushi-platter-')) {
                                    setSelectedSushiPlatter(item);
                                    setSushiPlatterSelections([]);
                                    setShowSushiPlatterModal(true);
                                  } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                    setSelectedTray(item);
                                    setTrayQuantities({small: 0, large: 0}); // Reset quantities
                                    setShowTrayModal(true);
                                  } else {
                                    addToCart(item);
                                  }
                                }}
                                className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (item.id === 'cap-sampler') {
                                  setShowSamplerModal(true);
                                } else if (item.id === 'cap-soda') {
                                  setSelectedSoda(item);
                                  const initialQuantities: {[key: string]: number} = {};
                                  if ('flavors' in item && item.flavors) {
                                    (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                  }
                                  setSodaQuantities(initialQuantities);
                                  setShowSodaModal(true);
                                } else if (item.id === 'sushi-platter') {
                                  setSelectedSushiPlatter(item);
                                  setSushiPlatterSelections([]);
                                  setShowSushiPlatterModal(true);
                                } else if (item.id === 'sushi-nigiri-platter') {
                                  setSelectedNigiriPlatter(item);
                                  setNigiriPlatterSelections([]);
                                  setShowNigiriPlatterModal(true);
                                } else if (item.id === 'sushi-sashimi-platter') {
                                  setSelectedSashimiPlatter(item);
                                  setSashimiPlatterSelections([]);
                                  setShowSashimiPlatterModal(true);
                                } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                  setSelectedTray(item);
                                  setTrayQuantities({small: 0, large: 0}); // Reset quantities
                                  setShowTrayModal(true);
                                } else {
                                  addToCart(item);
                                }
                              }}
                              className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                              style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                            >
                              <Plus size={20} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desserts Section */}
              {currentMenu.filter(item => item.category === 'dessert').length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                      🍰
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Desserts & Treats</h3>
                      <p style={{ color: 'rgb(113, 113, 122)' }}>Sweet endings to your perfect meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
                      >
                        {item.image && (
                          <div className="h-40 w-full overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                                item.id === 'cap-cookie-brookie-tray' ? 'object-[center_70%]' : ''
                              }`}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                          </div>
                        )}

                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            {!('isCustomizable' in item && item.isCustomizable) && (
                              <div className="text-right">
                                <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

                          {/* Dietary Info */}
                          {item.dietaryInfo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.dietaryInfo.map((info) => (
                                <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                  {info}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          <div className="flex items-center justify-between mt-auto">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={20} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beverages Section */}
              {currentMenu.filter(item => item.category === 'beverage').length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                      🥤
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Beverages</h3>
                      <p style={{ color: 'rgb(113, 113, 122)' }}>Refreshing drinks to complement your meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
                      >
                        {item.image && (
                          <div className="h-40 w-full overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                          </div>
                        )}

                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            {!('isCustomizable' in item && item.isCustomizable) && (
                              <div className="text-right">
                                <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

                          {/* Dietary Info */}
                          {item.dietaryInfo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.dietaryInfo.map((info) => (
                                <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                  {info}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          <div className="flex items-center justify-between mt-auto">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => {
                                    if (item.id === 'cap-soda') {
                                      setSelectedSoda(item);
                                      const initialQuantities: {[key: string]: number} = {};
                                      if ('flavors' in item && item.flavors) {
                                        (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                      }
                                      setSodaQuantities(initialQuantities);
                                      setShowSodaModal(true);
                                    } else {
                                      addToCart(item);
                                    }
                                  }}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  if (item.id === 'cap-soda') {
                                    setSelectedSoda(item);
                                    const initialQuantities: {[key: string]: number} = {};
                                    if ('flavors' in item && item.flavors) {
                                      (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                    }
                                    setSodaQuantities(initialQuantities);
                                    setShowSodaModal(true);
                                  } else {
                                    addToCart(item);
                                  }
                                }}
                                className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={20} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Cart and Checkout Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl shadow-xl p-6 sticky top-8" style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(113, 113, 122)'
              }}>
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 text-white`} style={{
                    backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
                  }}>
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Your Order</h3>
                    <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>Review and complete</p>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgb(113, 113, 122)' }}>
                      <ShoppingCart size={24} className="text-white" />
                    </div>
                    <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>Your cart is empty</p>
                    <p className="text-sm mt-2" style={{ color: 'rgb(113, 113, 122)' }}>Add items from the menu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="rounded-lg p-3" style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '1px solid rgb(113, 113, 122)'
                        }}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.name}</h4>
                            <span className="font-bold text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 text-white rounded transition flex items-center justify-center"
                                style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-medium min-w-[1.5rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => addItemFromCart(item)}
                                className="w-6 h-6 text-white rounded transition flex items-center justify-center"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-xs" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-4" style={{ borderTop: '1px solid rgb(113, 113, 122)' }}>
                      <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15, 15, 15, 0.05)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Total:</span>
                          <span className="text-2xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${total.toFixed(2)}</span>
                        </div>
                        <div className="text-sm mt-1" style={{ color: 'rgb(15, 15, 15)' }}>
                          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4" style={{ borderTop: '1px solid rgb(113, 113, 122)' }}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                          <Calendar size={16} />
                          Delivery Details
                        </h4>
                        {(searchParams.get('date') || searchParams.get('time')) && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{
                            backgroundColor: 'rgba(15, 15, 15, 0.1)',
                            color: 'rgb(113, 113, 122)'
                          }}>
                            📅 From Schedule
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Date</label>
                          <input
                            type="date"
                            value={deliveryInfo.date}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Time</label>
                          <div
                            onClick={() => setShowTimePicker(!showTimePicker)}
                            className="w-full rounded-lg px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                          >
                            <span>
                              {deliveryInfo.time ?
                                new Date(`2000-01-01T${deliveryInfo.time}`).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                }) :
                                'Select time'
                              }
                            </span>
                            <Clock size={16} style={{ color: 'rgb(113, 113, 122)' }} />
                          </div>

                          {showTimePicker && (
                            <div
                              ref={timePickerRef}
                              className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                              style={{
                                backgroundColor: 'rgb(255, 255, 255)',
                                border: '2px solid rgb(113, 113, 122)'
                              }}
                            >
                              {/* Close button */}
                              <div className="sticky top-0 flex justify-between items-center p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(113, 113, 122)' }}>
                                <span className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Select Time</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTimePicker(false);
                                  }}
                                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <X size={12} className="text-white" />
                                </button>
                              </div>

                              {/* Time options */}
                              <div className="p-1">
                                {timeOptions.map((time) => (
                                  <div
                                    key={time.value}
                                    onClick={() => handleTimeSelect(time.value)}
                                    className="px-3 py-2 text-sm cursor-pointer rounded transition-colors duration-150"
                                    style={{
                                      color: deliveryInfo.time === time.value ? 'white' : 'rgb(15, 15, 15)',
                                      backgroundColor: deliveryInfo.time === time.value ? 'rgb(15, 15, 15)' : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (deliveryInfo.time !== time.value) {
                                        e.currentTarget.style.backgroundColor = 'rgba(113, 113, 122, 0.1)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (deliveryInfo.time !== time.value) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                  >
                                    {time.display}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                          <MapPin size={14} />
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={deliveryInfo.address.street}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, street: e.target.value}
                          })}
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 mb-2"
                          style={{
                            border: '1px solid rgb(113, 113, 122)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(15, 15, 15)'
                          }}
                          required
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={deliveryInfo.address.city}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, city: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                          <select
                            value={deliveryInfo.address.state}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, state: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          >
                            <option value="NV">Nevada</option>
                            <option value="CA">California</option>
                            <option value="AZ">Arizona</option>
                            <option value="UT">Utah</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Zip Code"
                            value={deliveryInfo.address.zipCode}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, zipCode: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Special Instructions</label>
                        <textarea
                          placeholder="Any special delivery instructions..."
                          value={deliveryInfo.specialInstructions}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                          style={{
                            border: '1px solid rgb(113, 113, 122)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(15, 15, 15)'
                          }}
                          rows={2}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full text-white py-3 px-4 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)')}
                        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)')}
                      >
                        {isSubmitting ? 'Processing...' : `Proceed to Payment - $${total.toFixed(2)}`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Payment Modal */}
        {showPayment && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-xl shadow-2xl max-w-sm w-full p-6 max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid rgb(113, 113, 122)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>Complete Payment</h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-2xl font-bold transition hover:scale-110"
                    style={{ color: 'rgb(113, 113, 122)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(82, 82, 91)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(15, 15, 15, 0.05)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Order Total:</span>
                    <span className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items • Delivery: {deliveryInfo.date} at {deliveryInfo.time}
                  </div>
                </div>

                <StripePaymentForm
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isProcessingPayment}
                  setIsProcessing={setIsProcessingPayment}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="rounded-xl shadow-2xl max-w-md w-full p-8"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(15, 15, 15)'
              }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-3"
                  style={{ color: 'rgb(15, 15, 15)' }}
                >
                  Order Placed Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 text-lg"
                  style={{ color: 'rgb(113, 113, 122)' }}
                >
                  Thank you for your order! You will receive a confirmation email shortly with all the details.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full text-white px-6 py-3 rounded-lg transition font-semibold"
                    style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = '/schedule';
                    }}
                    className="w-full px-6 py-3 rounded-lg transition font-medium"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid rgb(113, 113, 122)',
                      color: 'rgb(113, 113, 122)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(113, 113, 122)';
                    }}
                  >
                    View Schedule
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tray Size Selection Modal */}
        {showTrayModal && selectedTray && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={trayModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Size
                  </h2>
                  <button
                    onClick={() => setShowTrayModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                  {selectedTray.name}
                </h3>

                {/* Description */}
                <p className="text-sm mb-6" style={{ color: 'rgb(113, 113, 122)' }}>
                  {selectedTray.description}
                </p>

                {/* Size Selection with Quantity */}
                <div className="space-y-4">
                  {/* Small Size */}
                  <div className="border-2 border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                          Small
                        </h4>
                        <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                          Serves 8-10 people
                        </p>
                      </div>
                      <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                        ${selectedTray.pricing?.small.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          small: Math.max(0, prev.small - 1)
                        }))}
                        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                        {trayQuantities.small}
                      </span>
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          small: prev.small + 1
                        }))}
                        className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Large Size */}
                  <div className="border-2 border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                          Large
                        </h4>
                        <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                          Serves 11-13 people
                        </p>
                      </div>
                      <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                        ${selectedTray.pricing?.large.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          large: Math.max(0, prev.large - 1)
                        }))}
                        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                        {trayQuantities.large}
                      </span>
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          large: prev.large + 1
                        }))}
                        className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                      Total: ${((trayQuantities.small * selectedTray.pricing?.small) + (trayQuantities.large * selectedTray.pricing?.large)).toFixed(2)}
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {trayQuantities.small + trayQuantities.large} item(s)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Add small items to cart
                      if (trayQuantities.small > 0) {
                        const smallItem = {
                          ...selectedTray,
                          id: `${selectedTray.id}-small-${Date.now()}`,
                          name: `${selectedTray.name} (Small)`,
                          description: `${selectedTray.description} Serves 8-10 people.`,
                          price: selectedTray.pricing.small
                        };
                        addToCartWithQuantity(smallItem, trayQuantities.small);
                      }

                      // Add large items to cart
                      if (trayQuantities.large > 0) {
                        const largeItem = {
                          ...selectedTray,
                          id: `${selectedTray.id}-large-${Date.now()}`,
                          name: `${selectedTray.name} (Large)`,
                          description: `${selectedTray.description} Serves 11-13 people.`,
                          price: selectedTray.pricing.large
                        };
                        addToCartWithQuantity(largeItem, trayQuantities.large);
                      }

                      // Reset and close modal
                      setTrayQuantities({small: 0, large: 0});
                      setShowTrayModal(false);
                    }}
                    disabled={trayQuantities.small + trayQuantities.large === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                      trayQuantities.small + trayQuantities.large > 0
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Soda Flavor Selection Modal */}
        {showSodaModal && selectedSoda && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={sodaModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Flavors
                  </h2>
                  <button
                    onClick={() => setShowSodaModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                  {selectedSoda.name}
                </h3>

                {/* Description */}
                <p className="text-sm mb-6" style={{ color: 'rgb(113, 113, 122)' }}>
                  ${selectedSoda.price.toFixed(2)} each - Select your favorite flavors
                </p>

                {/* Flavor Selection with Quantity */}
                <div className="space-y-4">
                  {selectedSoda.flavors?.map((flavor: string) => (
                    <div key={flavor} className="border-2 border-gray-200 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                            {flavor}
                          </h4>
                          <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                            ${selectedSoda.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSodaQuantities(prev => ({
                            ...prev,
                            [flavor]: Math.max(0, (prev[flavor] || 0) - 1)
                          }))}
                          className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                          {sodaQuantities[flavor] || 0}
                        </span>
                        <button
                          onClick={() => setSodaQuantities(prev => ({
                            ...prev,
                            [flavor]: (prev[flavor] || 0) + 1
                          }))}
                          className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                      Total: ${(Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) * selectedSoda.price).toFixed(2)}
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0)} bottle(s)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Add each flavor with its quantity to cart
                      Object.entries(sodaQuantities).forEach(([flavor, quantity]) => {
                        if (quantity > 0) {
                          const sodaItem = {
                            ...selectedSoda,
                            id: `${selectedSoda.id}-${flavor.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            name: `${selectedSoda.name} - ${flavor}`,
                            description: `${flavor} flavored beverage`,
                            price: selectedSoda.price
                          };
                          addToCartWithQuantity(sodaItem, quantity);
                        }
                      });

                      // Reset and close modal
                      const initialQuantities: {[key: string]: number} = {};
                      (selectedSoda.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                      setSodaQuantities(initialQuantities);
                      setShowSodaModal(false);
                    }}
                    disabled={Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                      Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) > 0
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Sushi Platter Selection Modal */}
        {showSushiPlatterModal && selectedSushiPlatter && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-auto"
            onClick={() => {
              setShowSushiPlatterModal(false);
              setSelectedPlatterSize(null);
              setSushiPlatterSelections([]);
            }}
          >
            <motion.div
              ref={sushiPlatterModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    {!selectedPlatterSize ? 'Select Platter Size' : 'Customize Your Platter'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowSushiPlatterModal(false);
                      setSelectedPlatterSize(null);
                      setSushiPlatterSelections([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Size Selection */}
                {!selectedPlatterSize && selectedSushiPlatter.hasMultipleSizes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                      Choose Your Platter Size
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedSushiPlatter.sizes?.map((size: any) => (
                        <div
                          key={size.id}
                          onClick={() => setSelectedPlatterSize(size)}
                          className="border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-black transition-colors"
                        >
                          <h4 className="font-semibold text-lg mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                            {size.name}
                          </h4>
                          <p className="text-sm mb-2" style={{ color: 'rgb(113, 113, 122)' }}>
                            {size.description}
                          </p>
                          <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                            ${size.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Item Selection (shown after size is selected) */}
                {selectedPlatterSize && (
                  <>
                    {/* Platter Info */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => {
                            setSelectedPlatterSize(null);
                            setSushiPlatterSelections([]);
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          ←
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                            {selectedPlatterSize.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                            {selectedPlatterSize.description}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                        Price: ${selectedPlatterSize.price.toFixed(2)} (includes 10% discount)
                      </p>
                    </div>

                    {/* Available Sushi Items */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                        Select {selectedPlatterSize.platters?.itemCount} Items
                      </h4>
                      <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                        Selected: {sushiPlatterSelections.length} / {selectedPlatterSize.platters?.itemCount}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableSushiItems.map((sushiItem) => {
                          const selectedCount = sushiPlatterSelections.filter(sel => sel.id === sushiItem.id).length;
                          const canAdd = sushiPlatterSelections.length < (selectedPlatterSize.platters?.itemCount || 0);

                      return (
                        <div key={sushiItem.id} className="border-2 border-gray-200 p-4 rounded-xl">
                          <div className="flex items-center gap-4">
                            <img
                              src={sushiItem.image}
                              alt={sushiItem.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-grow">
                              <h5 className="font-semibold text-sm" style={{ color: 'rgb(15, 15, 15)' }}>
                                {sushiItem.name}
                              </h5>
                              <p className="text-xs" style={{ color: 'rgb(113, 113, 122)' }}>
                                ${sushiItem.price.toFixed(2)}
                              </p>
                              {selectedCount > 0 && (
                                <p className="text-xs font-semibold text-green-600">
                                  Selected: {selectedCount}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedCount > 0 && (
                                <button
                                  onClick={() => {
                                    const index = sushiPlatterSelections.findIndex(sel => sel.id === sushiItem.id);
                                    if (index !== -1) {
                                      const newSelections = [...sushiPlatterSelections];
                                      newSelections.splice(index, 1);
                                      setSushiPlatterSelections(newSelections);
                                    }
                                  }}
                                  className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                  -
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (canAdd) {
                                    setSushiPlatterSelections([...sushiPlatterSelections, sushiItem]);
                                  }
                                }}
                                disabled={!canAdd}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  canAdd
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                    {/* Price Display */}
                    {sushiPlatterSelections.length === selectedPlatterSize.platters?.itemCount && (
                      <div className="pt-4 border-t border-gray-200 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Price Breakdown:</h4>
                          {sushiPlatterSelections.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-1">
                              <span>{item.name} ({selectedPlatterSize.platters?.piecesPerOption || 1} pieces)</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculatePlatterPrice(sushiPlatterSelections, selectedPlatterSize.platters?.piecesPerOption || 1).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          if (sushiPlatterSelections.length === selectedPlatterSize.platters?.itemCount) {
                            const dynamicPrice = calculatePlatterPrice(sushiPlatterSelections, selectedPlatterSize.platters?.piecesPerOption || 1);
                            const platterItem = {
                              ...selectedPlatterSize,
                              id: `${selectedSushiPlatter.id}-${selectedPlatterSize.id}-${Date.now()}`,
                              name: `${selectedPlatterSize.name} (Custom)`,
                              description: `Custom platter with: ${sushiPlatterSelections.map(item => `${item.name} (${selectedPlatterSize.platters?.piecesPerOption || 1} pieces)`).join(', ')}`,
                              price: dynamicPrice,
                              category: 'main' as const,
                              dietaryInfo: [] as string[],
                              customSelections: sushiPlatterSelections
                            };
                            addToCart(platterItem);
                            setSushiPlatterSelections([]);
                            setSelectedPlatterSize(null);
                            setShowSushiPlatterModal(false);
                          }
                        }}
                        disabled={sushiPlatterSelections.length !== selectedPlatterSize.platters?.itemCount}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                          sushiPlatterSelections.length === selectedPlatterSize.platters?.itemCount
                            ? 'bg-black hover:bg-gray-800'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {sushiPlatterSelections.length === selectedPlatterSize.platters?.itemCount
                          ? `Add ${selectedPlatterSize.name} to Cart - $${calculatePlatterPrice(sushiPlatterSelections, selectedPlatterSize.platters?.piecesPerOption || 1).toFixed(2)}`
                          : `Select ${(selectedPlatterSize.platters?.itemCount || 0) - sushiPlatterSelections.length} more items`
                        }
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Nigiri Platter Selection Modal */}
        {showNigiriPlatterModal && selectedNigiriPlatter && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-auto"
            onClick={() => {
              setShowNigiriPlatterModal(false);
              setSelectedNigiriSize(null);
              setNigiriPlatterSelections([]);
            }}
          >
            <motion.div
              ref={nigiriPlatterModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    {selectedNigiriPlatter.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowNigiriPlatterModal(false);
                      setSelectedNigiriSize(null);
                      setNigiriPlatterSelections([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Size Selection */}
                {!selectedNigiriSize && selectedNigiriPlatter.hasMultipleSizes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                      Choose Your Platter Size
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedNigiriPlatter.sizes?.map((size: any) => (
                        <div
                          key={size.id}
                          onClick={() => setSelectedNigiriSize(size)}
                          className="border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-black transition-colors"
                        >
                          <h4 className="font-semibold text-lg mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                            {size.name}
                          </h4>
                          <p className="text-sm mb-2" style={{ color: 'rgb(113, 113, 122)' }}>
                            {size.description}
                          </p>
                          <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                            ${size.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Item Selection */}
                {selectedNigiriSize && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => {
                            setSelectedNigiriSize(null);
                            setNigiriPlatterSelections([]);
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          ←
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                            {selectedNigiriSize.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                            {selectedNigiriSize.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                        Select {selectedNigiriSize.platters?.itemCount} Items
                      </h4>
                      <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                        Selected: {nigiriPlatterSelections.length} / {selectedNigiriSize.platters?.itemCount}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableNigiriOptions.map((nigiriItem) => {
                          const selectedCount = nigiriPlatterSelections.filter(sel => sel.id === nigiriItem.id).length;
                          const canAdd = nigiriPlatterSelections.length < (selectedNigiriSize.platters?.itemCount || 0);

                      return (
                        <div key={nigiriItem.id} className="border-2 border-gray-200 p-4 rounded-xl">
                          <div className="flex items-center gap-4">
                            <img
                              src={nigiriItem.image}
                              alt={nigiriItem.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                                {nigiriItem.name}
                              </h5>
                              {nigiriItem.description && (
                                <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                                  {nigiriItem.description}
                                </p>
                              )}
                              <p className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>
                                ${nigiriItem.price.toFixed(2)} each
                              </p>
                              {selectedCount > 0 && (
                                <p className="text-sm font-medium mt-1" style={{ color: 'rgb(15, 15, 15)' }}>
                                  Selected: {selectedCount}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedCount > 0 && (
                                <button
                                  onClick={() => {
                                    const index = nigiriPlatterSelections.findIndex(sel => sel.id === nigiriItem.id);
                                    if (index !== -1) {
                                      const newSelections = [...nigiriPlatterSelections];
                                      newSelections.splice(index, 1);
                                      setNigiriPlatterSelections(newSelections);
                                    }
                                  }}
                                  className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                  -
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (canAdd) {
                                    setNigiriPlatterSelections([...nigiriPlatterSelections, nigiriItem]);
                                  }
                                }}
                                disabled={!canAdd}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  canAdd
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </div>

                    {/* Price Display */}
                    {nigiriPlatterSelections.length === selectedNigiriSize.platters?.itemCount && (
                      <div className="pt-4 border-t border-gray-200 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Price Breakdown:</h4>
                          {nigiriPlatterSelections.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-1">
                              <span>{item.name} ({selectedNigiriSize.platters?.piecesPerOption || 1} pieces)</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculatePlatterPrice(nigiriPlatterSelections, selectedNigiriSize.platters?.piecesPerOption || 1).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          if (nigiriPlatterSelections.length === selectedNigiriSize.platters?.itemCount) {
                            const dynamicPrice = calculatePlatterPrice(nigiriPlatterSelections, selectedNigiriSize.platters?.piecesPerOption || 1);
                            const platterItem = {
                              ...selectedNigiriSize,
                              id: `${selectedNigiriPlatter.id}-${selectedNigiriSize.id}-${Date.now()}`,
                              name: `${selectedNigiriSize.name} (Custom)`,
                              description: `Custom nigiri platter with: ${nigiriPlatterSelections.map(item => `${item.name} (${selectedNigiriSize.platters?.piecesPerOption || 1} pieces)`).join(', ')}`,
                              price: dynamicPrice,
                              category: 'main' as const,
                              dietaryInfo: [] as string[],
                              customSelections: nigiriPlatterSelections
                            };
                            addToCart(platterItem);
                            setNigiriPlatterSelections([]);
                            setSelectedNigiriSize(null);
                            setShowNigiriPlatterModal(false);
                          }
                        }}
                        disabled={nigiriPlatterSelections.length !== selectedNigiriSize.platters?.itemCount}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                          nigiriPlatterSelections.length === selectedNigiriSize.platters?.itemCount
                            ? 'bg-black hover:bg-gray-800'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {nigiriPlatterSelections.length === selectedNigiriSize.platters?.itemCount
                          ? `Add ${selectedNigiriSize.name} to Cart - $${calculatePlatterPrice(nigiriPlatterSelections, selectedNigiriSize.platters?.piecesPerOption || 1).toFixed(2)}`
                          : `Select ${(selectedNigiriSize.platters?.itemCount || 0) - nigiriPlatterSelections.length} more items`
                        }
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Sashimi Platter Selection Modal */}
        {showSashimiPlatterModal && selectedSashimiPlatter && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-auto"
            onClick={() => {
              setShowSashimiPlatterModal(false);
              setSelectedSashimiSize(null);
              setSashimiPlatterSelections([]);
            }}
          >
            <motion.div
              ref={sashimiPlatterModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    {selectedSashimiPlatter.name}
                  </h2>
                  <button
                    onClick={() => {
                      setShowSashimiPlatterModal(false);
                      setSelectedSashimiSize(null);
                      setSashimiPlatterSelections([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Size Selection */}
                {!selectedSashimiSize && selectedSashimiPlatter.hasMultipleSizes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                      Choose Your Platter Size
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedSashimiPlatter.sizes?.map((size: any) => (
                        <div
                          key={size.id}
                          onClick={() => setSelectedSashimiSize(size)}
                          className="border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-black transition-colors"
                        >
                          <h4 className="font-semibold text-lg mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                            {size.name}
                          </h4>
                          <p className="text-sm mb-2" style={{ color: 'rgb(113, 113, 122)' }}>
                            {size.description}
                          </p>
                          <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                            ${size.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Item Selection */}
                {selectedSashimiSize && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <button
                          onClick={() => {
                            setSelectedSashimiSize(null);
                            setSashimiPlatterSelections([]);
                          }}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          ←
                        </button>
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                            {selectedSashimiSize.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                            {selectedSashimiSize.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
                        Select {selectedSashimiSize.platters?.itemCount} Items
                      </h4>
                      <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                        Selected: {sashimiPlatterSelections.length} / {selectedSashimiSize.platters?.itemCount}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableSashimiOptions.map((sashimiItem) => {
                          console.log('Sashimi item:', sashimiItem.name, 'Image:', sashimiItem.image, 'Price:', sashimiItem.price);
                          const selectedCount = sashimiPlatterSelections.filter(sel => sel.id === sashimiItem.id).length;
                          const canAdd = sashimiPlatterSelections.length < (selectedSashimiSize.platters?.itemCount || 0);

                      return (
                        <div key={sashimiItem.id} className="border-2 border-gray-200 p-4 rounded-xl">
                          <div className="flex items-center gap-4">
                            <img
                              src={sashimiItem.image}
                              alt={sashimiItem.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Failed to load image:', sashimiItem.image);
                                e.currentTarget.style.border = '2px solid red';
                              }}
                              onLoad={() => console.log('Successfully loaded:', sashimiItem.image)}
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                                {sashimiItem.name}
                              </h5>
                              {sashimiItem.description && (
                                <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                                  {sashimiItem.description}
                                </p>
                              )}
                              <p className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>
                                ${sashimiItem.price.toFixed(2)} each
                              </p>
                              {selectedCount > 0 && (
                                <p className="text-sm font-medium mt-1" style={{ color: 'rgb(15, 15, 15)' }}>
                                  Selected: {selectedCount}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedCount > 0 && (
                                <button
                                  onClick={() => {
                                    const index = sashimiPlatterSelections.findIndex(sel => sel.id === sashimiItem.id);
                                    if (index !== -1) {
                                      const newSelections = [...sashimiPlatterSelections];
                                      newSelections.splice(index, 1);
                                      setSashimiPlatterSelections(newSelections);
                                    }
                                  }}
                                  className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                  -
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (canAdd) {
                                    setSashimiPlatterSelections([...sashimiPlatterSelections, sashimiItem]);
                                  }
                                }}
                                disabled={!canAdd}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  canAdd
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    </div>

                    {/* Price Display */}
                    {sashimiPlatterSelections.length === selectedSashimiSize.platters?.itemCount && (
                      <div className="pt-4 border-t border-gray-200 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Price Breakdown:</h4>
                          {sashimiPlatterSelections.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-1">
                              <span>{item.name} ({selectedSashimiSize.platters?.piecesPerOption || 1} pieces)</span>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculatePlatterPrice(sashimiPlatterSelections, selectedSashimiSize.platters?.piecesPerOption || 1).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          if (sashimiPlatterSelections.length === selectedSashimiSize.platters?.itemCount) {
                            const dynamicPrice = calculatePlatterPrice(sashimiPlatterSelections, selectedSashimiSize.platters?.piecesPerOption || 1);
                            const platterItem = {
                              ...selectedSashimiSize,
                              id: `${selectedSashimiPlatter.id}-${selectedSashimiSize.id}-${Date.now()}`,
                              name: `${selectedSashimiSize.name} (Custom)`,
                              description: `Custom sashimi platter with: ${sashimiPlatterSelections.map(item => `${item.name} (${selectedSashimiSize.platters?.piecesPerOption || 1} pieces)`).join(', ')}`,
                              price: dynamicPrice,
                              category: 'main' as const,
                              dietaryInfo: [] as string[],
                              customSelections: sashimiPlatterSelections
                            };
                            addToCart(platterItem);
                            setSashimiPlatterSelections([]);
                            setSelectedSashimiSize(null);
                            setShowSashimiPlatterModal(false);
                          }
                        }}
                        disabled={sashimiPlatterSelections.length !== selectedSashimiSize.platters?.itemCount}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                          sashimiPlatterSelections.length === selectedSashimiSize.platters?.itemCount
                            ? 'bg-black hover:bg-gray-800'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {sashimiPlatterSelections.length === selectedSashimiSize.platters?.itemCount
                          ? `Add ${selectedSashimiSize.name} to Cart - $${calculatePlatterPrice(sashimiPlatterSelections, selectedSashimiSize.platters?.piecesPerOption || 1).toFixed(2)}`
                          : `Select ${(selectedSashimiSize.platters?.itemCount || 0) - sashimiPlatterSelections.length} more items`
                        }
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Sampler Plate Modal */}
        {showSamplerModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={samplerModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Customize Your Sampler Plate
                  </h2>
                  <button
                    onClick={() => setShowSamplerModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Size <span className="text-red-500">Required</span>
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>Select 1 option</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => {
                        setSamplerSize('small');
                        setSelectedSandwiches([]); // Clear selections when changing size
                      }}
                      className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                        samplerSize === 'small' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                        Small - 3 Subs (8-10 people)
                      </h4>
                      <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>$73.99</p>
                    </div>

                    <div
                      onClick={() => {
                        setSamplerSize('large');
                        setSelectedSandwiches([]); // Clear selections when changing size
                      }}
                      className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                        samplerSize === 'large' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                        Large - 4 Subs (11-13 people)
                      </h4>
                      <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>$97.99</p>
                    </div>
                  </div>
                </div>

                {/* Sandwich Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(15, 15, 15)' }}>
                    {selectedSandwiches.reduce((sum, item) => sum + item.count, 0) < (samplerSize === 'small' ? 3 : 4)
                      ? `Select Sandwiches (${selectedSandwiches.reduce((sum, item) => sum + item.count, 0)}/${samplerSize === 'small' ? 3 : 4})`
                      : 'All Subs Selected'} <span className="text-red-500">Required</span>
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                    Click to add sandwiches. You can select the same sandwich multiple times.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {capriottisIndividualSandwiches.map((sandwich) => {
                      const selectedItem = selectedSandwiches.find(item => item.id === sandwich.id);
                      const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
                      const maxSandwiches = samplerSize === 'small' ? 3 : 4;
                      const isSelected = !!selectedItem;
                      const canAddMore = totalSelected < maxSandwiches;

                      return (
                        <div
                          key={sandwich.id}
                          className={`border-2 p-3 rounded-lg transition-all relative ${
                            isSelected
                              ? 'border-red-500 bg-red-50'
                              : canAddMore
                              ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div
                            onClick={() => {
                              if (canAddMore) {
                                if (selectedItem) {
                                  // Increase count
                                  setSelectedSandwiches(selectedSandwiches.map(item =>
                                    item.id === sandwich.id
                                      ? { ...item, count: item.count + 1 }
                                      : item
                                  ));
                                } else {
                                  // Add new item
                                  setSelectedSandwiches([...selectedSandwiches, { id: sandwich.id, count: 1 }]);
                                }
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <img
                              src={sandwich.image}
                              alt={sandwich.name}
                              className="w-full h-20 object-cover rounded-lg mb-2"
                            />
                            <h4 className="font-semibold text-sm" style={{ color: 'rgb(15, 15, 15)' }}>
                              {sandwich.name}
                            </h4>
                            {sandwich.isWagyu && (
                              <p className="text-sm font-bold text-red-600">
                                +$7.29 Wagyu
                              </p>
                            )}
                          </div>

                          {/* Selection Controls */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedItem!.count > 1) {
                                    setSelectedSandwiches(selectedSandwiches.map(item =>
                                      item.id === sandwich.id
                                        ? { ...item, count: item.count - 1 }
                                        : item
                                    ));
                                  } else {
                                    setSelectedSandwiches(selectedSandwiches.filter(item => item.id !== sandwich.id));
                                  }
                                }}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold min-w-[1rem] text-center">
                                {selectedItem!.count}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (canAddMore) {
                                    setSelectedSandwiches(selectedSandwiches.map(item =>
                                      item.id === sandwich.id
                                        ? { ...item, count: item.count + 1 }
                                        : item
                                    ));
                                  }
                                }}
                                disabled={!canAddMore}
                                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                                  canAddMore
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Sandwiches Summary */}
                {selectedSandwiches.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                      Selected Sandwiches ({selectedSandwiches.reduce((sum, item) => sum + item.count, 0)}/{samplerSize === 'small' ? 3 : 4}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSandwiches.map((selectedItem) => {
                        const sandwich = capriottisIndividualSandwiches.find(s => s.id === selectedItem.id);
                        return (
                          <span
                            key={selectedItem.id}
                            className="bg-white px-3 py-1 rounded-full text-sm border flex items-center gap-2"
                          >
                            {sandwich?.name} {selectedItem.count > 1 && `(×${selectedItem.count})`}
                            <button
                              onClick={() => setSelectedSandwiches(selectedSandwiches.filter(item => item.id !== selectedItem.id))}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {(samplerSize === 'small' ? 3400 : 9320)} Cals | Qty: 1
                    </p>
                    <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                      ${calculateSamplerPrice().toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const maxSandwiches = samplerSize === 'small' ? 3 : 4;
                      const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
                      if (totalSelected === maxSandwiches) {
                        // Create description with quantities
                        const sandwichDescriptions = selectedSandwiches.map(item => {
                          const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
                          return item.count > 1
                            ? `${item.count}× ${sandwich?.name || ''}`
                            : sandwich?.name || '';
                        });

                        const finalPrice = calculateSamplerPrice();
                        const samplerItem = {
                          id: `cap-sampler-${Date.now()}`,
                          name: `Sampler Plate (${samplerSize === 'small' ? 'Small' : 'Large'})`,
                          description: `Custom sampler with ${sandwichDescriptions.join(', ')}`,
                          price: finalPrice,
                          category: 'main' as const,
                          dietaryInfo: [],
                          image: '/menu/Capriottis-Bobbie-Tray.webp',
                          restaurant: 'capriottis',
                          customization: {
                            size: samplerSize,
                            sandwiches: selectedSandwiches.map(item => ({
                              name: capriottisIndividualSandwiches.find(s => s.id === item.id)?.name || '',
                              count: item.count
                            }))
                          }
                        };
                        addToCart(samplerItem);
                        setShowSamplerModal(false);
                        setSelectedSandwiches([]);
                        setSamplerSize('small');
                      }
                    }}
                    disabled={selectedSandwiches.reduce((sum, item) => sum + item.count, 0) !== (samplerSize === 'small' ? 3 : 4)}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                      selectedSandwiches.reduce((sum, item) => sum + item.count, 0) === (samplerSize === 'small' ? 3 : 4)
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl shadow-xl max-w-md w-full p-6"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4" style={{ color: 'rgb(113, 113, 122)' }}>⚠️</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Unable to Place Order</h3>
                <p className="mb-6" style={{ color: 'rgb(15, 15, 15)' }}>{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="text-white px-6 py-2 rounded-lg transition"
                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
