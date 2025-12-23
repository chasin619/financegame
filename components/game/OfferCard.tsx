'use client';

import { Offer, Cents } from '@/types/game';
import { formatCurrency } from '@/lib/simulation/money';
import { useState } from 'react';

interface OfferCardProps {
  offer: Offer;
  cash: Cents;
  creditAvailable: Cents;
  onDecision: (offerId: string, action: 'accept' | 'decline', paymentMethod?: 'cash' | 'credit') => void;
  disabled?: boolean;
}

export function OfferCard({ offer, cash, creditAvailable, onDecision, disabled }: OfferCardProps) {
  const [decided, setDecided] = useState(false);
  
  const canPayCash = cash >= offer.cost;
  const canPayCredit = creditAvailable >= offer.cost;
  
  const handleDecision = (action: 'accept' | 'decline', paymentMethod?: 'cash' | 'credit') => {
    setDecided(true);
    onDecision(offer.id, action, paymentMethod);
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      tech: '📱',
      fashion: '👕',
      entertainment: '🎮',
      social: '🍽️',
      travel: '✈️',
      hobby: '🎨',
      transportation: '🚗',
    };
    return icons[category] || '🛍️';
  };
  
  if (offer.type === 'car') {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🚗</div>
          <div className="text-xl font-bold text-purple-900">{offer.description}</div>
          <div className="text-3xl font-black text-purple-600 mt-2">{formatCurrency(offer.cost)}</div>
          <div className="text-sm text-gray-600 mt-1">
            Down payment: {formatCurrency(Math.floor(offer.cost * 0.125))}
          </div>
        </div>
        
        {!decided ? (
          <div className="space-y-2">
            <button
              onClick={() => handleDecision('accept')}
              disabled={disabled || cash < Math.floor(offer.cost * 0.125)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Buy {offer.tier} car
            </button>
            <button
              onClick={() => handleDecision('decline')}
              disabled={disabled}
              className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              Pass
            </button>
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 font-bold py-3 rounded-xl text-center">
            ✓ Decision Made
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-indigo-400">
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{getCategoryIcon(offer.category)}</div>
        <div className="text-xl font-bold text-gray-900">{offer.description}</div>
        <div className="text-3xl font-black text-indigo-600 mt-2">{formatCurrency(offer.cost)}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">{offer.category}</div>
      </div>
      
      {!decided ? (
        <div className="space-y-2">
          <button
            onClick={() => handleDecision('accept', 'cash')}
            disabled={disabled || !canPayCash}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            💵 Pay Cash
          </button>
          <button
            onClick={() => handleDecision('accept', 'credit')}
            disabled={disabled || !canPayCredit}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            💳 Use Credit
          </button>
          <button
            onClick={() => handleDecision('decline')}
            disabled={disabled}
            className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
          >
            ❌ Pass
          </button>
        </div>
      ) : (
        <div className="bg-green-100 text-green-800 font-bold py-3 rounded-xl text-center animate-pulse">
          ✓ Decision Made
        </div>
      )}
      
      {!canPayCash && !decided && (
        <div className="mt-3 text-xs text-red-600 text-center font-medium">
          ⚠️ Not enough cash (need {formatCurrency(offer.cost - cash)} more)
        </div>
      )}
    </div>
  );
}