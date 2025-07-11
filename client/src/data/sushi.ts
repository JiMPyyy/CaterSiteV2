import { SushiItem } from '@/types/menu';

// Available sushi items for platter selection (not shown in main menu)
export const availableSushiItems: SushiItem[] = [
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
export const availableNigiriOptions: SushiItem[] = [
  { id: 'ahi-nigiri', name: 'Ahi Nigiri', description: 'Premium ahi tuna over rice.', price: 11.79, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-ahi.jpg' },
  { id: 'albacore-nigiri', name: 'Albacore Nigiri', description: 'White tuna over seasoned rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-albacore.jpg' },
  { id: 'ebi-shrimp-nigiri', name: 'Ebi (Shrimp) Nigiri', description: 'Cooked shrimp over rice.', price: 11.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-ebi(shrimp).jpg' },
  { id: 'escolar-super-white-nigiri', name: 'Escolar (Super White) Nigiri', description: 'Buttery super white fish over rice.', price: 12.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-escolar(Super White).jpg' },
  { id: 'garlic-tuna-nigiri', name: 'Garlic Tuna Nigiri', description: 'Ahi tuna with garlic seasoning over rice.', price: 12.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Garlic-Tuna.jpg' },
  { id: 'hamachi-yellowtail-nigiri', name: 'Hamachi (Yellowtail) Nigiri', description: 'Fresh yellowtail over rice.', price: 12.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Hamachi(yellowtail).jpg' },
  { id: 'hirame-halibut-nigiri', name: 'Hirame (Halibut) Nigiri', description: 'Delicate halibut over rice.', price: 13.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-hirame(halibut).jpg' },
  { id: 'salmon-nigiri', name: 'Salmon (Sake) Nigiri', description: 'Fresh Atlantic salmon over rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-salmon(sake).jpg' },
  { id: 'salmon-heaven-nigiri', name: 'Salmon Heaven Nigiri', description: 'Premium salmon preparation over rice.', price: 12.75, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-salmon-heaven.jpg' },
  { id: 'smoked-paprika-salmon-nigiri', name: 'Smoked Paprika Salmon Nigiri', description: 'Salmon with smoked paprika over rice.', price: 12.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-Smoked-Paprika-Salmon.jpg' },
  { id: 'tamago-sweet-egg-nigiri', name: 'Tamago (Sweet Egg) Nigiri', description: 'Sweet Japanese omelet over rice.', price: 7.88, category: 'main' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/nigiri/on-demand-nigiri-Tamago(Sweet egg).jpg' },
  { id: 'unagi-eel-nigiri', name: 'Unagi (Eel) Nigiri', description: 'Grilled eel with sweet sauce over rice.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-unagi(eel).jpg' },
  { id: 'yuzu-yellowtail-nigiri', name: 'Yuzu Yellowtail Nigiri', description: 'Yellowtail with yuzu citrus over rice.', price: 13.50, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/nigiri/on-demand-nigiri-yuzu-yellowtail.jpg' }
];

// Available sashimi options for sashimi platters
export const availableSashimiOptions: SushiItem[] = [
  { id: 'ahi-sashimi', name: 'Ahi Sashimi', description: 'Premium ahi tuna slices.', price: 12.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Ahi.jpg' },
  { id: 'albacore-sashimi', name: 'Albacore Sashimi', description: 'White tuna sashimi slices.', price: 11.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Albacore.jpg' },
  { id: 'ebi-shrimp-sashimi', name: 'Ebi (Shrimp) Sashimi', description: 'Cooked shrimp sashimi.', price: 10.95, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Ebi(Shrimp).jpg' },
  { id: 'garlic-tuna-sashimi', name: 'Garlic Tuna Sashimi', description: 'Ahi tuna with garlic seasoning.', price: 13.25, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Garlic-Tuna.jpg' },
  { id: 'hamachi-yellowtail-sashimi', name: 'Hamachi (Yellowtail) Sashimi', description: 'Fresh yellowtail sashimi.', price: 13.05, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Hamachi(YellowTail).jpg' },
  { id: 'salmon-sake-sashimi', name: 'Salmon (Sake) Sashimi', description: 'Fresh Atlantic salmon sashimi.', price: 12.15, category: 'main' as const, dietaryInfo: [], image: '/menu/Sushi/Sashimi/on-demand-Sashimi-Salmon(Sake).jpg' }
];

// Available sushi sides and additions
export const sushiSidesAndAdditions: SushiItem[] = [
  // Sauces
  { id: 'eel-sauce', name: 'Eel Sauce', description: 'Sweet and savory eel sauce.', price: 1.50, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-eel-sauce.jpg' },
  { id: 'yum-yum-sauce', name: 'Yum Yum Sauce', description: 'Creamy Japanese mayo-based sauce.', price: 1.50, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-yum-yum-sauce.jpg' },
  { id: 'spicy-yum-yum-sauce', name: 'Spicy Yum Yum Sauce', description: 'Spicy version of our signature sauce.', price: 1.75, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-spicy-yum-yum-sauce.jpg' },
  { id: 'ranch-dressing', name: 'Ranch Dressing', description: 'Classic ranch dressing.', price: 1.25, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-ranch-dressing.jpg' },

  // Traditional Sides
  { id: 'wasabi', name: 'Wasabi', description: 'Traditional Japanese horseradish paste.', price: 1.00, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-wasabi.jpg' },
  { id: 'fresh-wasabi', name: 'Fresh Wasabi', description: 'Freshly grated wasabi root.', price: 2.50, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-fresh-wasabi.jpg' },
  { id: 'pickled-ginger', name: 'Pickled Ginger', description: 'Traditional palate cleanser.', price: 1.00, category: 'side' as const, dietaryInfo: [], image: '/menu/Sushi/sides/on-demand-ginger.jpg' },

  // Modifications
  { id: 'avocado-add', name: 'Add Avocado', description: 'Fresh avocado addition.', price: 2.00, category: 'modification' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/on-demand-Avacado-roll.jpg' },
  { id: 'cream-cheese-add', name: 'Add Cream Cheese', description: 'Creamy Philadelphia-style addition.', price: 1.50, category: 'modification' as const, dietaryInfo: ['vegetarian'], image: '/menu/Sushi/on-demand-philly-roll.jpg' },
  { id: 'make-it-fried', name: 'Make it Fried', description: 'Tempura-fried preparation.', price: 1.50, category: 'modification' as const, dietaryInfo: [], image: '/menu/Sushi/on-demand-fire-tempura-crunch-roll.jpg' }
];
