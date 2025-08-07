# 🔄 Automatic Subscription Expiration System

## Overview

The automatic subscription expiration system ensures that subscriptions are automatically marked as expired when they reach their end date. This system runs daily at midnight (UTC) and provides both automatic and manual expiration checking capabilities.

## 🏗️ Architecture

### Backend Components

1. **SubscriptionExpirationService** (`backend/indardeco-main/services/subscriptionExpirationService.js`)
   - Core service handling automatic expiration logic
   - Cron job scheduler running daily at 00:00 UTC
   - Manual expiration check functionality
   - Statistics and monitoring capabilities

2. **Enhanced Subscription Controller** (`backend/indardeco-main/controllers/SubscriptionController.js`)
   - New API endpoints for manual expiration checks
   - Expiration statistics endpoints
   - Upcoming expiration monitoring

3. **Updated Routes** (`backend/indardeco-main/routes/SubscriptionRoutes.js`)
   - New routes for expiration management
   - Manual expiration check endpoint
   - Statistics and monitoring endpoints

### Frontend Components

1. **SubscriptionExpirationComponent** (`src/app/dash-adm/subscriptions/subscription-expiration/`)
   - Comprehensive UI for managing subscription expiration
   - Real-time statistics display
   - Manual expiration controls
   - Upcoming expiration monitoring

2. **Enhanced Subscription List** (`src/app/dash-adm/subscriptions/subscription-list/`)
   - Visual expiration indicators
   - Days remaining display
   - Color-coded status indicators

## 🚀 Features

### Automatic Expiration
- **Daily Cron Job**: Runs every day at midnight (UTC)
- **Automatic Status Update**: Changes active subscriptions to expired when end date is reached
- **Conflict Prevention**: Prevents multiple simultaneous expiration checks
- **Error Handling**: Comprehensive error handling and logging

### Manual Controls
- **Manual Expiration Check**: Admin can trigger immediate expiration check
- **Real-time Statistics**: Live statistics on active, expired, and upcoming expirations
- **Upcoming Expiration Monitoring**: Shows subscriptions expiring within 7 days

### Visual Indicators
- **Color-coded Status**: 
  - 🟢 Normal (7+ days remaining)
  - 🟡 Warning (3-7 days remaining)
  - 🟠 Critical (0-3 days remaining)
  - 🔴 Expired (0 days remaining)
- **Days Remaining Display**: Shows exact days left for active subscriptions
- **Payment Status Indicators**: Visual payment status with color coding

## 📊 API Endpoints

### New Endpoints

```javascript
// Manual expiration check
POST /api/subscription/expire-check
Authorization: Bearer <token>

// Get expiration statistics
GET /api/subscription/expiration-stats
Authorization: Bearer <token>

// Get upcoming expirations (next 7 days)
GET /api/subscription/upcoming-expirations
Authorization: Bearer <token>
```

### Response Examples

**Expiration Statistics:**
```json
{
  "totalActive": 15,
  "totalExpired": 8,
  "expiringToday": 2,
  "expiringThisWeek": 5
}
```

**Upcoming Expirations:**
```json
{
  "count": 3,
  "subscriptions": [
    {
      "_id": "subscription_id",
      "supplierId": {
        "_id": "supplier_id",
        "name": "Supplier Name",
        "email": "supplier@example.com"
      },
      "planType": "premium",
      "endDate": "2024-01-15T00:00:00.000Z",
      "price": 99.99,
      "paymentStatus": "paid"
    }
  ]
}
```

## 🛠️ Installation & Setup

### Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend/indardeco-main
   npm install node-cron
   ```

2. **Environment Variables:**
   Ensure your `.env` file includes:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Component Registration:**
   The component is already registered in the routing system.

2. **Access the Interface:**
   Navigate to `/dash-adm/subscriptions/expiration` in your application.

## 🔧 Usage

### Automatic Expiration
The system automatically runs every day at midnight (UTC). No manual intervention required.

### Manual Expiration Check
1. Navigate to the Expiration Management page
2. Click "Run Manual Check" button
3. Monitor the results in real-time

### Monitoring Expirations
1. View statistics on the main dashboard
2. Check upcoming expirations list
3. Monitor color-coded indicators in subscription list

## 📈 Monitoring & Statistics

### Available Statistics
- **Total Active Subscriptions**: Currently active subscriptions
- **Total Expired Subscriptions**: Subscriptions marked as expired
- **Expiring Today**: Subscriptions expiring within 24 hours
- **Expiring This Week**: Subscriptions expiring within 7 days

### Visual Indicators
- **Green**: 7+ days remaining (normal)
- **Yellow**: 3-7 days remaining (warning)
- **Orange**: 0-3 days remaining (critical)
- **Red**: Expired (0 days remaining)

## 🧪 Testing

### Test Script
Run the test script to verify functionality:

```bash
cd backend/indardeco-main
node test-expiration.js
```

### Manual Testing
1. Create a subscription with an end date in the past
2. Run manual expiration check
3. Verify the subscription status changes to "expired"

## 🔒 Security Considerations

- **Authentication Required**: All expiration endpoints require valid authentication
- **Admin Access Only**: Expiration management is restricted to admin users
- **Audit Logging**: All expiration actions are logged for audit purposes
- **Error Handling**: Comprehensive error handling prevents system crashes

## 🚨 Troubleshooting

### Common Issues

1. **Cron Job Not Running**
   - Check server logs for cron initialization messages
   - Verify timezone settings (UTC)
   - Ensure server is running continuously

2. **Manual Check Fails**
   - Verify authentication token
   - Check database connectivity
   - Review server logs for specific errors

3. **Statistics Not Updating**
   - Refresh the page
   - Check network connectivity
   - Verify API endpoint responses

### Debug Commands

```bash
# Check cron job status
grep "subscription expiration" /var/log/application.log

# Test manual expiration
curl -X POST /api/subscription/expire-check \
  -H "Authorization: Bearer <token>"

# Check expiration statistics
curl -X GET /api/subscription/expiration-stats \
  -H "Authorization: Bearer <token>"
```

## 📝 Logging

The system provides comprehensive logging:

```
🕐 Initializing subscription expiration cron job...
✅ Subscription expiration cron job scheduled successfully
⏰ Running subscription expiration check...
🔍 Checking for expired subscriptions at 2024-01-15T00:00:00.000Z
📊 Found 3 expired subscriptions
🔄 Expiring subscription 507f1f77bcf86cd799439011 for supplier ABC Corp
✅ Subscription 507f1f77bcf86cd799439011 expired successfully
✅ Successfully expired 3 subscriptions
```

## 🔄 Future Enhancements

1. **Email Notifications**: Send expiration warnings to suppliers
2. **Auto-renewal**: Automatic renewal for eligible subscriptions
3. **Advanced Analytics**: Detailed expiration trend analysis
4. **Custom Schedules**: Configurable expiration check intervals
5. **Bulk Operations**: Mass expiration management tools

## 📞 Support

For issues or questions regarding the automatic subscription expiration system:

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Test with the provided test script
4. Contact the development team with specific error details

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team 