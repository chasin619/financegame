import { QuizQuestion } from '../types';

export const LEVEL_NUMBER = 5;

export const questions: QuizQuestion[] = [
  {
    id: 'l5-01',
    prompt: 'All your friends are buying $120 concert tickets. You have $150 saved for a new bike. What do you do?',
    answers: [
      { id: 'a', label: 'Skip the concert - stick to my bike goal', isCorrect: true, explanationShort: 'Strong! Don\'t let others derail your goals. The bike is yours!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: 'Buy the ticket - everyone is going!', isCorrect: false, explanationShort: 'Peer pressure wins = your goal loses. Stay focused!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 4 } },
      { id: 'c', label: 'Ask parents for $120 to keep my savings', isCorrect: false, explanationShort: 'Still wasting $120 on peer pressure instead of your goal!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Buy ticket, then save for bike again', isCorrect: false, explanationShort: 'You were so close! Don\'t restart for peer pressure.', grade: 'ok', impact: { wallet: -2, debt: 0, stress: 2 } },
    ],
    difficulty: 'hard',
    category: 'mindset',
  },
  {
    id: 'l5-02',
    prompt: 'You want to save $500 for a new laptop in 10 months. How much do you need to save each month?',
    answers: [
      { id: 'a', label: '$50 per month', isCorrect: true, explanationShort: 'Perfect! $50 × 10 months = $500. Clear goal, clear plan.', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: '$100 per month', isCorrect: false, explanationShort: 'That would get you $1,000! You only need $50/month.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 1 } },
      { id: 'c', label: '$25 per month', isCorrect: false, explanationShort: 'That\'s only $250 in 10 months. You need $50/month.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 2 } },
      { id: 'd', label: 'I don\'t know', isCorrect: false, explanationShort: '$500 ÷ 10 months = $50/month. Practice your division!', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l5-03',
    prompt: 'A store credit card offers "10% off today if you sign up!" You\'re buying $100 of stuff. Should you get the card?',
    answers: [
      { id: 'a', label: 'No - credit cards lead to debt, not worth $10 off', isCorrect: true, explanationShort: 'Brilliant! $10 off isn\'t worth the temptation and debt risk.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I save $10!', isCorrect: false, explanationShort: 'Credit cards make it easy to overspend. Not worth $10!', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 4 } },
      { id: 'c', label: 'Yes, but I\'ll never use it again', isCorrect: false, explanationShort: 'That\'s what everyone thinks! Then they use it and owe money.', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'Get the card, then cancel it immediately', isCorrect: false, explanationShort: 'Still not worth it. Just pay cash and avoid the trap.', grade: 'ok', impact: { wallet: 1, debt: 1, stress: 2 } },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'l5-04',
    prompt: 'Your friend wants to borrow $30. They say "I\'ll pay you back plus $5 extra next month." Should you lend it?',
    answers: [
      { id: 'a', label: 'No - lending money to friends damages relationships', isCorrect: true, explanationShort: 'Wise! Money + friendships = trouble. Suggest they save instead.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I\'ll make $5!', isCorrect: false, explanationShort: 'What if they can\'t pay back? Your friendship is worth more than $5!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 4 } },
      { id: 'c', label: 'Lend $15 instead of $30', isCorrect: false, explanationShort: 'Less money, same relationship risk. Don\'t lend to friends.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'd', label: 'Yes, but write a contract', isCorrect: false, explanationShort: 'Contracts don\'t prevent awkwardness. Keep money out of friendship.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 3 } },
    ],
    difficulty: 'medium',
    category: 'debt',
  },
  {
    id: 'l5-05',
    prompt: 'You see an ad: "New phone! Only $25/month for 36 months!" That\'s $900 total. The phone costs $600 in stores. What\'s happening?',
    answers: [
      { id: 'a', label: 'They\'re charging me $300 extra over 3 years!', isCorrect: true, explanationShort: 'Exactly! Monthly payments hide the real cost. Save and buy!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: 'It\'s a good deal - I get the phone now!', isCorrect: false, explanationShort: 'You\'re paying $300 EXTRA for impatience! Save up instead.', grade: 'bad', impact: { wallet: -4, debt: 5, stress: 4 } },
      { id: 'c', label: '$25/month is easier than $600 at once', isCorrect: false, explanationShort: 'Easier but costs $300 more! Save $50/month and buy in 12 months.', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 3 } },
      { id: 'd', label: 'The phone will be worth $900 later', isCorrect: false, explanationShort: 'Phones lose value fast! Never worth more than store price.', grade: 'bad', impact: { wallet: -3, debt: 3, stress: 3 } },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'l5-06',
    prompt: 'You saved $200. Your goal is $400 for a tablet. Friends invite you on a $100 trip. What do you do?',
    answers: [
      { id: 'a', label: 'Skip the trip - I\'m halfway to my goal!', isCorrect: true, explanationShort: 'Excellent focus! You\'re 50% there. Don\'t give up now!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: 'Go on the trip - I can save again', isCorrect: false, explanationShort: 'Restarting from $100 means 5 more months of saving!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Go on trip, ask parents to help with tablet', isCorrect: false, explanationShort: 'You were saving for a reason! Finish what you started.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Suggest a cheaper activity with friends', isCorrect: false, explanationShort: 'Good compromise! But staying focused on your goal is better.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 1 } },
    ],
    difficulty: 'hard',
    category: 'mindset',
  },
  {
    id: 'l5-07',
    prompt: 'You can work after school and earn $60/week. But it means less time for homework and friends. Worth it?',
    answers: [
      { id: 'a', label: 'Depends - balance is important, maybe work less', isCorrect: true, explanationShort: 'Wise! Money is good, but school and friendships matter too.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Yes - $60/week is great money!', isCorrect: false, explanationShort: 'Money is good, but not if grades and friendships suffer!', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 3 } },
      { id: 'c', label: 'No - school and friends come first', isCorrect: false, explanationShort: 'True! But some part-time work can teach responsibility.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: -1 } },
      { id: 'd', label: 'Work full-time to make more money', isCorrect: false, explanationShort: 'School is your main job! Balance is key.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 5 } },
    ],
    difficulty: 'hard',
    category: 'mindset',
  },
  {
    id: 'l5-08',
    prompt: 'You borrow $50 from your sister for a game. Next month, you can pay $40 back or buy a new game for $50. What do you do?',
    answers: [
      { id: 'a', label: 'Pay her back the full $50 - debts first!', isCorrect: true, explanationShort: 'Perfect! Always pay debts before wants. Honor your commitments.', grade: 'best', impact: { wallet: 3, debt: -5, stress: -4 } },
      { id: 'b', label: 'Pay $40, buy the game for $10', isCorrect: false, explanationShort: 'You owe her $50! Pay it all before buying wants.', grade: 'bad', impact: { wallet: -2, debt: 2, stress: 4 } },
      { id: 'c', label: 'Buy the game, pay her next month', isCorrect: false, explanationShort: 'That breaks trust! Pay your debts before fun spending.', grade: 'bad', impact: { wallet: -4, debt: 3, stress: 5 } },
      { id: 'd', label: 'Pay $25 now, $25 later', isCorrect: false, explanationShort: 'If you have $50, pay it all back now! Don\'t delay.', grade: 'ok', impact: { wallet: 1, debt: -2, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'debt',
  },
  {
    id: 'l5-09',
    prompt: 'Your friend shows off their new $200 sneakers bought with "buy now, pay later." They owe $20/month for 10 months. Smart?',
    answers: [
      { id: 'a', label: 'No - paying over time for shoes is a bad idea', isCorrect: true, explanationShort: 'Correct! Shoes lose value while you\'re still paying for them!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - $20/month is affordable', isCorrect: false, explanationShort: 'Affordable doesn\'t mean smart! 10 months of payments for shoes!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Yes - at least they got nice shoes', isCorrect: false, explanationShort: 'By month 10, they\'ll want new shoes but still owe on these!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Maybe - depends if they really needed shoes', isCorrect: false, explanationShort: 'Even if needed, save $200 and buy, don\'t owe for 10 months!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'debt',
  },
  {
    id: 'l5-10',
    prompt: 'You find a "get rich quick" online offer: "Turn $100 into $1,000 in 1 week!" Should you try it?',
    answers: [
      { id: 'a', label: 'No - it\'s definitely a scam', isCorrect: true, explanationShort: 'Smart! If it sounds too good to be true, it is. Keep your money!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I could make $900!', isCorrect: false, explanationShort: 'Scams! You\'ll lose your $100. Never trust "get rich quick."', grade: 'bad', impact: { wallet: -5, debt: 0, stress: 5 } },
      { id: 'c', label: 'Try it with $20 to test it', isCorrect: false, explanationShort: 'Still a scam! You\'ll lose $20. Don\'t "test" scams.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Ask a trusted adult first', isCorrect: false, explanationShort: 'Good instinct! But you can already tell it\'s a scam. Say no.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l5-11',
    prompt: 'You earned $300 from summer work. Should you save it all, spend it all, or split it?',
    answers: [
      { id: 'a', label: 'Split it: save most, spend some on fun', isCorrect: true, explanationShort: 'Balanced! Maybe save $200, enjoy $100. Work deserves some reward!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: 'Save it all - no spending!', isCorrect: false, explanationShort: 'Good discipline! But rewarding hard work is okay too.', grade: 'ok', impact: { wallet: 3, debt: 0, stress: -1 } },
      { id: 'c', label: 'Spend it all - I earned it!', isCorrect: false, explanationShort: 'You earned it, but saving builds your future! Save most.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Lend it to friends who ask', isCorrect: false, explanationShort: 'Never lend money! Keep it for yourself - save or spend wisely.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 4 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l5-12',
    prompt: 'Banks pay you "interest" - a little extra money for keeping savings with them. If you save $100 and they give 5% per year, how much extra do you get?',
    answers: [
      { id: 'a', label: '$5 extra after one year', isCorrect: true, explanationShort: 'Perfect! 5% of $100 = $5. Free money for saving!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: '$50 extra', isCorrect: false, explanationShort: 'That would be 50%! 5% of $100 is $5.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'c', label: '$105 total', isCorrect: false, explanationShort: 'That\'s the total! The "extra" is $5. You\'d have $105 total.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Banks don\'t pay interest', isCorrect: false, explanationShort: 'They do! It\'s a small reward for saving. Learn about it!', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
];
