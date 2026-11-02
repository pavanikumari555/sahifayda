'use client';
import { useState } from 'react';
import { Car, Smartphone, TrendingDown, AlertTriangle, CheckCircle2, DollarSign, Zap } from 'lucide-react';

export default function CarVsUberCalculator({ language = 'en' }) {
  const isHi = language === 'hi';
  
  const [carPrice, setCarPrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(200000);
  const [monthlyKm, setMonthlyKm] = useState(800);
  const [currentRideSpend, setCurrentRideSpend] = useState(5000);
  const [parkingCost, setParkingCost] = useState(2000);
  const [fuelPrice, setFuelPrice] = useState(100);

  const copy = {
    en: {
      badge: 'Car vs Uber/Ola Calculator',
      title: 'Should You Buy a Car or Use Cabs and Metro?',
      subtitle: 'Estimate the cost of owning a car compared with using Uber/Ola cabs and the metro over 5 years.',
      howToLabel: 'How to use:',
      howTo: 'Enter the car price, down payment, how far you travel each month, your current Uber/Ola spend, parking cost and petrol price. The result compares the estimated monthly and 5-year cost of owning a car with using cabs and the metro.',
      inputs: {
        carPrice: 'Car on-road price',
        downPayment: 'Down payment',
        monthlyKm: 'Kilometres you travel in a month',
        currentRideSpend: 'Your monthly Uber/Ola spend on daily trips',
        parkingCost: 'Monthly parking cost',
        fuelPrice: 'Petrol price per litre (example, you can change it)'
      },
      kmUnit: 'km',
      ownership: 'Owning a car',
      ridesharing: 'Uber/Ola cabs + metro',
      breakdown: {
        emi: 'EMI (assumed 9.5% loan rate)',
        fuel: 'Petrol',
        insurance: 'Insurance (assumed)',
        maintenance: 'Maintenance + service (assumed)',
        parking: 'Parking',
        total: 'Total per month',
        fiveYearCar: '5-year total (incl. down payment)',
        fiveYear: '5-year total'
      },
      rideBreakdown: {
        daily: 'Daily Uber/Ola trips',
        metro: 'Metro pass (assumed)',
        weekend: 'Weekend cab rides (assumed)',
        total: 'Total per month'
      },
      savings: 'Estimated 5-year saving without a car',
      invested: 'If invested at an assumed 12% yearly return (returns are not guaranteed)',
      investedDetail: (amount) => `Estimated value after investing ${amount} every month for 5 years`,
      verdict: 'What these numbers suggest',
      reasons: {
        skip: 'On these numbers, cabs and metro cost less than owning a car',
        metro: 'Metro and Uber/Ola can cover most daily trips',
        invest: 'You could save or invest the monthly difference',
        flexibility: 'No parking or car upkeep to manage'
      },
      buyCar: {
        title: 'A car may make more sense if:',
        points: [
          'You drive 1,500 km or more a month',
          'You need a car for work or business',
          'You have safe parking',
          'Your family needs to travel every day'
        ]
      },
      warning: 'Costs not included here: the car losing value over time, repairs after the warranty ends, traffic fines and tolls.',
      note: 'Fixed assumptions in this calculator: 9.5% yearly car-loan interest for 5 years, 15 km per litre mileage, ₹12,000 insurance and ₹24,000 maintenance per year, a ₹1,200 metro pass and ₹3,000 of weekend cab rides per month. Your real numbers may be different.',
      disclaimer: 'This is an estimate for learning, not financial advice. Check actual costs and rates with the provider.'
    },
    hi: {
      badge: 'कार बनाम Uber/Ola कैलकुलेटर',
      title: 'कार खरीदें या कैब और मेट्रो से चलें?',
      subtitle: '5 साल में कार रखने का खर्च और Uber/Ola कैब व मेट्रो से चलने का खर्च, दोनों का अनुमान लगाकर तुलना करें।',
      howToLabel: 'कैसे इस्तेमाल करें:',
      howTo: 'कार की कीमत, डाउन पेमेंट, महीने में कितना सफ़र करते हैं, अभी Uber/Ola पर कितना खर्च होता है, पार्किंग खर्च और पेट्रोल का दाम भरें। नतीजे में कार रखने और कैब व मेट्रो से चलने का अनुमानित महीने का और 5 साल का खर्च दिखेगा।',
      inputs: {
        carPrice: 'कार की कुल कीमत (ऑन-रोड)',
        downPayment: 'डाउन पेमेंट (शुरू में दी जाने वाली रकम)',
        monthlyKm: 'महीने में कितने किलोमीटर चलते हैं',
        currentRideSpend: 'रोज़ के सफ़र पर Uber/Ola का महीने का खर्च',
        parkingCost: 'महीने का पार्किंग खर्च',
        fuelPrice: 'पेट्रोल का दाम प्रति लीटर (उदाहरण, बदल सकते हैं)'
      },
      kmUnit: 'किमी',
      ownership: 'कार रखने का खर्च',
      ridesharing: 'Uber/Ola कैब + मेट्रो',
      breakdown: {
        emi: 'EMI (9.5% ब्याज दर मानकर)',
        fuel: 'पेट्रोल',
        insurance: 'बीमा (अनुमान)',
        maintenance: 'रखरखाव + सर्विसिंग (अनुमान)',
        parking: 'पार्किंग',
        total: 'हर महीने कुल',
        fiveYearCar: '5 साल का कुल खर्च (डाउन पेमेंट सहित)',
        fiveYear: '5 साल का कुल खर्च'
      },
      rideBreakdown: {
        daily: 'रोज़ की Uber/Ola यात्राएँ',
        metro: 'मेट्रो पास (अनुमान)',
        weekend: 'हफ़्ते के आख़िर की कैब यात्राएँ (अनुमान)',
        total: 'हर महीने कुल'
      },
      savings: 'कार न लेने पर 5 साल में अनुमानित बचत',
      invested: 'अगर 12% सालाना रिटर्न मानकर निवेश करें (रिटर्न पक्का नहीं होता)',
      investedDetail: (amount) => `हर महीने ${amount}, 5 साल तक निवेश करने पर अनुमानित रकम`,
      verdict: 'ये आँकड़े क्या बताते हैं',
      reasons: {
        skip: 'इन आँकड़ों के हिसाब से कैब और मेट्रो, कार रखने से सस्ते पड़ते हैं',
        metro: 'मेट्रो और Uber/Ola से रोज़ का ज़्यादातर सफ़र हो सकता है',
        invest: 'हर महीने बचा अंतर आप जमा या निवेश कर सकते हैं',
        flexibility: 'पार्किंग और कार के रखरखाव की झंझट नहीं'
      },
      buyCar: {
        title: 'कार लेना ज़्यादा सही हो सकता है अगर:',
        points: [
          'आप महीने में 1,500 किमी या उससे ज़्यादा चलाते हैं',
          'काम या कारोबार के लिए कार चाहिए',
          'आपके पास सुरक्षित पार्किंग है',
          'परिवार को रोज़ आना-जाना होता है'
        ]
      },
      warning: 'जो खर्च यहाँ नहीं जोड़े गए: समय के साथ कार की कीमत घटना, वारंटी ख़त्म होने के बाद मरम्मत, ट्रैफ़िक जुर्माना और टोल।',
      note: 'इस कैलकुलेटर में तय मान: 5 साल के कार लोन पर 9.5% सालाना ब्याज, 15 किमी प्रति लीटर माइलेज, साल का ₹12,000 बीमा और ₹24,000 रखरखाव, हर महीने ₹1,200 का मेट्रो पास और ₹3,000 की हफ़्ते के आख़िर की कैब यात्राएँ। आपके असली आँकड़े अलग हो सकते हैं।',
      disclaimer: 'यह केवल अनुमान है, वित्तीय सलाह नहीं। असली खर्च और दरें प्रदाता से जाँचें।'
    }
  };

  const t = copy[isHi ? 'hi' : 'en'];

  // Car calculations
  const loanAmount = carPrice - downPayment;
  const loanRate = 0.095; // 9.5% per annum
  const loanTenure = 60; // 5 years
  const monthlyRate = loanRate / 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) / (Math.pow(1 + monthlyRate, loanTenure) - 1);
  
  const mileage = 15; // km per liter
  const monthlyFuel = (monthlyKm / mileage) * fuelPrice;
  const monthlyInsurance = 12000 / 12; // Annual insurance
  const monthlyMaintenance = 24000 / 12; // Annual maintenance
  
  const totalCarMonthly = emi + monthlyFuel + monthlyInsurance + monthlyMaintenance + parkingCost;
  const totalCar5Year = downPayment + (totalCarMonthly * 60);

  // Ride-sharing calculations
  const dailyUber = currentRideSpend;
  const metroPass = 1200;
  const weekendRides = 3000;
  const totalRideMonthly = dailyUber + metroPass + weekendRides;
  const totalRide5Year = totalRideMonthly * 60;

  // Savings
  const savings = totalCar5Year - totalRide5Year;
  const monthlySavings = totalCarMonthly - totalRideMonthly;
  
  // Investment calculation (12% annual return)
  const investmentReturn = monthlySavings > 0 
    ? (monthlySavings * (Math.pow(1 + 0.12/12, 60) - 1) / (0.12/12))
    : 0;

  const shouldBuyCar = monthlyKm >= 1500 || savings < 0;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' };
  const fieldWrapStyle = { display: 'flex', alignItems: 'center', border: '1px solid var(--border, #cbd5e1)', borderRadius: '8px', padding: '10px 12px', background: 'var(--surface, #fff)' };
  const innerInputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', color: 'var(--ink, #0f172a)', background: 'transparent' };

  return (
    <div className="car-uber-calculator not-prose" style={{
      maxWidth: '820px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--border, #e2e8f0)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#3b82f6',
          background: '#dbeafe',
          padding: '4px 10px',
          borderRadius: '12px',
          marginBottom: '6px'
        }}>
          <Car size={14} aria-hidden="true" /> {t.badge}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: '8px 0 0', lineHeight: '1.6' }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--muted, #64748b)', margin: '10px 0 0', lineHeight: '1.6', padding: '10px 12px', background: 'var(--soft, #f8fafc)', border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px' }}>
          <strong style={{ color: 'var(--ink, #0f172a)' }}>{t.howToLabel}</strong> {t.howTo}
        </p>
      </div>

      {/* Input Form */}
      <div style={{ display: 'grid', gap: '14px', marginBottom: '24px', background: 'var(--soft, #f8fafc)', padding: '16px', borderRadius: '10px' }}>
        {/* Car Price & Down Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              {t.inputs.carPrice}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                min="300000"
                max="5000000"
                step="50000"
                aria-label={t.inputs.carPrice}
                style={innerInputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              {t.inputs.downPayment}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min="0"
                max={carPrice * 0.5}
                step="10000"
                aria-label={t.inputs.downPayment}
                style={innerInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Monthly KM & Current Ride Spend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              {t.inputs.monthlyKm}
            </label>
            <div style={fieldWrapStyle}>
              <input
                type="number"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                min="100"
                max="5000"
                step="100"
                aria-label={t.inputs.monthlyKm}
                style={innerInputStyle}
              />
              <span style={{ color: 'var(--muted, #94a3b8)', marginLeft: '6px', fontSize: '13px' }}>{t.kmUnit}</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              {t.inputs.currentRideSpend}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={currentRideSpend}
                onChange={(e) => setCurrentRideSpend(Number(e.target.value))}
                min="0"
                max="50000"
                step="500"
                aria-label={t.inputs.currentRideSpend}
                style={innerInputStyle}
              />
            </div>
          </div>
        </div>

        {/* Parking & Fuel Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              {t.inputs.parkingCost}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={parkingCost}
                onChange={(e) => setParkingCost(Number(e.target.value))}
                min="0"
                max="10000"
                step="500"
                aria-label={t.inputs.parkingCost}
                style={innerInputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              {t.inputs.fuelPrice}
            </label>
            <div style={fieldWrapStyle}>
              <span style={{ color: 'var(--muted, #94a3b8)', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                min="80"
                max="200"
                step="5"
                aria-label={t.inputs.fuelPrice}
                style={innerInputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Car Ownership */}
        <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)', border: '2px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#991b1b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Car size={16} aria-hidden="true" /> {t.ownership}
          </h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.breakdown.emi}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(emi)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.breakdown.fuel}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(monthlyFuel)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.breakdown.insurance}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(monthlyInsurance)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.breakdown.maintenance}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(monthlyMaintenance)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.breakdown.parking}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(parkingCost)}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #fca5a5', paddingTop: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#991b1b' }}>{t.breakdown.total}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#dc2626' }}>{formatMoney(totalCarMonthly)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>{t.breakdown.fiveYearCar}:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b' }}>{formatMoney(totalCar5Year)}</span>
            </div>
          </div>
        </div>

        {/* Ride-Sharing */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#166534', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={16} aria-hidden="true" /> {t.ridesharing}
          </h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.rideBreakdown.daily}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(dailyUber)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.rideBreakdown.metro}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(metroPass)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>{t.rideBreakdown.weekend}:</span>
              <span style={{ fontWeight: '600', color: '#334155' }}>{formatMoney(weekendRides)}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #86efac', paddingTop: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>{t.rideBreakdown.total}:</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#16a34a' }}>{formatMoney(totalRideMonthly)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>{t.breakdown.fiveYear}:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#166534' }}>{formatMoney(totalRide5Year)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Highlight */}
      {savings > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
          border: '2px solid #fde047',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingDown size={24} style={{ color: '#ca8a04' }} aria-hidden="true" />
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#854d0e' }}>{t.savings}</span>
            </div>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#ca8a04' }}>{formatMoney(savings)}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={16} style={{ color: '#16a34a' }} aria-hidden="true" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>{t.invested}</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{formatMoney(investmentReturn)}</span>
            <p style={{ fontSize: '11px', color: '#65a30d', margin: '6px 0 0', lineHeight: '1.5' }}>
              {t.investedDetail(formatMoney(monthlySavings))}
            </p>
          </div>
        </div>
      )}

      {/* Verdict */}
      <div style={{
        background: shouldBuyCar ? '#fef3c7' : '#dcfce7',
        border: `2px solid ${shouldBuyCar ? '#fde047' : '#86efac'}`,
        borderRadius: '12px',
        padding: '18px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: shouldBuyCar ? '#854d0e' : '#166534', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={20} aria-hidden="true" /> {t.verdict}
        </h3>
        {!shouldBuyCar ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {Object.values(t.reasons).map((reason, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} aria-hidden="true" />
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>{reason}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#854d0e', marginBottom: '12px' }}>{t.buyCar.title}</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {t.buyCar.points.map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: '#ca8a04' }} aria-hidden="true" />
                  <span style={{ fontSize: '12px', color: '#713f12' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Warning */}
      <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#991b1b', margin: 0 }}>
          <strong>{t.warning}</strong>
        </p>
      </div>

      {/* Note */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--muted, #64748b)', margin: '0', padding: '12px', background: 'var(--soft, #f8fafc)', borderRadius: '6px' }}>
        💡 {t.note}
      </p>

      {/* Disclaimer */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: 'var(--muted, #64748b)', margin: '10px 0 0' }}>
        {t.disclaimer}
      </p>
    </div>
  );
}
