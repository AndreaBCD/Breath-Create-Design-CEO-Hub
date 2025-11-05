# Breathe Create Design - CEO Dashboard

A comprehensive Notion dashboard setup for managing your creative business.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Notion workspace
- A Notion integration (already set up: "Claude Integration")

### Setup

1. **Clone this repository** (if you haven't already)

2. **Run the dashboard creator:**
   ```bash
   node create-ceo-dashboard.js
   ```

   The script will automatically:
   - Connect to your Notion workspace
   - Enhance your existing "Creative CEO Dashboard"
   - Create comprehensive databases for business management

## 📊 Dashboard Components

Your CEO Dashboard includes:

### 1. **Key Business Metrics** 📊
Track essential KPIs and business performance indicators:
- Current values vs targets
- Status tracking (On Track, At Risk, Behind, Exceeded)
- Quarterly organization
- Last updated timestamps

### 2. **Strategic Goals & OKRs** 🎯
Manage high-level objectives:
- Goals categorized by Revenue, Growth, Operations, Team, Product
- Priority levels (Critical, High, Medium, Low)
- Progress tracking with percentages
- Owner assignments and due dates
- Status monitoring

### 3. **Team & Leadership** 👥
Centralize team information:
- Team member directory
- Roles and departments
- Contact information
- Start dates and performance tracking
- Department categorization (Leadership, Creative, Operations, Marketing, Finance)

### 4. **Active Projects** 🚀
Project portfolio management:
- Project descriptions and status
- Budget tracking
- Timeline management (start/end dates)
- Team lead assignments
- Progress percentages
- Priority levels

### 5. **Financial Overview** 💰
Financial tracking and reporting:
- Revenue and expense tracking
- Monthly and yearly organization
- Investment monitoring
- Profit analysis
- Custom notes

### 6. **Clients & Partnerships** 🤝
Client relationship management:
- Client directory with industry info
- Status tracking (Active, Prospect, On Hold, Former)
- Contract value monitoring
- Satisfaction levels
- Contact information

### 7. **Meeting Notes & Decisions** 📅
Meeting documentation:
- Meeting types (Leadership, Team Sync, Client, Strategy, One-on-One)
- Attendee tracking
- Action items
- Follow-up flags
- Date organization

## 🎨 Features

- **Beautiful Color Coding**: Each database uses intuitive color schemes for quick visual recognition
- **Emoji Icons**: Clear visual indicators for each section
- **Status Tracking**: Multiple status options across different databases
- **Progress Monitoring**: Percentage-based progress tracking
- **Flexible Organization**: Tags, dates, and categories for powerful filtering
- **Scalable Structure**: Designed to grow with your business

## 🔧 Configuration

The script is pre-configured with your:
- Notion Integration Token
- Creative CEO Dashboard Page ID
- Teamspace: "Breathe Create Design"

To modify the configuration, edit `create-ceo-dashboard.js`:
```javascript
const NOTION_TOKEN = 'your-token-here';
const DASHBOARD_PAGE_ID = 'your-page-id-here';
```

## 📝 Usage Tips

1. **Regular Updates**: Keep your dashboards updated weekly for best results
2. **Team Collaboration**: Share specific databases with team members
3. **Views**: Create custom views in each database for different perspectives
4. **Templates**: Use Notion's template feature for recurring entries
5. **Automation**: Connect with Zapier or Make.com for automated updates

## 🛠️ Troubleshooting

### "Access denied" Error

1. Go to https://www.notion.so/my-integrations
2. Click "Claude Integration"
3. Verify capabilities are enabled:
   - ✓ Read content
   - ✓ Update content
   - ✓ Insert content
4. Go to your Creative CEO Dashboard page in Notion
5. Click the "•••" menu → "Connections"
6. Ensure "Claude Integration" is connected

### Token Issues

If you need to regenerate your token:
1. Go to https://www.notion.so/my-integrations
2. Click "Claude Integration"
3. Find "Internal Integration Secret"
4. Click "Regenerate"
5. Update the token in `create-ceo-dashboard.js`

## 📚 Additional Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion Integration Guide](https://www.notion.so/help/create-integrations-with-the-notion-api)

## 🤝 Support

For issues or questions about this dashboard setup, please refer to:
- Notion API documentation
- Your integration settings at https://www.notion.so/my-integrations

## 📄 License

This dashboard setup is provided as-is for use with your Breathe Create Design business.

---

**Made with ❤️ for creative leaders and CEOs**
