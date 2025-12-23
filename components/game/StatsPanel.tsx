'use client';

import { GameState } from '@/types/game';
import { formatCurrency } from '@/lib/simulation/money';

interface StatsPanelProps {
  state: GameState;
  label: string;
  isGuru?: boolean;
}

export function StatsPanel({ state, label, isGuru = false }: StatsPanelProps) {
  const netWorth = state.cash - state.creditCard.balance - (state.carLoan?.remainingBalance || 0);
  
  const getStressEmoji = (stress: number) => {
    if (stress < 30) return '😊';
    if (stress < 60) return '😟';
    return '😰';
  };
  
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl p-6 ${
      isGuru 
        ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-400'
    }`}>
      {/* Decorative circles */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${isGuru ? 'bg-green-200' : 'bg-blue-200'} rounded-full opacity-20 -mr-16 -mt-16`}></div>
      <div className={`absolute bottom-0 left-0 w-24 h-24 ${isGuru ? 'bg-green-200' : 'bg-blue-200'} rounded-full opacity-20 -ml-12 -mb-12`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${isGuru ? 'text-green-900' : 'text-blue-900'}`}>
            {label}
          </h3>
          {isGuru && <span className="text-3xl">🧙</span>}
          {!isGuru && <span className="text-3xl">👤</span>}
        </div>
        
        <div className="space-y-4">
          {/* Cash */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Cash</div>
            <div className="text-3xl font-black text-green-600">{formatCurrency(state.cash)}</div>
          </div>
          
          {/* Debt */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Credit Card Debt</div>
            <div className={`text-2xl font-black ${state.creditCard.balance > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {state.creditCard.balance > 0 ? formatCurrency(state.creditCard.balance) : '$0'}
            </div>
            {state.creditCard.balance > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                Utilization: {Math.round((state.creditCard.balance / state.creditCard.limit) * 100)}%
              </div>
            )}
          </div>
          
          {/* Car Loan */}
          {state.carLoan && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Car Loan</div>
              <div className="text-xl font-black text-orange-600">
                {formatCurrency(state.carLoan.remainingBalance)}
              </div>
              <div className="mt-1 text-xs text-gray-600">
                {state.carLoan.remainingMonths} months left
              </div>
            </div>
          )}
          
          {/* Net Worth - BIG */}
          <div className={`rounded-xl p-4 shadow-md ${
            netWorth >= 0 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
              : 'bg-gradient-to-br from-red-500 to-pink-600'
          }`}>
            <div className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">Net Worth</div>
            <div className="text-4xl font-black text-white">
              {formatCurrency(netWorth)}
            </div>
          </div>
          
          {/* Additional Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Credit Score */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 mb-1">Credit Score</div>
              <div className="text-2xl font-bold text-gray-900">{state.creditScore}</div>
            </div>
            
            {/* Stress */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 mb-1">Stress</div>
              <div className="text-2xl font-bold">
                {getStressEmoji(state.stressLevel)} {Math.round(state.stressLevel)}
              </div>
            </div>
          </div>
          
          {/* Interest Paid */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="text-xs font-semibold text-red-700 mb-1">💸 Total Interest Paid</div>
            <div className="text-xl font-black text-red-600">
              {formatCurrency(state.lifetimeInterestPaid)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}