# Frontend-Backend API Integration

## Overview
The Angular frontend has been successfully connected to the Express.js backend APIs for both User and Product management.

## 🔗 Connected APIs

### User API Integration
- **Authentication**: Login, Register, Token Refresh
- **Profile Management**: Get/Update user profiles
- **Password Management**: Reset password with OTP
- **Admin Functions**: User management, banning, deletion
- **Shopping Features**: Cart and wishlist management
- **Payment**: Konnect payment gateway integration

### Product API Integration
- **CRUD Operations**: Create, Read, Update, Delete products
- **Advanced Features**: Category filtering, sorting by sales
- **3D Products**: 3D model management
- **Search & Filter**: Price range, stock level filtering

## 🚀 Setup Instructions

### 1. Backend Setup
Ensure your Express.js backend is running on port 9002:
```bash
cd backend
npm install
npm start
```

### 2. Frontend Setup
Install dependencies and start the development server:
```bash
npm install
ng serve
```

### 3. Environment Configuration
Update `src/environments/environment.ts` with your backend URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9002/api', // Update if different
};
```

## 📁 New Files Created

### Services
- `src/app/shared/services/api.service.ts` - Base HTTP service
- `src/app/shared/services/user.service.ts` - User API service
- `src/app/shared/services/product.service.ts` - Product API service
- `src/app/shared/services/category.service.ts` - Category API service
- `src/app/shared/services/subcategory.service.ts` - SubCategory API service
- `src/app/shared/services/supplier.service.ts` - Supplier API service
- `src/app/shared/services/rating.service.ts` - Rating/Review API service
- `src/app/shared/services/promotion.service.ts` - Promotion API service

### Security
- `src/app/shared/guards/auth.guard.ts` - Route protection
- `src/app/shared/interceptors/auth.interceptor.ts` - Token management

### Configuration
- `src/environments/environment.ts` - Environment variables

## 🔐 Authentication Flow

1. **Login**: User enters email/password
2. **Token Storage**: JWT token stored in localStorage
3. **Auto-Refresh**: Interceptor handles token refresh
4. **Route Protection**: AuthGuard protects dashboard routes
5. **Logout**: Clears tokens and redirects to login

## 📋 API Endpoints Used

### User Endpoints
- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `GET /api/users` - Get all users (admin)
- `PUT /api/banUser` - Ban/unban user
- `DELETE /api/deleteUser` - Delete user
- `POST /api/refreshtoken` - Refresh JWT token

### Product Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/sorted` - Get products sorted by sales

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### SubCategory Endpoints
- `GET /api/subcategories` - Get all subcategories
- `POST /api/subcategories` - Create subcategory
- `PUT /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Supplier Endpoints
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Rating Endpoints
- `GET /api/ratings/:productId` - Get ratings for product
- `POST /api/ratings` - Create rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating
- `GET /api/ratings/average/:productId` - Get average rating

### Promotion Endpoints
- `GET /api/promotions` - Get all promotions
- `POST /api/promotions` - Create promotion
- `PUT /api/promotions/:id` - Update promotion
- `DELETE /api/promotions/:id` - Delete promotion

## 🎯 Features Implemented

### ✅ Authentication
- JWT token-based authentication
- Automatic token refresh
- Route protection with guards
- Secure logout functionality

### ✅ User Management
- User listing with pagination
- User creation and editing
- User banning/unbanning
- User deletion with confirmation

### ✅ Product Management
- Product listing and creation
- Product editing and deletion
- Category-based filtering
- 3D product support

### ✅ Error Handling
- HTTP interceptor for error management
- User-friendly error messages
- Automatic redirect on authentication failure

## 🔧 Usage Examples

### Login
```typescript
this.userService.login({ email: 'user@example.com', password: 'password' })
  .subscribe(response => {
    this.userService.setToken(response.token);
    this.router.navigate(['/dash-adm']);
  });
```

### Get All Users
```typescript
this.userService.getAllUsers().subscribe(users => {
  this.users = users;
});
```

### Create Product
```typescript
this.productService.createProduct(productData).subscribe(product => {
  console.log('Product created:', product);
});
```

## 🚨 Important Notes

1. **CORS**: Ensure your backend has CORS configured for `http://localhost:4200`
2. **Token Expiry**: JWT tokens expire after 15 minutes, refresh tokens after 7 days
3. **Error Handling**: All API calls include proper error handling
4. **Security**: Tokens are automatically included in all API requests

## 🐛 Troubleshooting

### Common Issues
1. **CORS Error**: Check backend CORS configuration
2. **401 Unauthorized**: Check token validity and refresh mechanism
3. **API Not Found**: Verify backend URL in environment.ts
4. **Token Expired**: Automatic refresh should handle this

### Debug Steps
1. Check browser console for errors
2. Verify backend is running on correct port
3. Check network tab for API request/response
4. Verify environment configuration

## 📈 Next Steps

1. **Add more features**: User roles, advanced filtering
2. **Improve UI**: Better error messages, loading states
3. **Add tests**: Unit tests for services and components
4. **Production setup**: Environment-specific configurations 