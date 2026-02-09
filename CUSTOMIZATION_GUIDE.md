# 🎨 BOUTIQUE SHOP - CUSTOMIZATION GUIDE

Complete guide for customizing the boutique shop for your business needs.

---

## 🎯 BRANDING CUSTOMIZATION

### 1. Colors & Styling

**File: `frontend/tailwind.config.js`**

```javascript
theme: {
  extend: {
    colors: {
      primary: '#000000',      // Change to your brand color
      secondary: '#f5f5f5',    // Change to your accent
      accent: '#ff6b6b',       // Change CTA color
    },
  },
}
```

**Usage in Components:**
```jsx
<button className="bg-primary text-white">Branded Button</button>
<div className="bg-secondary text-primary">Card</div>
```

### 2. Logo & Branding

**File: `frontend/components/Header.tsx`**

Replace the logo placeholder:
```jsx
<div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
  <span className="text-white text-lg font-bold">B</span>
</div>
```

With your logo:
```jsx
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={40} 
  height={40} 
/>
```

### 3. Fonts

**File: `frontend/app/globals.css`**

Add to `<head>` in Next.js:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
```

---

## 📱 CONTENT CUSTOMIZATION

### 1. Business Information

**Update in Multiple Places:**

- **Header Company Name**: `frontend/components/Header.tsx`
- **Footer Info**: `frontend/components/Footer.tsx`
- **About Page**: `frontend/app/about/page.tsx`
- **Home Page Text**: `frontend/app/page.tsx`

### 2. WhatsApp Integration

**File: `frontend/.env.local`**

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210  # Your WhatsApp number
```

Replace with your number (include country code).

### 3. Social Media Links

**File: `frontend/.env.local`**

```env
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourbrand
```

Also update in:
- `frontend/components/Footer.tsx`
- `frontend/app/contact/page.tsx`
- `frontend/app/about/page.tsx`

### 4. Contact Email

**File: `frontend/app/contact/page.tsx`**

```typescript
<p className="text-gray-700">your-email@boutique.com</p>
```

---

## 🗄️ DATABASE CUSTOMIZATION

### 1. Add New Product Fields

**File: `backend/src/models/Product.ts`**

```typescript
const productSchema = new Schema<IProductDocument>({
  // ... existing fields ...
  
  // Add new field
  sku: {
    type: String,
    unique: true,
  },
  weight: {
    type: Number,  // in grams
  },
  material: {
    type: String,
  },
});
```

Update in TypeScript interface:
**File: `backend/src/types/index.ts`**

```typescript
export interface IProduct {
  // ... existing fields ...
  sku?: string;
  weight?: number;
  material?: string;
}
```

### 2. Customize Admin User Fields

**File: `backend/src/models/AdminUser.ts`**

Add phone or other fields:
```typescript
phone: {
  type: String,
  default: null,
},
role: {
  type: String,
  enum: ['admin', 'moderator'],
  default: 'admin',
},
```

### 3. Add New Database Collections

Create new file: `backend/src/models/YourModel.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IYourModel extends Document {
  name: string;
  description: string;
}

const schema = new Schema<IYourModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const YourModel = mongoose.model<IYourModel>('YourModel', schema);
```

---

## 🔧 FEATURE CUSTOMIZATION

### 1. Change Product Fields Displayed

**File: `frontend/components/ProductCard.tsx`**

Currently shows:
- Image
- Category
- Name
- Price & discount
- Stock status

To add rating:
```tsx
<div className="flex gap-1">
  {Array.from({length: Math.round(product.rating || 0)}).map((_, i) => (
    <span key={i} className="text-yellow-500">★</span>
  ))}
</div>
```

### 2. Modify Filters on Shop Page

**File: `frontend/app/shop/page.tsx`**

Current filters:
- Category
- Price range
- Featured
- New arrivals
- Sort

To add rating filter:
```tsx
<select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
  <option value="">All Ratings</option>
  <option value="4">4+ Stars</option>
  <option value="3">3+ Stars</option>
</select>
```

### 3. Customize Homepage Sections

**File: `frontend/app/page.tsx`**

Edit these sections:
- Hero banner text & images
- Featured products count
- New arrivals count
- Categories displayed
- Offers section
- Reviews shown

### 4. Change Product Details Layout

**File: `frontend/app/product/[id]/page.tsx`**

Modify:
- Image gallery layout
- Information display order
- Related products count
- WhatsApp message template

---

## 🔐 AUTHENTICATION CUSTOMIZATION

### 1. Change Admin Password

**File: `backend/.env`**

```env
ADMIN_PASSWORD=YourSecurePassword123
```

Run seeding again:
```bash
npm run seed
```

### 2. Add Role-Based Access

**File: `backend/src/middleware/auth.ts`**

```typescript
export const verifyAdminRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || req.admin.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    next();
  };
};
```

### 3. Add Email Verification

Extend `AdminUser` model to include:
```typescript
isEmailVerified: {
  type: Boolean,
  default: false,
},
verificationToken: {
  type: String,
  default: null,
},
```

---

## 📧 EMAIL INTEGRATION (Optional)

### Add Email Notifications

Install nodemailer:
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**File: `backend/src/utils/email.ts`** (new file)

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};
```

Use when creating contact messages:
```typescript
await sendEmail(
  contactMessage.email,
  'We received your message',
  '<h1>Thank you for contacting us!</h1>'
);
```

---

## 🖼️ IMAGE OPTIMIZATION

### 1. Cloudinary Setup

**File: `backend/.env`**

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

**File: `backend/src/utils/cloudinary.ts`** (create new)

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath);
  return result.secure_url;
};
```

### 2. Image Optimization in Next.js

**Already Configured!** Next.js handles:
- Automatic format conversion
- Responsive images
- Lazy loading
- Picture tag generation

---

## 🎨 ADMIN PANEL CUSTOMIZATION

### 1. Add Dashboard Chart

Install recharts:
```bash
npm install recharts
```

**File: `frontend/app/admin/dashboard/page.tsx`**

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const data = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
  ];

  return (
    <LineChart width={400} height={300} data={data}>
      <CartesianGrid />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#000" />
    </LineChart>
  );
}
```

### 2. Add Product Bulk Upload

Create new page: `frontend/app/admin/products/bulk-upload/page.tsx`

```tsx
'use client';

export default function BulkUploadPage() {
  const handleCSVUpload = (file: File) => {
    // Parse CSV
    // Create products
  };

  return (
    <div>
      <h1>Bulk Upload Products</h1>
      <input type="file" accept=".csv" onChange={(e) => {
        if (e.target.files) {
          handleCSVUpload(e.target.files[0]);
        }
      }} />
    </div>
  );
}
```

---

## 🌍 MULTI-LANGUAGE SUPPORT (Optional)

Install next-intl:
```bash
npm install next-intl
```

Create translation files:
- `messages/en.json`
- `messages/hi.json`
- `messages/fr.json`

Update pages to use translations:
```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return <h1>{t('welcome')}</h1>;
}
```

---

## 📊 ANALYTICS INTEGRATION (Optional)

### Add Google Analytics

**File: `frontend/app/layout.tsx`**

```tsx
import Script from 'next/script';

export default function RootLayout(...) {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=GA_ID`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_ID');
            `,
          }}
        />
      </head>
    </html>
  );
}
```

---

## 📦 ADD NEW ADMIN FEATURE

### Example: Add FAQ Management

1. **Create Model** (`backend/src/models/FAQ.ts`)
```typescript
interface IFAQ {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}
```

2. **Create Controller** (`backend/src/controllers/faqController.ts`)
```typescript
export const getAllFAQs = async (req: Request, res: Response) => {
  // Get FAQs logic
};
```

3. **Create Routes** (`backend/src/routes/faqs.ts`)
```typescript
router.get('/', getAllFAQs);
router.post('/', verifyAuth, createFAQ);
// ... other routes
```

4. **Add to Server** (`backend/src/index.ts`)
```typescript
import faqRoutes from './routes/faqs';
app.use('/api/faqs', faqRoutes);
```

5. **Create Admin Page** (`frontend/app/admin/faqs/page.tsx`)
```tsx
// Display and manage FAQs
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### 1. Add Caching Headers

**File: `backend/src/index.ts`**

```typescript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 2. Implement Pagination Everywhere

Already done for products and reviews!

### 3. Database Indexing

Already optimized in product model:
```typescript
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
```

---

## 🔍 SEO OPTIMIZATIONS

### 1. Update Metadata

**File: `frontend/app/[page]/page.tsx`**

```typescript
export const metadata: Metadata = {
  title: 'Your Boutique - Premium Fashion',
  description: 'Shop elegant dresses and accessories',
  keywords: 'dresses, sarees, fashion, boutique',
  openGraph: {
    title: 'Your Boutique',
    description: 'Premium Fashion',
    images: ['/og-image.png'],
  },
};
```

### 2. Add Structured Data

```tsx
import { JsonLd } from 'react-schemaorg';

<JsonLd<Organization>
  item={{
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Boutique',
    url: 'https://yourboutique.com',
  }}
/>
```

---

## 📝 DEPLOYMENT CUSTOMIZATION

### Before Deploying:

1. **Change JWT Secret**
   - `backend/.env`: Set strong `JWT_SECRET`

2. **Update CORS**
   - `backend/.env`: Set `CORS_ORIGIN` to your domain

3. **Database**
   - Set `MONGODB_URI` to production MongoDB Atlas URL

4. **Environment Variables**
   - Set all required vars in hosting platform

5. **API URL**
   - `frontend/.env.production`: Point to production API

---

## ✨ QUICK WINS

Quick customizations that make big impact:

1. **Change button colors** in `tailwind.config.js`
2. **Update email** in `app/contact/page.tsx`
3. **Add your Instagram** in `.env.local`
4. **Update company name** in `components/Header.tsx`
5. **Change WhatsApp number** in `.env.local`
6. **Update hero image** in `app/page.tsx`
7. **Add your logo** in `components/Header.tsx`
8. **Change meta description** in `app/layout.tsx`

---

## 🆘 COMMON CUSTOMIZATION ISSUES

### TypeScript errors after changes?
- Run `npm run build` to rebuild
- Check that updated interfaces match usage

### Styling not applied?
- Clear `.next` cache: `rm -rf .next`
- Rebuild CSS: `npm run dev`

### Database errors?
- Verify MongoDB connection
- Check model exports
- Run migrations if needed

---

## 📚 WHEN TO ASK FOR HELP

Need custom features? These components make extending easy:

1. **New database fields** → Add to models
2. **New API endpoints** → Create controller + routes
3. **New pages** → Create in `frontend/app/`
4. **New admin features** → Add model + controller + admin page
5. **UI changes** → Modify components with Tailwind

Everything is modular and well-organized for easy extension!

---

**Happy customizing! 🎨**
