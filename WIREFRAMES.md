# DigiRation PWA - Mobile-First Wireframes

## 1. Ration ID Registration

### Layout Structure:
```
┌─────────────────────────────────┐
│        DigiRation              │ Header (60px)
│    Ration Shop App             │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 Welcome to DigiRation   │ │ Welcome Card (120px)
│ │                             │ │
│ │  Get started by entering    │ │
│ │  your Ration Card ID        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Ration Card ID *           │ │ Input Field (60px)
│ │  [RC1234567890        ]     │ │
│ │  Enter your 10-digit ID     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 Mobile Number *         │ │ Input Field (60px)
│ │  [+91 98765 43210     ]     │ │
│ │  Linked to ration card      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [✓] I agree to terms      │ │ Checkbox (40px)
│ │  and privacy policy         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [📤 Send OTP]              │ │ Primary Button (56px)
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Need help? Contact support │ │ Help Link (40px)
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Components:
- **Welcome Card**: App introduction and purpose
- **Ration ID Input**: 10-digit validation with formatting
- **Mobile Number Input**: Country code + number validation
- **Terms Checkbox**: Required agreement
- **Send OTP Button**: Primary action, disabled until valid inputs
- **Help Link**: Support contact information

---

## 2. OTP Verification

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Verify Mobile Number        │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 OTP Sent!               │ │ Status Card (100px)
│ │                             │ │
│ │  We've sent a 6-digit code  │ │
│ │  to +91 98765 43210         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Enter OTP *                │ │ OTP Input (80px)
│ │  [1] [2] [3] [4] [5] [6]    │ │
│ │  Individual digit boxes     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  ⏱️ Resend OTP in 30s       │ │ Timer (40px)
│ │  [Resend Code]              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [✓] Verify & Continue      │ │ Verify Button (56px)
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Didn't receive OTP?        │ │ Help Section (60px)
│ │  • Check SMS folder         │ │
│ │  • Verify mobile number     │ │
│ │  • Contact support          │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Components:
- **Status Card**: Confirmation of OTP sent
- **OTP Input**: 6 individual digit boxes with auto-focus
- **Resend Timer**: Countdown with resend option
- **Verify Button**: Only enabled when all digits entered
- **Help Section**: Troubleshooting options

---

## 3. Family Member Selection & Verification

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Select Your Profile         │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👨‍👩‍👧‍👦 Kumar Family          │ │ Family Header (80px)
│ │  Ration Card: RC1234567890  │ │
│ │  4 family members           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Rajesh Kumar (45, M)    │ │ Member Card (100px)
│ │  Head of Family             │ │
│ │  [Select] [✓ Verified]      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Priya Kumar (42, F)     │ │ Member Card (100px)
│ │  Spouse                     │ │
│ │  [Select] [⚠️ Pending]      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Arjun Kumar (18, M)     │ │ Member Card (100px)
│ │  Son                        │ │
│ │  [Select] [❌ Not Verified] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Meera Kumar (15, F)     │ │ Member Card (100px)
│ │  Daughter                   │ │
│ │  [Select] [❌ Not Verified] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [✓] Continue to Verification│ │ Continue Button (56px)
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Components:
- **Family Header**: Family name, ration card, member count
- **Member Cards**: Avatar, name, age, gender, role, verification status
- **Selection Buttons**: Choose which member you are
- **Verification Status**: ✓ Verified, ⚠️ Pending, ❌ Not Verified
- **Continue Button**: Proceed to ID verification

---

## 4. Government ID Verification

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Verify Your Identity        │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🆔 Identity Verification   │ │ Header Card (100px)
│ │                             │ │
│ │  Please verify your identity│ │
│ │  using a government ID      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 Aadhaar Card            │ │ ID Option (80px)
│ │  [📷 Scan QR Code]          │ │
│ │  [📝 Enter Aadhaar Number]  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🆔 PAN Card                │ │ ID Option (80px)
│ │  [📷 Scan QR Code]          │ │
│ │  [📝 Enter PAN Number]      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🆔 Voter ID                │ │ ID Option (80px)
│ │  [📷 Scan QR Code]          │ │
│ │  [📝 Enter Voter ID]        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📋 Driver's License        │ │ ID Option (80px)
│ │  [📷 Scan QR Code]          │ │
│ │  [📝 Enter License Number]  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [✓] Complete Verification  │ │ Verify Button (56px)
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Components:
- **Header Card**: Explanation of verification process
- **ID Options**: Multiple government ID types
- **Scan Options**: QR code scanning for each ID type
- **Manual Entry**: Alternative to scanning
- **Verify Button**: Complete the verification process

---

## 5. Verification Success & Home Screen

### Layout Structure:
```
┌─────────────────────────────────┐
│ [☰] DigiRation        [🔔] [👤] │ Header (44px)
├─────────────────────────────────┤
│                                 │
│    Welcome back, [Family Name]  │ Welcome Message (24px)
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Ration Card ID: RC123456   │ │ Card Display (80px)
│ │  Family: Kumar Family       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 Scan QR Code           │ │ Primary CTA (56px)
│ │  Tap to scan dealer QR     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📊 Quick Stats            │ │ Stats Cards (120px)
│ │  This Month: 3/4 items     │ │
│ │  Remaining: ₹450           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📋 Recent Transactions    │ │ Recent Activity (100px)
│ │  Rice - 2 days ago         │ │
│ │  Wheat - 1 week ago        │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav (60px)
└─────────────────────────────────┘
```

### Components:
- **Header**: Logo, notifications, profile icon
- **Welcome Card**: Family name, ration card ID
- **Primary CTA**: Large, prominent scan button
- **Stats Cards**: Monthly usage summary
- **Recent Activity**: Last 2-3 transactions
- **Bottom Navigation**: 4 main sections

---

## 2. Family Member Selection

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Select Family Member        │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Rajesh Kumar (45, M)    │ │ Member Card (80px)
│ │  Head of Family             │ │
│ │  [✓ Verified]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Priya Kumar (42, F)     │ │ Member Card (80px)
│ │  Spouse                     │ │
│ │  [✓ Verified]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Arjun Kumar (18, M)     │ │ Member Card (80px)
│ │  Son                        │ │
│ │  [⚠️ Verification Pending]  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Meera Kumar (15, F)     │ │ Member Card (80px)
│ │  Daughter                   │ │
│ │  [✓ Verified]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [✓] Select & Continue      │ │ Selection Button (56px)
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Member Cards**: Avatar, name, age, gender, role, verification status
- **Verification Badges**: ✓ Verified, ⚠️ Pending, ❌ Failed
- **Selection Button**: Only enabled when member selected
- **Scrollable List**: For families with many members

---

## 3. Available Stocks

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Available Stocks            │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🍚 Rice (Basmati)          │ │ Stock Item (100px)
│ │  Shop Stock: 50kg           │ │
│ │  Your Quota: 10kg/month     │ │
│ │  Used: 7kg | Remaining: 3kg │ │
│ │  [🟢 Available]             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🌾 Wheat (Whole)           │ │ Stock Item (100px)
│ │  Shop Stock: 30kg           │ │
│ │  Your Quota: 8kg/month      │ │
│ │  Used: 8kg | Remaining: 0kg │ │
│ │  [🔴 Quota Exhausted]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🫒 Cooking Oil             │ │ Stock Item (100px)
│ │  Shop Stock: 0L             │ │
│ │  Your Quota: 2L/month       │ │
│ │  Used: 0L | Remaining: 2L   │ │
│ │  [🔴 Out of Stock]          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🧂 Salt (Iodized)          │ │ Stock Item (100px)
│ │  Shop Stock: 25kg           │ │
│ │  Your Quota: 1kg/month      │ │
│ │  Used: 0.5kg | Remaining: 0.5kg │
│ │  [🟢 Available]             │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Stock Cards**: Item icon, name, shop stock, personal quota, usage, status
- **Status Indicators**: 🟢 Available, 🟡 Low Stock, 🔴 Out of Stock/Quota Exhausted
- **Progress Bars**: Visual representation of quota usage
- **Filter Options**: Available, Out of Stock, All Items

---

## 4. Transaction History

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Transaction History         │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📅 December 2023           │ │ Month Header (40px)
│ │  ┌─────────────────────────┐ │ │
│ │  │ 🍚 Rice - 5kg           │ │ │ Transaction (60px)
│ │  │ Dec 15, 2023 | 2:30 PM  │ │ │
│ │  │ Rajesh Kumar | Shop A   │ │ │
│ │  │ [✅ Completed]          │ │ │
│ │  └─────────────────────────┘ │ │
│ │  ┌─────────────────────────┐ │ │
│ │  │ 🌾 Wheat - 8kg          │ │ │ Transaction (60px)
│ │  │ Dec 10, 2023 | 11:15 AM │ │ │
│ │  │ Priya Kumar | Shop A    │ │ │
│ │  │ [✅ Completed]          │ │ │
│ │  └─────────────────────────┘ │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📅 November 2023           │ │ Month Header (40px)
│ │  ┌─────────────────────────┐ │ │
│ │  │ 🫒 Oil - 2L             │ │ │ Transaction (60px)
│ │  │ Nov 28, 2023 | 4:45 PM  │ │ │
│ │  │ Rajesh Kumar | Shop A   │ │ │
│ │  │ [✅ Completed]          │ │ │
│ │  └─────────────────────────┘ │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Month Headers**: Group transactions by month
- **Transaction Cards**: Item, quantity, date/time, member, shop, status
- **Status Badges**: ✅ Completed, ⏳ Pending, ❌ Failed
- **Search/Filter**: By date range, item type, member
- **Pull to Refresh**: For updating transaction list

---

## 5. QR Code Scanner

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Scan QR Code                │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │                             │ │
│ │        📷 Camera View       │ │ Camera View (300px)
│ │                             │ │
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 Point camera at QR code │ │ Instructions (60px)
│ │  on dealer's machine        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  💡 Can't scan?             │ │ Help Button (40px)
│ │  Enter code manually        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [📸 Flash] [🔄 Switch]     │ │ Camera Controls (60px)
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Camera View**: Full-screen camera preview
- **Scanning Overlay**: Target frame for QR code
- **Instructions**: Clear guidance for users
- **Camera Controls**: Flash toggle, camera switch
- **Manual Entry**: Fallback option for QR scanning issues

---

## 6. Waiting for Dealer

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Transaction in Progress     │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │        ⏳ Waiting...        │ │ Loading Animation (200px)
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Waiting for dealer to     │ │ Status Message (80px)
│ │  confirm your transaction   │ │
│ │                             │ │
│ │  Transaction ID: TXN123456  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Selected Member:        │ │ Member Info (60px)
│ │  Rajesh Kumar               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [❌ Cancel Transaction]    │ │ Cancel Button (56px)
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Loading Animation**: Spinner or progress indicator
- **Status Message**: Clear explanation of current state
- **Transaction ID**: For reference and support
- **Member Info**: Confirmation of selected member
- **Cancel Option**: Allow user to abort transaction

---

## 7. Profile & Settings

### Layout Structure:
```
┌─────────────────────────────────┐
│ [←] Profile & Settings          │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │  👤 Rajesh Kumar            │ │ Profile Header (100px)
│ │  RC123456 | Head of Family  │ │
│ │  📧 rajesh@email.com        │ │
│ │  📱 +91 98765 43210         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  ⚙️ Account Settings        │ │ Settings Section (60px)
│ │  Edit personal details      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🔔 Notifications           │ │ Settings Section (60px)
│ │  Transaction alerts         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🌙 Theme                   │ │ Settings Section (60px)
│ │  Light / Dark mode          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📱 About App               │ │ Settings Section (60px)
│ │  Version 1.0.0              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  [🚪 Logout]                │ │ Logout Button (56px)
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📦] [📜] [👤]            │ Bottom Nav
└─────────────────────────────────┘
```

### Components:
- **Profile Header**: User info, contact details
- **Settings Sections**: Account, notifications, theme, about
- **Toggle Switches**: For notification preferences
- **Logout Button**: Prominent, with confirmation dialog

---

## Design Principles

### Mobile-First Approach:
- **Touch Targets**: Minimum 44px for all interactive elements
- **Thumb-Friendly**: Primary actions within thumb reach
- **One-Handed Use**: Critical functions accessible with one hand
- **Large Text**: Minimum 16px font size for readability

### Accessibility:
- **High Contrast**: Sufficient color contrast ratios
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Indicators**: Clear focus states for all elements

### Performance:
- **Lazy Loading**: Images and components loaded on demand
- **Optimized Images**: WebP format with fallbacks
- **Minimal Bundle**: Code splitting and tree shaking
- **Offline Support**: Service worker for offline functionality

### Responsive Design:
- **Breakpoints**: 320px (mobile), 768px (tablet), 1024px (desktop)
- **Flexible Layouts**: CSS Grid and Flexbox
- **Scalable Typography**: Relative units (rem, em)
- **Adaptive Images**: Responsive images with srcset
