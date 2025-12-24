import { QuizQuestion } from '../types';

export const LEVEL_NUMBER = 4;

export const questions: QuizQuestion[] = [
  {
    id: 'l4-01',
    prompt: 'A game subscription costs $5/month. You play it a lot for 2 months, then get bored. What should you do?',
    answers: [
      { id: 'a', label: 'Cancel it - I\'m not using it anymore', isCorrect: true, explanationShort: 'Smart! Subscriptions are only worth it if you use them.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Keep it - I might play again someday', isCorrect: false, explanationShort: '"Might play" means wasting $5 every month! Cancel it.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Keep it for 6 more months, then cancel', isCorrect: false, explanationShort: 'That\'s $30 wasted! Cancel when you stop using it.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'd', label: 'Let my parents pay for it', isCorrect: false, explanationShort: 'Even if parents pay, wasting money is wrong. Cancel it!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l4-02',
    prompt: 'Your friend says "Just borrow $20 from your brother, you can pay him back later!" Should you?',
    answers: [
      { id: 'a', label: 'No - borrowing from family causes problems', isCorrect: true, explanationShort: 'Excellent! Borrowing money can hurt relationships.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I\'ll pay him back for sure', isCorrect: false, explanationShort: 'What if you can\'t pay back on time? Don\'t borrow!', grade: 'bad', impact: { wallet: -2, debt: 4, stress: 4 } },
      { id: 'c', label: 'Borrow $10 instead of $20', isCorrect: false, explanationShort: 'Less debt is better, but still debt! Don\'t borrow.', grade: 'ok', impact: { wallet: -1, debt: 2, stress: 2 } },
      { id: 'd', label: 'Ask to borrow without saying when I\'ll pay back', isCorrect: false, explanationShort: 'That\'s even worse! Never borrow without a clear plan.', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 5 } },
    ],
    difficulty: 'medium',
    category: 'debt',
  },
  {
    id: 'l4-03',
    prompt: 'An ad says "Buy now, pay over 4 months, no extra cost!" for a $40 headset. Is this a good deal?',
    answers: [
      { id: 'a', label: 'No - owing money for months isn\'t worth it', isCorrect: true, explanationShort: 'Right! Save $40 first, then buy. Don\'t owe money!', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - no extra cost means it\'s free money!', isCorrect: false, explanationShort: 'You still owe $40! It just tricks you into buying now.', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 3 } },
      { id: 'c', label: 'Yes - paying $10/month is easy', isCorrect: false, explanationShort: '$10/month locks up your allowance for 4 months!', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'Maybe - depends if I really need it', isCorrect: false, explanationShort: 'Even if you need it, save up first! Don\'t owe money.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'l4-04',
    prompt: 'You subscribe to 3 streaming services at $8 each. You only watch one. What should you do?',
    answers: [
      { id: 'a', label: 'Cancel 2 services, save $16/month', isCorrect: true, explanationShort: 'Perfect! That\'s $192/year saved. Only pay for what you use!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -3 } },
      { id: 'b', label: 'Keep all 3 - I might watch them later', isCorrect: false, explanationShort: '"Might watch" is wasting $16 every month!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'c', label: 'Cancel 1 service, keep 2', isCorrect: false, explanationShort: 'You only watch 1! Cancel both services you don\'t use.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Share accounts with friends', isCorrect: false, explanationShort: 'That\'s against rules. Just cancel what you don\'t use!', grade: 'ok', impact: { wallet: 2, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l4-05',
    prompt: 'A store offers: "Spend $50, get $10 gift card!" You were going to spend $30. What do you do?',
    answers: [
      { id: 'a', label: 'Just spend my $30 - don\'t buy extra stuff', isCorrect: true, explanationShort: 'Smart! Spending $20 extra to "save" $10 is losing money.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Spend $50 to get the $10 gift card', isCorrect: false, explanationShort: 'You spent $20 extra for a $10 card. That\'s a $10 loss!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Buy $50 worth and use gift card later', isCorrect: false, explanationShort: 'Still spending $20 you didn\'t plan to! Stick to $30.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Ask a friend to combine purchases', isCorrect: false, explanationShort: 'Creative, but just buy what you need! Don\'t chase deals.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'hard',
    category: 'spending',
  },
  {
    id: 'l4-06',
    prompt: 'Everyone at school has the new sneakers for $80. Yours are fine. What do you do?',
    answers: [
      { id: 'a', label: 'Keep my shoes - they work great!', isCorrect: true, explanationShort: 'Excellent! Don\'t spend money just to fit in.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Save up and buy them - I want to fit in', isCorrect: false, explanationShort: 'Real friends don\'t care about your shoes! Save your money.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'c', label: 'Ask parents to buy them for me', isCorrect: false, explanationShort: 'Your shoes work! Don\'t waste money on peer pressure.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'd', label: 'Use "buy now pay later" to get them', isCorrect: false, explanationShort: 'Never go into debt for shoes you don\'t need!', grade: 'bad', impact: { wallet: -4, debt: 5, stress: 5 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'l4-07',
    prompt: 'You borrowed $15 from a friend last month. You got your allowance. What\'s the first thing to do?',
    answers: [
      { id: 'a', label: 'Pay back my friend immediately', isCorrect: true, explanationShort: 'Perfect! Always pay back debts first. It protects friendships.', grade: 'best', impact: { wallet: 2, debt: -5, stress: -4 } },
      { id: 'b', label: 'Pay back $5 now, $10 later', isCorrect: false, explanationShort: 'If you have it, pay it all back now! Don\'t delay.', grade: 'ok', impact: { wallet: 1, debt: -2, stress: 2 } },
      { id: 'c', label: 'Spend allowance, pay back next month', isCorrect: false, explanationShort: 'That breaks trust! Pay debts before spending on wants.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 5 } },
      { id: 'd', label: 'Hope they forget about it', isCorrect: false, explanationShort: 'That\'s dishonest and ruins friendships! Pay them back.', grade: 'bad', impact: { wallet: -4, debt: 2, stress: 6 } },
    ],
    difficulty: 'easy',
    category: 'debt',
  },
  {
    id: 'l4-08',
    prompt: 'You want a $50 toy. The store offers "Buy now, pay $10/week for 5 weeks, no extra charge." What\'s the catch?',
    answers: [
      { id: 'a', label: 'I\'m locked into paying $10 every week for 5 weeks', isCorrect: true, explanationShort: 'Exactly! Payment plans lock up your future allowance.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'There\'s no catch - it\'s a great deal!', isCorrect: false, explanationShort: 'The catch is you owe money for 5 weeks! Save first instead.', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 3 } },
      { id: 'c', label: 'I get the toy faster this way', isCorrect: false, explanationShort: 'True, but you\'re in debt for weeks! Not worth it.', grade: 'bad', impact: { wallet: -2, debt: 3, stress: 3 } },
      { id: 'd', label: 'I can stop paying after week 3', isCorrect: false, explanationShort: 'No! You committed to 5 weeks. You must pay all $50.', grade: 'bad', impact: { wallet: -3, debt: 4, stress: 4 } },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'l4-09',
    prompt: 'You have $60. A sale says "Everything 50% off!" Should you spend it all since everything is cheap?',
    answers: [
      { id: 'a', label: 'No - only buy what I actually need', isCorrect: true, explanationShort: 'Perfect! Sales are only good if you were buying anyway.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Yes - I\'m saving 50%!', isCorrect: false, explanationShort: 'Spending $60 on things you don\'t need isn\'t saving!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'c', label: 'Spend $30, save $30', isCorrect: false, explanationShort: 'Only spend if you need it! "Half off" doesn\'t matter.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Buy stuff to resell and make money', isCorrect: false, explanationShort: 'Risky! You might not sell it. Only buy what you need.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'l4-10',
    prompt: 'A "free trial" subscription requires your payment info. After 7 days it charges $10/month. Good idea?',
    answers: [
      { id: 'a', label: 'No - I might forget to cancel and get charged', isCorrect: true, explanationShort: 'Smart thinking! Free trials often trap you into paying.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes - I\'ll just cancel before 7 days', isCorrect: false, explanationShort: 'Easy to forget! Companies count on that. Skip it.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'c', label: 'Yes - it\'s free!', isCorrect: false, explanationShort: 'It\'s only free if you cancel! Most people forget.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Set a reminder to cancel on day 6', isCorrect: false, explanationShort: 'Better! But why risk it? Only sign up if you\'ll pay.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'hard',
    category: 'spending',
  },
  {
    id: 'l4-11',
    prompt: 'Your friend owes you $10 from last month but keeps "forgetting." What should you do?',
    answers: [
      { id: 'a', label: 'Politely remind them and ask when they can pay', isCorrect: true, explanationShort: 'Good! It\'s fair to ask for your money back.', grade: 'best', impact: { wallet: 2, debt: -2, stress: -2 } },
      { id: 'b', label: 'Let it go - asking is awkward', isCorrect: false, explanationShort: 'It\'s your money! It\'s okay to ask for it back.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'c', label: 'Get mad and demand it back rudely', isCorrect: false, explanationShort: 'Be polite but firm. Rudeness doesn\'t help!', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 4 } },
      { id: 'd', label: 'Never lend to them again', isCorrect: false, explanationShort: 'Good lesson! But first, ask politely for your $10 back.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'l4-12',
    prompt: 'You have 3 subscriptions you barely use totaling $18/month. That\'s $216/year! What now?',
    answers: [
      { id: 'a', label: 'Cancel all 3 and save $216/year', isCorrect: true, explanationShort: 'Excellent! $216 can buy so much more than unused subscriptions!', grade: 'best', impact: { wallet: 4, debt: 0, stress: -4 } },
      { id: 'b', label: 'Keep them - I might use them someday', isCorrect: false, explanationShort: '"Might use" means never. That\'s $216 wasted!', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 3 } },
      { id: 'c', label: 'Cancel 1, keep 2', isCorrect: false, explanationShort: 'If you barely use all 3, cancel all 3!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Try to use them more to get my money\'s worth', isCorrect: false, explanationShort: 'Don\'t force yourself! Just cancel and save the money.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
];
