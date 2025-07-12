import { RestaurantMenus } from '@/types/menu';

// Restaurant menu data
export const restaurantMenus: RestaurantMenus = {
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
        image: '/menu/Capriottis-DelawaresFinest-Tray.webp', // Using Delaware's Finest as it shows variety
        isCustomizable: true
      },

      // Salad Trays
      {
        id: 'cap-balsamic-chicken-tray',
        name: 'Balsamic Chicken Party Tray',
        description: 'Grilled chicken breast, mixed greens, gorgonzola cheese crumbles, glazed cranberry walnuts, and balsamic dressing. Serves 6-8. For large orders, please call the shop.',
        price: 35.99,
        category: 'salad' as const,
        dietaryInfo: [],
        image: '/menu/salad/caps-balsamic-chicken-party-tray-salad.avif',
        isCustomizable: true,
        saladOptions: {
          hasSpecialInstructions: true,
          hasDressingSelection: true,
          defaultDressing: 'Balsamic Vinaigrette',
          availableDressings: ['Balsamic Vinaigrette', 'BBQ Sauce', 'Ranch Dressing', 'Red Wine Vinaigrette'],
          extraDressingPrice: 2.00,
          hasRemovableToppings: true,
          removableToppings: [
            'No Gorgonzola Crumbles',
            'No Cranberry Walnuts'
          ]
        }
      },
      {
        id: 'cap-bbq-turkey-tray',
        name: 'BBQ Turkey Party Tray',
        description: 'Fresh roasted turkey, mixed greens, crispy cheddar onions, diced tomatoes, corn, black beans, BBQ sauce, and chipotle ranch dressing. Serves 6-8. For large orders, please call the shop.',
        price: 35.99,
        category: 'salad' as const,
        dietaryInfo: [],
        image: '/menu/salad/caps-BBQ-Turkey-party-tray-salad.avif',
        isCustomizable: true,
        saladOptions: {
          hasSpecialInstructions: true,
          hasDressingSelection: true,
          defaultDressing: 'Ranch Dressing',
          availableDressings: ['Balsamic Vinaigrette', 'BBQ Sauce', 'Ranch Dressing', 'Red Wine Vinaigrette'],
          extraDressingPrice: 2.00,
          hasRemovableToppings: true,
          removableToppings: [
            'No Corn & Black Bean Mix',
            'No Diced Tomatoes',
            'No Crispy Cheddar Onions'
          ]
        }
      },
      {
        id: 'cap-bbq-chicken-tray',
        name: 'BBQ Chicken Party Tray',
        description: 'Fresh grilled chicken breast, mixed greens, crispy cheddar onions, diced tomatoes, corn, black beans, BBQ sauce, and chipotle ranch dressing. Serves 6-8. For large orders, please call the shop.',
        price: 35.99,
        category: 'salad' as const,
        dietaryInfo: [],
        image: '/menu/salad/caps-BBQ-Chicken-party-tray-salad.avif',
        isCustomizable: true,
        saladOptions: {
          hasSpecialInstructions: true,
          hasDressingSelection: true,
          defaultDressing: 'Ranch Dressing',
          availableDressings: ['Balsamic Vinaigrette', 'BBQ Sauce', 'Ranch Dressing', 'Red Wine Vinaigrette'],
          extraDressingPrice: 2.00,
          hasRemovableToppings: true,
          removableToppings: [
            'No Corn & Black Bean Mix',
            'No Diced Tomatoes',
            'No Crispy Cheddar Onions'
          ]
        }
      },
      {
        id: 'cap-chopped-tray',
        name: "CAP'S Chopped Party Tray",
        description: 'Fresh chopped lettuce, tomatoes, provolone cheese, salami, capicola, prosciuttini, black olives, and red wine vinaigrette. Serves 6-8. For large orders, please call the shop.',
        price: 35.99,
        category: 'salad' as const,
        dietaryInfo: [],
        image: '/menu/salad/caps-Chopped-party-tray-salad.avif',
        isCustomizable: true,
        saladOptions: {
          hasSpecialInstructions: true,
          hasDressingSelection: true,
          defaultDressing: 'Red Wine Vinaigrette',
          availableDressings: ['Balsamic Vinaigrette', 'BBQ Sauce', 'Ranch Dressing', 'Red Wine Vinaigrette'],
          extraDressingPrice: 2.00,
          hasRemovableToppings: true,
          removableToppings: [
            'No Diced Tomatoes',
            'No Diced Provolone',
            'No Black Olives'
          ]
        }
      },
      {
        id: 'cap-creation-tray',
        name: "CAP'S Creation Party Tray",
        description: 'Garden salad with mixed greens and your choice of toppings. Serves 6-8. For large orders, please call the shop.',
        price: 35.99,
        category: 'salad' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/salad/caps-Creation-party-tray-salad.avif',
        isCustomizable: true,
        saladOptions: {
          hasSpecialInstructions: true,
          hasCustomToppings: true,
          hasDressingSelection: true,
          defaultDressing: 'Balsamic Vinaigrette',
          availableDressings: ['Balsamic Vinaigrette', 'BBQ Sauce', 'Ranch Dressing', 'Red Wine Vinaigrette'],
          extraDressingPrice: 2.00,
          availableToppings: [
            'Black Olives',
            'Crispy Cheddar Onions',
            'Mushrooms',
            'Cranberry Walnuts',
            'Diced Tomatoes',
            'Raw Onion',
            'Sweet Peppers',
            'Whole Hots',
            'Crushed Pepper Relish',
            'Corn & Black Bean Mix'
          ],
          hasAddCheese: true,
          cheeseOptions: [
            { name: 'American', price: 1.00 },
            { name: 'Provolone', price: 2.00 },
            { name: 'Gorgonzola Crumbles', price: 2.00 },
            { name: 'Swiss', price: 1.00 }
          ],
          hasAddMeat: true,
          meatOptions: [
            { name: 'Tuna', price: 5.75 },
            { name: 'Turkey', price: 5.50 },
            { name: 'Veggie Turkey', price: 5.75 },
            { name: 'Diced Italian Meat', price: 5.50 },
            { name: 'Diced Chicken', price: 5.50 },
            { name: 'Wagyu', price: 5.75 },
            { name: 'Genoa Salami', price: 5.75 },
            { name: 'Peppered Ham', price: 5.75 },
            { name: 'Bacon', price: 4.00 }
          ]
        }
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
