// Product Categories and Types - Real data structure for Shambani backend

export interface ProductType {
  id: string;
  name: string;
  nameSwahili: string;
  icon: string;
  unit: string;
  unitSwahili: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameSwahili: string;
  description: string;
  descriptionSwahili: string;
  icon: string;
  types: ProductType[];
}

// Real product categories for Shambani agricultural platform
export const productCategories: ProductCategory[] = [
  {
    id: "livestock",
    name: "Livestock",
    nameSwahili: "Mifugo",
    description: "Live animals ready for purchase",
    descriptionSwahili: "Wanyama hai tayari kwa ununuzi",
    icon: "🐄",
    types: [
      {
        id: "cow",
        name: "Cattle/Cows",
        nameSwahili: "Ng'ombe",
        icon: "🐄",
        unit: "head",
        unitSwahili: "kichwa"
      },
      {
        id: "goat",
        name: "Goats",
        nameSwahili: "Mbuzi",
        icon: "🐐",
        unit: "head",
        unitSwahili: "kichwa"
      },
      {
        id: "sheep",
        name: "Sheep",
        nameSwahili: "Kondoo",
        icon: "🐑",
        unit: "head",
        unitSwahili: "kichwa"
      },
      {
        id: "chicken",
        name: "Chickens",
        nameSwahili: "Kuku",
        icon: "🐔",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "pig",
        name: "Pigs",
        nameSwahili: "Nguruwe",
        icon: "🐷",
        unit: "head",
        unitSwahili: "kichwa"
      },
      {
        id: "duck",
        name: "Ducks",
        nameSwahili: "Bata",
        icon: "🦆",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "turkey",
        name: "Turkeys",
        nameSwahili: "Bata Bukini",
        icon: "🦃",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "rabbit",
        name: "Rabbits",
        nameSwahili: "Sungura",
        icon: "🐰",
        unit: "piece",
        unitSwahili: "kipande"
      }
    ]
  },
  {
    id: "fresh-produce",
    name: "Fresh Produce",
    nameSwahili: "Mazao Safi",
    description: "Fresh fruits, vegetables, and crops",
    descriptionSwahili: "Matunda, mboga, na mazao safi",
    icon: "🌽",
    types: [
      {
        id: "maize",
        name: "Maize/Corn",
        nameSwahili: "Mahindi",
        icon: "🌽",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "rice",
        name: "Rice",
        nameSwahili: "Mchele",
        icon: "🌾",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "beans",
        name: "Beans",
        nameSwahili: "Maharagwe",
        icon: "🫘",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "tomato",
        name: "Tomatoes",
        nameSwahili: "Nyanya",
        icon: "🍅",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "onion",
        name: "Onions",
        nameSwahili: "Vitunguu",
        icon: "🧅",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "potato",
        name: "Potatoes",
        nameSwahili: "Viazi",
        icon: "🥔",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "cabbage",
        name: "Cabbage",
        nameSwahili: "Kabichi",
        icon: "🥬",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "carrot",
        name: "Carrots",
        nameSwahili: "Karoti",
        icon: "🥕",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "banana",
        name: "Bananas",
        nameSwahili: "Ndizi",
        icon: "🍌",
        unit: "bunch",
        unitSwahili: "kishada"
      },
      {
        id: "mango",
        name: "Mangoes",
        nameSwahili: "Maembe",
        icon: "🥭",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "avocado",
        name: "Avocados",
        nameSwahili: "Parachichi",
        icon: "🥑",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "pineapple",
        name: "Pineapples",
        nameSwahili: "Nanasi",
        icon: "🍍",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "watermelon",
        name: "Watermelons",
        nameSwahili: "Tikiti Maji",
        icon: "🍉",
        unit: "piece",
        unitSwahili: "kipande"
      },
      {
        id: "pepper",
        name: "Peppers",
        nameSwahili: "Pilipili Hoho",
        icon: "🌶️",
        unit: "kg",
        unitSwahili: "kg"
      },
      {
        id: "spinach",
        name: "Spinach",
        nameSwahili: "Mchicha",
        icon: "🥬",
        unit: "bunch",
        unitSwahili: "kishada"
      },
      {
        id: "eggplant",
        name: "Eggplant",
        nameSwahili: "Biringanya",
        icon: "🍆",
        unit: "kg",
        unitSwahili: "kg"
      }
    ]
  }
];
