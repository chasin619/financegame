'use client';

import { useState } from 'react';
import { Cents } from '@/types/game';
import { formatCurrency, calculateInterest, calculateMinimumPayment } from '@/lib/simulation/money';

interface PaymentControlsProps {
  balance: Cents;
  cash: Cents;
  apr: number;
  onPaymentDecision: (type: 'minimum' | 'full' | 'custom', amount?: Cents) => void;
  disabled?: boolean;
}

export function PaymentControls({ balance, cash, apr, onPaymentDecision, disabled }: PaymentControlsProps) {
  const [paymentType, setPaymentType] = useState<'minimum' | 'full' | 'custom'>('minimum');
  const [customAmount, setCustomAmount] = useState('');
  const [decided, setDecided] = useState(false);
  
  if (balance === 0) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg">
        <div className="text-5xl mb-2">✓</div>
        <div className="text-2xl font-bold">No Credit Card Balance!</div>
        <div className="text-lg opacity-90 mt-1">You are debt-free this month 🎉</div>
      </div>
    );
  }
  
  const minPayment = calculateMinimumPayment(balance, 0.02, 2500);
  const interest = calculateInterest(balance, apr);
  
  const handleSubmit = () => {
    if (paymentType === 'custom') {
      const amount = Math.round(parseFloat(customAmount) * 100) as Cents;
      onPaymentDecision('custom', amount);
    } else {
      onPaymentDecision(paymentType);
    }
    setDecided(true);
  };
  
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-2xl font-bold text-gray-900">💳 Credit Card Payment</h4>
        <div className="text-3xl">📊</div>
      </div>
      
      <div className="bg-white rounded-xl p-4 mb-4 border border-yellow-300">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-600 font-semibold mb-1">Balance</div>
            <div className="text-2xl font-black text-red-600">{formatCurrency(balance)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-semibold mb-1">Minimum Due</div>
            <div className="text-2xl font-black text-orange-600">{formatCurrency(minPayment)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 font-semibold mb-1">Interest (24% APR)</div>
            <div className="text-2xl font-black text-red-600">{formatCurrency(interest)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="font-bold text-red-900 mb-1">Paying minimum costs you!</div>
            <div className="text-sm text-red-800">
              If you only pay <span className="font-bold">{formatCurrency(minPayment)}</span>, 
              you will be charged <span className="font-bold">{formatCurrency(interest)}</span> in interest next month.
            </div>
            <div className="text-sm text-green-800 mt-2 font-bold">
              ✓ Pay full balance to save {formatCurrency(interest)}!
            </div>
          </div>
        </div>
      </div>
      
      {!decided ? (
        <>
          <div className="space-y-3 mb-4">
            <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentType === 'minimum' 
                ? 'bg-orange-100 border-orange-400' 
                : 'bg-white border-gray-200 hover:border-orange-300'
            }`}>
              <input
                type="radio"
                value="minimum"
                checked={paymentType === 'minimum'}
                onChange={(e) => setPaymentType(e.target.value as any)}
                disabled={disabled}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900">Minimum Payment ({formatCurrency(minPayment)})</div>
                <div className="text-sm text-red-600">⚠️ Costs you {formatCurrency(interest)} in interest</div>
              </div>
            </label>
            
            <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentType === 'full' 
                ? 'bg-green-100 border-green-400' 
                : 'bg-white border-gray-200 hover:border-green-300'
            } ${cash < balance ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="radio"
                value="full"
                checked={paymentType === 'full'}
                onChange={(e) => setPaymentType(e.target.value as any)}
                disabled={disabled || cash < balance}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900">Full Balance ({formatCurrency(balance)})</div>
                <div className="text-sm text-green-600">✓ Saves you {formatCurrency(interest)}!</div>
              </div>
            </label>
            
            <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentType === 'custom' 
                ? 'bg-blue-100 border-blue-400' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                value="custom"
                checked={paymentType === 'custom'}
                onChange={(e) => setPaymentType(e.target.value as any)}
                disabled={disabled}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-900 mb-2">Custom Amount</div>
                {paymentType === 'custom' && (
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 text-lg font-bold"
                    disabled={disabled}
                    min={minPayment / 100}
                    max={Math.min(balance, cash) / 100}
                  />
                )}
              </div>
            </label>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={disabled || (paymentType === 'custom' && !customAmount)}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-lg shadow-lg"
          >
            Confirm Payment Decision
          </button>
        </>
      ) : (
        <div className="bg-green-100 text-green-800 font-bold py-4 rounded-xl text-center text-lg animate-pulse">
          ✓ Payment Decision Made
        </div>
      )}
    </div>
  );
}