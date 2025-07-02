'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'dessert' | 'beverage';
  dietaryInfo: string[];
  image: string;
  isPlatter?: boolean;
  maxItems?: number;
};

type PlatterItem = {
  id: string;
  name: string;
  price: number;
  type: 'roll' | 'nigiri' | 'sashimi';
};

// Sushi platter selection items (from Sushi on Demand menu)
const sushiPlatterItems: PlatterItem[] = [
  // Rolls
  { id: 'roll1', name: '007 Roll', price: 10.35, type: 'roll' },
  { id: 'roll2', name: 'Alaskan Roll', price: 8.06, type: 'roll' },
  { id: 'roll3', name: 'Avokyu Roll', price: 4.28, type: 'roll' },
  { id: 'roll4', name: 'Baked Scallops Roll', price: 12.56, type: 'roll' },
  { id: 'roll5', name: 'Batman Burrito', price: 12.56, type: 'roll' },
  { id: 'roll6', name: 'Blackjack Roll', price: 12.60, type: 'roll' },
  { id: 'roll7', name: 'Boss Coskey Roll', price: 9.90, type: 'roll' },
  { id: 'roll8', name: 'California Roll', price: 7.20, type: 'roll' },
  { id: 'roll9', name: 'Caterpillar Roll', price: 8.10, type: 'roll' },
  { id: 'roll10', name: 'Chanel Roll', price: 12.56, type: 'roll' },
  { id: 'roll11', name: 'Crab Tempura Crunch Roll', price: 9.90, type: 'roll' },
  { id: 'roll12', name: 'Crispy Rice Roll', price: 12.60, type: 'roll' },
  { id: 'roll13', name: 'Cucumber Roll', price: 3.56, type: 'roll' },
  { id: 'roll14', name: 'Dexter Dragon Roll', price: 12.60, type: 'roll' },
  { id: 'roll15', name: 'Don\'t Be Like Mason Roll', price: 12.60, type: 'roll' },
  { id: 'roll16', name: 'Double Dragon Roll', price: 13.50, type: 'roll' },
  { id: 'roll17', name: 'Double Yellowtail Roll', price: 13.50, type: 'roll' },
  { id: 'roll18', name: 'Fire Down Below Roll', price: 10.35, type: 'roll' },
  { id: 'roll19', name: 'Fire Tempura Crunch Roll', price: 12.60, type: 'roll' },
  { id: 'roll20', name: 'Fleury Fire Roll', price: 13.50, type: 'roll' },
  { id: 'roll21', name: 'Flying Hawaiian Roll', price: 13.50, type: 'roll' },
  { id: 'roll22', name: 'Futomaki Roll', price: 8.10, type: 'roll' },
  { id: 'roll23', name: 'GG Special Roll', price: 13.50, type: 'roll' },
  { id: 'roll24', name: 'Golden Cali Roll', price: 9.00, type: 'roll' },
  { id: 'roll25', name: 'Golden Knight Roll', price: 12.60, type: 'roll' },
  { id: 'roll26', name: 'Golden Tiger Roll', price: 12.60, type: 'roll' },
  { id: 'roll27', name: 'Habanero Roll', price: 12.60, type: 'roll' },
  { id: 'roll28', name: 'Hawaiian Roll', price: 12.60, type: 'roll' },
  { id: 'roll29', name: 'Heart Attack Roll', price: 12.60, type: 'roll' },
  { id: 'roll30', name: 'Hulk Burrito', price: 13.46, type: 'roll' },
  { id: 'roll31', name: 'Japanese Lasagna Roll', price: 12.60, type: 'roll' },
  { id: 'roll32', name: 'Johnny Roll', price: 13.46, type: 'roll' },
  { id: 'roll33', name: 'Kelly Crunch Roll', price: 12.60, type: 'roll' },
  { id: 'roll34', name: 'Kiss Of Fire Roll', price: 12.60, type: 'roll' },
  { id: 'roll35', name: 'Knight Hawk Roll', price: 12.60, type: 'roll' },
  { id: 'roll36', name: 'Knight Time Roll', price: 12.60, type: 'roll' },
  { id: 'roll37', name: 'Kristen Special Roll', price: 13.50, type: 'roll' },
  { id: 'roll38', name: 'Lilly Roll', price: 9.90, type: 'roll' },
  { id: 'roll39', name: 'Lisa Lisa Roll', price: 7.16, type: 'roll' },
  { id: 'roll40', name: 'Negihama Roll', price: 5.36, type: 'roll' },
  { id: 'roll41', name: 'ODS Hand Roll', price: 13.46, type: 'roll' },
  { id: 'roll42', name: 'ODS1 Roll', price: 13.50, type: 'roll' },
  { id: 'roll43', name: 'ODS2 Roll', price: 12.56, type: 'roll' },
  { id: 'roll44', name: 'On Demand Roll', price: 11.70, type: 'roll' },
  { id: 'roll45', name: 'Orange Blossom Roll', price: 12.60, type: 'roll' },
  { id: 'roll46', name: 'Philly Roll', price: 7.16, type: 'roll' },
  { id: 'roll47', name: 'Playboy Roll', price: 12.56, type: 'roll' },
  { id: 'roll48', name: 'Rainbow Roll', price: 13.50, type: 'roll' },
  { id: 'roll49', name: 'Sake Maki Roll', price: 4.95, type: 'roll' },
  { id: 'roll50', name: 'Salmon Avocado Roll', price: 8.06, type: 'roll' },
  { id: 'roll51', name: 'Salmon Skin Hand Roll', price: 9.00, type: 'roll' },
  { id: 'roll52', name: 'Sammy Special Roll', price: 12.60, type: 'roll' },
  { id: 'roll53', name: 'Sashimi Roll', price: 13.46, type: 'roll' },
  { id: 'roll54', name: 'Sexy GG Roll', price: 13.50, type: 'roll' },
  { id: 'roll55', name: 'Shrimp Tempura Roll', price: 6.26, type: 'roll' },
  { id: 'roll56', name: 'Something Wrong Roll', price: 12.60, type: 'roll' },
  { id: 'roll57', name: 'Southern Highlands Roll', price: 13.50, type: 'roll' },
  { id: 'roll58', name: 'Spicy Crab Roll', price: 7.20, type: 'roll' },
  { id: 'roll59', name: 'Spicy Crabby Salmon Lemon Roll', price: 12.60, type: 'roll' },
  { id: 'roll60', name: 'Spicy Tataki Roll', price: 12.56, type: 'roll' },
  { id: 'roll61', name: 'Spicy Tuna Roll', price: 7.16, type: 'roll' },
  { id: 'roll62', name: 'Spider Roll', price: 9.90, type: 'roll' },
  { id: 'roll63', name: 'Tuna roll', price: 5.36, type: 'roll' },
  { id: 'roll64', name: 'The Cros Roll', price: 12.60, type: 'roll' },
  { id: 'roll65', name: 'Tiger Roll', price: 12.56, type: 'roll' },
  { id: 'roll66', name: 'TNT Natasha Roll', price: 12.60, type: 'roll' },
  { id: 'roll67', name: 'Too Hot Too Sexy Roll', price: 12.60, type: 'roll' },
  { id: 'roll68', name: 'Tuna Cali', price: 12.60, type: 'roll' },
  { id: 'roll69', name: 'Veggie Roll', price: 8.10, type: 'roll' },
  { id: 'roll70', name: 'Wet Dream Roll', price: 12.60, type: 'roll' },
  { id: 'roll71', name: 'Who\'s Your Mother Roll', price: 12.60, type: 'roll' },

  // Nigiri
  { id: 'nigiri1', name: 'Ahi Garlic Tuna', price: 11.75, type: 'nigiri' },
  { id: 'nigiri2', name: 'Ahi Nigiri', price: 11.79, type: 'nigiri' },
  { id: 'nigiri3', name: 'Albacore Nigiri', price: 11.25, type: 'nigiri' },
  { id: 'nigiri4', name: 'Ebi (Shrimp) Nigiri', price: 11.15, type: 'nigiri' },
  { id: 'nigiri5', name: 'Escolar (Super White) Nigiri', price: 11.25, type: 'nigiri' },
  { id: 'nigiri6', name: 'Hamachi (Yellowtail) Nigiri', price: 12.15, type: 'nigiri' },
  { id: 'nigiri7', name: 'Hirame (Halibut) Nigiri', price: 12.56, type: 'nigiri' },
  { id: 'nigiri8', name: 'Salmon Nigiri', price: 11.25, type: 'nigiri' },
  { id: 'nigiri9', name: 'Smoked Paprika Salmon Nigiri', price: 11.25, type: 'nigiri' },
  { id: 'nigiri10', name: 'Tamago (Sweet Egg) Nigiri', price: 7.88, type: 'nigiri' },
  { id: 'nigiri11', name: 'Unagi (Eel) Nigiri', price: 11.25, type: 'nigiri' },
  { id: 'nigiri12', name: 'Yuzu Yellowtail Nigiri', price: 11.25, type: 'nigiri' },

  // Sashimi
  { id: 'sashimi1', name: 'Ahi Sashimi', price: 12.25, type: 'sashimi' },
  { id: 'sashimi2', name: 'Albacore Sashimi', price: 11.25, type: 'sashimi' },
  { id: 'sashimi3', name: 'Ebi (Shrimp) Sashimi', price: 10.95, type: 'sashimi' },
  { id: 'sashimi4', name: 'Eel Unagi sashimi', price: 12.25, type: 'sashimi' },
  { id: 'sashimi5', name: 'Escolar (Super White) Sashimi', price: 6.53, type: 'sashimi' },
  { id: 'sashimi6', name: 'Garlic Tuna Sashimi', price: 11.76, type: 'sashimi' },
  { id: 'sashimi7', name: 'Hamachi (Yellowtail) Sashimi', price: 13.05, type: 'sashimi' },
  { id: 'sashimi8', name: 'Hirame (Halibut) Sashimi', price: 13.46, type: 'sashimi' },
  { id: 'sashimi9', name: 'Hotate (Scallop) Sashimi', price: 13.46, type: 'sashimi' },
  { id: 'sashimi10', name: 'Ikura Sashimi', price: 10.13, type: 'sashimi' },
  { id: 'sashimi11', name: 'Masago Sashimi', price: 10.13, type: 'sashimi' },
  { id: 'sashimi12', name: 'Salmon (Sake) Sashimi', price: 12.15, type: 'sashimi' },
  { id: 'sashimi13', name: 'Salmon Belly w/ Fresh Wasabi Sashimi', price: 11.57, type: 'sashimi' },

  // Special Items
  { id: 'special1', name: 'Unagi Donburi 7 pcs.', price: 13.95, type: 'roll' }
];

// Restaurant menu data
const restaurantMenus = {
  "capriottis": {
    name: "Capriotti's Sandwich Shop",
    items: [
      // Party Trays (Main Catering Items)
      {
        id: 'cap1',
        name: 'The Bobbie® Party Tray',
        description: 'A tray loaded with the greatest sandwich in America. Homemade turkey, cranberry sauce, stuffing and mayo. (Feeds 8-10 people)',
        price: 89.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://www.reviewjournal.com/wp-content/uploads/2017/11/9548937_web1_capriotti-s_bobbie.jpeg'
      },
      {
        id: 'cap2',
        name: 'Delaware\'s Finest Party Tray',
        description: 'An assortment of our Cap\'s classics: The Bobbie®, Slaw Be Jo®, and the Italian sub (served with pickles, hot and sweet peppers). (Feeds 8-10 people)',
        price: 94.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/delawares-finest.jpg'
      },
      {
        id: 'cap3',
        name: 'Little Italy Party Tray',
        description: 'Paying homage to our heritage, this tray is loaded with nothing but tasty Italian subs (served with a side of pickles, hot and sweet peppers). (Feeds 8-10 people)',
        price: 87.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/little-italy.jpg'
      },
      {
        id: 'cap4',
        name: 'American Wagyu Party Tray',
        description: 'A tray of our finest American Wagyu beef subs: The American Wagyu Slaw Be Jo® and the American Wagyu Roast Beef. (Feeds 8-10 people)',
        price: 109.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/wagyu-tray.jpg'
      },
      {
        id: 'cap5',
        name: 'The Turkey Lover Party Tray',
        description: 'Assortment of our delicious oven-roasted turkey subs: The Bobbie®, Cole Turkey®, and the Homemade Turkey sub (served with a side of mayo, mustard, pickles and peppers). (Feeds 8-10 people)',
        price: 92.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/turkey-lovers.jpg'
      },
      {
        id: 'cap6',
        name: 'The Vegetarian Party Tray',
        description: 'Assortment of our delicious vegetarian subs made with meatless products and veggies: Veggie Turkey, Veggie Cole Turkey®, and Cheese sub. (Feeds 8-10 people)',
        price: 79.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/vegetarian-tray.jpg'
      },
      {
        id: 'cap7',
        name: 'Create Your Own Party Tray',
        description: 'Create your own party tray by choosing a combination of any of our cold subs: The Bobbie®, Cole Turkey®, American Wagyu Slaw Be Jo®, Italian, Homemade Turkey, Homemade Roast Beef, Tuna, Veggie Turkey, and Veggie Cole Turkey®. (Feeds 8-10 people)',
        price: 89.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/custom-tray.jpg'
      },

      // Box Lunches
      {
        id: 'cap8',
        name: 'The Bobbie® Boxed Lunch',
        description: 'The nationally acclaimed best-seller! Homemade turkey, cranberry sauce, stuffing, and mayo. Includes small (8") sandwich, chips, and cookie.',
        price: 14.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://www.reviewjournal.com/wp-content/uploads/2017/11/9548937_web1_capriotti-s_bobbie.jpeg'
      },
      {
        id: 'cap9',
        name: 'Cole Turkey® Boxed Lunch',
        description: 'Slow-roasted, homemade turkey, provolone cheese, Russian dressing, cole slaw, and mayo. Includes small (8") sandwich, chips, and cookie.',
        price: 14.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/cole-turkey-box.jpg'
      },
      {
        id: 'cap10',
        name: 'American Wagyu Slaw Be Jo® Boxed Lunch',
        description: 'Slow-cooked wagyu roast beef, provolone cheese, Russian dressing, cole slaw, and mayo. Includes small (8") sandwich, chips, and cookie.',
        price: 17.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/slaw-be-jo-box.jpg'
      },
      {
        id: 'cap11',
        name: 'Italian Sub Boxed Lunch',
        description: 'A flavorful combination of premium Italian deli meats made with Genoa salami, capocollo, and prosciuttini. Includes small (8") sandwich, chips, and cookie.',
        price: 15.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/italian-box.jpg'
      },
      {
        id: 'cap12',
        name: 'American Wagyu Roast Beef Boxed Lunch',
        description: 'Ultra-premium American Wagyu beef slow-roasted, piled high then topped with provolone cheese, lettuce, tomato, onions, and mayo. Includes small (8") sandwich, chips, and cookie.',
        price: 17.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/wagyu-roast-beef-box.jpg'
      },
      {
        id: 'cap13',
        name: 'Homemade Turkey Boxed Lunch',
        description: 'Our famous all natural, roasted, and hand pulled recipe. Includes small (8") sandwich, chips, and cookie.',
        price: 13.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/homemade-turkey-box.jpg'
      },
      {
        id: 'cap14',
        name: 'Homemade Tuna Boxed Lunch',
        description: 'Our homemade recipe, made fresh daily. Includes small (8") sandwich, chips, and cookie.',
        price: 13.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/tuna-box.jpg'
      },
      {
        id: 'cap15',
        name: 'Veggie Turkey Boxed Lunch',
        description: 'Veggie turkey, provolone cheese, lettuce, tomato, and onion. Includes small (8") sandwich, chips, and cookie.',
        price: 12.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/veggie-turkey-box.jpg'
      },
      {
        id: 'cap16',
        name: 'Veggie Cole Turkey® Boxed Lunch',
        description: 'Veggie turkey, provolone cheese, Russian dressing, cole slaw, and mayo. Includes small (8") sandwich, chips, and cookie.',
        price: 12.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/veggie-cole-turkey-box.jpg'
      },

      // Shareable Salads
      {
        id: 'cap17',
        name: 'Balsamic Chicken Catering Salad',
        description: 'Grilled chicken breast, mixed greens, gorgonzola cheese crumbles, glazed cranberry walnuts, and balsamic dressing (Feeds 6-8 People)',
        price: 49.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/balsamic-chicken-salad.jpg'
      },
      {
        id: 'cap18',
        name: 'BBQ Turkey or Chicken Catering Salad',
        description: 'Homemade turkey or grilled chicken breast, mixed greens, crispy fried onions, diced tomatoes, corn & black bean mix, chipotle ranch dressing, and BBQ sauce (Feeds 6-8 People)',
        price: 47.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/bbq-chicken-salad.jpg'
      },
      {
        id: 'cap19',
        name: 'American Wagyu & Bleu® Catering Salad',
        description: 'American Wagyu roast beef, mixed greens, gorgonzola cheese crumbles, sweet peppers, crispy fried onions, diced tomatoes, and gorgonzola vinaigrette (Feeds 6-8 People)',
        price: 54.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/wagyu-bleu-salad.jpg'
      },
      {
        id: 'cap20',
        name: 'Cap\'s Chopped Catering Salad',
        description: 'Fresh chopped iceberg lettuce, diced tomatoes, provolone cheese, salami, capocollo, pepper ham, black olives, and red wine vinaigrette. (Feeds 6-8 People)',
        price: 44.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/caps-chopped-salad.jpg'
      },
      {
        id: 'cap21',
        name: 'Cap\'s Creation Catering Salad',
        description: 'Garden salad with mixed greens and your choice of toppings: black olives, onions, mushrooms, glazed cranberry walnuts, crispy fried onions, diced tomatoes, sweet or hot peppers, corn & black bean mix. (Feeds 6-8 People)',
        price: 39.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/caps-creation-salad.jpg'
      },

      // Desserts & Sides
      {
        id: 'cap22',
        name: 'Cookie Tray',
        description: 'The perfect end to your party. Or the beginning. Heck, eat a cookie whenever you want, they\'re delicious! Comes with 12 cookies.',
        price: 19.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/cookie-tray.jpg'
      },
      {
        id: 'cap23',
        name: 'Cookie & Brookie Tray',
        description: 'An assortment of extraordinary cookies and brookies. Perfect for any gathering.',
        price: 24.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/brookie-tray.jpg'
      },
      {
        id: 'cap24',
        name: 'Catering Sides',
        description: 'Make any meal complete! Choose from our homemade coleslaw, cranberry, or stuffing. (Feeds 8-10 people)',
        price: 12.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/catering-sides.jpg'
      },
      {
        id: 'cap25',
        name: 'Catering Chips',
        description: 'Don\'t forget the chips! Assorted varieties available. Perfect for any catering order.',
        price: 8.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/catering-chips.jpg'
      }
    ]
  },
  "sushi": {
    name: "Sushi on Demand",
    items: [
      // Sushi Boats (Large Catering Options)
      {
        id: 'sushi1',
        name: '50 inch Sushi Boats! Chef Choice',
        description: 'Get a 50 inch Boat for your next event! It comes with a variety of 16 high quality rolls, 12 Piece Sashimi.',
        price: 375.00,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/50-inch-boat.jpg'
      },
      {
        id: 'sushi2',
        name: '50 inch Boat Chef Choice rolls only!',
        description: 'Get a 50 inch Boat for your next event! 20 Rolls: Poke with seaweed and an avocado.',
        price: 275.00,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/50-inch-rolls-boat.jpg'
      },
      {
        id: 'sushi3',
        name: '60 inch Rolls Chef Choice',
        description: '12 Pieces 12 Premium 12 Specialty Rolls with Seaweed Salad Poke and Avocado Bomb.',
        price: 395.00,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/60-inch-boat.jpg'
      },
      {
        id: 'sushi4',
        name: '60 inch Sushi Boats! Chef Choice Nigiri Sashimi Rolls',
        description: 'Get a 60 inch Boat for your next event! It comes with a variety of 28 high quality rolls, 20 Pieces Sashimi.',
        price: 575.00,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/60-inch-nigiri-boat.jpg'
      },

      // Platters (Customizable - Users select items)
      {
        id: 'sushi5',
        name: '10 Item Platter',
        description: 'Pick any 10 rolls, Sashimi, or Nigiri and get 10% off the platter! Choose from our extensive selection.',
        price: 0, // Price calculated based on selections
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/10-item-platter.jpg',
        isPlatter: true,
        maxItems: 10
      },
      {
        id: 'sushi6',
        name: '8 Item Platter',
        description: 'Pick any 8 rolls, Sashimi, or Nigiri and get 10% off the platter! Perfect for smaller groups.',
        price: 0, // Price calculated based on selections
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/8-item-platter.jpg',
        isPlatter: true,
        maxItems: 8
      },
      {
        id: 'sushi7',
        name: '5 Item Platter',
        description: 'Pick any 5 rolls, Sashimi, or Nigiri and get 10% off the platter! Great for intimate gatherings.',
        price: 0, // Price calculated based on selections
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/5-item-platter.jpg',
        isPlatter: true,
        maxItems: 5
      },


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
        image: '/menu/margherita.jpg'
      },
      {
        id: 'pizza2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
        price: 16.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/pepperoni.jpg'
      },
      {
        id: 'pizza3',
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, peppers, onions, mushrooms, olives',
        price: 19.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/supreme.jpg'
      },
      {
        id: 'pizza4',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
        price: 8.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/caesar-salad.jpg'
      },
      {
        id: 'pizza5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 6.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/tiramisu.jpg'
      },
      {
        id: 'pizza6',
        name: 'Italian Soda',
        description: 'Sparkling water with Italian syrup flavors',
        price: 3.49,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/italian-soda.jpg'
      }
    ]
  }
};

interface CartItem extends OrderItem {
  id: string;
}

export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: ''
    },
    specialInstructions: ''
  });

  // Platter selection state
  const [showPlatterModal, setShowPlatterModal] = useState(false);
  const [selectedPlatter, setSelectedPlatter] = useState<MenuItem | null>(null);
  const [platterSelections, setPlatterSelections] = useState<PlatterItem[]>([]);

  // Pre-fill date from URL parameter if coming from schedule page
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setDeliveryInfo(prev => ({
        ...prev,
        date: dateParam
      }));
    }
  }, [searchParams]);

  // Get current menu items based on selected restaurant
  const currentMenu = restaurantMenus[selectedRestaurant].items;

  // Add item to cart
  const addToCart = (menuItem: MenuItem) => {
    // Check if this is a platter item
    if (menuItem.isPlatter) {
      setSelectedPlatter(menuItem);
      setPlatterSelections([]);
      setShowPlatterModal(true);
      return;
    }

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

  // Add platter to cart with selected items
  const addPlatterToCart = () => {
    if (!selectedPlatter || platterSelections.length !== selectedPlatter.maxItems) {
      return;
    }

    const totalPrice = platterSelections.reduce((sum, item) => sum + item.price, 0);
    const discountedPrice = totalPrice * 0.9; // 10% discount

    const platterName = `${selectedPlatter.name} (${platterSelections.map(item => item.name).join(', ')})`;

    setCart([...cart, {
      id: `${selectedPlatter.id}-${Date.now()}`, // Unique ID for each platter
      name: platterName,
      description: `Custom platter with ${platterSelections.length} items (10% discount applied)`,
      quantity: 1,
      price: discountedPrice,
      category: selectedPlatter.category,
      dietaryInfo: selectedPlatter.dietaryInfo as any
    }]);

    setShowPlatterModal(false);
    setSelectedPlatter(null);
    setPlatterSelections([]);
  };

  // Toggle platter item selection
  const togglePlatterItem = (item: PlatterItem) => {
    const isSelected = platterSelections.find(selected => selected.id === item.id);

    if (isSelected) {
      setPlatterSelections(platterSelections.filter(selected => selected.id !== item.id));
    } else if (platterSelections.length < (selectedPlatter?.maxItems || 0)) {
      setPlatterSelections([...platterSelections, item]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment success received:', paymentId);
    setPaymentIntentId(paymentId);
    setShowPayment(false);
    // Now create the order with payment
    createOrderWithPayment(paymentId);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.log('Payment error received:', error);
    setErrorMessage(`Payment failed: ${error}`);
    setShowErrorModal(true);
    setIsSubmitting(false);
  };

  // Create order with payment
  const createOrderWithPayment = async (paymentId: string) => {
    try {
      console.log('Creating order with payment ID:', paymentId);
      const orderData: CreateOrderData & { paymentIntentId: string } = {
        items: cart.map(({ id, ...item }) => item),
        deliveryDate: deliveryInfo.date,
        deliveryTime: deliveryInfo.time,
        deliveryAddress: deliveryInfo.address,
        specialInstructions: deliveryInfo.specialInstructions,
        paymentIntentId: paymentId
      };

      console.log('Order data:', orderData);
      const result = await orderService.createOrder(orderData);
      console.log('Order creation result:', result);

      setOrderSuccess(true);
      setCart([]);
      setDeliveryInfo({
        date: '',
        time: '',
        address: {
          street: '',
          city: 'Las Vegas',
          state: 'NV',
          zipCode: ''
        },
        specialInstructions: ''
      });
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      setErrorMessage(error.message || 'Failed to create order');
      setShowErrorModal(true);
      setIsSubmitting(false);
    }
  };

  // Handle order submission (now shows payment form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage('Please log in to place an order');
      setShowErrorModal(true);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Please add items to your cart');
      setShowErrorModal(true);
      return;
    }

    // Check if delivery time is within 12 hours
    const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
    const currentTime = new Date();
    const timeDifference = deliveryDateTime.getTime() - currentTime.getTime();
    const hoursUntilDelivery = timeDifference / (1000 * 60 * 60); // Convert to hours

    if (hoursUntilDelivery < 12) {
      setErrorMessage('Orders must be placed at least 12 hours in advance. Please select a delivery time that is at least 12 hours from now to allow proper preparation time.');
      setShowErrorModal(true);
      return;
    }

    // Show payment form instead of creating order directly
    setShowPayment(true);
    // Don't set isSubmitting here - let the payment form handle its own processing state
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md"
        >
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your order. We'll prepare it with care and deliver it on time.</p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Place Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Food</h1>

        {/* Restaurant Selection Dropdown */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Choose Restaurant:
          </label>
          <select
            value={selectedRestaurant}
            onChange={(e) => {
              setSelectedRestaurant(e.target.value as keyof typeof restaurantMenus);
              setCart([]); // Clear cart when switching restaurants
            }}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
          >
            <option value="capriottis">Capriotti's Sandwich Shop</option>
            <option value="sushi">Sushi on Demand</option>
            <option value="pizza">Pizza Place</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Dishes */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Main Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMenu.filter(item => item.category === 'main').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {item.image && (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                      {/* Dietary Info */}
                      {item.dietaryInfo.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.dietaryInfo.map((info) => (
                            <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {info}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-medium">
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                              >
                                <Plus size={16} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desserts */}
            {currentMenu.filter(item => item.category === 'dessert').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Desserts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                        {/* Dietary Info */}
                        {item.dietaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.dietaryInfo.map((info) => (
                              <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {info}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="font-medium">
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                                >
                                  <Plus size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Beverages */}
            {currentMenu.filter(item => item.category === 'beverage').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Beverages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                        {/* Dietary Info */}
                        {item.dietaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.dietaryInfo.map((info) => (
                              <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {info}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="font-medium">
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                                >
                                  <Plus size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart and Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Order
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Information Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={16} />
                      Delivery Details
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={deliveryInfo.date}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, time: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={deliveryInfo.address.city}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, city: e.target.value}
                          })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={deliveryInfo.address.zipCode}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, zipCode: e.target.value}
                          })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        placeholder="Any special delivery instructions..."
                        value={deliveryInfo.specialInstructions}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={3}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <StripePaymentForm
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isSubmitting}
                  setIsProcessing={setIsSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Place Order</h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Platter Selection Modal */}
        {showPlatterModal && selectedPlatter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedPlatter.name}</h3>
                    <p className="text-gray-600 mt-1">
                      Select {selectedPlatter.maxItems} items ({platterSelections.length}/{selectedPlatter.maxItems} selected)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPlatterModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sushiPlatterItems.map((item) => {
                    const isSelected = platterSelections.find(selected => selected.id === item.id);
                    const canSelect = platterSelections.length < (selectedPlatter.maxItems || 0);

                    return (
                      <div
                        key={item.id}
                        onClick={() => togglePlatterItem(item)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : canSelect
                            ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                            {isSelected && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-1 ml-auto">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Subtotal: ${platterSelections.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      10% Discount: -${(platterSelections.reduce((sum, item) => sum + item.price, 0) * 0.1).toFixed(2)}
                    </p>
                    <p className="font-semibold text-gray-900">
                      Total: ${(platterSelections.reduce((sum, item) => sum + item.price, 0) * 0.9).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPlatterModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPlatterToCart}
                      disabled={platterSelections.length !== selectedPlatter.maxItems}
                      className={`px-6 py-2 rounded-lg transition ${
                        platterSelections.length === selectedPlatter.maxItems
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
