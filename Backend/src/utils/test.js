import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const BASE_URL = `http://127.0.0.1:${process.env.PORT || 5000}/api`;

const runTests = async () => {
  console.log('==================================================');
  console.log('     PLANTB BACKEND INTEGRATION TEST SUITE        ');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.log(`  ✗ [FAIL] ${message}`);
      failed++;
    }
  };

  const assertStatus = (res, expectedStatus, message) => {
    assert(res.status === expectedStatus, `${message} (Expected Status: ${expectedStatus}, Got: ${res.status})`);
  };

  try {
    // ------------------------------------------------
    // SECTION 1: PUBLIC ENDPOINTS
    // ------------------------------------------------
    console.log('--- Testing Public Endpoints ---');
    
    // Browse categories
    const catRes = await fetch(`${BASE_URL}/categories`);
    assertStatus(catRes, 200, 'GET /api/categories');
    const catData = await catRes.json();
    assert(catData.success && catData.data.length > 0, 'Categories list returned data');

    // Browse products
    const prodRes = await fetch(`${BASE_URL}/products`);
    assertStatus(prodRes, 200, 'GET /api/products');
    const prodData = await prodRes.json();
    assert(prodData.success && prodData.data.length > 0, 'Products list returned data');

    // Get Monstera product ID for future tests
    const products = prodData.data;
    const monstera = products.find(p => p.name === 'Monstera Deliciosa');
    const snakePlant = products.find(p => p.name.includes('Snake Plant'));
    const lavender = products.find(p => p.name.includes('Lavender'));
    assert(monstera !== undefined, 'Found Monstera Deliciosa in product list');
    
    // Get single product details
    if (monstera) {
      const singleRes = await fetch(`${BASE_URL}/products/${monstera._id}`);
      assertStatus(singleRes, 200, `GET /api/products/:id (${monstera.name})`);
      const singleData = await singleRes.json();
      assert(singleData.success && singleData.data.name === 'Monstera Deliciosa', 'Returned correct single product details');
    }

    // Get featured products
    const featRes = await fetch(`${BASE_URL}/products/featured`);
    assertStatus(featRes, 200, 'GET /api/products/featured');
    const featData = await featRes.json();
    assert(featData.success && featData.data.length > 0, 'Featured products returned items');

    // Search products
    const searchRes = await fetch(`${BASE_URL}/products/search?q=Sansevieria`);
    assertStatus(searchRes, 200, 'GET /api/products/search?q=Sansevieria');
    const searchData = await searchRes.json();
    assert(searchData.success && searchData.data.length > 0, 'Search returned results');

    // ------------------------------------------------
    // SECTION 2: AUTHENTICATION
    // ------------------------------------------------
    console.log('\n--- Testing Authentication Endpoints ---');

    // Login as Customer
    const custLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
    });
    assertStatus(custLoginRes, 200, 'POST /api/auth/login (Customer)');
    const custLoginData = await custLoginRes.json();
    const customerToken = custLoginData.data?.accessToken;
    const customerRefreshToken = custLoginData.data?.refreshToken;
    assert(customerToken !== undefined, 'Customer JWT access token generated');

    // Login as Admin
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@plantb.com', password: 'admin123' })
    });
    assertStatus(adminLoginRes, 200, 'POST /api/auth/login (Admin)');
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.data?.accessToken;
    assert(adminToken !== undefined, 'Admin JWT access token generated');

    // Refresh Token
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: customerRefreshToken })
    });
    assertStatus(refreshRes, 200, 'POST /api/auth/refresh');
    const refreshData = await refreshRes.json();
    assert(refreshData.success && refreshData.data?.accessToken !== undefined, 'Successfully refreshed access token');

    // ------------------------------------------------
    // SECTION 3: CLIENT / CUSTOMER API
    // ------------------------------------------------
    console.log('\n--- Testing Customer Operations ---');
    const custHeaders = {
      'Authorization': `Bearer ${customerToken}`,
      'Content-Type': 'application/json'
    };

    // Get Profile
    const profileRes = await fetch(`${BASE_URL}/profile`, { headers: custHeaders });
    assertStatus(profileRes, 200, 'GET /api/profile');
    const profileData = await profileRes.json();
    assert(profileData.success && profileData.data.email === 'john@example.com', 'Profile details match logged-in user');

    // Update Profile
    const updateProfileRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: custHeaders,
      body: JSON.stringify({ name: 'John Doe Jr.' })
    });
    assertStatus(updateProfileRes, 200, 'PUT /api/profile');
    const updateProfileData = await updateProfileRes.json();
    assert(updateProfileData.data.name === 'John Doe Jr.', 'Profile name changed in DB');

    // Add Address
    const addAddrRes = await fetch(`${BASE_URL}/profile/address`, {
      method: 'POST',
      headers: custHeaders,
      body: JSON.stringify({
        street: '789 Pine Road',
        city: 'Oakville',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      })
    });
    assertStatus(addAddrRes, 201, 'POST /api/profile/address');
    const addAddrData = await addAddrRes.json();
    assert(addAddrData.success && addAddrData.data.length > 1, 'Address added to profile');

    // Wishlist operations
    if (lavender) {
      // Add to wishlist
      const addWishRes = await fetch(`${BASE_URL}/wishlist/${lavender._id}`, {
        method: 'POST',
        headers: custHeaders
      });
      assertStatus(addWishRes, 200, 'POST /api/wishlist/:productId');

      // Get wishlist
      const getWishRes = await fetch(`${BASE_URL}/wishlist`, { headers: custHeaders });
      assertStatus(getWishRes, 200, 'GET /api/wishlist');
      const getWishData = await getWishRes.json();
      assert(
        getWishData.data.products.some(p => p._id === lavender._id),
        'Wishlist contains newly added French Lavender'
      );
    }

    // Cart operations
    if (monstera) {
      // Clear Cart first
      await fetch(`${BASE_URL}/cart`, { method: 'DELETE', headers: custHeaders });

      // Add to Cart
      const addCartRes = await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: custHeaders,
        body: JSON.stringify({ productId: monstera._id, quantity: 2 })
      });
      assertStatus(addCartRes, 200, 'POST /api/cart');

      // View Cart
      const viewCartRes = await fetch(`${BASE_URL}/cart`, { headers: custHeaders });
      assertStatus(viewCartRes, 200, 'GET /api/cart');
      const viewCartData = await viewCartRes.json();
      assert(viewCartData.data.items.length === 1 && viewCartData.data.items[0].quantity === 2, 'Cart has correct product and quantity');

      // Update quantity
      const cartItemId = viewCartData.data.items[0]._id;
      const updateCartRes = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: custHeaders,
        body: JSON.stringify({ quantity: 3 })
      });
      assertStatus(updateCartRes, 200, 'PUT /api/cart/:itemId');
      const updateCartData = await updateCartRes.json();
      assert(updateCartData.data.items[0].quantity === 3, 'Cart quantity updated successfully');
    }

    // Place Order
    if (monstera && profileData.data.addresses.length > 0) {
      const shippingAddress = profileData.data.addresses[0];
      const placeOrderRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: custHeaders,
        body: JSON.stringify({
          items: [{ product: monstera._id, quantity: 1 }],
          shippingAddress
        })
      });
      assertStatus(placeOrderRes, 201, 'POST /api/orders');
      const placeOrderData = await placeOrderRes.json();
      assert(placeOrderData.success && placeOrderData.data.totalAmount > 0, 'Order successfully placed');

      // View Order History
      const myOrdersRes = await fetch(`${BASE_URL}/orders/my-orders`, { headers: custHeaders });
      assertStatus(myOrdersRes, 200, 'GET /api/orders/my-orders');
      const myOrdersData = await myOrdersRes.json();
      assert(myOrdersData.data.length > 0, 'Order list retrieved successfully');

      // Cancel Order
      const newOrderId = placeOrderData.data._id;
      const cancelRes = await fetch(`${BASE_URL}/orders/${newOrderId}/cancel`, {
        method: 'POST',
        headers: custHeaders
      });
      assertStatus(cancelRes, 200, 'POST /api/orders/:id/cancel');
      const cancelData = await cancelRes.json();
      assert(cancelData.data.status === 'cancelled', 'Order successfully changed status to cancelled');
    }

    // ------------------------------------------------
    // SECTION 4: ADMIN API
    // ------------------------------------------------
    console.log('\n--- Testing Admin Operations ---');
    const adminHeaders = {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };

    // Dashboard Overview
    const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, { headers: adminHeaders });
    assertStatus(dashRes, 200, 'GET /api/admin/dashboard');
    const dashData = await dashRes.json();
    assert(
      dashData.success && 
      dashData.data.totalSales !== undefined && 
      dashData.data.lowStockAlerts !== undefined,
      'Dashboard stats successfully retrieved'
    );

    // Revenue reports
    const revRes = await fetch(`${BASE_URL}/admin/analytics/revenue?period=daily`, { headers: adminHeaders });
    assertStatus(revRes, 200, 'GET /api/admin/analytics/revenue?period=daily');
    const revData = await revRes.json();
    assert(revData.success && revData.data.length > 0, 'Revenue analytics report contains data');

    // Top products
    const topProdRes = await fetch(`${BASE_URL}/admin/analytics/top-products`, { headers: adminHeaders });
    assertStatus(topProdRes, 200, 'GET /api/admin/analytics/top-products');
    const topProdData = await topProdRes.json();
    assert(topProdData.success && topProdData.data.length > 0, 'Top products list contains data');

    // Get Users
    const usersRes = await fetch(`${BASE_URL}/admin/users`, { headers: adminHeaders });
    assertStatus(usersRes, 200, 'GET /api/admin/users');
    const usersData = await usersRes.json();
    assert(usersData.data.length > 0, 'Admin users list retrieved successfully');

    // Logout
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: customerRefreshToken })
    });
    assertStatus(logoutRes, 200, 'POST /api/auth/logout');

    console.log('\n==================================================');
    console.log(`TEST EXECUTION COMPLETED: ${passed} Passed, ${failed} Failed`);
    console.log('==================================================');

    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error(`\nTest Execution Aborted due to error: ${error.message}`);
    process.exit(1);
  }
};

runTests();
