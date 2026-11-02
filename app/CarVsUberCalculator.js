'use client';
import { useState } from 'react';
import { Car, Smartphone, TrendingDown, AlertTriangle, CheckCircle2, DollarSign, Zap, ArrowRight } from 'lucide-react';
import SocialProofCounter from './SocialProofCounter';

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
      title: 'Should You Buy a Car or Use Ride-Sharing?',
      subtitle: 'Calculate the TRUE cost of car ownership vs Uber/Ola + Metro over 5 years',
      inputs: {
        carPrice: 'Car on-road price',
        downPayment: 'Down payment (20-30%)',
        monthlyKm: 'Monthly kilometers needed',
        currentRideSpend: 'Current Uber/Ola per month',
        parkingCost: 'Monthly parking cost',
        fuelPrice: 'Petrol price per liter'
      },
      ownership: 'CAR OWNERSHIP (5 Years)',
      ridesharing: 'RIDE-SHARING + METRO',
      breakdown: {
        emi: 'EMI',
        fuel: 'Petrol',
        insurance: 'Insurance',
        maintenance: 'Maintenance + Service',
        parking: 'Parking',
        total: 'Total per month',
        fiveYear: '5-Year Total Cost'
      },
      rideBreakdown: {
        daily: 'Daily Uber (20 days)',
        metro: 'Metro pass',
        weekend: 'Weekend long rides',
        total: 'Total per month'
      },
      savings: 'TOTAL SAVINGS',
      invested: 'If Invested @ 12% Return',
      verdict: 'VERDICT',
      reasons: {
        skip: 'Skip the car, build wealth instead',
        metro: 'Use Metro + Uber = Stress-free',
        invest: 'Invest the EMI difference',
        flexibility: 'No parking, maintenance headaches'
      },
      buyCar: {
        title: 'Buy the Car if:',
        points: [
          'You drive 1,500+ km/month',
          'Need car for work/business',
          'Have secure parking',
          'Family requires daily travel'
        ]
      },
      warning: 'Hidden car costs: depreciation ₹2-3L/year, repairs after warranty, traffic fines, toll charges',
      note: 'This calculator assumes 9.5% car loan interest, 15 km/liter mileage, ₹12,000 annual insurance, ₹24,000 annual maintenance'
    },
    hi: {
      badge: 'कार बनाम Uber/Ola कैलकुलेटर',
      title: 'कार खरीदें या Ride-Sharing इस्तेमाल करें?',
      subtitle: '5 साल में कार की असली लागत vs Uber/Ola + मेट्रो की तुलना करें',
      inputs: {
        carPrice: 'कार की ऑन-रोड कीमत',
        downPayment: 'डाउन पेमेंट (20-30%)',
        monthlyKm: 'महीने में कितने किलोमीटर',
        currentRideSpend: 'अभी Uber/Ola में खर्च',
        parkingCost: 'महीने की पार्किंग लागत',
        fuelPrice: 'पेट्रोल की कीमत प्रति लीटर'
      },
      ownership: 'कार का स्वामित्व (5 साल)',
      ridesharing: 'RIDE-SHARING + मेट्रो',
      breakdown: {
        emi: 'EMI',
        fuel: 'पेट्रोल',
        insurance: 'बीमा',
        maintenance: 'मेंटेनेंस + सर्विस',
        parking: 'पार्किंग',
        total: 'प्रति माह कुल',
        fiveYear: '5 साल का कुल खर्च'
      },
      rideBreakdown: {
        daily: 'रोज़ Uber (20 दिन)',
        metro: 'मेट्रो पास',
        weekend: 'वीकएंड लंबी राइड',
        total: 'प्रति माह कुल'
      },
      savings: 'कुल बचत',
      invested: '12% रिटर्न पर निवेश करने से',
      verdict: 'निष्कर्ष',
      reasons: {
        skip: 'कार छोड़ें, संपत्ति बनाएँ',
        metro: 'मेट्रो + Uber = तनाव-मुक्त',
        invest: 'EMI के अंतर को निवेश करें',
        flexibility: 'पार्किंग, मेंटेनेंस की चिंता नहीं'
      },
      buyCar: {
        title: 'कार खरीदें अगर:',
        points: [
          'आप 1,500+ किमी/माह चलाते हैं',
          'काम/व्यवसाय के लिए कार चाहिए',
          'सुरक्षित पार्किंग है',
          'परिवार को रोज़ यात्रा चाहिए'
        ]
      },
      warning: 'छिपी लागतें: मूल्य ह्रास ₹2-3L/साल, वारंटी के बाद मरम्मत, ट्रैफ़िक जुर्माना, टोल शुल्क',
      note: 'यह कैलकुलेटर 9.5% कार लोन ब्याज, 15 किमी/लीटर माइलेज, ₹12,000 वार्षिक बीमा, ₹24,000 वार्षिक रखरखाव मानता है'
    }
  };

  const t = copy[language];

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

  return (
    <div className="car-uber-calculator not-prose" style={{
      maxWidth: '820px',
      margin: '0 auto',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--line, #e2e8f0)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Social Proof Counter */}
      <SocialProofCounter calculatorType="car_vs_uber" trackUsage={true} />
      
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
          <Car size={14} /> {t.badge}
        </span>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0f172a)', margin: '4px 0' }}>
          {t.title}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted, #64748b)', margin: '8px 0 0', lineHeight: '1.6' }}>
          {t.subtitle}
        </p>
      </div>

      {/* Input Form */}
      <div style={{ display: 'grid', gap: '14px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
        {/* Car Price & Down Payment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.carPrice}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                min="300000"
                max="5000000"
                step="50000"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.downPayment}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min="0"
                max={carPrice * 0.5}
                step="10000"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>
        </div>

        {/* Monthly KM & Current Ride Spend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.monthlyKm}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <input
                type="number"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(Number(e.target.value))}
                min="100"
                max="5000"
                step="100"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
              <span style={{ color: '#94a3b8', marginLeft: '6px', fontSize: '13px' }}>km</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.currentRideSpend}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={currentRideSpend}
                onChange={(e) => setCurrentRideSpend(Number(e.target.value))}
                min="0"
                max="50000"
                step="500"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>
        </div>

        {/* Parking & Fuel Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.parkingCost}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={parkingCost}
                onChange={(e) => setParkingCost(Number(e.target.value))}
                min="0"
                max="10000"
                step="500"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink, #334155)', display: 'block', marginBottom: '6px' }}>
              {t.inputs.fuelPrice}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', background: '#fff' }}>
              <span style={{ color: '#94a3b8', marginRight: '6px' }}>₹</span>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                min="80"
                max="200"
                step="5"
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600' }}
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
            <Car size={16} /> {t.ownership}
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
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}>{t.breakdown.fiveYear}:</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b' }}>{formatMoney(totalCar5Year)}</span>
            </div>
          </div>
        </div>

        {/* Ride-Sharing */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#166534', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={16} /> {t.ridesharing}
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
              <TrendingDown size={24} style={{ color: '#ca8a04' }} />
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#854d0e' }}>{t.savings}</span>
            </div>
            <span style={{ fontSize: '28px', fontWeight: '900', color: '#ca8a04' }}>{formatMoney(savings)}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>{t.invested}</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{formatMoney(investmentReturn)}</span>
            <p style={{ fontSize: '11px', color: '#65a30d', margin: '6px 0 0', lineHeight: '1.5' }}>
              {isHi ? `महीने ${formatMoney(monthlySavings)} निवेश करने पर 5 साल में कुल कॉर्पस` : `Invest ${formatMoney(monthlySavings)}/month for 5 years`}
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
          <DollarSign size={20} /> {t.verdict}
        </h3>
        {!shouldBuyCar ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {Object.values(t.reasons).map((reason, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
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
                  <CheckCircle2 size={16} style={{ color: '#ca8a04' }} />
                  <span style={{ fontSize: '12px', color: '#713f12' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Warning */}
      <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#991b1b', margin: 0 }}>
          <strong>⚠️ {t.warning}</strong>
        </p>
      </div>

      {/* Note */}
      <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#64748b', margin: '0', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
        💡 {t.note}
      </p>
    </div>
  );
}
