import { QuizQuestion } from './types';

export const questionBank: QuizQuestion[] = [
  // SPENDING QUESTIONS
  {
    id: 'spend-01',
    prompt: 'Your friends invite you to a concert tonight. Tickets are $80, but you only have $120 left until payday in 3 days.',
    answers: [
      { id: 'a', label: 'Go! Use my credit card for the ticket', isCorrect: false, explanationShort: 'Small debts add up fast with 24% APR interest', impactTag: 'High-interest debt' },
      { id: 'b', label: 'Go, use cash - I can skip lunch this week', isCorrect: false, explanationShort: 'Skipping meals risks your health and energy', impactTag: 'Health risk' },
      { id: 'c', label: 'Skip it - suggest a free hangout instead', isCorrect: true, explanationShort: 'Real friends understand. Free fun exists!', impactTag: 'Smart choice' },
      { id: 'd', label: 'Ask to borrow money from a friend', isCorrect: false, explanationShort: 'Borrowing from friends damages relationships', impactTag: 'Relationship risk' },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'spend-02',
    prompt: 'You see the new iPhone on sale for $899. You have $1,200 in savings and your current phone works fine.',
    answers: [
      { id: 'a', label: 'Buy it - I deserve an upgrade', isCorrect: false, explanationShort: 'Want ≠ need. Working phone = no urgency', impactTag: 'Impulse buy' },
      { id: 'b', label: 'Buy it with 0% financing over 24 months', isCorrect: false, explanationShort: 'Monthly payments lock up future income', impactTag: 'Payment trap' },
      { id: 'c', label: 'Keep current phone until it breaks', isCorrect: true, explanationShort: 'Maximize value from what you own', impactTag: 'Wise delay' },
      { id: 'd', label: 'Trade in old phone and buy refurbished', isCorrect: false, explanationShort: 'Better than new, but still unnecessary now', impactTag: 'Partial win' },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'spend-03',
    prompt: 'Your coffee habit costs $6 daily. That\'s $180/month. What should you do?',
    answers: [
      { id: 'a', label: 'Keep it - it\'s my only luxury', isCorrect: false, explanationShort: '$2,160/year could be emergency fund or vacation', impactTag: 'Hidden cost' },
      { id: 'b', label: 'Make coffee at home - costs $0.50/day', isCorrect: true, explanationShort: 'Save $1,980/year. Same caffeine, better savings', impactTag: 'Smart swap' },
      { id: 'c', label: 'Cut to 3 days per week', isCorrect: false, explanationShort: 'Helps, but homemade saves way more', impactTag: 'Partial fix' },
      { id: 'd', label: 'Switch to cheaper fast food coffee', isCorrect: false, explanationShort: 'Still spending $90/month unnecessarily', impactTag: 'Still expensive' },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'spend-04',
    prompt: 'Black Friday sale: TV normally $800, now $499. You weren\'t planning to buy one.',
    answers: [
      { id: 'a', label: 'Buy it! I\'m "saving" $301', isCorrect: false, explanationShort: 'You\'re not saving - you\'re spending $499 you didn\'t plan to', impactTag: 'Marketing trap' },
      { id: 'b', label: 'Skip it - no TV was the plan', isCorrect: true, explanationShort: 'A "deal" you don\'t need is still money wasted', impactTag: 'Discipline win' },
      { id: 'c', label: 'Put it on my credit card - it\'s a deal', isCorrect: false, explanationShort: 'Credit card interest erases the "savings"', impactTag: 'Debt for wants' },
      { id: 'd', label: 'Buy it and sell my old working TV', isCorrect: false, explanationShort: 'Still net spending on an unplanned purchase', impactTag: 'Justification trap' },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
  {
    id: 'spend-05',
    prompt: 'Your car needs $400 in repairs. You have $200 cash and a credit card.',
    answers: [
      { id: 'a', label: 'Put all $400 on credit card', isCorrect: false, explanationShort: 'Use your cash first, then credit only for the gap', impactTag: 'Unnecessary debt' },
      { id: 'b', label: 'Pay $200 cash, $200 on credit', isCorrect: true, explanationShort: 'Minimize debt. Pay off the $200 ASAP', impactTag: 'Smart split' },
      { id: 'c', label: 'Skip the repair until payday', isCorrect: false, explanationShort: 'Small problems become expensive big problems', impactTag: 'Risky delay' },
      { id: 'd', label: 'Ask for payment plan from mechanic', isCorrect: false, explanationShort: 'Good option, but use your $200 first', impactTag: 'Decent backup' },
    ],
    difficulty: 'medium',
    category: 'spending',
  },

  // DEBT QUESTIONS
  {
    id: 'debt-01',
    prompt: 'You have $2,000 credit card debt at 24% APR. Minimum payment is $40. You have $300 extra this month.',
    answers: [
      { id: 'a', label: 'Pay the $40 minimum, save $260', isCorrect: false, explanationShort: 'You\'ll pay $960 in interest over time', impactTag: 'Interest trap' },
      { id: 'b', label: 'Pay $340 total toward the card', isCorrect: true, explanationShort: 'Kills debt faster, saves hundreds in interest', impactTag: 'Debt destroyer' },
      { id: 'c', label: 'Pay $40, spend $260 on wants', isCorrect: false, explanationShort: 'Debt grows while you buy stuff', impactTag: 'Backwards priority' },
      { id: 'd', label: 'Pay $150, save $150', isCorrect: false, explanationShort: 'Better than minimum, but emergency fund can wait until debt is gone', impactTag: 'Split focus' },
    ],
    difficulty: 'medium',
    category: 'debt',
  },
  {
    id: 'debt-02',
    prompt: 'You get a pre-approved credit card offer: $5,000 limit, 0% APR for 12 months, then 27%.',
    answers: [
      { id: 'a', label: 'Accept - free money for a year!', isCorrect: false, explanationShort: 'Teaser rates train you to carry debt', impactTag: 'Future trap' },
      { id: 'b', label: 'Decline - I don\'t need more credit', isCorrect: true, explanationShort: 'More credit = more temptation to overspend', impactTag: 'Discipline choice' },
      { id: 'c', label: 'Accept but don\'t use it', isCorrect: false, explanationShort: 'Why add temptation? Unused cards often have fees', impactTag: 'Pointless risk' },
      { id: 'd', label: 'Accept and transfer my current balance', isCorrect: false, explanationShort: 'Balance transfers have fees and you must pay off in 12mo', impactTag: 'Advanced move' },
    ],
    difficulty: 'hard',
    category: 'debt',
  },
  {
    id: 'debt-03',
    prompt: 'Paying minimums on $3,000 debt will take 15 years and cost $5,200 in interest. What now?',
    answers: [
      { id: 'a', label: 'Just pay minimums - I can\'t afford more', isCorrect: false, explanationShort: 'Cut one expense. Even $20 extra/month helps', impactTag: 'Giving up' },
      { id: 'b', label: 'Find $50-100/month extra to attack debt', isCorrect: true, explanationShort: 'Pays off in 3-4 years, saves $4,000+', impactTag: 'Game changer' },
      { id: 'c', label: 'Get a consolidation loan', isCorrect: false, explanationShort: 'Only helps if you fix spending habits first', impactTag: 'Band-aid fix' },
      { id: 'd', label: 'Ignore it - it\'s overwhelming', isCorrect: false, explanationShort: 'Debt doesn\'t disappear. It grows.', impactTag: 'Denial danger' },
    ],
    difficulty: 'medium',
    category: 'debt',
  },
  {
    id: 'debt-04',
    prompt: 'You have $500 cash. Should you build savings or pay down $2,000 credit card debt?',
    answers: [
      { id: 'a', label: 'Save all $500 for emergencies', isCorrect: false, explanationShort: 'Credit card charges 24% interest. Kill debt first', impactTag: 'Wrong priority' },
      { id: 'b', label: 'Pay all $500 toward credit card', isCorrect: true, explanationShort: 'Once debt is gone, build savings aggressively', impactTag: 'Attack debt' },
      { id: 'c', label: 'Split: $250 savings, $250 to card', isCorrect: false, explanationShort: 'Debt costs more than savings earns', impactTag: 'Slow progress' },
      { id: 'd', label: 'Treat myself - I earned this money', isCorrect: false, explanationShort: 'Debt with interest is an emergency', impactTag: 'Self-sabotage' },
    ],
    difficulty: 'easy',
    category: 'debt',
  },
  {
    id: 'debt-05',
    prompt: 'Your friend offers to lend you $1,000 interest-free to pay off credit cards. Should you accept?',
    answers: [
      { id: 'a', label: 'Yes! No interest is better than 24% APR', isCorrect: false, explanationShort: 'Money + friendship = relationship poison', impactTag: 'Friendship risk' },
      { id: 'b', label: 'No - keep debt away from friendships', isCorrect: true, explanationShort: 'Thank them, then budget aggressively to fix it yourself', impactTag: 'Protect relationship' },
      { id: 'c', label: 'Accept if I write a contract', isCorrect: false, explanationShort: 'Contracts don\'t prevent awkwardness', impactTag: 'Still risky' },
      { id: 'd', label: 'Accept and pay them back first', isCorrect: false, explanationShort: 'One missed payment = ruined friendship', impactTag: 'High stakes' },
    ],
    difficulty: 'medium',
    category: 'debt',
  },

  // SAVINGS QUESTIONS
  {
    id: 'save-01',
    prompt: 'You just got paid $2,400. After rent and bills, you have $600 left. What\'s the first move?',
    answers: [
      { id: 'a', label: 'Move $100 to savings immediately', isCorrect: true, explanationShort: 'Pay yourself first, before temptation hits', impactTag: 'Priority win' },
      { id: 'b', label: 'Keep it all in checking for flexibility', isCorrect: false, explanationShort: 'Money in checking gets spent', impactTag: 'Temptation trap' },
      { id: 'c', label: 'Spend on things I need', isCorrect: false, explanationShort: 'Define "need" carefully. Save first.', impactTag: 'Need vs want' },
      { id: 'd', label: 'Wait until end of month, save what\'s left', isCorrect: false, explanationShort: 'There\'s never anything left', impactTag: 'Classic mistake' },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'save-02',
    prompt: 'Your savings account has $1,200. Your emergency fund goal is $3,000. Then what?',
    answers: [
      { id: 'a', label: 'Keep saving - $3k isn\'t enough', isCorrect: false, explanationShort: '$3k is a good start. Then focus on investing', impactTag: 'Over-saving' },
      { id: 'b', label: 'Start investing while building to $3k', isCorrect: true, explanationShort: 'Split extra money: some to e-fund, some to invest', impactTag: 'Balanced growth' },
      { id: 'c', label: 'Stop saving - treat myself', isCorrect: false, explanationShort: 'Financial security requires both saving AND investing', impactTag: 'Premature reward' },
      { id: 'd', label: 'Increase e-fund goal to $10k first', isCorrect: false, explanationShort: 'Cash loses value to inflation. Invest after $3-6k', impactTag: 'Opportunity cost' },
    ],
    difficulty: 'hard',
    category: 'savings',
  },
  {
    id: 'save-03',
    prompt: 'You get a $600 tax refund. What should you do?',
    answers: [
      { id: 'a', label: 'Straight to savings/emergency fund', isCorrect: true, explanationShort: 'Windfalls are perfect for financial cushion', impactTag: 'Smart windfall' },
      { id: 'b', label: 'Treat myself - it\'s "free money"', isCorrect: false, explanationShort: 'It\'s YOUR money you overpaid the government', impactTag: 'Windfall waste' },
      { id: 'c', label: 'Buy something I\'ve been wanting', isCorrect: false, explanationShort: 'Wants can wait. Security can\'t', impactTag: 'Instant gratification' },
      { id: 'd', label: 'Split: $300 fun, $300 savings', isCorrect: false, explanationShort: 'Better than all fun, but still suboptimal', impactTag: 'Compromise move' },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'save-04',
    prompt: 'Your savings account pays 0.01% interest. A high-yield savings pays 4.5%. What do you do?',
    answers: [
      { id: 'a', label: 'Switch to high-yield savings ASAP', isCorrect: true, explanationShort: '$1,000 earns $45/year vs $0.10. Easy choice', impactTag: 'Free money' },
      { id: 'b', label: 'Stay - switching is too much work', isCorrect: false, explanationShort: '10 minutes of work = $45/year forever', impactTag: 'Lazy money loss' },
      { id: 'c', label: 'Invest it all instead of savings', isCorrect: false, explanationShort: 'Emergency fund stays liquid and safe', impactTag: 'Wrong vehicle' },
      { id: 'd', label: 'My bank is convenient - interest doesn\'t matter', isCorrect: false, explanationShort: 'Convenience costs you real money', impactTag: 'Comfort tax' },
    ],
    difficulty: 'medium',
    category: 'savings',
  },
  {
    id: 'save-05',
    prompt: 'You have no emergency fund. You get $200 extra this month. There\'s also a great sale...',
    answers: [
      { id: 'a', label: 'Start emergency fund with all $200', isCorrect: true, explanationShort: 'First $1,000 emergency fund is THE priority', impactTag: 'Foundation first' },
      { id: 'b', label: '$100 savings, $100 on the sale', isCorrect: false, explanationShort: 'Sales happen every month. Security doesn\'t', impactTag: 'Split temptation' },
      { id: 'c', label: 'Sale now, save next month', isCorrect: false, explanationShort: 'Next month never comes. Emergencies do.', impactTag: 'Future promises' },
      { id: 'd', label: 'Invest it for growth', isCorrect: false, explanationShort: 'Emergency fund comes before investing', impactTag: 'Wrong order' },
    ],
    difficulty: 'easy',
    category: 'savings',
  },

  // INVESTING QUESTIONS
  {
    id: 'invest-01',
    prompt: 'You have $5,000 saved and no debt. Your company offers 401k matching. What do you do?',
    answers: [
      { id: 'a', label: 'Contribute enough to get full match', isCorrect: true, explanationShort: 'Company match = instant 100% return. Free money!', impactTag: 'Free returns' },
      { id: 'b', label: 'Keep it all in savings - investing is risky', isCorrect: false, explanationShort: 'Inflation makes cash lose value. Diversify.', impactTag: 'Risk aversion loss' },
      { id: 'c', label: 'Invest in individual stocks I like', isCorrect: false, explanationShort: 'Index funds beat stock picking 90% of time', impactTag: 'Gambling risk' },
      { id: 'd', label: 'Wait until I have $10k to invest', isCorrect: false, explanationShort: 'Time in market beats timing. Start now.', impactTag: 'Analysis paralysis' },
    ],
    difficulty: 'medium',
    category: 'investing',
  },
  {
    id: 'invest-02',
    prompt: 'A friend made $5,000 on crypto. They say you should invest $2,000. You have that saved.',
    answers: [
      { id: 'a', label: 'Invest $2,000 - I trust my friend', isCorrect: false, explanationShort: 'Past returns ≠ future results. Crypto is volatile', impactTag: 'FOMO risk' },
      { id: 'b', label: 'Pass - stick to boring index funds', isCorrect: true, explanationShort: 'Slow and steady wins. Speculation loses savings', impactTag: 'Smart boring' },
      { id: 'c', label: 'Invest $200 just to try it', isCorrect: false, explanationShort: 'Even "fun money" in speculation is risk you don\'t need', impactTag: 'Gamble lite' },
      { id: 'd', label: 'Research crypto for 6 months first', isCorrect: false, explanationShort: 'By the time you "know" crypto, the bubble pops', impactTag: 'Too late game' },
    ],
    difficulty: 'medium',
    category: 'investing',
  },
  {
    id: 'invest-03',
    prompt: 'The stock market just dropped 15%. Your portfolio is down $3,000. What now?',
    answers: [
      { id: 'a', label: 'Sell everything - protect what\'s left', isCorrect: false, explanationShort: 'Selling locks in losses. Markets recover.', impactTag: 'Panic sell' },
      { id: 'b', label: 'Hold steady - don\'t look at it', isCorrect: true, explanationShort: 'Time heals market wounds. Zoom out 20 years', impactTag: 'Diamond hands' },
      { id: 'c', label: 'Buy more - stocks are on sale', isCorrect: false, explanationShort: 'Good IF you have extra cash. Don\'t force it.', impactTag: 'Advanced move' },
      { id: 'd', label: 'Move everything to savings', isCorrect: false, explanationShort: 'Market timing fails. Stay invested.', impactTag: 'Fear reaction' },
    ],
    difficulty: 'hard',
    category: 'investing',
  },
  {
    id: 'invest-04',
    prompt: 'You can afford $100/month investing. Where should it go?',
    answers: [
      { id: 'a', label: 'Low-cost S&P 500 index fund', isCorrect: true, explanationShort: 'Simple, diversified, low fees. Proven winner', impactTag: 'Index win' },
      { id: 'b', label: 'Pick 3 individual stocks', isCorrect: false, explanationShort: '3 stocks = high risk, not diversified', impactTag: 'Concentration risk' },
      { id: 'c', label: 'Actively managed mutual fund', isCorrect: false, explanationShort: 'High fees eat returns. Index beats active long-term', impactTag: 'Fee drag' },
      { id: 'd', label: 'Gold or real estate', isCorrect: false, explanationShort: '$100/month is too small for real estate', impactTag: 'Wrong vehicle' },
    ],
    difficulty: 'medium',
    category: 'investing',
  },
  {
    id: 'invest-05',
    prompt: 'You\'re 25. Should you invest in a Roth IRA or regular brokerage account?',
    answers: [
      { id: 'a', label: 'Roth IRA - tax-free growth forever', isCorrect: true, explanationShort: 'Pay tax now (low bracket), withdraw tax-free in retirement', impactTag: 'Tax optimization' },
      { id: 'b', label: 'Regular brokerage - more flexibility', isCorrect: false, explanationShort: 'You won\'t need this money for 40 years. Use Roth', impactTag: 'Flexibility illusion' },
      { id: 'c', label: 'Split 50/50 between both', isCorrect: false, explanationShort: 'Max Roth first ($7k/yr limit), then brokerage', impactTag: 'Suboptimal split' },
      { id: 'd', label: 'Wait until I\'m 30 to decide', isCorrect: false, explanationShort: '5 years of compound growth lost forever', impactTag: 'Time lost' },
    ],
    difficulty: 'hard',
    category: 'investing',
  },

  // MINDSET QUESTIONS
  {
    id: 'mind-01',
    prompt: 'Your coworkers go out for $40 lunches weekly. You bring lunch from home. They tease you.',
    answers: [
      { id: 'a', label: 'Join them - I don\'t want to seem cheap', isCorrect: false, explanationShort: 'That\'s $2,000/year. Your future self thanks you', impactTag: 'Peer pressure' },
      { id: 'b', label: 'Keep packing lunch - my goals matter more', isCorrect: true, explanationShort: 'Real wealth is built in private', impactTag: 'Long-term thinking' },
      { id: 'c', label: 'Go every other week as compromise', isCorrect: false, explanationShort: 'Still $1,000/year. Stick to your plan', impactTag: 'Half measure' },
      { id: 'd', label: 'Explain my savings goals to them', isCorrect: false, explanationShort: 'You don\'t owe explanations. Just do you.', impactTag: 'Over-explaining' },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'mind-02',
    prompt: 'You make $50k/year. Your friend makes $80k but has $20k credit card debt. Who\'s better off?',
    answers: [
      { id: 'a', label: 'My friend - higher income is what matters', isCorrect: false, explanationShort: 'Income means nothing if you\'re drowning in debt', impactTag: 'Income illusion' },
      { id: 'b', label: 'Me - if I have no debt and savings', isCorrect: true, explanationShort: 'Net worth and habits matter more than income', impactTag: 'True wealth' },
      { id: 'c', label: 'Friend - they can pay it off faster', isCorrect: false, explanationShort: 'High income + poor habits = permanent debt', impactTag: 'Lifestyle creep' },
      { id: 'd', label: 'Can\'t tell - need more information', isCorrect: false, explanationShort: '$20k debt at 24% APR is a clear problem', impactTag: 'Overthinking' },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'mind-03',
    prompt: 'You feel like you "deserve" expensive things because you work hard. True or false?',
    answers: [
      { id: 'a', label: 'True - hard work should be rewarded', isCorrect: false, explanationShort: 'Reward yourself with financial freedom, not stuff', impactTag: 'Entitlement trap' },
      { id: 'b', label: 'False - hard work doesn\'t justify bad money choices', isCorrect: true, explanationShort: 'Everyone works hard. Build wealth instead.', impactTag: 'Reality check' },
      { id: 'c', label: 'True - but only if I can afford it', isCorrect: false, explanationShort: '"Afford" often means "have cash now" not "should buy"', impactTag: 'Justification game' },
      { id: 'd', label: 'True - YOLO, enjoy life now', isCorrect: false, explanationShort: '40-year-old you with no savings won\'t enjoy it', impactTag: 'Short-term trap' },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'mind-04',
    prompt: 'Your parents say "money doesn\'t buy happiness." How do you respond?',
    answers: [
      { id: 'a', label: 'Agree - money doesn\'t matter much', isCorrect: false, explanationShort: 'Money buys OPTIONS and reduces stress', impactTag: 'Naive view' },
      { id: 'b', label: 'Money buys freedom, which enables happiness', isCorrect: true, explanationShort: 'Financial security = less stress, more choices', impactTag: 'Realistic view' },
      { id: 'c', label: 'Disagree - money buys everything I want', isCorrect: false, explanationShort: 'Stuff fades. Experiences and security last.', impactTag: 'Materialism trap' },
      { id: 'd', label: 'Money doesn\'t matter, just enjoy life', isCorrect: false, explanationShort: 'Can\'t enjoy life when stressed about bills', impactTag: 'Denial mode' },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'mind-05',
    prompt: 'Financial education should be taught in high school. Agree or disagree?',
    answers: [
      { id: 'a', label: 'Agree - most critical life skill', isCorrect: true, explanationShort: 'Money affects every decision. Teach it early.', impactTag: 'Systemic fix' },
      { id: 'b', label: 'Disagree - parents should teach it', isCorrect: false, explanationShort: 'Most parents don\'t know it themselves', impactTag: 'Cycle continues' },
      { id: 'c', label: 'Disagree - you learn by doing', isCorrect: false, explanationShort: 'Why let people destroy credit to "learn"?', impactTag: 'Expensive lesson' },
      { id: 'd', label: 'Neutral - won\'t help much', isCorrect: false, explanationShort: 'Knowledge + early habits = lifetime impact', impactTag: 'Defeatist view' },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },
  {
    id: 'mind-06',
    prompt: 'You see a friend with a brand new luxury car. You feel envious. What\'s the reality?',
    answers: [
      { id: 'a', label: 'They\'re doing better than me financially', isCorrect: false, explanationShort: 'Cars are often leased or financed. It\'s debt, not wealth', impactTag: 'Appearance trap' },
      { id: 'b', label: 'They might be drowning in payments', isCorrect: true, explanationShort: 'Fancy car often = broke. Net worth matters, not looks', impactTag: 'Hidden truth' },
      { id: 'c', label: 'I should get a nice car too', isCorrect: false, explanationShort: 'Keeping up with Joneses = keeping up with debt', impactTag: 'Comparison poison' },
      { id: 'd', label: 'Cars are a good investment', isCorrect: false, explanationShort: 'Cars lose 20% value the moment you drive off', impactTag: 'Depreciation bomb' },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'mind-07',
    prompt: 'Is it better to look rich or BE rich?',
    answers: [
      { id: 'a', label: 'Look rich - perception is reality', isCorrect: false, explanationShort: 'Looking rich keeps you broke. Being rich is invisible', impactTag: 'Image obsession' },
      { id: 'b', label: 'BE rich - wealth is private', isCorrect: true, explanationShort: 'Real wealth: paid-off house, no debt, invested assets', impactTag: 'Stealth wealth' },
      { id: 'c', label: 'Both - you can have both', isCorrect: false, explanationShort: 'Rarely. Most "rich looking" people are in debt', impactTag: 'Illusion belief' },
      { id: 'd', label: 'Neither - money doesn\'t define me', isCorrect: false, explanationShort: 'True, but financial stress affects everything', impactTag: 'Avoidance mode' },
    ],
    difficulty: 'easy',
    category: 'mindset',
  },

  // MIXED SCENARIOS
  {
    id: 'mixed-01',
    prompt: 'You get a 10% raise ($4,000/year). What\'s the best move?',
    answers: [
      { id: 'a', label: 'Upgrade my lifestyle - I earned it', isCorrect: false, explanationShort: 'Lifestyle creep keeps you paycheck-to-paycheck forever', impactTag: 'Creep danger' },
      { id: 'b', label: 'Pretend raise never happened - save/invest it all', isCorrect: true, explanationShort: 'You lived fine before. Bank 100% of raise = wealth', impactTag: 'Stealth savings' },
      { id: 'c', label: 'Split: 50% lifestyle, 50% savings', isCorrect: false, explanationShort: 'Better than all lifestyle, but you don\'t need more stuff', impactTag: 'Half win' },
      { id: 'd', label: 'Pay off debt faster', isCorrect: false, explanationShort: 'Great if you have debt! But answer B assumes no debt', impactTag: 'Context dependent' },
    ],
    difficulty: 'medium',
    category: 'mindset',
  },
  {
    id: 'mixed-02',
    prompt: 'Rent is $1,200/mo. You can afford $1,500. Should you upgrade?',
    answers: [
      { id: 'a', label: 'Yes - more space and nicer place', isCorrect: false, explanationShort: 'That\'s $3,600/year you could invest', impactTag: 'Lifestyle inflation' },
      { id: 'b', label: 'No - invest the $300/month difference', isCorrect: true, explanationShort: '$300/mo invested = $150k in 20 years', impactTag: 'Opportunity cost win' },
      { id: 'c', label: 'Yes - I spend lots of time at home', isCorrect: false, explanationShort: 'Comfort is nice. Wealth is better.', impactTag: 'Rationalization' },
      { id: 'd', label: 'Get a roommate and pay even less', isCorrect: false, explanationShort: 'Smart if you can tolerate it! Save even more', impactTag: 'Advanced frugality' },
    ],
    difficulty: 'medium',
    category: 'spending',
  },
  {
    id: 'mixed-03',
    prompt: 'Your AC breaks in summer. Repair is $800. You have $400 in emergency fund.',
    answers: [
      { id: 'a', label: 'Use emergency fund + $400 credit', isCorrect: true, explanationShort: 'THIS is what emergency funds are for', impactTag: 'Fund purpose' },
      { id: 'b', label: 'Put all $800 on credit card', isCorrect: false, explanationShort: 'Use the emergency fund! That\'s its job', impactTag: 'Ignoring resources' },
      { id: 'c', label: 'Suffer through summer without AC', isCorrect: false, explanationShort: 'Health risk isn\'t worth $800', impactTag: 'Extreme frugality' },
      { id: 'd', label: 'Ask family for money', isCorrect: false, explanationShort: 'You have resources. Use them first.', impactTag: 'Unnecessary ask' },
    ],
    difficulty: 'easy',
    category: 'savings',
  },
  {
    id: 'mixed-04',
    prompt: 'You want to buy a house. You have 5% down payment. Should you buy now or wait for 20%?',
    answers: [
      { id: 'a', label: 'Buy now with 5% down', isCorrect: false, explanationShort: 'PMI insurance costs hundreds/month. Wait for 20%', impactTag: 'Impatience tax' },
      { id: 'b', label: 'Wait and save for 20% down payment', isCorrect: true, explanationShort: 'PMI avoided, better rate, smaller payment', impactTag: 'Patient win' },
      { id: 'c', label: 'Buy now - prices always go up', isCorrect: false, explanationShort: '2008 called. Prices don\'t always rise.', impactTag: 'Speculation risk' },
      { id: 'd', label: 'Never buy - renting is smarter', isCorrect: false, explanationShort: 'Depends on market. But 20% down beats 5%', impactTag: 'Overgeneralization' },
    ],
    difficulty: 'hard',
    category: 'investing',
  },
  {
    id: 'mixed-05',
    prompt: 'Subscription services cost you $150/month total. You use 3 of the 8. What now?',
    answers: [
      { id: 'a', label: 'Cancel the 5 I don\'t use', isCorrect: true, explanationShort: 'That\'s $90/mo ($1,080/yr) wasted on nothing', impactTag: 'Subscription audit' },
      { id: 'b', label: 'Keep them all - I might use them', isCorrect: false, explanationShort: '"Might" = never. Cancel now, resubscribe if needed', impactTag: 'Sunk cost fallacy' },
      { id: 'c', label: 'Cancel 3, keep 5 active ones', isCorrect: false, explanationShort: 'Math is backwards. Keep the 3 you USE', impactTag: 'Confusion' },
      { id: 'd', label: 'Share accounts with friends to split cost', isCorrect: false, explanationShort: 'Against TOS, risky. Just cancel what you don\'t use', impactTag: 'Workaround' },
    ],
    difficulty: 'easy',
    category: 'spending',
  },
];

// Utility to get random questions for a session
export function getRandomQuestions(count: number = 15): QuizQuestion[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questionBank.length));
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] {
  return questionBank.filter(q => q.difficulty === difficulty);
}

// Get questions by category
export function getQuestionsByCategory(category: QuizQuestion['category']): QuizQuestion[] {
  return questionBank.filter(q => q.category === category);
}
