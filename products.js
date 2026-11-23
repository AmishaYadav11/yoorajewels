// Yoora Jewels - Official 30 Luxury Curated Waterproof Everyday Pieces
// 100% Anti-Tarnish • Shower, Sweat & Sleep In Everyday Jewellery
// All items strictly women's authentic jewelry: Rings, Necklaces, Earrings, Bracelets, Anklets

const PRODUCTS = [
  // --- CATEGORY: RINGS (6 Unique Pieces) ---
  {
    id: 1,
    name: "Aura Solitaire Diamond Band",
    category: "Rings",
    price: 399,
    originalPrice: 899,
    badge: "Bestseller",
    image: "images/products/product-1.jpg",
    description: "Signature bezel-set brilliant zircon shimmer on a sleek 316L stainless steel band. Shower safe and sweatproof for seamless daily elegance.",
    rating: 4.9,
    reviewsCount: 118,
    features: ["AAA Grade Zirconia", "Never Tarnishes in Water", "Hypoallergenic Comfort Fit"]
  },
  {
    id: 2,
    name: "Seraphina Pink Sapphire Halo Ring",
    category: "Rings",
    price: 449,
    originalPrice: 949,
    badge: "18K PVD Gold",
    image: "images/products/product-2.jpg",
    description: "Radiant emerald-cut blush pink sapphire framed by micro-pavé zircons. 18K vacuum rose gold plating designed for 24/7 wear.",
    rating: 4.8,
    reviewsCount: 84,
    features: ["Emerald Cut Blush Sapphire", "18K PVD Rose Gold", "Zero Skin Irritation"]
  },
  {
    id: 3,
    name: "Twin Daisies Bloom Cocktail Ring",
    category: "Rings",
    price: 349,
    originalPrice: 799,
    badge: "Shower Safe",
    image: "images/products/product-3.jpg",
    description: "Artistic floral cocktail ring adorned with tear-cut amethyst and citrine gem crystals. Fade-free, waterproof, and eye-catching.",
    rating: 4.9,
    reviewsCount: 52,
    features: ["Floral Gem Cluster", "Shower & Sweat Safe", "Comfort Curved Fit"]
  },
  {
    id: 4,
    name: "Elysian Dual Halo Pave Rings",
    category: "Rings",
    price: 499,
    originalPrice: 999,
    badge: "Trending",
    image: "images/products/product-4.jpg",
    description: "Duo-stacking rose gold and platinum finished halo rings with brilliant cut crystals. Shower-friendly and fade-proof.",
    rating: 4.7,
    reviewsCount: 67,
    features: ["Dual Stacking Band", "Sweat & Gym Safe", "Mirror Gold Polish"]
  },
  {
    id: 5,
    name: "Celeste Bridal Solitaire Ring",
    category: "Rings",
    price: 429,
    originalPrice: 899,
    badge: "Sleep Friendly",
    image: "images/products/product-5.jpg",
    description: "Classic bridal solitaire band featuring a claw-set centre stone and channel-set eternity pave. Ultra-smooth edges for sleeping comfort.",
    rating: 4.9,
    reviewsCount: 93,
    features: ["Solitaire Brilliant Cut", "Sleep Friendly Edges", "Non-Snagging Prongs"]
  },
  {
    id: 6,
    name: "Twisted Eternity Pave Bands",
    category: "Rings",
    price: 329,
    originalPrice: 699,
    badge: "Sweat Proof",
    image: "images/products/product-6.jpg",
    description: "Interlocking dual-tone yellow gold and platinum eternity bands with delicate micro pave crystals. Will never turn skin green.",
    rating: 4.8,
    reviewsCount: 41,
    features: ["Dual Tone Finish", "Workout Tested", "Lifetime Tarnish Proof"]
  },

  // --- CATEGORY: NECKLACES (6 Unique Pieces) ---
  {
    id: 7,
    name: "Aurora Cascade",
    category: "Necklaces",
    price: 499,
    originalPrice: 1049,
    badge: "dm2buy Bestseller",
    image: "images/products/product-7.jpg",
    description: "Anti-tarnish | Waterproof | Skin safe. Signature cascading drop necklace with shimmering golden droplets, perfect for day-to-night styling.",
    rating: 5.0,
    reviewsCount: 164,
    features: ["Anti-Tarnish 18K Gold", "Waterproof Daily Wear", "Skin Safe Hypoallergenic"]
  },
  {
    id: 8,
    name: "Neckcharms",
    category: "Necklaces",
    price: 299,
    originalPrice: 349,
    badge: "Sale Special",
    image: "images/products/product-8.jpg",
    description: "Delicate minimalist choker chain with evenly spaced floating droplet charms. Effortless everyday luxury you never have to take off.",
    rating: 4.9,
    reviewsCount: 142,
    features: ["Floating Charm Accents", "Shower & Sweatproof", "Adjustable 16-18 Inch"]
  },
  {
    id: 9,
    name: "Celestial Crescent Moon Pendant",
    category: "Necklaces",
    price: 549,
    originalPrice: 1199,
    badge: "Trending",
    image: "images/products/product-9.jpg",
    description: "Layered golden chain necklace boasting an emerald crystal prism and diamond-studded crescent moon charm. Tarnish-free PVD coating.",
    rating: 4.8,
    reviewsCount: 79,
    features: ["Double Layer Silhouette", "Emerald Octagon Crystal", "PVD Gold Protection"]
  },
  {
    id: 10,
    name: "Ethereal Keshi Pearl Choker",
    category: "Necklaces",
    price: 499,
    originalPrice: 1099,
    badge: "Shower Safe",
    image: "images/products/product-10.jpg",
    description: "Uniform lustrous cultured freshwater pearls fastened with a rose gold pavé floral clasp. Waterproof and shower safe.",
    rating: 4.7,
    reviewsCount: 48,
    features: ["Natural Cultured Pearls", "Pave Rose Clasp", "Shower Safe Wire"]
  },
  {
    id: 11,
    name: "Serenade Tennis Choker Necklace",
    category: "Necklaces",
    price: 599,
    originalPrice: 1299,
    badge: "18K PVD Gold",
    image: "images/products/product-11.jpg",
    description: "Sparkling continuous double-row baguette crystal tennis choker. Sits flush along collarbone with mirror-like brilliance.",
    rating: 4.9,
    reviewsCount: 112,
    features: ["Double Row Baguettes", "Zero Snagging", "Hypoallergenic 316L"]
  },
  {
    id: 12,
    name: "Amora Pavé Heart Charm Pendant",
    category: "Necklaces",
    price: 449,
    originalPrice: 999,
    badge: "Sleep Friendly",
    image: "images/products/product-12.jpg",
    description: "Open floating heart charm encrusted with cubic zirconia along a micro-ball chain. Snag-free and comfortable to sleep in.",
    rating: 4.9,
    reviewsCount: 63,
    features: ["Floating Heart Charm", "Snag-Free Clasp", "Water & Sweat Proof"]
  },

  // --- CATEGORY: EARRINGS (6 Unique Pieces) ---
  {
    id: 13,
    name: "YOORA JEWELS Quad Clover Earrings",
    category: "Earrings",
    price: 149,
    originalPrice: 249,
    badge: "Hot Seller",
    image: "images/products/product-13.jpg",
    description: "Anti tarnish sparkling quad clover huggie dangle earrings. Dainty, lightweight, and perfect for college, office, and everyday glamour.",
    rating: 5.0,
    reviewsCount: 198,
    features: ["Anti-Tarnish Seal", "Four-Leaf Lucky Clover", "Comfort Click Clasp"]
  },
  {
    id: 14,
    name: "Royal Sapphire Blue Heart Drops",
    category: "Earrings",
    price: 349,
    originalPrice: 749,
    badge: "Trending",
    image: "images/products/product-14.jpg",
    description: "Faceted deep royal blue crystal hearts suspended from French gold ear wires. Hypoallergenic and resistant to shower moisture.",
    rating: 4.8,
    reviewsCount: 77,
    features: ["Faceted Sapphire Crystals", "French Ear Wire", "Shower Friendly"]
  },
  {
    id: 15,
    name: "Aurelia Chunky Croissant Hoops",
    category: "Earrings",
    price: 449,
    originalPrice: 949,
    badge: "18K PVD Gold",
    image: "images/products/product-15.jpg",
    description: "Hollow-formed lightweight croissant hoop earrings with a radiant warm gold mirror sheen. Waterproof and shower safe.",
    rating: 4.9,
    reviewsCount: 98,
    features: ["Lightweight Hollow Form", "18K Gold Mirror Luster", "Secure Click Lock"]
  },
  {
    id: 16,
    name: "Lumiere Sapphire Chandelier Drops",
    category: "Earrings",
    price: 499,
    originalPrice: 1049,
    badge: "Luxury Statement",
    image: "images/products/product-16.jpg",
    description: "Art deco chandelier earrings featuring tear-cut sapphire stones framed with brilliant baguette and round cubic zirconia.",
    rating: 4.9,
    reviewsCount: 86,
    features: ["Art Deco Chandelier", "Non-Tarnishing Metal", "Featherlight Comfort"]
  },
  {
    id: 17,
    name: "Molten Hammered Gold Studs",
    category: "Earrings",
    price: 399,
    originalPrice: 849,
    badge: "Shower Safe",
    image: "images/products/product-17.jpg",
    description: "Organic molten textured gold button earrings that catch the light from every angle. Surgical grade stainless steel posts.",
    rating: 4.8,
    reviewsCount: 65,
    features: ["Hammered Molten Texture", "Surgical Grade Posts", "Zero Skin Redness"]
  },
  {
    id: 18,
    name: "Celeste Champagne Teardrop Drops",
    category: "Earrings",
    price: 329,
    originalPrice: 699,
    badge: "Sleep Friendly",
    image: "images/products/product-18.jpg",
    description: "Champagne crystal teardrops in halo pavé bezel settings on hinged leverback huggies. Seamless for sleeping and daily wear.",
    rating: 4.9,
    reviewsCount: 54,
    features: ["Leverback Sleep Clasp", "Champagne Faceted Crystal", "Rust & Water Free"]
  },

  // --- CATEGORY: BRACELETS (6 Unique Pieces) ---
  {
    id: 19,
    name: "Seraphic Sparkle Tennis Bracelet",
    category: "Bracelets",
    price: 649,
    originalPrice: 1399,
    badge: "Bestseller",
    image: "images/products/product-19.jpg",
    description: "Continuous brilliant round crystal links surrounded by micro-pavé halos. Shower and sleep safe with secure dual safety clasp.",
    rating: 5.0,
    reviewsCount: 156,
    features: ["Dual Safety Clasp", "Never Catches Sleeves", "18K White Gold Finish"]
  },
  {
    id: 20,
    name: "Bella Toggle Link Chain Bracelet",
    category: "Bracelets",
    price: 429,
    originalPrice: 899,
    badge: "Shower Safe",
    image: "images/products/product-20.jpg",
    description: "Chic oval link chain featuring an effortless T-bar toggle clasp. 100% waterproof stainless steel with rich 18K gold plating.",
    rating: 4.8,
    reviewsCount: 94,
    features: ["T-Bar Toggle Clasp", "Waterproof & Sweatproof", "18K Gold Glow"]
  },
  {
    id: 21,
    name: "Trio Mixed Metal Stacking Bangles",
    category: "Bracelets",
    price: 499,
    originalPrice: 999,
    badge: "Sweat Proof",
    image: "images/products/product-21.jpg",
    description: "Three interlocking sleek solid bangles in yellow gold, rose gold, and silver. Scratch-resistant and gym workout friendly.",
    rating: 4.9,
    reviewsCount: 88,
    features: ["3-in-1 Mixed Tones", "Gym & Sweat Safe", "Solid 316L Core"]
  },
  {
    id: 22,
    name: "Monique Paperclip Link Bracelet",
    category: "Bracelets",
    price: 549,
    originalPrice: 1199,
    badge: "18K PVD Gold",
    image: "images/products/product-22.jpg",
    description: "Double layered elongated paperclip link bracelet with polished lobster clasp. Fade-proof under perfumes, water, and lotion.",
    rating: 4.8,
    reviewsCount: 72,
    features: ["Double Layer Paperclip", "Perfume & Lotion Safe", "Vacuum Plated Gold"]
  },
  {
    id: 23,
    name: "Imperial Emerald Heritage Kadas",
    category: "Bracelets",
    price: 599,
    originalPrice: 1299,
    badge: "Handcrafted",
    image: "images/products/product-23.jpg",
    description: "Pair of regal filigree gold kadas accented with faceted emerald stone centers. Anti-tarnish sealed for wedding and daily festive wear.",
    rating: 4.9,
    reviewsCount: 61,
    features: ["Pair of Two Kadas", "Emerald Crystal Centers", "Tarnish-Free Seal"]
  },
  {
    id: 24,
    name: "Verona Ruby Filigree Royal Bangle",
    category: "Bracelets",
    price: 649,
    originalPrice: 1399,
    badge: "Luxury Statement",
    image: "images/products/product-24.jpg",
    description: "Mastercrafted openwork floral vine bangle encrusted with tear ruby stones. Push-hinge closure with everlasting anti-fade luster.",
    rating: 5.0,
    reviewsCount: 110,
    features: ["Push-Hinge Mechanism", "Floral Openwork Filigree", "Ruby Teardrop Accents"]
  },

  // --- CATEGORY: ANKLETS (6 Unique Pieces) ---
  {
    id: 25,
    name: "Sunkissed Celestial Star Charm Anklet",
    category: "Anklets",
    price: 379,
    originalPrice: 799,
    badge: "Shower Safe",
    image: "images/products/product-25.jpg",
    description: "Dainty silver/gold cable chain featuring an embossed star charm. 100% waterproof and beach-ready with anti-rust guarantee.",
    rating: 4.9,
    reviewsCount: 128,
    features: ["Beach & Shower Ready", "Rust-Free Clasp", "Dainty Star Charm"]
  },
  {
    id: 26,
    name: "Luna Bohemian Coin Barefoot Anklet",
    category: "Anklets",
    price: 449,
    originalPrice: 949,
    badge: "Beach Safe",
    image: "images/products/product-26.jpg",
    description: "Boho-luxe curb chain draped with shimmering hammered coin discs and optional barefoot harness ring. Chlorine and saltwater safe.",
    rating: 4.8,
    reviewsCount: 85,
    features: ["Hammered Coin Discs", "Saltwater & Pool Safe", "Adjustable 9-11 Inch"]
  },
  {
    id: 27,
    name: "Marina Pearl & Dolphin Charm Anklet",
    category: "Anklets",
    price: 399,
    originalPrice: 849,
    badge: "Sweat Proof",
    image: "images/products/product-27.jpg",
    description: "Playful ocean charm anklet with dainty golden dolphin, bee, starfish, and freshwater pearl drops. Sweatproof in all footwear.",
    rating: 4.9,
    reviewsCount: 96,
    features: ["Nautical Charms & Pearls", "Snag-Free In Shoes", "18K Gold Glow"]
  },
  {
    id: 28,
    name: "Zephyr Dainty Kite Chain Anklet",
    category: "Anklets",
    price: 429,
    originalPrice: 899,
    badge: "18K PVD Gold",
    image: "images/products/product-28.jpg",
    description: "Minimalist geometric kite pendant suspended along a shimmering diamond-cut cable chain. Never tarnishes or turns skin green.",
    rating: 4.8,
    reviewsCount: 64,
    features: ["Geometric Kite Motif", "Fade-Proof PVD Coating", "Featherlight Fit"]
  },
  {
    id: 29,
    name: "Solana Barefoot Wave Anklet",
    category: "Anklets",
    price: 349,
    originalPrice: 749,
    badge: "Water Safe",
    image: "images/products/product-29.jpg",
    description: "Ultra-slender beaded cord anklet designed to swim, shower, and sleep in. Non-stretch, mildew-proof, and comfortable 24/7.",
    rating: 4.7,
    reviewsCount: 53,
    features: ["100% Waterproof Weave", "Sleep In Comfort", "Non-Snagging Clasp"]
  },
  {
    id: 30,
    name: "Amalfi 18K Gold Paperclip Ankle Chain",
    category: "Anklets",
    price: 499,
    originalPrice: 1049,
    badge: "Bestseller",
    image: "images/products/product-30.jpg",
    description: "Modern heavy gauge paperclip link anklet with high-shine polish. Engineered for tropical humidity, daily showers, and summer elegance.",
    rating: 5.0,
    reviewsCount: 140,
    features: ["Chunky Paperclip Profile", "Never Tarnishes in Water", "18K Vacuum Plating"]
  }
];

if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
