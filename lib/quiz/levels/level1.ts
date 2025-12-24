import { QuizQuestion } from '../types';

export const LEVEL_NUMBER = 1;

export const questions: QuizQuestion[] = [
  {
    id: 'l1-01',
    prompt: 'You have 5 coins. A toy costs 3 coins. A candy costs 2 coins. You want both. What should you do?',
    answers: [
      { id: 'a', label: 'Buy the toy and save my 2 coins', isCorrect: true, explanationShort: 'Great choice! The toy lasts longer than candy.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'Buy the candy and save my 3 coins', isCorrect: false, explanationShort: 'Candy is yummy but gone quickly! Toys last longer.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
      { id: 'c', label: 'Ask Mom for more coins to buy both', isCorrect: false, explanationShort: 'We can\'t always get more money. Choose what matters most!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'd', label: 'Don\'t buy anything and keep all 5 coins', isCorrect: false, explanationShort: 'Saving is good, but it\'s okay to buy things you really want!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l1-02',
    prompt: 'You get 10 coins for your allowance. Should you spend it all right away?',
    answers: [
      { id: 'a', label: 'No, save some coins for later', isCorrect: true, explanationShort: 'Smart! Saving means you\'ll have coins when you need them.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -3 } },
      { id: 'b', label: 'Yes, spend it all on fun things', isCorrect: false, explanationShort: 'That\'s fun now, but you\'ll have no coins left for later!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Give all coins to my friend', isCorrect: false, explanationShort: 'It\'s nice to share, but you should keep some for yourself!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Ask for more coins next week', isCorrect: false, explanationShort: 'We get allowance on schedule. Let\'s use what we have wisely!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l1-03',
    prompt: 'You want a toy that costs 8 coins. You have 4 coins. What should you do?',
    answers: [
      { id: 'a', label: 'Save my allowance until I have 8 coins', isCorrect: true, explanationShort: 'Perfect! Waiting and saving shows you\'re smart with money.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: 'Buy a cheaper toy for 4 coins instead', isCorrect: false, explanationShort: 'That works too, but saving for what you really want is better!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 1 } },
      { id: 'c', label: 'Take coins from my piggy bank without asking', isCorrect: false, explanationShort: 'Always ask before using saved money. Savings are important!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'd', label: 'Forget about the toy', isCorrect: false, explanationShort: 'Don\'t give up! You can save for things you want.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l1-04',
    prompt: 'Is ice cream a NEED or a WANT?',
    answers: [
      { id: 'a', label: 'A want - it\'s yummy but I don\'t need it', isCorrect: true, explanationShort: 'Correct! Ice cream is a treat, not something we need to live.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'A need - everyone needs ice cream!', isCorrect: false, explanationShort: 'Ice cream is delicious, but we can live without it. It\'s a want!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Both a need and a want', isCorrect: false, explanationShort: 'Ice cream is only a want. Needs are food, water, and shelter!', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 1 } },
      { id: 'd', label: 'I don\'t know', isCorrect: false, explanationShort: 'Think about it: Can you live without ice cream? Then it\'s a want!', grade: 'bad', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l1-05',
    prompt: 'Your friend has a new toy. You feel sad you don\'t have one. What should you think?',
    answers: [
      { id: 'a', label: 'I can save my coins to get my own toy', isCorrect: true, explanationShort: 'Great thinking! You can work toward your own goals.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -3 } },
      { id: 'b', label: 'I need the same toy right now!', isCorrect: false, explanationShort: 'We don\'t need everything our friends have. Save for what YOU want!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Ask my friend to give me their toy', isCorrect: false, explanationShort: 'That\'s not fair to your friend. You can get your own!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 2 } },
      { id: 'd', label: 'I don\'t like toys anymore', isCorrect: false, explanationShort: 'It\'s okay to want things! Just save your coins for them.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l1-06',
    prompt: 'You have 6 coins. Stickers cost 2 coins. How many packs can you buy?',
    answers: [
      { id: 'a', label: '3 packs (and have 0 coins left)', isCorrect: false, explanationShort: 'That\'s right math, but spending all your coins isn\'t smart!', grade: 'ok', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'b', label: '2 packs (and save 2 coins)', isCorrect: true, explanationShort: 'Perfect! You can enjoy stickers AND save coins for later.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'c', label: '1 pack (and save 4 coins)', isCorrect: false, explanationShort: 'Good saving! But you can buy 2 and still save some.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: -1 } },
      { id: 'd', label: '0 packs (save all 6 coins)', isCorrect: false, explanationShort: 'Saving is great, but it\'s okay to enjoy some stickers too!', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 0 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l1-07',
    prompt: 'Where is the safest place to keep your coins?',
    answers: [
      { id: 'a', label: 'In my piggy bank or safe place at home', isCorrect: true, explanationShort: 'Yes! A piggy bank keeps your money safe and organized.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'In my pocket all the time', isCorrect: false, explanationShort: 'Pockets have holes! You might lose your coins.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 3 } },
      { id: 'c', label: 'Under my bed', isCorrect: false, explanationShort: 'You might forget where they are! Use a piggy bank instead.', grade: 'ok', impact: { wallet: -1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Give them to a friend to hold', isCorrect: false, explanationShort: 'Keep your own money safe. Your friend might lose them!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l1-08',
    prompt: 'You see a shiny toy at the store. Should you ask Mom to buy it right away?',
    answers: [
      { id: 'a', label: 'No, think about it first and decide if I really want it', isCorrect: true, explanationShort: 'Smart! Thinking before buying helps you make good choices.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'Yes, ask Mom to buy it now!', isCorrect: false, explanationShort: 'Sometimes things look cool in stores but we don\'t need them!', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'c', label: 'Take it without asking', isCorrect: false, explanationShort: 'That\'s not right! We always pay for things we want.', grade: 'bad', impact: { wallet: -4, debt: 0, stress: 5 } },
      { id: 'd', label: 'Cry until Mom buys it', isCorrect: false, explanationShort: 'That\'s not nice! We should be patient and save our own money.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 4 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l1-09',
    prompt: 'You find 3 coins on the ground. What should you do?',
    answers: [
      { id: 'a', label: 'Give them to Mom or a teacher - someone might have lost them', isCorrect: true, explanationShort: 'Good job being honest! That\'s the right thing to do.', grade: 'best', impact: { wallet: 1, debt: 0, stress: -3 } },
      { id: 'b', label: 'Keep them in my pocket and don\'t tell anyone', isCorrect: false, explanationShort: 'Someone might be looking for those coins. Always tell a grown-up!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 3 } },
      { id: 'c', label: 'Spend them right away', isCorrect: false, explanationShort: 'Those aren\'t your coins yet. Give them to a grown-up first!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'd', label: 'Hide them at home', isCorrect: false, explanationShort: 'That\'s not honest. The right thing is to give them to a grown-up.', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'l1-10',
    prompt: 'What does "saving money" mean?',
    answers: [
      { id: 'a', label: 'Keeping some coins instead of spending them all', isCorrect: true, explanationShort: 'Perfect! Saving means keeping money for later.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'Spending all your money on sale items', isCorrect: false, explanationShort: 'Spending is the opposite of saving! Saving means keeping money.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Asking for more allowance', isCorrect: false, explanationShort: 'Getting more money isn\'t saving. Saving is keeping what you have!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 1 } },
      { id: 'd', label: 'Giving money to your friends', isCorrect: false, explanationShort: 'Giving away is nice, but saving means keeping it for yourself!', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'l1-11',
    prompt: 'Mom gives you 5 coins. You want gum for 2 coins. Should you buy it?',
    answers: [
      { id: 'a', label: 'Think about it - do I really want gum or should I save?', isCorrect: true, explanationShort: 'Great thinking! Always think before you spend.', grade: 'best', impact: { wallet: 2, debt: 0, stress: -2 } },
      { id: 'b', label: 'Yes! Buy gum right away!', isCorrect: false, explanationShort: 'Gum is fun but doesn\'t last long. Think first!', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Buy 2 packs of gum with 4 coins', isCorrect: false, explanationShort: 'That\'s spending almost all your money on gum! Save some.', grade: 'bad', impact: { wallet: -3, debt: 0, stress: 3 } },
      { id: 'd', label: 'Give the coins back to Mom', isCorrect: false, explanationShort: 'Mom gave them to you! You can keep them and save them.', grade: 'ok', impact: { wallet: 0, debt: 0, stress: 1 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'l1-12',
    prompt: 'Is it better to buy 1 big toy or 5 small toys that break easily?',
    answers: [
      { id: 'a', label: '1 big toy that lasts a long time', isCorrect: true, explanationShort: 'Smart choice! Quality over quantity means less waste.', grade: 'best', impact: { wallet: 3, debt: 0, stress: -2 } },
      { id: 'b', label: '5 small toys - more is always better!', isCorrect: false, explanationShort: 'More isn\'t always better if they break! Choose quality.', grade: 'bad', impact: { wallet: -2, debt: 0, stress: 2 } },
      { id: 'c', label: 'Don\'t buy any toys', isCorrect: false, explanationShort: 'It\'s okay to buy toys! Just choose wisely.', grade: 'ok', impact: { wallet: 1, debt: 0, stress: 0 } },
      { id: 'd', label: 'Ask someone else to buy them for me', isCorrect: false, explanationShort: 'Use your own saved coins to buy what you want!', grade: 'bad', impact: { wallet: -1, debt: 0, stress: 2 } },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
];
