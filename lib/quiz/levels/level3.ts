import { QuizQuestion } from '../types';

export const LEVEL_NUMBER = 3;

export const questions: QuizQuestion[] = [
  {
    id: 'l3-01',
    prompt: 'You saved $30 for a new game. Your bike tire goes flat and costs $25 to fix. What should you do?',
    answers: [
      { id: 'a', label: 'Fix the bike - I need it for school', isCorrect: true, explanationShort: 'Smart! Needs come before wants. You can save for the game again.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Buy the game - I saved for it!', isCorrect: false, explanationShort: 'The game can wait, but you need your bike now!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 4 } },
      { id: 'c', label: 'Ask parents to fix bike so I can buy game', isCorrect: false, explanationShort: 'You have the money! Use your savings for emergencies like this.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'd', label: 'Walk to school and buy the game', isCorrect: false, explanationShort: 'Walking far every day is hard! Fix your bike first.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 4 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l3-02',
    prompt: 'You have $15. A shirt costs $12. Pants cost $18. You need both. What\'s your plan?',
    answers: [
      { id: 'a', label: 'Buy the shirt now, save $3 more for pants later', isCorrect: true, explanationShort: 'Good planning! Buy what you can afford, then save for the rest.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Ask to borrow $3 to buy pants now', isCorrect: false, explanationShort: 'Borrowing creates debt! Just wait and save $3 more.', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'c', label: 'Don\'t buy anything and save more', isCorrect: false, explanationShort: 'You can buy the shirt! Then save for pants.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Buy the pants first', isCorrect: false, explanationShort: 'You only have $15, pants cost $18. Buy the shirt first!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l3-03',
    prompt: 'Your class is going on a $40 field trip in 2 months. You get $10 allowance per month. How do you prepare?',
    answers: [
      { id: 'a', label: 'Save $20 from each month\'s allowance', isCorrect: true, explanationShort: 'Perfect planning! You\'ll have exactly $40 ready.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Don\'t save - ask parents for $40 later', isCorrect: false, explanationShort: 'You have 2 months to save! Do it yourself.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'c', label: 'Save $10 from one month, borrow $30', isCorrect: false, explanationShort: 'Why borrow when you can save $20 from each month?', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'Spend allowance now, worry about it later', isCorrect: false, explanationShort: 'Planning ahead prevents problems! Start saving now.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 4 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l3-04',
    prompt: 'Two friends want you to join different activities. One is free, one costs $10. Both sound fun. What do you choose?',
    answers: [
      { id: 'a', label: 'Choose the free activity and save my money', isCorrect: true, explanationShort: 'Great choice! Fun doesn\'t have to cost money.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Choose the $10 activity', isCorrect: false, explanationShort: 'If both are equally fun, why spend $10? Choose free!', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 1 } },
      { id: 'c', label: 'Do both activities', isCorrect: false, explanationShort: 'You can only do one at a time! Pick the free option.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'd', label: 'Do neither and stay home', isCorrect: false, explanationShort: 'You have a free option! Go have fun without spending.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l3-05',
    prompt: 'You see a "limited edition" toy for $25. The regular version costs $15 and does the same thing. Which do you buy?',
    answers: [
      { id: 'a', label: 'Regular version - saves me $10!', isCorrect: true, explanationShort: 'Smart! "Limited edition" is just marketing. Save $10!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Limited edition - it\'s special!', isCorrect: false, explanationShort: '"Special" costs $10 more for the same toy!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'c', label: 'Buy both versions', isCorrect: false, explanationShort: 'Why buy two of the same toy? Pick the regular one!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Don\'t buy either', isCorrect: false, explanationShort: 'If you want the toy, the regular version is the smart buy!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 0 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l3-06',
    prompt: 'You break your friend\'s $8 toy by accident. What should you do?',
    answers: [
      { id: 'a', label: 'Use my savings to buy them a new one', isCorrect: true, explanationShort: 'That\'s being responsible! Accidents happen, make it right.', grade: 'best', impact: { wallet: -1, debt: 0, stress: -2 } },
      { id: 'b', label: 'Say sorry but don\'t replace it', isCorrect: false, explanationShort: 'Sorry is good, but you should replace what you broke.', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 3 } },
      { id: 'c', label: 'Hide it and pretend it wasn\'t me', isCorrect: false, explanationShort: 'That\'s not honest! Own up and replace it.', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 5 } },
      { id: 'd', label: 'Ask your parents to buy a new one', isCorrect: false, explanationShort: 'You broke it, you should fix it with your own money.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'l3-07',
    prompt: 'A store has a "Buy Now, Pay Later" plan for a $30 skateboard. Pay $10 now, $10 next month, $10 after. Good deal?',
    answers: [
      { id: 'a', label: 'No - just save $30 and buy it when I can', isCorrect: true, explanationShort: 'Excellent! Paying over time means you owe money. Save first!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I get the skateboard now!', isCorrect: false, explanationShort: 'You\'ll owe $20 for weeks! Better to save and buy it.', grade: 'bad', impact: { wallet: -2, debt: 4, stress: 3 } },
      { id: 'c', label: 'Yes - $10 is easier than $30', isCorrect: false, explanationShort: '$10 three times is still $30, but you\'re in debt until you finish!', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'Ask parents to pay the full $30', isCorrect: false, explanationShort: 'If you want it, save your own money for it!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'l3-08',
    prompt: 'You want to start a savings goal. Is it better to save $2 every week or $8 once a month?',
    answers: [
      { id: 'a', label: 'Both equal $8/month, but weekly is easier to remember!', isCorrect: true, explanationShort: 'Great thinking! Smaller regular amounts build good habits.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: '$8 once a month is easier', isCorrect: false, explanationShort: 'It\'s easy to forget or spend that $8! Weekly is better.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'c', label: 'Don\'t save regularly, just save when I feel like it', isCorrect: false, explanationShort: 'Regular saving builds habits! Pick weekly or monthly.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Save $10 every month instead', isCorrect: false, explanationShort: 'More saving is great! But the question is about $8 total.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 0 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l3-09',
    prompt: 'Your allowance is $12/week. If you save $4 each week, how much will you have in 6 weeks?',
    answers: [
      { id: 'a', label: '$24', isCorrect: true, explanationShort: 'Perfect math! $4 × 6 weeks = $24 saved.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: '$48', isCorrect: false, explanationShort: 'That would be saving ALL $12 for 4 weeks. $4 × 6 = $24.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'c', label: '$12', isCorrect: false, explanationShort: '$4 per week for 6 weeks is more than $12. It\'s $24!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
      { id: 'd', label: 'I don\'t know', isCorrect: false, explanationShort: '$4 saved every week × 6 weeks = $24. You can do it!', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l3-10',
    prompt: 'Brand name sneakers cost $60. Store brand sneakers cost $30 and work the same. What do you choose?',
    answers: [
      { id: 'a', label: 'Store brand - save $30!', isCorrect: true, explanationShort: 'Excellent! Logos don\'t make shoes better. Save half!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Brand name - everyone has them', isCorrect: false, explanationShort: 'Don\'t waste $30 extra just because others have them!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Buy both pairs', isCorrect: false, explanationShort: 'You only need one pair! Choose store brand.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Ask for the brand name as a gift', isCorrect: false, explanationShort: 'If they work the same, why ask for the expensive one?', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l3-11',
    prompt: 'You find a $10 bill on the playground. No one is around. What should you do?',
    answers: [
      { id: 'a', label: 'Turn it in to the teacher - someone lost it', isCorrect: true, explanationShort: 'Great integrity! That\'s the right thing to do.', grade: 'best', impact: { wallet: 1, debt: 0, stress: -3 } },
      { id: 'b', label: 'Keep it - finders keepers!', isCorrect: false, explanationShort: 'Someone is sad they lost $10. Do the right thing!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 3 } },
      { id: 'c', label: 'Split it with a friend', isCorrect: false, explanationShort: 'That\'s still keeping money that isn\'t yours!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'd', label: 'Leave it where I found it', isCorrect: false, explanationShort: 'Someone else might take it. Turn it in to a teacher!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l3-12',
    prompt: 'You have $50 saved. Your tablet screen cracks. Repair costs $35. What should you do?',
    answers: [
      { id: 'a', label: 'Use my savings to repair it', isCorrect: true, explanationShort: 'Smart! Savings are for emergencies like this.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -3 } },
      { id: 'b', label: 'Don\'t fix it, save my $50', isCorrect: false, explanationShort: 'You need your tablet! This is what savings are for.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'c', label: 'Ask someone to lend me $35', isCorrect: false, explanationShort: 'You have the money saved! No need to borrow.', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'Try to fix it myself with tape', isCorrect: false, explanationShort: 'Tablets need proper repair. Use your savings!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
];
