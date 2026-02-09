# Boutique Shop - Complete Online Boutique Business Website

A production-ready, full-stack e-commerce boutique website built with **TypeScript everywhere**. Features a modern Next.js frontend, Express.js backend, MongoDB database, and JWT authentication.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context / Server Components
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod + express-validator

### DevOps
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
boutique-shop/
├── backend/
│   ├── src/
│   │   ├── controllers/       # API business logic
│   │   ├── models/            # Mongoose schemas & types
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth & error handling
│   │   ├── utils/             # JWT, validation, helpers
│   │   ├── config/            # Database config
│   │   ├── scripts/           # Seeding scripts
│   │   ├── types/             # TypeScript interfaces
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   ├── shop/              # Shop listing page
│   │   ├── product/[id]/      # Product details page
│   │   ├── category/[slug]/   # Category pages
│   │   ├── offers/            # Offers page
│   │   ├── reviews/           # Reviews page
│   │   ├── about/             # About us page
│   │   ├── contact/           # Contact page
│   │   ├── admin/             # Protected admin area
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── offers/
│   │   │   └── reviews/
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── Loading.tsx
│   │   └── ToastProvider.tsx
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── toast.ts           # Toast notifications
│   │   └── utils.ts           # Helper functions
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 📋 Features

### Public Website
- ✅ Hero banner with dynamic content
- ✅ Product listing with filters & sorting
- ✅ Product search functionality
- ✅ Category-based navigation
- ✅ Product details with image gallery
- ✅ Featured products section
- ✅ New arrivals showcase
- ✅ Active offers & discounts display
- ✅ Customer reviews slider
- ✅ About us page
- ✅ Contact form
- ✅ WhatsApp enquiry integration
- ✅ Responsive mobile design
- ✅ SEO optimized pages

### Admin Dashboard
- ✅ JWT authentication login
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ Offers & discounts management
- ✅ Reviews management
- ✅ Dashboard analytics
- ✅ Stock management
- ✅ Product tagging & categorization

### Technical Features
- ✅ 100% TypeScript codebase
- ✅ Production-grade error handling
- ✅ Input validation (Zod + express-validator)
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcryptjs)
- ✅ REST API with Express
- ✅ MongoDB with Mongoose ORM
- ✅ CORS enabled
- ✅ Toast notification system
- ✅ Loading states & error boundaries

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ (LTS recommended)
- MongoDB 5.0+
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure .env**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/boutique-shop
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   ADMIN_EMAIL=admin@boutique.com
   ADMIN_PASSWORD=AdminPassword123
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Build TypeScript**
   ```bash
   npm run build
   ```

5. **Seed sample data**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure .env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
   NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:3000`

## 🗄️ Database Models

### AdminUser
```typescript
{
  email: String (unique)
  password: String (hashed)
  name: String
  createdAt: Date
  updatedAt: Date
}
```

### Category
```typescript
{
  name: String (unique)
  slug: String (auto-generated)
  description: String
  image: String (optional)
  createdAt: Date
  updatedAt: Date
}
```

### Product
```typescript
{
  name: String
  description: String
  price: Number
  discountedPrice: Number (optional)
  category: ObjectId (ref: Category)
  images: [String]
  sizes: [String]
  colors: [String]
  tags: [String]
  isFeatured: Boolean
  isNewArrival: Boolean
  isActive: Boolean
  stock: Number
  createdAt: Date
  updatedAt: Date
}
```

### Offer
```typescript
{
  title: String
  description: String
  discountType: 'percentage' | 'flat'
  discountValue: Number
  applicableProducts: [ObjectId] (optional)
  applicableCategories: [ObjectId] (optional)
  startDate: Date
  endDate: Date
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

### Review
```typescript
{
  customerName: String
  rating: Number (1-5)
  reviewText: String
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (protected)

### Product Routes
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Category Routes
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Offer Routes
- `GET /api/offers` - Get all offers
- `POST /api/offers` - Create offer (protected)
- `PUT /api/offers/:id` - Update offer (protected)
- `DELETE /api/offers/:id` - Delete offer (protected)

### Review Routes
- `GET /api/reviews` - Get all reviews (paginated)
- `POST /api/reviews` - Create review (protected)
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## 📱 Frontend Routes

### Public Routes
- `/` - Home page
- `/shop` - Product listing with filters
- `/product/[id]` - Product details
- `/category/[slug]` - Category products
- `/offers` - Active offers
- `/reviews` - Customer reviews
- `/about` - About us
- `/contact` - Contact form

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard (protected)
- `/admin/products` - Products management (protected)
- `/admin/categories` - Categories management (protected)
- `/admin/offers` - Offers management (protected)
- `/admin/reviews` - Reviews management (protected)

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

1. Admin logs in with email & password
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Backend middleware verifies token validity

**Default Admin Credentials:**
- Email: `admin@boutique.com`
- Password: `AdminPassword123`

> ⚠️ **CHANGE THESE IN PRODUCTION!**

## 🎨 Customization

### Colors & Branding
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#000000',
      secondary: '#f5f5f5',
      accent: '#ff6b6b',
    },
  },
}
```

### WhatsApp Integration
Update in `frontend/.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

### Cloudinary Setup (Optional)
For image uploads, configure in `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
```
Deploy on Vercel with:
- Build command: `npm run build`
- Start command: `npm run start`

### Backend (Render/Railway)
```bash
cd backend
npm run build
```
Deploy with:
- Build command: `npm run build`
- Start command: `npm start`

Set environment variables in hosting platform for:
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

## 📊 Seeding Data

The application includes sample data for testing:
- 4 categories (Dresses, Sarees, Accessories, Formal Wear)
- 5 sample products
- 4 customer reviews
- 2 promotional offers

Run seeding:
```bash
npm run seed
```

## 🧪 Testing the Application

1. **Visit homepage**: `http://localhost:3000`
2. **Browse products**: `/shop`
3. **View offers**: `/offers`
4. **Admin login**: `/admin/login`
5. **Use credentials**: Email: `admin@boutique.com`, Password: `AdminPassword123`
6. **Manage content**: `/admin/dashboard`

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Development/production
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - Token expiration time
- `CORS_ORIGIN` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp number
- `NEXT_PUBLIC_INSTAGRAM_URL` - Instagram profile URL

## 🚨 Error Handling

The application includes comprehensive error handling:
- Input validation with Zod schemas
- Express error middleware
- API error responses
- Toast notifications for user feedback
- Loading states for async operations

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues or questions:
1. Check the code comments
2. Review the TypeScript interfaces
3. Check backend API routes
4. Review frontend components

## ✨ Key Features Summary

- **100% TypeScript** - Type-safe codebase throughout
- **Production-Ready** - Error handling, validation, auth
- **Fully Featured** - Complete e-commerce functionality
- **Admin Panel** - Easy content management
- **Mobile Responsive** - Works on all devices
- **SEO Optimized** - Dynamic metadata & structured data
- **Modern Stack** - Latest versions of all technologies
- **Clean Code** - Well-organized, commented codebase
- **Scalable** - Ready for growth and customization
- **WhatsApp Integration** - Direct customer communication

---

**Happy coding! 🎉**
