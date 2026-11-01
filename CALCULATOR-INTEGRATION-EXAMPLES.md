# Smart Card Calculator - Quick Integration Examples

## Quick Start: 3 Steps to Monetize

### Step 1: Import the Component

```javascript
import SmartCardOfferCalculator from '../SmartCardOfferCalculator';
```

### Step 2: Add to Your Page

```javascript
<SmartCardOfferCalculator />
```

### Step 3: Update Affiliate Links (One-Time Setup)

See [SMART-CARD-CALCULATOR-GUIDE.md](./SMART-CARD-CALCULATOR-GUIDE.md) for details.

---

## 🎯 Real-World Integration Examples

### Example 1: Credit Card Comparison Guide (English)

```javascript
// app/guides/[slug]/page.js (when slug === 'credit-cards')

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

export default function CreditCardGuide() {
  return (
    <article className="guide-article">
      <h1>Best Credit Cards for Online Shopping 2026</h1>
      
      <p>
        Choosing the right credit card can save you ₹1,500 to ₹2,500 on every 
        major purchase. Use our calculator to find which card gives you maximum 
        cashback and instant discounts:
      </p>

      <SmartCardOfferCalculator 
        initialPrice={30000}
        initialCategory="mobile"
        language="en"
      />

      <h2>How Credit Card Cashback Works</h2>
      <p>When you shop with a cashback credit card...</p>

      <h2>5 Best Cards Compared</h2>
      
      <h3>1. Amazon Pay ICICI Bank Card</h3>
      <p>The Amazon Pay ICICI credit card is completely free...</p>
      <ul>
        <li>5% unlimited cashback on Amazon</li>
        <li>1% cashback everywhere else</li>
        <li>₹0 annual fee (lifetime free)</li>
      </ul>

      <h3>2. SBI Cashback Card</h3>
      <p>Best for those who shop across multiple platforms...</p>

      {/* More detailed content */}
    </article>
  );
}
```

### Example 2: Hindi Mobile Shopping Guide

```javascript
// app/hi/guides/[slug]/page.js (when slug === 'mobile-kharidna')

import SmartCardOfferCalculator from '../../../SmartCardOfferCalculator';

export default function MobileShoppingGuideHi() {
  return (
    <article className="guide-article">
      <h1>मोबाइल खरीदते समय कौन-सा क्रेडिट कार्ड इस्तेमाल करें?</h1>
      
      <p>
        नया स्मार्टफोन खरीदने जा रहे हैं? सही क्रेडिट कार्ड चुनकर ₹1,500 से 
        ₹2,000 तक की सीधी बचत कर सकते हैं। अपने बजट के अनुसार कैलकुलेटर में 
        कीमत डालकर देखें:
      </p>

      <SmartCardOfferCalculator 
        initialPrice={25000}
        initialCategory="mobile"
        language="hi"
      />

      <h2>क्रेडिट कार्ड से कैशबैक कैसे मिलता है?</h2>
      <p>जब आप कैशबैक क्रेडिट कार्ड से खरीदारी करते हैं...</p>

      <h2>Top 3 कार्ड मोबाइल खरीद के लिए</h2>
      
      <h3>1. Amazon Pay ICICI बैंक कार्ड</h3>
      <ul>
        <li>Amazon पर 5% अनलिमिटेड कैशबैक</li>
        <li>बाकी जगह 1% कैशबैक</li>
        <li>₹0 सालाना फीस (लाइफटाइम फ्री)</li>
      </ul>

      {/* More Hindi content */}
    </article>
  );
}
```

### Example 3: Laptop Buying Guide with Higher Budget

```javascript
// app/guides/laptop-buying/page.js

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

export default function LaptopBuyingGuide() {
  return (
    <article>
      <h1>Laptop Buying Guide: Best Cards for ₹40K-₹80K Budget</h1>
      
      <p>
        Planning to buy a laptop? The right credit card can save you ₹2,000 to 
        ₹4,000 through cashback and bank sale discounts. Plus, you can convert 
        it to No-Cost EMI:
      </p>

      <SmartCardOfferCalculator 
        initialPrice={55000}
        initialCategory="laptop"
        language="en"
      />

      <h2>Best Time to Buy Laptops</h2>
      <p>
        Amazon and Flipkart sales (Prime Day, Big Billion Days) offer additional 
        10% instant bank discounts when you use specific credit cards...
      </p>

      <h2>No-Cost EMI: How It Really Works</h2>
      <p>
        Many people think No-Cost EMI is free, but there's a hidden discount you 
        lose. Here's how banks structure it...
      </p>
    </article>
  );
}
```

### Example 4: TV/Appliance Guide with Merchant Selection

```javascript
// app/guides/appliance-shopping/page.js

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

export default function ApplianceGuide() {
  return (
    <article>
      <h1>Best Credit Cards for TV, AC, and Washing Machine Purchase</h1>
      
      <p>
        Large appliances are expensive, but choosing the right credit card and 
        shopping platform can save you ₹3,000 to ₹5,000:
      </p>

      <SmartCardOfferCalculator 
        initialPrice={45000}
        initialCategory="appliance"
        language="en"
      />

      <div className="buying-tips">
        <h3>💡 Pro Tips:</h3>
        <ul>
          <li>
            <strong>Amazon vs Flipkart:</strong> Use the calculator to compare 
            which platform gives better savings with your card
          </li>
          <li>
            <strong>Festive Sales:</strong> HDFC Millennia often has additional 
            10% instant discount during sales
          </li>
          <li>
            <strong>No-Cost EMI:</strong> Available on purchases above ₹10,000 
            with most cards
          </li>
        </ul>
      </div>

      <h2>When to Use Which Card</h2>
      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Best Card</th>
            <th>Expected Savings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Buying on Amazon</td>
            <td>Amazon Pay ICICI</td>
            <td>5% unlimited cashback</td>
          </tr>
          <tr>
            <td>Buying on Flipkart</td>
            <td>Flipkart Axis</td>
            <td>5% + sale discounts</td>
          </tr>
          <tr>
            <td>During bank sale</td>
            <td>HDFC Millennia</td>
            <td>Up to 10% instant</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
```

### Example 5: Budget Shopping Guide (General Category)

```javascript
// app/guides/budget-shopping/page.js

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

export default function BudgetShoppingGuide() {
  return (
    <article>
      <h1>Smart Shopping on a Budget: Maximize Every Rupee</h1>
      
      <p>
        Whether you're buying clothes, books, or household items, the right 
        credit card ensures you never pay full price:
      </p>

      <SmartCardOfferCalculator 
        initialPrice={15000}
        initialCategory="general"
        language="en"
      />

      <h2>Best Cards for Different Spending Levels</h2>
      
      <h3>Under ₹25,000/month: SBI Cashback</h3>
      <p>
        If your monthly online spending is under ₹25,000, the SBI Cashback card 
        is perfect. You get 5% cashback on all online purchases (Amazon, Flipkart, 
        Swiggy, Zomato, bill payments, etc.) up to ₹5,000 cashback per month.
      </p>

      <h3>Heavy Amazon Shopper: Amazon ICICI</h3>
      <p>
        If 70%+ of your shopping is on Amazon, get the Amazon Pay ICICI card. 
        It's lifetime free and gives unlimited 5% cashback on Amazon with no 
        monthly cap.
      </p>
    </article>
  );
}
```

### Example 6: Dynamic Integration Based on URL Parameter

```javascript
// app/products/[category]/page.js

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

const categoryConfig = {
  smartphones: { price: 25000, category: 'mobile' },
  laptops: { price: 55000, category: 'laptop' },
  tvs: { price: 45000, category: 'appliance' },
  'washing-machines': { price: 30000, category: 'appliance' },
  default: { price: 20000, category: 'general' }
};

export default function ProductCategoryPage({ params }) {
  const config = categoryConfig[params.category] || categoryConfig.default;
  
  return (
    <div className="product-category-page">
      <h1>Best Deals on {params.category}</h1>
      
      <section>
        <h2>Calculate Your Savings</h2>
        <p>
          Find out which credit card will save you the most on your {params.category} 
          purchase:
        </p>
        
        <SmartCardOfferCalculator 
          initialPrice={config.price}
          initialCategory={config.category}
          language="en"
        />
      </section>

      <section>
        <h2>Featured {params.category}</h2>
        {/* Product listings */}
      </section>
    </div>
  );
}
```

### Example 7: Seasonal Sale Page

```javascript
// app/sale/diwali-2026/page.js

import SmartCardOfferCalculator from '../../SmartCardOfferCalculator';

export default function DiwaliSalePage() {
  return (
    <div className="sale-page">
      <div className="sale-hero">
        <h1>🪔 Diwali Sale 2026: Best Card Offers</h1>
        <p>Stack credit card cashback with sale discounts!</p>
      </div>

      <section className="calculator-section">
        <h2>Calculate Total Savings (Sale Discount + Card Cashback)</h2>
        
        <SmartCardOfferCalculator 
          initialPrice={40000}
          initialCategory="mobile"
          language="en"
        />
        
        <div className="sale-notice">
          <strong>🎯 Pro Tip:</strong> During Diwali sales, HDFC Millennia and 
          HDFC Regalia often have additional 10% instant discount offers. Check 
          the calculator above to see your potential savings!
        </div>
      </section>

      <section>
        <h2>Top Deals by Category</h2>
        {/* Sale items */}
      </section>
    </div>
  );
}
```

---

## 🎨 Styling Integration

### Using with Your Existing Theme

The calculator respects CSS variables from your theme:

```css
/* Your globals.css or theme file */
:root {
  --surface: #ffffff;
  --bg: #f8fafc;
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
}

/* Dark mode support */
[data-theme="dark"] {
  --surface: #1e293b;
  --bg: #0f172a;
  --ink: #f1f5f9;
  --muted: #94a3b8;
  --line: #334155;
}
```

### Adding Custom Wrapper Styles

```javascript
<div className="calculator-wrapper">
  <SmartCardOfferCalculator />
</div>

<style jsx>{`
  .calculator-wrapper {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
  }
  
  @media (max-width: 768px) {
    .calculator-wrapper {
      padding: 0 16px;
      margin: 24px auto;
    }
  }
`}</style>
```

---

## 📊 A/B Testing Ideas

### Test 1: Default Price Points

```javascript
// Version A: Lower entry price
<SmartCardOfferCalculator initialPrice={20000} />

// Version B: Mid-range price
<SmartCardOfferCalculator initialPrice={35000} />
```

Test which default gets more engagement and card applications.

### Test 2: Merchant Pre-selection

```javascript
// Auto-select based on page context
const merchant = pageUrl.includes('amazon') ? 'amazon' : 
                 pageUrl.includes('flipkart') ? 'flipkart' : 'any';

<SmartCardOfferCalculator 
  merchant={merchant}  // Note: You'd need to add this prop
/>
```

### Test 3: Placement

```javascript
// Top of article (immediate engagement)
<article>
  <h1>Guide Title</h1>
  <SmartCardOfferCalculator />
  <p>Content starts here...</p>
</article>

// vs

// After first few paragraphs (contextual placement)
<article>
  <h1>Guide Title</h1>
  <p>Introduction paragraph...</p>
  <p>Context paragraph...</p>
  <SmartCardOfferCalculator />
  <p>Rest of content...</p>
</article>
```

---

## 🚀 Next Steps

1. **Install** the component in your project
2. **Update** Amazon affiliate tag (line ~121 in component)
3. **Create** card guide landing pages with actual bank referral links
4. **Integrate** calculator into 3-5 high-traffic guide pages
5. **Monitor** performance using analytics
6. **Optimize** based on conversion data

---

## 📞 Quick Reference

| Use Case | Initial Price | Category | Language |
|----------|---------------|----------|----------|
| Budget phone guide | 15000 | mobile | en/hi |
| Mid-range phone | 30000 | mobile | en/hi |
| Laptop guide | 50000-70000 | laptop | en |
| TV/AC/Fridge | 40000-60000 | appliance | en/hi |
| General shopping | 20000 | general | en/hi |

---

**Need Help?** Check [SMART-CARD-CALCULATOR-GUIDE.md](./SMART-CARD-CALCULATOR-GUIDE.md) for detailed documentation.
