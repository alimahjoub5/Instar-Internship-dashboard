# Subscription System Documentation

## Overview

The subscription system for suppliers has been implemented to provide a comprehensive subscription management solution. This system allows administrators to manage different subscription tiers, track payments, and monitor subscription analytics.

## Features

### Backend Features

#### Models
1. **Subscription Model** (`backend/indardeco-main/models/Subscription.js`)
   - Tracks subscription details including plan type, status, dates, and payment information
   - Supports three subscription tiers: Basic, Premium, and Enterprise
   - Includes features like auto-renewal, payment status tracking, and subscription lifecycle management

2. **SubscriptionPlan Model** (`backend/indardeco-main/models/SubscriptionPlan.js`)
   - Defines available subscription plans with pricing and features
   - Configurable features per plan (max products, images, analytics, etc.)
   - Supports plan activation/deactivation

#### Controllers
1. **SubscriptionController** (`backend/indardeco-main/controllers/SubscriptionController.js`)
   - CRUD operations for subscriptions
   - Subscription lifecycle management (create, cancel, renew)
   - Payment status updates
   - Subscription statistics and analytics

2. **SubscriptionPlanController** (`backend/indardeco-main/controllers/SubscriptionPlanController.js`)
   - Plan management operations
   - Plan creation, updates, and deletion
   - Plan type retrieval

#### Routes
- **Subscription Routes** (`backend/indardeco-main/routes/SubscriptionRoutes.js`)
  - RESTful API endpoints for subscription management
  - Authentication middleware integration
  - Comprehensive route coverage for all subscription operations

### Frontend Features

#### Services
1. **SubscriptionService** (`src/app/shared/services/subscription.service.ts`)
   - TypeScript interfaces for type safety
   - Complete API integration
   - Helper methods for subscription status and calculations

#### Components
1. **SubscriptionListComponent** (`src/app/dash-adm/subscriptions/subscription-list/`)
   - Displays all subscriptions in a table format
   - Status indicators and action buttons
   - Responsive design with Material Design

2. **CreateSubscriptionComponent** (`src/app/dash-adm/subscriptions/create-subscription/`)
   - Form for creating new subscriptions
   - Plan selection with feature display
   - Supplier selection integration

3. **SubscriptionStatsComponent** (`src/app/dash-adm/subscriptions/subscription-stats/`)
   - Dashboard-style analytics
   - Revenue tracking and plan distribution
   - Visual statistics and metrics

## Subscription Plans

### Basic Plan
- **Price**: $29.99/month
- **Duration**: 1 month
- **Features**:
  - Up to 50 products
  - Up to 10 images per product
  - Basic support

### Premium Plan
- **Price**: $79.99/3 months
- **Duration**: 3 months
- **Features**:
  - Up to 200 products
  - Up to 50 images per product
  - Analytics dashboard
  - Priority support
  - Advanced reporting
  - Bulk operations

### Enterprise Plan
- **Price**: $299.99/year
- **Duration**: 12 months
- **Features**:
  - Up to 1000 products
  - Up to 200 images per product
  - All Premium features
  - Custom branding
  - API access
  - White label solution

## API Endpoints

### Subscription Endpoints
- `POST /api/subscription` - Create new subscription
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscription/:id` - Get subscription by ID
- `GET /api/subscriptions/supplier/:supplierId` - Get subscriptions by supplier
- `PUT /api/subscription/:id` - Update subscription
- `PUT /api/subscription/:id/cancel` - Cancel subscription
- `PUT /api/subscription/:id/renew` - Renew subscription
- `PUT /api/subscription/:id/payment-status` - Update payment status
- `GET /api/subscriptions/stats` - Get subscription statistics

### Subscription Plan Endpoints
- `POST /api/subscription-plan` - Create subscription plan
- `GET /api/subscription-plans` - Get all subscription plans
- `GET /api/subscription-plan/:id` - Get plan by ID
- `GET /api/subscription-plan/type/:type` - Get plan by type
- `PUT /api/subscription-plan/:id` - Update subscription plan
- `DELETE /api/subscription-plan/:id` - Delete subscription plan

## Installation and Setup

### Backend Setup

1. **Initialize Subscription Plans**
   ```bash
   cd backend/indardeco-main
   node init-subscription-plans.js
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   ng serve
   ```

## Usage

### Admin Dashboard

1. **Access Subscription Management**
   - Navigate to `/dash-adm/subscriptions`
   - View all subscriptions in a table format

2. **Create New Subscription**
   - Click "New Subscription" button
   - Select supplier and plan
   - Configure payment method and auto-renewal
   - Submit to create subscription

3. **View Statistics**
   - Navigate to `/dash-adm/subscriptions/stats`
   - View subscription analytics and revenue metrics

### Subscription Management

1. **View Subscriptions**
   - All subscriptions are displayed with status indicators
   - Filter by status, plan type, or supplier
   - Sort by various criteria

2. **Manage Subscriptions**
   - Cancel active subscriptions
   - Renew expired subscriptions
   - Update payment status
   - View subscription details

3. **Payment Tracking**
   - Track payment status (pending, paid, failed, refunded)
   - Update payment status manually
   - Monitor payment history

## Database Schema

### Subscription Collection
```javascript
{
  _id: ObjectId,
  supplierId: ObjectId (ref: Supplier),
  planType: String (enum: ["basic", "premium", "enterprise"]),
  status: String (enum: ["active", "expired", "cancelled", "pending"]),
  startDate: Date,
  endDate: Date,
  price: Number,
  paymentStatus: String (enum: ["pending", "paid", "failed", "refunded"]),
  paymentMethod: String (enum: ["card", "bank_transfer", "paypal"]),
  autoRenew: Boolean,
  features: {
    maxProducts: Number,
    maxImages: Number,
    analytics: Boolean,
    prioritySupport: Boolean,
    customBranding: Boolean,
    apiAccess: Boolean
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### SubscriptionPlan Collection
```javascript
{
  _id: ObjectId,
  name: String,
  type: String (enum: ["basic", "premium", "enterprise"]),
  price: Number,
  duration: Number (months),
  features: {
    maxProducts: Number,
    maxImages: Number,
    analytics: Boolean,
    prioritySupport: Boolean,
    customBranding: Boolean,
    apiAccess: Boolean,
    advancedReporting: Boolean,
    bulkOperations: Boolean,
    whiteLabel: Boolean
  },
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Authentication**
   - All subscription endpoints require authentication
   - JWT token validation
   - Role-based access control

2. **Data Validation**
   - Input validation on all endpoints
   - Type checking and sanitization
   - Error handling and logging

3. **Payment Security**
   - Secure payment method handling
   - Payment status tracking
   - Audit trail for payment changes

## Future Enhancements

1. **Payment Integration**
   - Stripe/PayPal integration
   - Automated payment processing
   - Invoice generation

2. **Advanced Analytics**
   - Revenue charts and graphs
   - Subscription growth tracking
   - Churn analysis

3. **Email Notifications**
   - Subscription expiry reminders
   - Payment confirmation emails
   - Renewal notifications

4. **API Rate Limiting**
   - Plan-based API limits
   - Usage tracking
   - Overage handling

## Troubleshooting

### Common Issues

1. **Subscription Not Creating**
   - Check if supplier exists
   - Verify plan is active
   - Ensure no active subscription exists for supplier

2. **Payment Status Issues**
   - Verify payment method is valid
   - Check payment status updates
   - Review error logs

3. **Statistics Not Loading**
   - Check database connectivity
   - Verify aggregation queries
   - Review error handling

### Error Codes

- `400` - Bad Request (invalid data)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (subscription/plan not found)
- `409` - Conflict (duplicate subscription)
- `500` - Internal Server Error

## Support

For technical support or questions about the subscription system, please refer to the API documentation or contact the development team.

## License

This subscription system is part of the Instar Internship Dashboard project and follows the same licensing terms. 