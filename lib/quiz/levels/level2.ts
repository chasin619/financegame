import { QuizQuestion } from '../types';

export const LEVEL_NUMBER = 2;

export const questions: QuizQuestion[] = [
  {
    id: 'l2-01',
    prompt: 'You get $5 allowance each week. You want a $15 video game. How many weeks until you can buy it?',
    answers: [
      { id: 'a', label: '3 weeks if I save all my allowance', isCorrect: true, explanationShort: 'Perfect math! Saving every week gets you there.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: '1 week - I\'ll ask for extra money', isCorrect: false, explanationShort: 'We can\'t always get extra! Plan with what you have.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'c', label: 'I don\'t know', isCorrect: false, explanationShort: '$15 ÷ $5 = 3 weeks. You can do this math!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
      { id: 'd', label: 'Never - I\'ll spend my allowance each week', isCorrect: false, explanationShort: 'If you spend it all, you can\'t save! Wait and save.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l2-02',
    prompt: 'At the store: Markers are $3 at Store A and $5 at Store B. Which should you buy?',
    answers: [
      { id: 'a', label: 'Store A - same markers for less money!', isCorrect: true, explanationShort: 'Smart shopping! Always compare prices.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Store B - more expensive means better', isCorrect: false, explanationShort: 'Not always! If they\'re the same, buy the cheaper one.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'c', label: 'Buy from both stores', isCorrect: false, explanationShort: 'Why spend $8 when you only need one set? Choose Store A!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Don\'t buy any markers', isCorrect: false, explanationShort: 'If you need markers, Store A is the smart choice!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l2-03',
    prompt: 'You have $8 saved. You want a $12 toy. What should you do?',
    answers: [
      { id: 'a', label: 'Wait and save $4 more from allowance', isCorrect: true, explanationShort: 'Great patience! Waiting and saving is the smart way.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Ask to borrow $4 from my sister', isCorrect: false, explanationShort: 'Borrowing from family can cause problems. Save instead!', grade: 'bad', impact: { wallet: -2, debt: 2, stress: 3 } },
      { id: 'c', label: 'Buy a cheaper $8 toy instead', isCorrect: false, explanationShort: 'That works, but saving for what you really want is better!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Forget about it and spend my $8 on candy', isCorrect: false, explanationShort: 'Don\'t give up on your goal! Candy is gone fast, toys last.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l2-04',
    prompt: 'Your friend wants to trade your new ball for their old one plus $2. Should you do it?',
    answers: [
      { id: 'a', label: 'No - my new ball is worth more than $2 extra', isCorrect: true, explanationShort: 'Smart! Your new ball is worth keeping.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'Yes - I get $2 cash!', isCorrect: false, explanationShort: 'You\'re trading something new for old + $2. Not a good deal!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Ask for $5 instead of $2', isCorrect: false, explanationShort: 'Better, but why trade your new ball at all?', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Give them the ball for free', isCorrect: false, explanationShort: 'That\'s very generous, but you should value your things!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'l2-05',
    prompt: 'You want a snack from the vending machine for $1.50. You brought a snack from home. What do you do?',
    answers: [
      { id: 'a', label: 'Eat my snack from home and save $1.50', isCorrect: true, explanationShort: 'Excellent! You\'re saving money by being prepared.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Buy the vending machine snack anyway', isCorrect: false, explanationShort: 'Why waste $1.50 when you have a snack already?', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'c', label: 'Eat both snacks', isCorrect: false, explanationShort: 'You don\'t need two snacks! Save your money.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Give my home snack away and buy vending machine', isCorrect: false, explanationShort: 'That wastes food AND money. Eat what you brought!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l2-06',
    prompt: 'You earn $4 for doing chores. Should you spend it or save it?',
    answers: [
      { id: 'a', label: 'Save at least half ($2) for my goal', isCorrect: true, explanationShort: 'Great plan! Saving some keeps you moving toward your goal.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Spend it all on a treat', isCorrect: false, explanationShort: 'Treats are nice, but saving helps you reach bigger goals!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Save all $4', isCorrect: false, explanationShort: 'Saving it all is great too! But some fun is okay.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: -1 } },
      { id: 'd', label: 'Give it to someone else', isCorrect: false, explanationShort: 'You earned it! Keep and save it for yourself.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l2-07',
    prompt: 'There\'s a big sale! Everything is "Buy 2 Get 1 Free!" Should you buy 3 things you don\'t need?',
    answers: [
      { id: 'a', label: 'No - buying things I don\'t need wastes money', isCorrect: true, explanationShort: 'Smart! A sale on things you don\'t need is still waste.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - it\'s free!', isCorrect: false, explanationShort: 'The 3rd is free, but you\'re still paying for 2 you don\'t need!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Buy 2 things only', isCorrect: false, explanationShort: 'If you don\'t need them, buying 2 is still wasteful!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Wait to see if I need them later', isCorrect: false, explanationShort: 'Good thinking, but if you don\'t need them now, skip it!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l2-08',
    prompt: 'Your pencil breaks. A fancy pencil costs $3. A regular pencil costs $0.50. Which do you buy?',
    answers: [
      { id: 'a', label: 'Regular pencil - it writes the same!', isCorrect: true, explanationShort: 'Perfect! Both pencils work. Save the difference!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Fancy pencil - it looks cooler', isCorrect: false, explanationShort: 'Looking cool costs $2.50 extra. Not worth it!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'c', label: 'Buy both pencils', isCorrect: false, explanationShort: 'You only need one pencil! Choose the regular one.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Don\'t buy any pencil', isCorrect: false, explanationShort: 'You need a pencil! Buy the regular one.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l2-09',
    prompt: 'You saved $10! Your friend says "You\'re rich! Buy us pizza!" What do you say?',
    answers: [
      { id: 'a', label: 'No thanks, I\'m saving for my own goal', isCorrect: true, explanationShort: 'Good boundary! Your savings are for YOUR goals.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Okay! I\'ll buy pizza for everyone', isCorrect: false, explanationShort: 'Don\'t let others pressure you to spend your savings!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'c', label: 'Buy pizza and ask them to pay me back', isCorrect: false, explanationShort: 'Friends might forget to pay back. Keep your savings!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Split the pizza cost with my friend', isCorrect: false, explanationShort: 'Better, but still spending your savings. Stick to your goal!', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'l2-10',
    prompt: 'Is it better to buy a toy that costs $10 now or wait 2 weeks and get one that costs $15?',
    answers: [
      { id: 'a', label: 'Wait for the $15 toy if that\'s what I really want', isCorrect: true, explanationShort: 'Great patience! Getting what you want is worth waiting for.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Buy the $10 toy now', isCorrect: false, explanationShort: 'If you want the $15 one more, waiting is smarter!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'c', label: 'Buy both toys', isCorrect: false, explanationShort: 'That\'s $25! Pick one and save your money.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Don\'t buy any toy', isCorrect: false, explanationShort: 'It\'s okay to buy toys! Just plan and save for them.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 0 } },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'l2-11',
    prompt: 'Your mom gives you $20 for your birthday. What\'s the smartest thing to do?',
    answers: [
      { id: 'a', label: 'Save $10, use $10 for something fun', isCorrect: true, explanationShort: 'Perfect balance! Save some, enjoy some.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Spend all $20 right away', isCorrect: false, explanationShort: 'Birthday money is special! Save at least half.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Save all $20', isCorrect: false, explanationShort: 'Saving it all is great! But some fun is okay too.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'd', label: 'Give it back to Mom', isCorrect: false, explanationShort: 'It\'s a gift for you! Keep it and use it wisely.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l2-12',
    prompt: 'You want a new backpack. Yours still works but has a small tear. What should you do?',
    answers: [
      { id: 'a', label: 'Keep using it until it really breaks', isCorrect: true, explanationShort: 'Excellent! Use things until they\'re really done.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Buy a new one right away', isCorrect: false, explanationShort: 'A small tear is okay! Save money by using what works.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 2 } },
      { id: 'c', label: 'Ask for a new one even though mine works', isCorrect: false, explanationShort: 'Wanting new things is normal, but use what you have first!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Fix the tear myself or with help', isCorrect: false, explanationShort: 'Great idea too! Fixing things saves money.', grade: 'ok', impact: { wallet: 2, debt: 0, stress: -1 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
];
