import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import RefreshToken from '../models/RefreshToken.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/plantb');
    console.log('MongoDB Connected for database seeding...');

    // Clear collections
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await RefreshToken.deleteMany();
    console.log('Cleared existing data.');

    // 1. Seed Categories
    const categoriesData = [
      {
        name: 'plants',
        description: 'Lush indoor and outdoor greenery, succulents, and flowering varieties.',
        subcategories: ['indoor', 'outdoor', 'succulents', 'flowering']
      },
      {
        name: 'medicines',
        description: 'Pesticides, fertilizers, and nutrient solutions to keep plants healthy.',
        subcategories: ['fertilizer', 'pesticides', 'nutrients', 'growth boosters']
      },
      {
        name: 'pots',
        description: 'Ceramic, terracotta, plastic, and hanging pots.',
        subcategories: ['ceramic', 'plastic', 'hanging', 'terracotta']
      },
      {
        name: 'accessories',
        description: 'Soil, tools, seeds, and accessories for plant care.',
        subcategories: ['soil', 'tools', 'watering cans', 'seeds']
      }
    ];

    await Category.insertMany(categoriesData);
    console.log('Seeded default product categories.');

    // 2. Seed Users
    const admin = new User({
      name: 'System Admin',
      email: 'admin@plantb.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    const customer1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      addresses: [
        {
          street: '123 Forest Lane',
          city: 'Garden City',
          state: 'NY',
          zipCode: '11530',
          country: 'USA',
          isDefault: true
        }
      ]
    });
    await customer1.save();

    const customer2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'customer',
      addresses: [
        {
          street: '456 Meadow Ave',
          city: 'Greenfield',
          state: 'CA',
          zipCode: '93927',
          country: 'USA',
          isDefault: true
        }
      ]
    });
    await customer2.save();

    console.log('Seeded users (admin and customer accounts).');

    // 3. Seed Products
    const productsData = [
      {
        name: 'Monstera Deliciosa',
        description: 'The iconic split-leaf plant, perfect for adding a tropical vibe indoors.',
        price: 29.99,
        stock: 25,
        images: ['/uploads/monstera.jpg'],
        category: 'plants',
        type: 'indoor',
        tags: ['indoor', 'tropical', 'popular'],
        discount: 10,
        isFeatured: true
      },
      {
        name: 'Snake Plant (Sansevieria)',
        description: 'An extremely hardy, air-purifying plant that thrives on neglect.',
        price: 19.99,
        stock: 40,
        images: ['/uploads/snake_plant.jpg'],
        category: 'plants',
        type: 'indoor',
        tags: ['indoor', 'air-purifying', 'low-maintenance'],
        isFeatured: true
      },
      {
        name: 'French Lavender',
        description: 'A beautiful flowering outdoor herb known for its relaxing fragrance.',
        price: 14.99,
        stock: 15,
        images: ['/uploads/lavender.jpg'],
        category: 'plants',
        type: 'outdoor',
        tags: ['outdoor', 'fragrant', 'flowering']
      },
      {
        name: 'Aloe Vera',
        description: 'Succulent plant species known for its soothing gel and easy maintenance.',
        price: 9.99,
        stock: 5, // low stock
        images: ['/uploads/aloe.jpg'],
        category: 'plants',
        type: 'succulents',
        tags: ['succulent', 'medicinal', 'easy-care']
      },
      {
        name: 'Organic Liquid Fertilizer',
        description: 'Concentrated natural nutrients to boost foliage growth and root health.',
        price: 12.49,
        stock: 30,
        images: ['/uploads/fertilizer.jpg'],
        category: 'medicines',
        type: 'fertilizer',
        tags: ['organic', 'fertilizer', 'growth'],
        isFeatured: true
      },
      {
        name: 'Neem Oil Pest Spray',
        description: 'Ready-to-use organic insect killer and fungicide spray.',
        price: 8.99,
        stock: 2, // low stock
        images: ['/uploads/neem_oil.jpg'],
        category: 'medicines',
        type: 'pesticides',
        tags: ['organic', 'pesticide', 'neem']
      },
      {
        name: 'Minimalist Ceramic Pot',
        description: 'Sleek matte-white ceramic pot with drainage hole and saucer.',
        price: 24.99,
        stock: 20,
        images: ['/uploads/ceramic_pot.jpg'],
        category: 'pots',
        type: 'ceramic',
        tags: ['ceramic', 'pot', 'white']
      },
      {
        name: 'Hanging Coconut Fiber Basket',
        description: 'Eco-friendly hanging planter with steel chain hanger.',
        price: 15.99,
        stock: 12,
        images: ['/uploads/hanging_basket.jpg'],
        category: 'pots',
        type: 'hanging',
        tags: ['hanging', 'coconut-fiber', 'rustic']
      },
      {
        name: 'Organic Potting Soil Mix',
        description: 'Premium soil mixture enriched with compost, peat moss, and perlite.',
        price: 11.99,
        stock: 50,
        images: ['/uploads/soil.jpg'],
        category: 'accessories',
        type: 'soil',
        tags: ['soil', 'organic', 'planting']
      },
      {
        name: 'Bonsai Pruning Shears',
        description: 'High carbon steel bypass shears designed for delicate pruning.',
        price: 18.99,
        stock: 8, // low stock
        images: ['/uploads/shears.jpg'],
        category: 'accessories',
        type: 'tools',
        tags: ['tools', 'pruning', 'carbon-steel']
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log('Seeded products.');

    // 4. Seed Carts & Wishlists
    await Cart.create({ user: customer1._id, items: [] });
    await Cart.create({ user: customer2._id, items: [] });

    await Wishlist.create({ user: customer1._id, products: [products[0]._id, products[1]._id] });
    await Wishlist.create({ user: customer2._id, products: [products[1]._id] });
    console.log('Seeded empty carts and sample wishlists.');

    // 5. Seed Reviews
    await Review.create({
      product: products[0]._id,
      user: customer1._id,
      rating: 5,
      comment: 'Excellent plant, arrived in pristine condition and looks beautiful in my living room!'
    });

    await Review.create({
      product: products[0]._id,
      user: customer2._id,
      rating: 4,
      comment: 'Lush and healthy, but took a bit longer to arrive.'
    });

    await Review.create({
      product: products[1]._id,
      user: customer1._id,
      rating: 5,
      comment: 'Very easy to keep alive. Perfect for a beginner!'
    });

    console.log('Seeded product reviews.');

    // 6. Seed Orders
    // Delivered order for Customer 1
    await Order.create({
      user: customer1._id,
      items: [
        {
          product: products[0]._id,
          quantity: 1,
          price: 26.99
        },
        {
          product: products[8]._id,
          quantity: 2,
          price: 11.99
        }
      ],
      shippingAddress: customer1.addresses[0],
      totalAmount: 50.97,
      paymentStatus: 'paid',
      status: 'delivered',
      paymentMethod: 'card',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    });

    // Delivered order for Customer 2
    await Order.create({
      user: customer2._id,
      items: [
        {
          product: products[1]._id,
          quantity: 2,
          price: 19.99
        },
        {
          product: products[4]._id,
          quantity: 1,
          price: 12.49
        }
      ],
      shippingAddress: customer2.addresses[0],
      totalAmount: 52.47,
      paymentStatus: 'paid',
      status: 'delivered',
      paymentMethod: 'paypal',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    // Pending order for Customer 2
    await Order.create({
      user: customer2._id,
      items: [
        {
          product: products[2]._id,
          quantity: 1,
          price: 14.99
        }
      ],
      shippingAddress: customer2.addresses[0],
      totalAmount: 14.99,
      paymentStatus: 'pending',
      status: 'pending',
      paymentMethod: 'cod',
      createdAt: new Date()
    });

    console.log('Seeded historical orders.');
    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
