/**
 * Quick Helper Script - Run this to understand the project
 * This demonstrates how to use the API client and common operations
 */

// Example: Fetching products
// import api from '@/lib/api';
// 
// const loadProducts = async () => {
//   try {
//     const response = await api.getProducts({
//       category: 'dresses',
//       minPrice: 2000,
//       maxPrice: 15000,
//       sortBy: 'price',
//       page: 1,
//       limit: 12,
//     });
//     console.log('Products:', response.data.data.products);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// Example: Admin Login
// const handleAdminLogin = async () => {
//   try {
//     const response = await api.adminLogin(
//       'admin@boutique.com',
//       'AdminPassword123'
//     );
//     localStorage.setItem('adminToken', response.data.data.token);
//     console.log('Login successful!');
//   } catch (error) {
//     console.error('Login failed:', error);
//   }
// };

// Example: Creating a product (Admin only)
// const createNewProduct = async () => {
//   try {
//     const response = await api.createProduct({
//       name: 'Beautiful Saree',
//       description: 'A stunning traditional saree with intricate patterns',
//       price: 7500,
//       discountedPrice: 6000,
//       category: 'category-id-here',
//       images: [
//         'https://via.placeholder.com/500x600?text=Saree+1',
//         'https://via.placeholder.com/500x600?text=Saree+2',
//       ],
//       sizes: ['One Size'],
//       colors: ['Red', 'Gold'],
//       tags: ['traditional', 'festive'],
//       isFeatured: true,
//       isNewArrival: true,
//       isActive: true,
//       stock: 20,
//     });
//     console.log('Product created:', response.data.data);
//   } catch (error) {
//     console.error('Error creating product:', error);
//   }
// };

// Example: Toast notifications
// import { toastManager } from '@/lib/toast';
//
// toastManager.success('Operation successful!');
// toastManager.error('Something went wrong');
// toastManager.info('Just a notification');

export const exampleUsage = {
  message: 'Check this file for API usage examples',
};
