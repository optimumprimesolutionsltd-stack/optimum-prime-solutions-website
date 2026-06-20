import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Users, MapPin, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ROICalculator() {
  const [users, setUsers] = useState(1);
  const [locations, setLocations] = useState(1);
  const [revenue, setRevenue] = useState(5); // In Millions KES

  const recommendation = useMemo(() => {
    if (users > 2 || locations > 1 || revenue > 10) {
      return {
        edition: 'TallyPrime Gold',
        price: 'KES 172,800',
        setup: 'KES 25,000',
        total: 'KES 197,800',
        roi: '3-6 Months',
        savings: 'KES 15,000+/month',
        reasons: [
          'Multi-user concurrent access',
          'Consolidated multi-branch reporting',
          'Advanced security & user roles',
          'Remote access built-in'
        ]
      };
    }
    return {
      edition: 'TallyPrime Silver',
      price: 'KES 57,600',
      setup: 'KES 10,000',
      total: 'KES 67,600',
      roi: '2-4 Months',
      savings: 'KES 5,000+/month',
      reasons: [
        'Affordable entry point',
        'Full accounting & KRA features',
        'Perfect for single-user control',
        'Easy upgrade path to Gold'
      ]
    };
  }, [users, locations, revenue]);

  return (
    <div className="my-12 overflow-hidden rounded-3xl border border-navy-200 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-800">
      <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">TallyPrime ROI Calculator</h3>
            <p className="text-xs text-navy-300 uppercase tracking-wider font-semibold">Estimate your investment & savings</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-0">
        {/* Inputs */}
        <div className="p-6 sm:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-navy-100 dark:border-navy-700">
          <div>
            <label className="flex items-center justify-between text-sm font-bold text-navy-900 dark:text-white mb-4">
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-red-600" /> Number of Users</span>
              <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs">{users} User{users > 1 ? 's' : ''}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={users}
              onChange={(e) => setUsers(parseInt(e.target.value))}
              className="w-full h-2 bg-navy-100 rounded-lg appearance-none cursor-pointer accent-red-600 dark:bg-navy-700"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-bold text-navy-900 dark:text-white mb-4">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-600" /> Business Locations</span>
              <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs">{locations} Location{locations > 1 ? 's' : ''}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={locations}
              onChange={(e) => setLocations(parseInt(e.target.value))}
              className="w-full h-2 bg-navy-100 rounded-lg appearance-none cursor-pointer accent-red-600 dark:bg-navy-700"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-sm font-bold text-navy-900 dark:text-white mb-4">
              <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-red-600" /> Annual Revenue (KES)</span>
              <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs">{revenue}M+</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={revenue}
              onChange={(e) => setRevenue(parseInt(e.target.value))}
              className="w-full h-2 bg-navy-100 rounded-lg appearance-none cursor-pointer accent-red-600 dark:bg-navy-700"
            />
            <div className="flex justify-between mt-2 text-[10px] text-navy-400 font-bold uppercase tracking-tighter">
              <span>1M</span>
              <span>10M</span>
              <span>25M</span>
              <span>50M+</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-navy-50 dark:bg-navy-900/50 p-6 sm:p-8">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy-500 dark:text-navy-400">Recommended Solution</span>
            <h4 className="text-2xl font-black text-navy-900 dark:text-white mt-1">{recommendation.edition}</h4>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl bg-white dark:bg-navy-800 p-4 shadow-sm border border-navy-100 dark:border-navy-700">
              <p className="text-[10px] font-bold text-navy-400 uppercase">Investment</p>
              <p className="text-lg font-black text-navy-900 dark:text-white">{recommendation.price}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-navy-800 p-4 shadow-sm border border-navy-100 dark:border-navy-700">
              <p className="text-[10px] font-bold text-navy-400 uppercase">Est. ROI</p>
              <p className="text-lg font-black text-emerald-600">{recommendation.roi}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {recommendation.reasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          <button className="w-full group flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95">
            Request Quote for this Setup
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      <div className="bg-navy-100/50 dark:bg-navy-800/50 p-4 text-center border-t border-navy-200 dark:border-navy-700">
        <p className="text-[10px] text-navy-500 dark:text-navy-400 font-medium">
          * Estimates based on average Kenyan B2B operational efficiency gains. Final pricing subject to VAT and implementation complexity.
        </p>
      </div>
    </div>
  );
}
