// Mock datasets for testing and fallback modes

export const mockProducts = [
    {
        id: 1,
        name: "Argan Oil Premium",
        description: "100% organic extra-virgin culinary argan oil, hand-pressed by cooperatives in the Essaouira region. Rich in antioxidants and nutrients.",
        price: 120.00,
        standard_quantity: 1, // 1 Litre
        farmer_name: "Association Cooperatives Essaouira",
        category: "Oils",
        is_available: true,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80",
        harvest_date: "2026-05-10",
        location: "Essaouira",
        next_harvest_date: "2026-10-15",
        estimated_stock: 150,
        remaining_capacity: 85,
        harvest_id: 101,
        harvest_link: "#"
    },
    {
        id: 2,
        name: "Majhoul Dates Premium",
        description: "Large, sweet, and juicy Majhoul dates harvested in the sunny oases of Errachidia. Free of preservatives and added sugar.",
        price: 95.00,
        standard_quantity: 1, // 1 kg
        farmer_name: "Errachidia Palms Co.",
        category: "Fruits",
        is_available: true,
        image: "https://images.unsplash.com/photo-1506224477000-07aa8a76be89?w=500&q=80",
        harvest_date: "2026-09-01",
        location: "Errachidia",
        next_harvest_date: "2026-09-05",
        estimated_stock: 400,
        remaining_capacity: 320,
        harvest_id: 102,
        harvest_link: "#"
    },
    {
        id: 3,
        name: "Taliouine Saffron (Grade A)",
        description: "Authentic premium red saffron filaments from Taliouine. Harvested early in the morning for maximum color, aroma, and flavor.",
        price: 35.00,
        standard_quantity: 1, // 1 gram
        farmer_name: "Saffron Cooperative of Taliouine",
        category: "Spices",
        is_available: true,
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80",
        harvest_date: "2026-11-20",
        location: "Taliouine",
        next_harvest_date: "2026-11-10",
        estimated_stock: 25,
        remaining_capacity: 12,
        harvest_id: 103,
        harvest_link: "#"
    },
    {
        id: 4,
        name: "Extra Virgin Olive Oil Meknes",
        description: "Cold-pressed extra virgin olive oil from Picholine olives grown in the historic orchards of Meknes. Low acidity and vibrant taste.",
        price: 70.00,
        standard_quantity: 1, // 1 Litre
        farmer_name: "Meknes Olive Groves",
        category: "Oils",
        is_available: true,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80",
        harvest_date: "2026-04-15",
        location: "Meknes",
        next_harvest_date: "2026-10-01",
        estimated_stock: 500,
        remaining_capacity: 450,
        harvest_id: 104,
        harvest_link: "#"
    },
    {
        id: 5,
        name: "Berkane Clementines",
        description: "Sweet, seedless, and easy-to-peel clementines directly from the orchards of Berkane. Bursting with fresh citrus juice.",
        price: 8.00,
        standard_quantity: 5, // 5kg box
        farmer_name: "Berkane Citrus Farmers Assoc.",
        category: "Fruits",
        is_available: true,
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&q=80",
        harvest_date: "2026-12-05",
        location: "Berkane",
        next_harvest_date: "2026-12-01",
        estimated_stock: 1000,
        remaining_capacity: 900,
        harvest_id: 105,
        harvest_link: "#"
    },
    {
        id: 6,
        name: "Tafraout Organic Almonds",
        description: "Premium almonds grown naturally in the Anti-Atlas mountains around Tafraout. Sun-dried and shelled by hand.",
        price: 140.00,
        standard_quantity: 1, // 1 kg
        farmer_name: "Atlas Organic Cooperative",
        category: "Nuts",
        is_available: false, // Out of stock to test visual states
        image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&q=80",
        harvest_date: "2026-08-20",
        location: "Tafraout",
        next_harvest_date: "2026-09-01",
        estimated_stock: 80,
        remaining_capacity: 0,
        harvest_id: 106,
        harvest_link: "#"
    }
];

export const mockHarvests = [
    {
        id: 101,
        product_name: "Argan Oil Premium",
        farmer_name: "Association Cooperatives Essaouira",
        harvest_date: "2026-10-15",
        estimated_yield: "500 Litres",
        actual_yield: "480 Litres",
        status: "Completed",
        created_at: "2026-05-01",
        quality_rating: "Excellent",
        notes: "High concentration of active nutrients this season due to moderate rainfall."
    },
    {
        id: 102,
        product_name: "Majhoul Dates Premium",
        farmer_name: "Errachidia Palms Co.",
        harvest_date: "2026-09-05",
        estimated_yield: "1500 kg",
        actual_yield: null,
        status: "In Progress",
        created_at: "2026-08-10",
        quality_rating: "Pending",
        notes: "Harvesting teams dispatched to Errachidia groves."
    },
    {
        id: 103,
        product_name: "Taliouine Saffron (Grade A)",
        farmer_name: "Saffron Cooperative of Taliouine",
        harvest_date: "2026-11-10",
        estimated_yield: "50 kg",
        actual_yield: null,
        status: "Scheduled",
        created_at: "2026-09-01",
        quality_rating: "Pending",
        notes: "Flowering expected early November. Labor scheduled."
    },
    {
        id: 104,
        product_name: "Extra Virgin Olive Oil Meknes",
        farmer_name: "Meknes Olive Groves",
        harvest_date: "2026-10-01",
        estimated_yield: "3000 Litres",
        actual_yield: "2950 Litres",
        status: "Completed",
        created_at: "2026-04-01",
        quality_rating: "Premium Grade",
        notes: "Acidity measured at 0.2%, well below extra virgin limit."
    }
];

export const mockOrders = [
    {
        id: 5001,
        client_name: "Adnane Radi",
        farmer_name: "Association Cooperatives Essaouira",
        items: [
            {
                productId: 1,
                productName: "Argan Oil Premium",
                packQuantity: 2,
                totalWeight: 2,
                unitPrice: 120.00,
                subtotal: 240.00
            }
        ],
        total_amount: 240.00,
        status: "Processing",
        delivery_address: "12 Rue de France, Casablanca",
        payment_status: "Paid",
        created_at: "2026-06-14T12:00:00Z"
    },
    {
        id: 5002,
        client_name: "Fatima Alami",
        farmer_name: "Errachidia Palms Co.",
        items: [
            {
                productId: 2,
                productName: "Majhoul Dates Premium",
                packQuantity: 5,
                totalWeight: 5,
                unitPrice: 95.00,
                subtotal: 475.00
            }
        ],
        total_amount: 475.00,
        status: "Delivered",
        delivery_address: "Avenue Allal Fassi, Marrakech",
        payment_status: "Paid",
        created_at: "2026-06-10T10:30:00Z"
    }
];
