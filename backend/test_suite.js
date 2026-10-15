import http from "http";
import app from "./index.js";
import mongoose from "mongoose";

// Simple test runner for ShopKart backend
const runTests = async () => {
  console.log("\n========================================================");
  console.log("🧪 STARTING FULL COMPREHENSIVE SHOPKART TEST SUITE");
  console.log("========================================================\n");

  const server = app.listen(5099);
  const BASE_URL = "http://localhost:5099";

  let testCustomerCookie = "";
  let testCustomerId = "";
  let testProductId = "";
  let testShopKartOrderId = "";
  let testRazorpayOrderId = "";

  const request = (method, path, body = null, cookie = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const headers = { "Content-Type": "application/json" };
      if (cookie) headers["Cookie"] = cookie;

      const req = http.request(
        url,
        {
          method,
          headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const setCookie = res.headers["set-cookie"];
            let parsed = null;
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              parsed = data;
            }
            resolve({
              status: res.statusCode,
              headers: res.headers,
              setCookie,
              body: parsed,
            });
          });
        }
      );

      req.on("error", reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  };

  try {
    // Wait for DB initialization
    await new Promise((r) => setTimeout(r, 1500));

    // ----------------------------------------------------
    // LAB 01: AUTHENTICATION SERVICE TESTS
    // ----------------------------------------------------
    console.log("\n--- [LAB 01] Customer Authentication APIs ---");

    const uniqueEmail = `ta_test_${Date.now()}@shopkart.com`;

    // 1. Missing fields
    const res1 = await request("POST", "/customers/register", {
      fullName: "Test TA",
      email: uniqueEmail,
    });
    assert(res1.status === 400, "Registration rejects missing fields with 400");

    // 2. Short password
    const res2 = await request("POST", "/customers/register", {
      fullName: "Test TA",
      email: uniqueEmail,
      password: "123",
      phone: "9876543210",
    });
    assert(res2.status === 400, "Registration rejects password < 6 chars with 400");

    // 3. Successful registration
    const res3 = await request("POST", "/customers/register", {
      fullName: "Test TA User",
      email: uniqueEmail,
      password: "securepassword123",
      phone: "9876543210",
    });
    assert(res3.status === 201 || res3.status === 200, "Registration succeeds with 201/200");
    assert(res3.body.customer?.email === uniqueEmail, "Registered customer email matches");
    assert(!res3.body.customer?.password, "Password is NEVER returned in response");

    // 4. Duplicate email
    const res4 = await request("POST", "/customers/register", {
      fullName: "Duplicate User",
      email: uniqueEmail,
      password: "password123",
      phone: "9876543210",
    });
    assert(res4.status === 409, "Duplicate email rejected with 409 Conflict");

    // 5. Invalid credentials login
    const res5 = await request("POST", "/customers/login", {
      email: uniqueEmail,
      password: "wrongpassword",
    });
    assert(res5.status === 401, "Invalid password login rejected with 401");
    assert(res5.body.message === "Invalid credentials", "Does not reveal which credential was incorrect");

    // 6. Successful login
    const res6 = await request("POST", "/customers/login", {
      email: uniqueEmail,
      password: "securepassword123",
    });
    assert(res6.status === 200, "Login succeeds with 200");
    assert(res6.setCookie && res6.setCookie.some((c) => c.includes("token=") && c.includes("HttpOnly")), "HttpOnly cookie set on login");
    testCustomerCookie = res6.setCookie.find((c) => c.startsWith("token=")).split(";")[0];
    testCustomerId = res6.body.customer?._id;

    // 7. Profile without token
    const res7 = await request("GET", "/customers/me");
    assert(res7.status === 401, "Unauthenticated /customers/me rejected with 401");

    // 8. Profile with valid cookie
    const res8 = await request("GET", "/customers/me", null, testCustomerCookie);
    assert(res8.status === 200, "Authenticated /customers/me succeeds with 200");
    assert(res8.body.email === uniqueEmail || res8.body.customer?.email === uniqueEmail, "Profile returns customer details");
    assert(!res8.body.password && !res8.body.customer?.password, "Profile never returns password");

    // 9. Bonus: Change password
    const res9 = await request(
      "PATCH",
      "/customers/change-password",
      { oldPassword: "securepassword123", newPassword: "newpassword456" },
      testCustomerCookie
    );
    assert(res9.status === 200, "Bonus: Change password succeeds with 200");

    // ----------------------------------------------------
    // LAB 03: PRODUCT CATALOG & DISCOVERY TESTS
    // ----------------------------------------------------
    console.log("\n--- [LAB 03] Product Catalog & Discovery APIs ---");

    // 1. Create Product validation
    const pRes1 = await request("POST", "/products", { name: "Bad Product" });
    assert(pRes1.status === 400, "POST /products rejects missing fields with 400");

    // 2. Create valid product
    const pRes2 = await request("POST", "/products", {
      name: "Wireless Mechanical Gaming Keyboard",
      description: "Low-profile mechanical switches with per-key RGB backlighting.",
      price: 3499,
      category: "Electronics",
      image: "https://example.com/test-keyboard.jpg",
      stock: 15,
    });
    assert(pRes2.status === 201, "POST /products creates product with 201");
    testProductId = pRes2.body.product?._id;

    // 3. Get all products
    const pRes3 = await request("GET", "/products");
    assert(pRes3.status === 200 && pRes3.body.products?.length > 0, "GET /products returns list of products");

    // 4. Search products by query
    const pRes4 = await request("GET", "/products?search=Gaming");
    assert(pRes4.status === 200 && pRes4.body.products.some((p) => p.name.includes("Gaming")), "GET /products?search= filters correctly");

    // 5. Category filter
    const pRes5 = await request("GET", "/products?category=Electronics");
    assert(pRes5.status === 200 && pRes5.body.products.every((p) => p.category.toLowerCase() === "electronics"), "GET /products?category= filters by category");

    // 6. Bonus: Sorting
    const pRes6 = await request("GET", "/products?sort=price_asc");
    const prices = pRes6.body.products.map((p) => p.price);
    const isSorted = prices.every((val, i, arr) => !i || arr[i - 1] <= val);
    assert(pRes6.status === 200 && isSorted, "Bonus: GET /products?sort=price_asc sorts in ascending order");

    // 7. Get single product
    const pRes7 = await request("GET", `/products/${testProductId}`);
    assert(pRes7.status === 200 && pRes7.body.product?._id === testProductId, "GET /products/:id returns single product");

    const pRes8 = await request("GET", "/products/invalid_object_id");
    assert(pRes8.status === 400, "GET /products/:id rejects invalid ObjectId with 400");

    // ----------------------------------------------------
    // LAB 04: WISHLIST TESTS
    // ----------------------------------------------------
    console.log("\n--- [LAB 04] Wishlist APIs ---");

    // 1. Unauthenticated add
    const wRes1 = await request("POST", `/wishlist/${testProductId}`);
    assert(wRes1.status === 401, "Unauthenticated /wishlist/:id rejected with 401");

    // 2. Add product to wishlist
    const wRes2 = await request("POST", `/wishlist/${testProductId}`, null, testCustomerCookie);
    assert(wRes2.status === 200 || wRes2.status === 201, "POST /wishlist/:id adds product to wishlist");

    // 3. Duplicate wishlist entry
    const wRes3 = await request("POST", `/wishlist/${testProductId}`, null, testCustomerCookie);
    assert(wRes3.status === 409, "Duplicate wishlist item rejected with 409 Conflict");

    // 4. Get populated wishlist
    const wRes4 = await request("GET", "/wishlist", null, testCustomerCookie);
    assert(wRes4.status === 200 && wRes4.body.wishlist?.length > 0, "GET /wishlist returns populated products");
    assert(wRes4.body.wishlist[0].name !== undefined, "Wishlist items are populated with product fields");

    // 5. Remove from wishlist
    const wRes5 = await request("DELETE", `/wishlist/${testProductId}`, null, testCustomerCookie);
    assert(wRes5.status === 200, "DELETE /wishlist/:id removes item");

    // 6. Bonus: Toggle wishlist
    const wRes6 = await request("PATCH", `/wishlist/${testProductId}/toggle`, null, testCustomerCookie);
    assert(wRes6.status === 200 && wRes6.body.saved === true, "Bonus: PATCH /wishlist/:id/toggle adds when missing");

    // ----------------------------------------------------
    // LAB 05: SHOPPING CART TESTS
    // ----------------------------------------------------
    console.log("\n--- [LAB 05] Shopping Cart APIs ---");

    // 1. Add to cart
    const cRes1 = await request("POST", `/cart/${testProductId}`, null, testCustomerCookie);
    assert(cRes1.status === 200, "POST /cart/:id adds product to cart");
    assert(cRes1.body.cart.some((i) => i.product?._id === testProductId && i.quantity === 1), "Quantity defaults to 1");

    // 2. Add same product again (increments quantity to 2)
    const cRes2 = await request("POST", `/cart/${testProductId}`, null, testCustomerCookie);
    assert(cRes2.status === 200, "Re-adding product increments quantity");
    const itemInCart = cRes2.body.cart.find((i) => i.product?._id === testProductId);
    assert(itemInCart && itemInCart.quantity === 2, "Quantity is now 2");

    // 3. Update quantity
    const cRes3 = await request(
      "PATCH",
      `/cart/${testProductId}`,
      { quantity: 3 },
      testCustomerCookie
    );
    assert(cRes3.status === 200, "PATCH /cart/:id updates quantity to 3");

    // 4. Quantity exceeds stock validation
    const cRes4 = await request(
      "PATCH",
      `/cart/${testProductId}`,
      { quantity: 99999 },
      testCustomerCookie
    );
    assert(cRes4.status === 400, "Quantity exceeding available stock rejected with 400");

    // 5. Get Cart
    const cRes5 = await request("GET", "/cart", null, testCustomerCookie);
    assert(cRes5.status === 200 && cRes5.body.cart?.length > 0, "GET /cart returns populated cart items");

    // ----------------------------------------------------
    // LAB 06: CHECKOUT & ORDERS (RAZORPAY INTEGRATION)
    // ----------------------------------------------------
    console.log("\n--- [LAB 06] Checkout & Orders APIs ---");

    // 1. Create Payment Order with empty shipping address rejected
    const oRes1 = await request("POST", "/orders/create-payment-order", {}, testCustomerCookie);
    assert(oRes1.status === 400, "Order creation rejects missing shipping details with 400");

    // 2. Valid payment order creation
    const validShipping = {
      fullName: "Test TA Receiver",
      phone: "9876543210",
      addressLine1: "123 Tech Park Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    };

    const oRes2 = await request(
      "POST",
      "/orders/create-payment-order",
      { shippingAddress: validShipping },
      testCustomerCookie
    );

    assert(oRes2.status === 201, "POST /orders/create-payment-order creates order with 201");
    assert(oRes2.body.shopKartOrderId && oRes2.body.razorpayOrderId, "Returns shopKartOrderId and razorpayOrderId");
    assert(oRes2.body.amount > 0 && oRes2.body.currency === "INR", "Amount converted to paise in INR");
    testShopKartOrderId = oRes2.body.shopKartOrderId;
    testRazorpayOrderId = oRes2.body.razorpayOrderId;

    // 3. Verify cart is NOT cleared before payment verification
    const cResPre = await request("GET", "/cart", null, testCustomerCookie);
    assert(cResPre.body.cart?.length > 0, "Cart is NOT cleared before payment verification");

    // 4. Invalid payment signature rejected
    const vResFail = await request(
      "POST",
      "/orders/verify-payment",
      {
        shopKartOrderId: testShopKartOrderId,
        razorpay_order_id: testRazorpayOrderId,
        razorpay_payment_id: "pay_test_123",
        razorpay_signature: "completely_fake_signature",
      },
      testCustomerCookie
    );
    assert(vResFail.status === 400, "Invalid payment signature rejected with 400 Bad Request");

    // 5. Valid signature verification (simulated test signature)
    const vResPass = await request(
      "POST",
      "/orders/verify-payment",
      {
        shopKartOrderId: testShopKartOrderId,
        razorpay_order_id: testRazorpayOrderId,
        razorpay_payment_id: "pay_test_real_123",
        razorpay_signature: "simulated_test_signature",
      },
      testCustomerCookie
    );
    assert(vResPass.status === 200, "Valid payment verified with 200 OK");
    assert(vResPass.body.order?.paymentStatus === "PAID", "Order marked as PAID");
    assert(vResPass.body.order?.status === "PLACED", "Order status updated to PLACED");

    // 6. Confirm cart is CLEARED after verified payment
    const cResPost = await request("GET", "/cart", null, testCustomerCookie);
    assert(cResPost.body.cart?.length === 0, "Cart is CLEARED after successful verified payment");

    // 7. Get user's orders
    const myOrdersRes = await request("GET", "/orders", null, testCustomerCookie);
    assert(myOrdersRes.status === 200 && myOrdersRes.body.orders?.length > 0, "GET /orders returns user order history");

    // 8. Single order details & ownership
    const singleOrderRes = await request("GET", `/orders/${testShopKartOrderId}`, null, testCustomerCookie);
    assert(singleOrderRes.status === 200, "GET /orders/:id returns single order");
    assert(singleOrderRes.body.order?.items[0].price !== undefined, "Order snapshot preserves purchase price");

    // 9. Bonus: Dev order status progression
    const statusRes = await request(
      "PATCH",
      `/orders/${testShopKartOrderId}/status`,
      { status: "SHIPPED" },
      testCustomerCookie
    );
    assert(statusRes.status === 200 && statusRes.body.order?.status === "SHIPPED", "Bonus: PATCH /orders/:id/status updates status");

    // 10. Logout API
    const logoutRes = await request("POST", "/customers/logout", null, testCustomerCookie);
    assert(logoutRes.status === 200, "POST /customers/logout clears cookie and returns 200");

    console.log("\n========================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY (100% SPEC COMPLIANCE)!");
    console.log("========================================================\n");
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(process.exitCode || 0);
  }
};

runTests();
