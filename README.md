# 🚀 ProcureFlow AI

A full-stack intelligent RFP (Request for Proposal) management system that streamlines vendor communication, automates proposal parsing using AI, and provides smart comparison tools.

## ✨ Features

- **📝 Structured RFP Creation** - Create detailed RFPs with line items and vendor requirements
- **📧 Automated Email Distribution** - Send RFPs to multiple vendors via SendGrid
- **🤖 AI-Powered Parsing** - Extract structured data from vendor responses using Google Gemini
- **📊 Smart Comparison** - Compare vendor proposals side-by-side with AI insights
- **👥 Vendor Management** - Organize and track vendor information and ratings
- **⚡ Real-time Updates** - Live proposal tracking and status updates

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **SendGrid** for email delivery
- **Google Gemini AI** for intelligent parsing
- In-memory data store

### Frontend
- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- Context API for state management

---

## 📁 Project Structure

```
ProcureFlow-AI/
├── backend/                    # Node + Express + TypeScript API
│   ├── src/
│   │   ├── models/            # Data models (RFP, Vendor, Proposal)
│   │   ├── db/                # In-memory database (memoryDb.ts)
│   │   ├── config/            # Configuration files
│   │   ├── services/          # Email & AI services
│   │   ├── controllers/       # Business logic
│   │   └── routes/            # API endpoints
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example           # Environment template
│
└── frontend/                   # React + Vite + Tailwind
    ├── src/
    │   ├── components/        # UI components
    │   ├── services/          # API client & helpers
    │   ├── store/             # Global state management
    │   └── App.tsx            # Main application
    ├── package.json
    └── tsconfig.json
```

---

## 🔧 Prerequisites

Before running this project, ensure you have:

- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **SendGrid Account** with:
  - API Key
  - Verified sender email address
- **Google Gemini API Key** (optional, for AI parsing)

---

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/Rakesh-honawad/ProcureFlow-AI
cd ProcureFlow-AI
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

> **⚠️ IMPORTANT: You will receive a separate `.env` file from the project author.**

**DO NOT create or modify the `.env` file yourself. Follow these steps:**

1. You will receive a file named **`.env`** separately (via email or secure channel)
2. Copy the **exact `.env` file** provided to you into the `backend/` directory:
   ```
   ProcureFlow-AI/
   └── backend/
       └── .env  ← Place the file here
   ```
3. **Do NOT modify** any values in the `.env` file
4. **Do NOT commit** this file to version control (it's already in `.gitignore`)

**The `.env` file contains:**
```bash
# SendGrid Configuration (for sending emails)
SENDGRID_API_KEY=<provided-key>
VERIFIED_SENDER_EMAIL=<provided-email>

# Google Gemini AI (for parsing vendor responses)
GEMINI_API_KEY=<provided-key>

# Server Configuration
PORT=4000
```

> **🔒 Security Note:** The `.env` file contains sensitive credentials and should NEVER be shared publicly or committed to Git.

#### 2.3 Start Backend Server

```bash
# From backend directory
npm run dev
```

✅ Backend running at: **http://localhost:4000**

---

### Step 3: Frontend Setup

#### 3.1 Install Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

#### 3.2 Start Frontend Server

```bash
# From frontend directory
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📖 User Guide

### 1️⃣ Create Vendors

1. Navigate to the **Vendors** section from the dashboard
2. Click **"Add Vendor"**
3. Fill in vendor details:
   - Name
   - Email address
   - Category
   - Rating (1-5 stars)
4. Click **Save**

> 💡 **Tip:** For testing, you can use your own email address as a vendor email.

> ⚠️ **Important:** When you add a vendor, a verification email is automatically sent to their email address. **Check the spam/junk folder** if the email doesn't appear in the inbox. The vendor needs to verify their email to receive RFPs.

---

### 2️⃣ Create an RFP

1. From the dashboard, click **"New RFP"**
2. **Describe your requirements in natural language** - Simply type or paste your procurement needs as you would in a message or email. For example:

   ```
   I need to procure office furniture for our new branch. We need 20 ergonomic 
   office chairs, 10 standing desks, and 5 conference tables. Our budget is 
   around $15,000 and we need delivery by March 15th, 2025. The chairs should 
   have lumbar support and adjustable height. Desks must be electric sit-stand 
   models. Conference tables should seat 8-10 people each.
   ```

3. Click **"Generate RFP"** - The AI will automatically parse your message and structure it into:
   - **Title** - Generated from your requirements
   - **Description** - Professional summary of needs
   - **Budget** - Extracted budget amount
   - **Deadline** - Identified submission deadline
   - **Line Items** - Structured list with:
     - Item descriptions
     - Quantities
     - Specifications/requirements
   - **Vendor Requirements** - Extracted quality/delivery criteria

4. **Review and Edit** - The AI-generated RFP will be displayed for your review. You can:
   - Edit any field if needed
   - Add or remove line items
   - Adjust specifications
   - Modify vendor requirements

5. Click **"Create RFP"** to finalize

> 💡 **Pro Tip:** Be specific in your natural language input. Include quantities, budget ranges, deadlines, and any quality requirements for best AI parsing results.

---

### 3️⃣ Select Vendors

1. Open the RFP from your dashboard
2. Go to the **"Select Vendors"** panel
3. Click on vendors to select them for this RFP
4. Selected vendors will be highlighted
5. The send button will show **"Send to X Vendors"**

> ⚠️ Only RFPs in `DRAFT` status can modify vendor selection.

---

### 4️⃣ Send RFP Emails

1. On the RFP detail page, click **"Send RFP"**
2. The system will:
   - ✅ Generate professional HTML emails
   - ✅ Send to all selected vendors via SendGrid
   - ✅ Update RFP status to `SENT`
3. Check the backend console for confirmation logs

> 📧 **Email Details:** All RFP emails are sent from **raki1432rk@gmail.com** (the configured sender email in the `.env` file)

> ⚠️ **Check Spam Folders:** Remind vendors to check their spam/junk folders if they don't receive the RFP email in their inbox.

---

### 5️⃣ Receive Vendor Responses

#### 🔴 Current Limitation: No Domain Configuration

**Important:** Currently, vendor responses cannot be automatically received in the website's response section because:
- A custom domain is required to configure SendGrid Inbound Parse
- Without domain setup, vendor replies go directly to **raki1432rk@gmail.com** (the sender email)

**What happens when vendors reply:**
1. Vendor receives RFP email from `raki1432rk@gmail.com`
2. Vendor clicks "Reply" and sends their proposal
3. The reply email goes to `raki1432rk@gmail.com` inbox
4. **The reply does NOT automatically appear in the website** (requires domain configuration)

---

#### 🧪 Demo Mode - Simulate Vendor Responses (For Testing)

Since real vendor responses can't be captured yet, use the **simulation feature** to test the system:

**Why simulate responses?**
- ✅ Test the AI parsing functionality
- ✅ Verify the proposal comparison features
- ✅ Demonstrate the complete workflow without domain setup
- ✅ Validate backend processing and data structure

**How to simulate:**

1. Go to the **"Incoming Responses"** tab of your RFP
2. Click **"Trigger Vendor Response Webhook"**
3. This simulates a vendor email response with:
   - Dynamic content based on your RFP line items
   - Realistic proposal pricing and terms
   - AI parsing of proposal data
   - Automatic proposal creation in the system

The simulated response mimics what would happen if a real vendor replied via email once domain configuration is complete.

---

#### 🚀 Future: Production Mode with Domain

Once a custom domain is configured, the workflow will be:

1. **Setup SendGrid Inbound Parse** to forward vendor replies to:
   ```
   POST https://your-domain.com/api/email/inbound
   ```

2. **Vendor sends email reply** → SendGrid captures it → Forwards to your backend

3. **Backend processes the email:**
   - Extracts RFP ID from recipient address
   - Uses AI to parse proposal details
   - Creates proposal automatically
   - Updates in real-time on website

4. **No manual intervention needed** - everything happens automatically!

> 💡 **Note:** Until domain configuration is complete, continue using the simulation feature to test and demonstrate all platform capabilities.

---

### 6️⃣ Compare Proposals

1. Navigate to the **"Incoming Responses"** tab to view all proposals
2. Click on individual proposals to see:
   - Total amount
   - Delivery timeline
   - Warranty terms
   - Payment terms
   - Line-by-line pricing
   - Original email content
3. Go to the **"AI Comparison"** tab to:
   - Compare multiple proposals side-by-side
   - View AI-generated insights
   - Identify best value propositions

---

## 🔌 API Endpoints

### RFP Management
```
GET    /api/rfps              # List all RFPs
POST   /api/rfps              # Create new RFP
GET    /api/rfps/:id          # Get RFP details
POST   /api/rfps/send         # Send RFP to vendors
```

### Vendor Management
```
GET    /api/vendors           # List all vendors
POST   /api/vendors           # Create new vendor
GET    /api/vendors/:id       # Get vendor details
```

### Proposals
```
GET    /api/proposals         # List all proposals
GET    /api/proposals/:rfpId  # Get proposals for specific RFP
```

### Email Webhooks
```
POST   /api/email/inbound     # Webhook for incoming vendor emails
```

---

## 🧪 Testing Guide

### Local Testing Workflow

1. **Create Test Vendors**
   - Use your personal email addresses
   - Create 2-3 test vendors

2. **Create Sample RFP**
   - Title: "Office Supplies Procurement"
   - Add 3-5 line items
   - Set budget and deadline

3. **Send RFP**
   - Select test vendors
   - Click send
   - Check your email inbox

4. **Simulate Response**
   - Use the "Trigger Vendor Response" button
   - View parsed proposal data
   - Check AI comparison

---

## 🛠️ Available Scripts

### Backend
```bash
cd backend

# Development mode (auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend
```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## ⚙️ Configuration Details

### ✅ Pre-Configured API Keys

**Good news!** All API keys and configurations are already set up for you. You don't need to create any accounts or generate keys.
#### I HAVE SHARED .ENV FILE IN THE FORM ADD IT LOCATION BACKEND/SRC

The `.env` file provided by the project author contains:
- ✅ **SendGrid API Key** - Already configured and verified
- ✅ **Verified Sender Email** - Ready to send emails
- ✅ **Google Gemini API Key** - AI parsing enabled and ready

**You only need to:**
1. Copy the provided `.env` file to `backend/` directory
2. Start the application
3. Begin using all features immediately

> 🔒 **Security Note:** The provided API keys are for development/testing purposes. The credentials are managed and monitored by the project author.

---

### 🔧 Optional: Using Your Own API Keys

If you want to use your own API keys in the future:

<details>
<summary><b>SendGrid Setup (Click to expand)</b></summary>

1. **Create SendGrid Account**: [https://sendgrid.com](https://sendgrid.com)
2. **Generate API Key**:
   - Settings → API Keys → Create API Key
   - Give it "Full Access" permissions
3. **Verify Sender Email**:
   - Settings → Sender Authentication
   - Verify your email address
4. Update `SENDGRID_API_KEY` and `VERIFIED_SENDER_EMAIL` in your `.env` file

</details>

<details>
<summary><b>Google Gemini Setup (Click to expand)</b></summary>

1. **Access Google AI Studio**: [https://aistudio.google.com](https://aistudio.google.com)
2. **Generate API Key**:
   - Click "Get API Key"
   - Create a new key or use existing
3. Update `GEMINI_API_KEY` in your `.env` file

</details>

---

## 🔒 Security Best Practices

### DO ✅
- Keep the `.env` file provided by the author unchanged
- Store `.env` files securely (password manager, encrypted storage)
- Use environment variables for all sensitive data
- Revoke and regenerate keys if accidentally exposed

### DON'T ❌
- Commit `.env` files to version control
- Share `.env` files via unsecured channels
- Hard-code API keys in source code
- Push `.env` files to GitHub, GitLab, or Bitbucket

> **If you accidentally commit secrets:**
> 1. Immediately revoke the exposed keys from SendGrid/Google Cloud
> 2. Generate new keys
> 3. Update your `.env` file
> 4. Remove the commit from Git history using `git filter-branch` or BFG Repo-Cleaner

---

## 📝 Notes & Limitations

### Current Limitations
- **In-Memory Storage**: Data is not persisted. Restarting the backend clears all RFPs, vendors, and proposals.
- **Single Server Instance**: Not designed for horizontal scaling.
- **No Authentication**: Current version has no user authentication system.
- **No Domain Configuration**: Vendor email responses go to sender email (raki1432rk@gmail.com) instead of being captured automatically in the system.
- **Fixed Currency**: Budget is displayed in dollars ($) regardless of input currency (e.g., rupees). No multi-currency support.
- **Single Tenant**: One organization only - no department-level access control or multi-department management.
- **Basic Analytics**: Limited reporting and analysis capabilities.

### Planned Enhancements

#### 🎯 Phase 1: Core Infrastructure 
- [ ] **Cloud Database Integration**
  - PostgreSQL or MongoDB for persistent data storage
  - Cloud deployment on AWS/Azure/GCP
  - Automated backups and disaster recovery
  - Data encryption at rest and in transit

- [ ] **Multi-Tenant Architecture**
  - Single application for entire organization
  - Root/Top HR administrator with master access
  - Department-level isolation and management
  - Hierarchical user roles and permissions

- [ ] **Authentication & Authorization System**
  - JWT-based secure authentication
  - Role-Based Access Control (RBAC):
    - **Root Admin** - Full system access, manage all departments
    - **Department HR** - Manage department RFPs only
    - **Procurement Manager** - View and analyze procurement data
    - **Viewer** - Read-only access to specific RFPs
  - Multi-factor authentication (MFA)
  - Session management and audit logs

- [ ] **Domain Configuration**
  - Custom domain setup for email handling
  - Automatic vendor response capture via SendGrid Inbound Parse
  - Email-to-RFP matching and processing
  - Real-time proposal updates in the system

#### 📊 Phase 2: AI-Powered Analytics 
- [ ] **Comprehensive Analytics Dashboard**
  - AI-generated insights and recommendations
  - Real-time data visualization with interactive charts
  - Executive summary reports with key metrics
  - Customizable dashboard widgets

- [ ] **Cost Analysis & Optimization**
  - AI-powered cost trend analysis
  - Budget vs. actual spending comparison
  - Cost-saving recommendations
  - ROI calculations and projections
  - Historical cost pattern recognition
  - Predictive budget forecasting using ML

- [ ] **Vendor Performance Management**
  - AI-driven vendor efficiency scoring
  - Automated vendor ranking based on:
    - Response time and quality
    - Pricing competitiveness
    - Delivery performance history
    - Compliance and reliability metrics
  - Vendor recommendation engine
  - Vendor risk assessment
  - Performance trend analysis over time

- [ ] **Proposal Response Analytics**
  - Response rate tracking and analysis
  - Time-to-respond metrics
  - Proposal quality scoring
  - Win/loss analysis with AI insights
  - Response pattern identification
  - Competitive intelligence gathering

- [ ] **Procurement Intelligence**
  - Total procurement spend tracking
  - Category-wise spending analysis
  - Department-wise procurement patterns
  - Seasonal trend identification
  - Market price benchmarking
  - Spend optimization recommendations

- [ ] **Advanced Visualizations**
  - Interactive charts and graphs (Line, Bar, Pie, Heatmaps)
  - Geospatial vendor distribution maps
  - Timeline visualizations for RFP lifecycle
  - Comparison matrices for proposals
  - Drill-down capabilities for detailed analysis
  - Export to PDF/Excel/PowerPoint

#### 🛡️ Phase 3: Risk & Compliance 
- [ ] **AI-Powered Risk Analysis**
  - Vendor financial health assessment
  - Supply chain risk evaluation
  - Delivery delay prediction models
  - Price volatility analysis
  - Compliance risk scoring
  - Fraud detection algorithms
  - Automated risk alerts and notifications

- [ ] **Compliance Management**
  - Regulatory compliance tracking
  - Audit trail and documentation
  - Policy violation detection
  - Automated compliance reporting
  - Vendor certification verification

#### 💰 Phase 4: Multi-Currency & Localization
- [ ] **Multi-Currency Support**
  - Automatic currency detection from natural language input
  - Support for 150+ global currencies
  - Real-time exchange rate integration
  - Currency conversion in proposals
  - Multi-currency reporting and analytics
  - Regional pricing comparisons

- [ ] **Localization**
  - Multi-language support (English, Hindi, Spanish, etc.)
  - Regional date/time formats
  - Local tax and compliance rules
  - Country-specific vendor requirements

#### 🚀 Phase 5: Advanced Features
- [ ] **Intelligent Automation**
  - AI-powered RFP template suggestions
  - Automated vendor matching based on requirements
  - Smart email follow-ups and reminders
  - Predictive delivery date estimation
  - Auto-negotiation suggestions

- [ ] **Integration Ecosystem**
  - ERP system integration (SAP, Oracle, etc.)
  - Accounting software sync (QuickBooks, Xero)
  - CRM integration (Salesforce, HubSpot)
  - Payment gateway integration
  - E-signature integration (DocuSign, Adobe Sign)

- [ ] **Mobile Applications**
  - iOS and Android native apps
  - Push notifications for RFP updates
  - Mobile approval workflows
  - On-the-go vendor management

- [ ] **Advanced AI Features**
  - Natural language querying of data ("Show me Q3 procurement costs")
  - AI chatbot for system navigation and help
  - Automated contract generation from proposals
  - Predictive analytics for future procurement needs
  - Sentiment analysis of vendor communications

---

## 🏢 Multi-Department Architecture (Future)

### Organizational Hierarchy

```
┌─────────────────────────────────────┐
│     Root Admin / Top HR             │
│   (Master Access - Full Control)    │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┬──────────────┐
        │                   │             │              │
   ┌────▼─────┐      ┌─────▼──────┐ ┌───▼──────┐  ┌───▼──────┐
   │   IT     │      │   Finance  │ │  Sales   │  │    HR    │
   │   Dept   │      │    Dept    │ │   Dept   │  │   Dept   │
   └────┬─────┘      └─────┬──────┘ └───┬──────┘  └───┬──────┘
        │                  │             │             │
   Dept HR             Dept HR      Dept HR       Dept HR
   (Dept Access)       (Dept Access) (Dept Access) (Dept Access)
```

### Access Control Matrix

| Role | Create RFP | View All RFPs | Manage Vendors | Analytics | Audit Logs |
|------|-----------|---------------|----------------|-----------|------------|
| **Root Admin** | ✅ All Depts | ✅ All Depts | ✅ All Depts | ✅ Organization-wide | ✅ Full Access |
| **Dept HR** | ✅ Own Dept | ✅ Own Dept | ✅ Own Dept | ✅ Dept-level | ❌ No Access |
| **Procurement Manager** | ❌ No | ✅ Own Dept | ❌ No | ✅ Dept-level | ❌ No Access |
| **Viewer** | ❌ No | ✅ Assigned RFPs | ❌ No | ❌ No | ❌ No Access |

### Department Isolation
- Each department has separate RFP workspace
- Vendors can be shared organization-wide or department-specific
- Budget allocation and tracking per department
- Department-level approval workflows
- Cross-department procurement collaboration (optional)

---

## ☁️ Cloud Infrastructure (Future)

### Deployment Architecture

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼───┐     ┌────▼───┐     ┌───▼────┐
         │ App    │     │ App    │     │ App    │
         │ Server │     │ Server │     │ Server │
         │   #1   │     │   #2   │     │   #3   │
         └────┬───┘     └────┬───┘     └───┬────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼────────┐
                    │  Database       │
                    │  (PostgreSQL/   │
                    │   MongoDB)      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼───┐     ┌────▼───┐     ┌───▼────┐
         │ Redis  │     │  S3    │     │  AI    │
         │ Cache  │     │Storage │     │Services│
         └────────┘     └────────┘     └────────┘
```

### Planned Cloud Services

- **Compute**: Auto-scaling application servers
- **Database**: Managed PostgreSQL/MongoDB with read replicas
- **Storage**: Object storage (S3/Azure Blob) for documents and attachments
- **Cache**: Redis for session management and performance
- **CDN**: Global content delivery for static assets
- **Monitoring**: CloudWatch/Azure Monitor for system health
- **Logging**: Centralized log aggregation and analysis
- **Backup**: Automated daily backups with point-in-time recovery
- **Security**: WAF, DDoS protection, encryption at rest and in transit

---

## 🐛 Troubleshooting

### Backend Won't Start

**Issue**: `Error: Missing environment variables`
- **Solution**: Ensure the `.env` file is in the `backend/` directory with all required variables

**Issue**: `Port 4000 already in use`
- **Solution**: Change the `PORT` in `.env` or kill the process using port 4000:
  ```bash
  # Mac/Linux
  lsof -ti:4000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :4000
  taskkill /PID <PID> /F
  ```

### Frontend Won't Connect to Backend

**Issue**: `Network Error` or `CORS Error`
- **Solution**: Ensure backend is running on `http://localhost:4000`
- Check browser console for specific error messages

### Emails Not Sending

**Issue**: Emails not received by vendors
- **Solution**: 
  1. Check SendGrid API key is valid
  2. Verify sender email is authenticated in SendGrid
  3. Check SendGrid dashboard for delivery logs
  4. Look for errors in backend console

### AI Parsing Not Working

**Issue**: Proposals show default values instead of parsed data
- **Solution**: 
  1. Verify `GEMINI_API_KEY` is set in `.env`
  2. Check Google AI Studio for API quota/limits
  3. Review backend logs for Gemini API errors

---

## 📧 Support & Contact

For questions, issues, or feature requests:

- **Email**: rakeshhonawad46@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Rakesh-honawad/ProcureFlow-AI/issues)
- **LinkedIn**: [Rakesh Honawad](https://linkedin.com/in/rakesh-honawad)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **SendGrid** for reliable email delivery infrastructure
- **Google Gemini** for powerful AI capabilities
- **React** & **Vite** teams for excellent developer experience
- **Tailwind CSS** for beautiful, responsive design

---

<div align="center">

**Built with ❤️ by Rakesh Honawad**

⭐ Star this repo if you find it helpful!

</div>
