# Dashboard Backend Documentation

## Overview

The Dashboard Backend provides comprehensive analytics and statistics for the admin dashboard. It aggregates data from multiple collections to provide real-time insights into the platform's performance.

## Features

### 📊 **Comprehensive Statistics**
- User statistics (total users, growth, recent registrations)
- Product statistics (total products, growth, recent additions)
- Sales statistics (total revenue, orders, growth)
- Subscription statistics (active subscriptions)
- Supplier statistics (total suppliers)
- Category statistics (categories and subcategories)

### 📋 **Activity Feed**
- Recent user registrations
- New product additions
- Recent sales transactions
- New reviews and ratings
- New subscription activations
- Real-time activity tracking

### 💰 **Revenue Analytics**
- Period-based revenue statistics (week, month, year)
- Revenue trends and growth patterns
- Sales aggregation and analysis

### 🏆 **Performance Rankings**
- Top performing products by sales
- Top suppliers by product count
- Performance metrics and rankings

## API Endpoints

### Base URL
```
http://localhost:9002/api/dashboard
```

### 1. Dashboard Statistics
**GET** `/stats`

Returns comprehensive dashboard statistics including users, products, sales, subscriptions, suppliers, and categories.

**Response:**
```json
{
  "users": {
    "total": 150,
    "growth": "+12%",
    "recent": [
      {
        "name": "John Doe",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "products": {
    "total": 1250,
    "growth": "+8%",
    "recent": [
      {
        "name": "Product Name",
        "price": 99.99,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "sales": {
    "total": 45000.00,
    "orders": 1250,
    "growth": "+15%",
    "recent": [
      {
        "product": { "name": "Product Name" },
        "amount": 99.99,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "subscriptions": {
    "active": 45
  },
  "suppliers": {
    "total": 25
  },
  "categories": {
    "total": 12,
    "subCategories": 48
  },
  "trends": []
}
```

### 2. Activity Feed
**GET** `/activity-feed`

Returns recent activities across the platform including user registrations, product additions, sales, reviews, and subscriptions.

**Response:**
```json
[
  {
    "type": "user",
    "title": "New User Registration",
    "description": "john@example.com joined the platform",
    "timestamp": "2024-01-15T10:30:00Z",
    "icon": "👤"
  },
  {
    "type": "product",
    "title": "New Product Added",
    "description": "Product Name was added to the catalog",
    "timestamp": "2024-01-15T10:25:00Z",
    "icon": "📦"
  },
  {
    "type": "sale",
    "title": "New Sale",
    "description": "Sale of Product Name for $99.99",
    "timestamp": "2024-01-15T10:20:00Z",
    "icon": "💰"
  }
]
```

### 3. Quick Stats
**GET** `/quick-stats`

Returns quick statistics for sidebar display.

**Response:**
```json
{
  "users": 150,
  "products": 1250,
  "subscriptions": 45,
  "suppliers": 25
}
```

### 4. Revenue Statistics
**GET** `/revenue-stats?period=month`

Returns revenue statistics for the specified period (week, month, year).

**Parameters:**
- `period` (optional): "week", "month", "year" (default: "month")

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "total": 1500.00,
    "count": 25
  },
  {
    "date": "2024-01-16",
    "total": 2200.00,
    "count": 35
  }
]
```

### 5. Top Products
**GET** `/top-products`

Returns top performing products by sales revenue.

**Response:**
```json
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "totalSales": 5000.00,
    "totalOrders": 50
  }
]
```

### 6. Top Suppliers
**GET** `/top-suppliers`

Returns top suppliers by product count.

**Response:**
```json
[
  {
    "_id": "supplier_id",
    "name": "Supplier Name",
    "email": "supplier@example.com",
    "productCount": 25
  }
]
```

## Database Models Used

### Core Models
- **User**: User registrations and profiles
- **Product**: Product catalog and details
- **Sales**: Sales transactions and revenue
- **Review**: Product reviews and ratings
- **Subscription**: Subscription management
- **Supplier**: Supplier information
- **Category**: Product categories
- **SubCategory**: Product subcategories

### Data Aggregation
The dashboard uses MongoDB aggregation pipelines to:
- Calculate totals and counts
- Group data by various criteria
- Sort and limit results
- Join data from multiple collections
- Calculate revenue and performance metrics

## Business Logic

### Growth Calculations
- User growth percentage (simplified calculation)
- Product growth percentage
- Sales growth percentage
- Revenue trend analysis

### Activity Tracking
- Real-time activity monitoring
- Multi-source activity aggregation
- Timestamp-based sorting
- Activity categorization

### Performance Metrics
- Top products by sales revenue
- Top suppliers by product count
- Revenue period analysis
- Order count tracking

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message description"
}
```

### Common Error Scenarios
- Database connection issues
- Missing required fields
- Invalid query parameters
- Aggregation pipeline errors

## Performance Considerations

### Database Indexing
- Ensure proper indexing on frequently queried fields
- Use compound indexes for complex queries
- Index timestamp fields for date-based queries

### Query Optimization
- Limit result sets to prevent memory issues
- Use projection to select only needed fields
- Implement pagination for large datasets
- Cache frequently accessed statistics

### Aggregation Optimization
- Use `$match` early in aggregation pipelines
- Limit intermediate result sets
- Use appropriate `$group` operations
- Sort results efficiently

## Security Considerations

### Data Access
- Implement proper authentication for dashboard access
- Validate user permissions for sensitive data
- Sanitize query parameters
- Implement rate limiting for API endpoints

### Data Privacy
- Ensure sensitive data is not exposed
- Implement proper data anonymization
- Follow GDPR compliance guidelines
- Secure API endpoints with proper authentication

## Testing

### Test Script
Use the provided test script to verify all endpoints:
```bash
node testDashboardBackend.js
```

### Manual Testing
Test each endpoint individually:
```bash
curl http://localhost:9002/api/dashboard/stats
curl http://localhost:9002/api/dashboard/activity-feed
curl http://localhost:9002/api/dashboard/quick-stats
curl http://localhost:9002/api/dashboard/revenue-stats?period=month
curl http://localhost:9002/api/dashboard/top-products
curl http://localhost:9002/api/dashboard/top-suppliers
```

## Deployment

### Environment Variables
Ensure the following environment variables are set:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 9002)
- `CORS_ORIGIN`: Allowed CORS origins

### Dependencies
Required npm packages:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `cors`: CORS middleware
- `morgan`: HTTP request logger

### Server Startup
```bash
npm start
```

## Monitoring and Maintenance

### Health Checks
- Monitor API response times
- Track error rates
- Monitor database performance
- Check memory usage

### Data Maintenance
- Regular database backups
- Clean up old activity logs
- Optimize database queries
- Monitor data growth

## Future Enhancements

### Planned Features
- Real-time notifications
- Advanced analytics dashboard
- Custom date range filtering
- Export functionality
- Advanced reporting
- Performance benchmarking
- Predictive analytics

### Scalability Improvements
- Implement caching layer
- Database sharding
- Load balancing
- Microservices architecture
- Real-time data streaming

## Support and Troubleshooting

### Common Issues
1. **Database Connection Errors**: Check MongoDB connection string
2. **Slow Query Performance**: Review database indexes
3. **Memory Issues**: Implement pagination and result limiting
4. **CORS Errors**: Verify CORS configuration

### Debugging
- Enable detailed logging
- Monitor database queries
- Check API response times
- Validate data integrity

### Contact
For technical support or questions about the dashboard backend, please refer to the development team or create an issue in the project repository. 