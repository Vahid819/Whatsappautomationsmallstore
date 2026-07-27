# 🍔 WhatsApp Food Ordering Management System

A modern **Full-Stack Restaurant Management System** that enables customers to place food orders directly through **WhatsApp** while allowing restaurant owners to manage products, customers, and orders from a powerful admin dashboard.

Built with **Next.js 16**, **TypeScript**, **Firebase Firestore**, and the **WhatsApp Cloud API**, this project automates the complete food ordering process without requiring customers to install an additional mobile application.

---

## ✨ Key Features

### 📱 Customer Experience

- Register through WhatsApp
- Browse the restaurant menu
- Select food items and quantities
- View order summary before confirmation
- Confirm orders directly in WhatsApp
- Receive instant order confirmation
- Simple conversational ordering experience

### 🛠️ Restaurant Admin Dashboard

- Dashboard with business overview
- Product Management (Create, Update, Delete)
- Order Management
- Customer Management
- Update order status in real time
- Search & filter orders
- Responsive admin interface
- Firestore-powered real-time data

---

# 📱 Ordering Workflow

```text
Customer
     │
     ▼
Send "Hi"
     │
     ▼
Customer Registration
     │
     ▼
View Menu
     │
     ▼
Select Product
     │
     ▼
Choose Quantity
     │
     ▼
Order Summary
     │
     ▼
Confirm Order
     │
     ▼
Order Saved to Firestore
     │
     ▼
Admin Dashboard
```

---

# 📊 Order Lifecycle

```text
New Order
      │
      ▼
Pending
      │
      ▼
Accepted
      │
      ▼
Preparing
      │
      ▼
Ready
      │
      ▼
Completed
```

Restaurant owners can update the order status at every stage.

---

# 🗂️ Firestore Database Structure

```text
customers/
products/
orders/
conversations/
```

---

# 🏗️ Project Structure

```text
src
│
├── app
│   ├── (dashboard)
│   ├── api
│   └── login
│
├── components
│   ├── dashboard
│   ├── orders
│   ├── products
│   └── ui
│
├── handlers
│
├── services
│
├── lib
│
├── schemas
│
├── types
│
└── utils
```

---

# ⚙️ Tech Stack

## Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React
- React Hook Form
- Zod

## Backend

- Firebase Firestore
- Firebase Admin SDK
- WhatsApp Cloud API
- Next.js Route Handlers
- Server Actions

## Deployment

- Vercel

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/whatsapp-food-ordering-system.git
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env.local` file.

```env
# Firebase

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# WhatsApp Cloud API

WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=

# App

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Run the Project

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 📸 Screenshots

| Dashboard | Orders |
|-----------|--------|
| Add Screenshot | Add Screenshot |

| Products | WhatsApp Chat |
|-----------|---------------|
| Add Screenshot | Add Screenshot |

> Replace the placeholders with actual screenshots after completing the project.

---

# 🎯 Future Enhancements

- 💳 Razorpay / Stripe Integration
- 📍 Live Order Tracking
- 🔔 WhatsApp Notifications
- 📈 Sales Analytics Dashboard
- 📄 PDF Invoice Generation
- ⭐ Customer Reviews
- 🌐 Multi-language Support
- 🏪 Multi-Restaurant (SaaS)
- 👥 Staff & Role Management
- 📦 Inventory Management

---

# 💡 Skills Demonstrated

This project demonstrates experience with:

- Full-Stack Development
- Next.js App Router
- TypeScript
- Firebase Firestore
- Firebase Admin SDK
- WhatsApp Cloud API Integration
- CRUD Operations
- REST APIs
- Real-Time Database
- Responsive UI Design
- Form Validation
- Clean Architecture
- Service Layer Pattern

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Vahid Momin**

📧 Email: vahidmomin.dev@gmail.com

💻 GitHub:
https://github.com/vahid819

🌐 Portfolio:
https://vahidmomin.vercel.app/

---

## ⭐ Show Your Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.