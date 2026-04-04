/**
 * FoodKnock Quick Order — Data File
 * All shop definitions and menu items live here.
 * Edit this file to add/remove shops or menu items.
 * 
 */

const SHOPS = [
  {
    id: "sanwariya-bakers",
    name: "Sanwariya Bakers",
    tagline: "Fresh Baked, Daily Made",
    emoji: "🥐",
    accent: "#f97316",
    gradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    accentLight: "rgba(249,115,22,0.10)",
    whatsapp: "919636879954",
    category: "Bakery & Snacks",
    menu: [

      // 🍔 Burgers
      { id: "sb01", name: "Aloo Tikki Burger", price: 30 },
      { id: "sb02", name: "Veg Burger", price: 40 },
      { id: "sb03", name: "Veg Grilled Burger", price: 45 },
      { id: "sb04", name: "Veg Paneer Burger", price: 50 },
      { id: "sb05", name: "Veg Double Tikki Burger", price: 60 },
      { id: "sb06", name: "Veg Cheese Burger", price: 70 },
      { id: "sb07", name: "Veg Cheese Paneer Burger", price: 80 },

      // 🥟 Patties
      { id: "sb08", name: "Aloo Patties", price: 20 },
      { id: "sb09", name: "Veg Masala Patties", price: 30 },
      { id: "sb10", name: "Tandoori Paneer Patties", price: 40 },
      { id: "sb11", name: "Veg Cheese Patties", price: 50 },
      { id: "sb12", name: "Veg Cheese Paneer Patties", price: 60 },
      { id: "sb13", name: "Cheese Namkeen Patties", price: 65 },
      { id: "sb14", name: "Cheese Sweet Corn Patties", price: 70 },

      // 🥟 Momos
      { id: "sb15", name: "Veg Momos (Steam)", price: 30 },
      { id: "sb16", name: "Veg Momos (Fried)", price: 40 },
      { id: "sb17", name: "Paneer Momos (Steam)", price: 40 },
      { id: "sb18", name: "Paneer Momos (Fried)", price: 50 },

      // 🍜 Maggi
      { id: "sb19", name: "Plain Maggi", price: 30 },
      { id: "sb20", name: "Masala Maggi", price: 40 },
      { id: "sb21", name: "Veg Paneer Maggi", price: 50 },
      { id: "sb22", name: "Veg Cheese Maggi", price: 55 },
      { id: "sb23", name: "Veg Cheese Paneer Sweetcorn Maggi", price: 70 },

      // 🍟 Fries
      { id: "sb24", name: "French Fries", price: 50 },
      { id: "sb25", name: "French Fries Masala", price: 60 },
      { id: "sb26", name: "Peri Peri Fries", price: 70 },

      // 🍛 Pav Bhaji
      { id: "sb27", name: "Pav Bhaji", price: 50 },
      { id: "sb28", name: "Extra Pav", price: 10 },

      // 🍜 Chowmein
      { id: "sb29", name: "Half Chowmein", price: 30 },
      { id: "sb30", name: "Full Chowmein", price: 40 },

      // 🥤 Shakes
      { id: "sb31", name: "Cold Coffee", price: 60 },
      { id: "sb32", name: "Oreo Shake", price: 70 },
      { id: "sb33", name: "Butterscotch Shake", price: 70 },
      { id: "sb34", name: "KitKat Shake", price: 80 },
      { id: "sb35", name: "Pineapple Shake", price: 90 },
      { id: "sb36", name: "Mix Pineapple Shake", price: 90 },
      { id: "sb37", name: "Strawberry Shake", price: 99 },

      // 🍕 Pizza
      { id: "sb38", name: "Veg Cheese Pizza", price: 70 },
      { id: "sb39", name: "Margherita Pizza", price: 80 },
      { id: "sb40", name: "OTC Pizza", price: 80 },
      { id: "sb41", name: "Sweet Corn Pizza", price: 90 },
      { id: "sb42", name: "Double Cheese Pizza", price: 90 },
      { id: "sb43", name: "Mushroom Cheese Pizza", price: 100 },
      { id: "sb44", name: "Peri Peri Paneer Pizza", price: 100 },
      { id: "sb45", name: "Tandoori Paneer Pizza", price: 110 },
      { id: "sb46", name: "Mexican Pizza", price: 110 },

      // 🥪 Sandwich
      { id: "sb47", name: "Veg Grilled Sandwich", price: 50 },
      { id: "sb48", name: "Veg Grilled Cheese Sandwich", price: 70 },
      { id: "sb49", name: "Cheese Sweet Corn Sandwich", price: 80 },
      { id: "sb50", name: "Veg Mexicorn Sandwich", price: 90 },
      { id: "sb51", name: "Veg Cheese Paneer Tikka Sandwich", price: 99 }

    ]
  },
  {
    id: "sunrise-fast-food",
    name: "Sunrise Fast Food",
    tagline: "Hot, Fast & Delicious",
    emoji: "🍔",
    accent: "#ef4444",
    gradient: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
    accentLight: "rgba(239,68,68,0.10)",
    whatsapp: "917014569910",
    category: "Fast Food",
    menu: [

      // 🍝 Pasta
      { id: "sf01", name: "Napolitana Red Pasta", price: 80 },
      { id: "sf02", name: "White Sauce Pasta", price: 100 },
      { id: "sf03", name: "Paneer Red Pasta", price: 120 },
      { id: "sf04", name: "Paneer White Sauce Pasta", price: 130 },

      // 🍕 Pizza
      { id: "sf05", name: "Plain Cheese Pizza", price: 50 },
      { id: "sf06", name: "OTC Pizza", price: 60 },
      { id: "sf07", name: "Double Cheese Pizza", price: 80 },
      { id: "sf08", name: "Mexican Spicy Pizza", price: 70 },
      { id: "sf09", name: "Paneer Tikka Pizza", price: 80 },
      { id: "sf10", name: "Corn Capsicum Pizza", price: 80 },
      { id: "sf11", name: "Cheese Pasta Pizza", price: 80 },
      { id: "sf12", name: "Mushroom Baby Corn Pizza", price: 100 },

      // 🥟 Patties
      { id: "sf13", name: "Aloo Patties", price: 20 },
      { id: "sf14", name: "Masala Patties", price: 30 },
      { id: "sf15", name: "Cheese Patties", price: 40 },
      { id: "sf16", name: "Tandoori Patties", price: 40 },
      { id: "sf17", name: "Veg Paneer Cheese Patties", price: 50 },

      // 🥪 Sandwich
      { id: "sf18", name: "Veg Grill Sandwich", price: 50 },
      { id: "sf19", name: "Veg Cheese Grill Sandwich", price: 60 },
      { id: "sf20", name: "Paneer Tikka Sandwich", price: 80 },
      { id: "sf21", name: "Sweet Corn Sandwich", price: 70 },

      // 🍜 Maggi
      { id: "sf22", name: "Plain Maggi", price: 30 },
      { id: "sf23", name: "Masala Maggi", price: 40 },
      { id: "sf24", name: "Veg Cheese Maggi", price: 50 },
      { id: "sf25", name: "Paneer Veg Maggi", price: 45 },

      // 🍛 Pav Bhaji
      { id: "sf26", name: "Pav Bhaji", price: 50 },
      { id: "sf27", name: "Paneer Pav Bhaji", price: 70 },

      // 🍔 Burgers
      { id: "sf28", name: "Aloo Tikki Burger", price: 30 },
      { id: "sf29", name: "Veg Burger", price: 35 },
      { id: "sf30", name: "Veg Paneer Burger", price: 40 },
      { id: "sf31", name: "Veg Cheese Burger", price: 50 },
      { id: "sf32", name: "Veg Cheese Paneer Burger", price: 60 },

      // 🍟 Fries
      { id: "sf33", name: "Plain Salted Fries", price: 50 },
      { id: "sf34", name: "Peri Peri Fries", price: 60 },
      { id: "sf35", name: "Cheese Peri Peri Fries", price: 70 },
      { id: "sf36", name: "Cheese Fries", price: 80 },

      // 🥟 Momos
      { id: "sf37", name: "Steam Momos", price: 50 },
      { id: "sf38", name: "Fried Momos", price: 60 },

      // 🥘 Chinese
      { id: "sf39", name: "Chilli Paneer Dry", price: 100 },
      { id: "sf40", name: "Chilli Paneer Gravy", price: 110 },
      { id: "sf41", name: "Chilli Potato", price: 70 },
      { id: "sf42", name: "Honey Chilli Potato", price: 80 },

      // 🍜 Noodles
      { id: "sf43", name: "Half Noodles", price: 25 },
      { id: "sf44", name: "Full Noodles", price: 40 },
      { id: "sf45", name: "Hakka Noodles", price: 50 },
      { id: "sf46", name: "Chilli Garlic Noodles", price: 60 },
      { id: "sf47", name: "Paneer Noodles", price: 70 },

      // 🥤 Shakes
      { id: "sf48", name: "Oreo Shake", price: 60 },
      { id: "sf49", name: "KitKat Shake", price: 70 },
      { id: "sf50", name: "Butterscotch Shake", price: 60 },
      { id: "sf51", name: "Chocolate Shake", price: 60 }

    ]
  },
  {
    id: "jyoti-juice-corner",
    name: "Jyoti Juice Corner",
    tagline: "Pure, Fresh & Energizing",
    emoji: "🍹",
    accent: "#10b981",
    gradient: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
    accentLight: "rgba(16,185,129,0.10)",
    whatsapp: "919828077407",
    category: "Juices & Drinks",
    menu: [

      // 🧃 Fresh Juices
      { id: "jj01", name: "Papaya Juice", price: 20 },
      { id: "jj02", name: "Pineapple Juice", price: 20 },
      { id: "jj03", name: "Beel Juice", price: 20 },
      { id: "jj04", name: "Banana Juice", price: 20 },
      { id: "jj05", name: "Mango Juice", price: 20 },
      { id: "jj06", name: "Mosambi Juice", price: 40 },

      // 🥤 Shakes
      { id: "jj07", name: "Papaya Shake", price: 25 },
      { id: "jj08", name: "Pineapple Shake", price: 25 },
      { id: "jj09", name: "Banana Shake", price: 25 },
      { id: "jj10", name: "Beel Shake", price: 25 },
      { id: "jj11", name: "Chikoo Shake", price: 30 },
      { id: "jj12", name: "Mango Shake", price: 25 },
      { id: "jj13", name: "Chocolate Shake", price: 50 },
      { id: "jj14", name: "KitKat Shake", price: 50 },
      { id: "jj15", name: "Oreo Shake", price: 50 }

    ]
  },
  {
    id: "cake-hut",
    name: "Cake Hut",
    tagline: "Every Bite is a Celebration",
    emoji: "🎂",
    accent: "#8b5cf6",
    gradient: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)",
    accentLight: "rgba(139,92,246,0.10)",
    whatsapp: "919785957372",
    category: "Cakes & Desserts",
    menu: [
      { id: "ch01", name: "Double Dekker Stuffed Pizza", price: 250 },
      { id: "ch02", name: "Veg Grilled Panner Pizza", price: 80 },
      { id: "ch03", name: "Veg Grilled Pizza", price: 60 },
    ],
  },
  {
    id: "manish-home",
    name: "Manish Home",
    tagline: "Special Homemade Treats",
    emoji: "🥤",
    accent: "#f59e0b",
    gradient: "linear-gradient(135deg, #fff7ed 0%, #fde68a 100%)",
    accentLight: "rgba(245,158,11,0.10)",
    whatsapp: "916367075149",
    category: "Home Specials",
    menu: [
      { id: "mh01", name: "Royal Kesar Thandai Shake", price: 50 }
    ]
  },
  {
    id: "ajay-home",
    name: "Ajay Home",
    tagline: "Simple & Tasty",
    emoji: "🍜",
    accent: "#3b82f6",
    gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    accentLight: "rgba(59,130,246,0.10)",
    whatsapp: "919950703030",
    category: "Home Specials",
    menu: [
      { id: "ah01", name: "Royal Kesar Thandai Shake", price: 50 }
    ]
  }
];
