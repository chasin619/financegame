import { Chapter, Story } from './types';

// STORY 1: "Pocket Coins Day"
const story1: Story = {
  id: 'ch1-story1',
  title: 'Pocket Coins Day',
  description: 'Mom gives you coins for the first time. What will you do with them?',
  moments: [
    {
      id: 's1-m1',
      text: 'Mom smiles and hands you 5 shiny coins. "These are yours," she says. You feel excited! What do you do first?',
      choices: [
        {
          id: 's1-m1-a',
          text: 'Hold them carefully and look at them',
          isBest: true,
          consequenceText: 'The coins feel special in your hand ✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m1-b',
          text: 'Toss them in the air like in movies!',
          isBest: false,
          consequenceText: 'One coin rolls away... uh oh 🪙💨',
          emotionalImpact: { coins: -1, mood: 'worried' },
        },
        {
          id: 's1-m1-c',
          text: 'Put them in your pocket right away',
          isBest: false,
          consequenceText: 'Your pocket feels heavy and warm 👖',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's1-m2',
      text: 'You notice your coins jingling. Mom says, "These can buy things, or you can save them." What are you thinking?',
      choices: [
        {
          id: 's1-m2-a',
          text: 'I want to save them somewhere safe!',
          isBest: true,
          consequenceText: 'Smart thinking! 💡',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's1-m2-b',
          text: 'I want to spend them right now!',
          isBest: false,
          consequenceText: 'So many things to buy... but wait 🤔',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's1-m3',
      teaser: 'Your little brother walks by...',
      text: 'Your little brother sees your coins and says "Can I have one?" He looks hopeful. What do you say?',
      choices: [
        {
          id: 's1-m3-a',
          text: '"These are mine, but we can share later"',
          isBest: true,
          consequenceText: 'He smiles. Your coins stay safe 💛',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's1-m3-b',
          text: '"Okay, here\'s one for you!"',
          isBest: false,
          consequenceText: 'He\'s happy, but you have less now 🪙➡️',
          emotionalImpact: { coins: -1, mood: 'happy' },
        },
        {
          id: 's1-m3-c',
          text: '"No! Go away!"',
          isBest: false,
          consequenceText: 'He looks sad... you feel bad too 😔',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's1-m4',
      text: 'Mom hands you a small jar. "This can be your coin bank," she says. Where should you keep it?',
      choices: [
        {
          id: 's1-m4-a',
          text: 'On my dresser where I can see it',
          isBest: true,
          consequenceText: 'Perfect spot! You can watch your coins grow 📦✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m4-b',
          text: 'Under my bed so it\'s hidden',
          isBest: false,
          consequenceText: 'It\'s safe... but you might forget about it 🛏️',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's1-m4-c',
          text: 'I don\'t need a jar, my pocket is fine',
          isBest: false,
          consequenceText: 'Pockets have holes sometimes... 👖❓',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's1-m5',
      text: 'You put your coins in the jar. You still have them all safe! You feel proud. What do you want to do?',
      choices: [
        {
          id: 's1-m5-a',
          text: 'Count them and see how many I have',
          isBest: true,
          consequenceText: 'You count carefully: 1, 2, 3... you know exactly what you have! 🔢',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m5-b',
          text: 'Shake the jar to hear them jingle',
          isBest: false,
          consequenceText: 'Jingle jingle! It sounds nice 🎵',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's1-m6',
      teaser: 'Later that day...',
      text: 'You see an ice cream truck outside! Ice cream costs 2 coins. You have your jar. What do you do?',
      choices: [
        {
          id: 's1-m6-a',
          text: 'Think about it first - do I really want ice cream?',
          isBest: true,
          consequenceText: 'Good thinking! No rush to decide 💭',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's1-m6-b',
          text: 'Grab 2 coins and run to buy ice cream!',
          isBest: false,
          consequenceText: 'Ice cream is yummy... but now you have less 🍦',
          emotionalImpact: { coins: -2, mood: 'excited' },
        },
        {
          id: 's1-m6-c',
          text: 'Ask Mom to buy ice cream instead',
          isBest: false,
          consequenceText: 'Mom says "Use your own coins if you want it" 👩',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's1-m7',
      text: 'The ice cream truck drives away. You notice your coins are still in the jar. How do you feel?',
      choices: [
        {
          id: 's1-m7-a',
          text: 'Happy! I still have all my coins',
          isBest: true,
          consequenceText: 'Your jar is full and safe 🏺✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m7-b',
          text: 'Sad I didn\'t get ice cream',
          isBest: false,
          consequenceText: 'Ice cream would be gone now anyway 🍦💨',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's1-m8',
      text: 'Before bed, you look at your coin jar. Mom asks, "Are you happy you saved your coins?" What do you say?',
      choices: [
        {
          id: 's1-m8-a',
          text: '"Yes! I can use them for something special"',
          isBest: true,
          consequenceText: 'Mom smiles at you 💛',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m8-b',
          text: '"I don\'t know yet"',
          isBest: false,
          consequenceText: 'That\'s okay, you\'re learning! 📚',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's1-m9',
      text: 'You put the jar on your dresser. The coins shine in the light. You think about tomorrow...',
      choices: [
        {
          id: 's1-m9-a',
          text: 'Maybe I\'ll get more coins and save even more!',
          isBest: true,
          consequenceText: 'You feel excited about saving! 🌟',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's1-m9-b',
          text: 'Maybe I\'ll spend them all tomorrow',
          isBest: false,
          consequenceText: 'Spending can be fun... but so is saving 💭',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's1-m10',
      text: 'You close your eyes. Your first coins are safe. Tomorrow is another day. How do you feel?',
      choices: [
        {
          id: 's1-m10-a',
          text: 'Proud and safe!',
          isBest: true,
          consequenceText: 'You did great today! 🎉',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's1-m10-b',
          text: 'Happy and sleepy',
          isBest: false,
          consequenceText: 'Sweet dreams! 😴✨',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
  ],
  happyEnding: {
    good: 'You did an amazing job today! Your coins are safe, and you learned that thinking before choosing makes you feel proud. Tomorrow will be even better! 💛✨',
    okay: 'What a day! You made some choices and learned new things. Your coins are there when you need them. Every day teaches you something! 🌟',
    learning: 'Today was full of new experiences! You learned that coins are special and worth thinking about. Tomorrow you can make even smarter choices! 💡💛',
  },
};

// STORY 2: "Candy Now or Later?"
const story2: Story = {
  id: 'ch1-story2',
  title: 'Candy Now or Later?',
  description: 'You see candy at the store. It looks so good! What will you choose?',
  moments: [
    {
      id: 's2-m1',
      text: 'You\'re at the store with Mom. You see a candy display with bright colors! Your coins are in your pocket. What do you feel?',
      choices: [
        {
          id: 's2-m1-a',
          text: 'Excited! Candy looks so good!',
          isBest: false,
          consequenceText: 'Your heart beats faster 💓',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's2-m1-b',
          text: 'Curious - I want to look closer',
          isBest: true,
          consequenceText: 'You walk closer to see the candy 🍬',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's2-m2',
      text: 'The candy costs 3 coins. You have 5 coins in your pocket from before. You touch your pocket. What do you think?',
      choices: [
        {
          id: 's2-m2-a',
          text: 'If I buy candy, I\'ll have 2 coins left',
          isBest: true,
          consequenceText: 'Smart counting! 🧮',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's2-m2-b',
          text: 'I don\'t care, I just want candy!',
          isBest: false,
          consequenceText: 'The candy looks so tempting 🍭',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's2-m2-c',
          text: 'Maybe I should save all my coins',
          isBest: false,
          consequenceText: 'Saving is good, but treats are okay too 💭',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's2-m3',
      teaser: 'You remember something...',
      text: 'You remember: candy is yummy, but it goes away fast. Toys last longer. What do you decide?',
      choices: [
        {
          id: 's2-m3-a',
          text: 'Maybe I should save for a toy instead',
          isBest: true,
          consequenceText: 'Long-term thinking! 🎯',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's2-m3-b',
          text: 'But I want candy right now!',
          isBest: false,
          consequenceText: 'It\'s hard to wait sometimes 😬',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's2-m4',
      text: 'Mom notices you looking at the candy. She says, "It\'s your choice." You feel the coins in your pocket. What do you do?',
      choices: [
        {
          id: 's2-m4-a',
          text: 'Think for a minute before deciding',
          isBest: true,
          consequenceText: 'You pause and breathe ⏸️',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's2-m4-b',
          text: 'Grab the candy and go to checkout!',
          isBest: false,
          consequenceText: 'Quick choice! 🏃',
          emotionalImpact: { coins: -3, mood: 'excited' },
        },
        {
          id: 's2-m4-c',
          text: 'Ask Mom what I should do',
          isBest: false,
          consequenceText: 'Mom says "What does your heart tell you?" 💬',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's2-m5',
      text: 'You think about what you really want. Candy tastes good for a few minutes. A toy can last for months. What feels right?',
      choices: [
        {
          id: 's2-m5-a',
          text: 'I\'ll wait and save for a toy',
          isBest: true,
          consequenceText: 'You feel proud of yourself! 🌟',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's2-m5-b',
          text: 'I\'ll get the candy this time',
          isBest: false,
          consequenceText: 'It\'s sweet and gone fast 🍬💨',
          emotionalImpact: { coins: -3, mood: 'happy' },
        },
      ],
    },
    {
      id: 's2-m6',
      teaser: 'You walk away from the candy...',
      text: 'You step away from the candy aisle. Your coins are still in your pocket. How do you feel?',
      choices: [
        {
          id: 's2-m6-a',
          text: 'Strong! I made a smart choice',
          isBest: true,
          consequenceText: 'Your coins feel safe 🪙✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's2-m6-b',
          text: 'A little sad, but okay',
          isBest: false,
          consequenceText: 'That\'s honest! 💛',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's2-m7',
      text: 'On the drive home, Mom says, "I\'m proud you thought about your choice." You smile. What are you thinking?',
      choices: [
        {
          id: 's2-m7-a',
          text: 'I can save for something even better!',
          isBest: true,
          consequenceText: 'Big dreams! 🎈',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's2-m7-b',
          text: 'Maybe next time I\'ll get candy',
          isBest: false,
          consequenceText: 'Next time is always there 📅',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's2-m8',
      text: 'At home, you put your coins back in your jar. They\'re all still there! What do you notice?',
      choices: [
        {
          id: 's2-m8-a',
          text: 'My jar looks full and happy!',
          isBest: true,
          consequenceText: 'Saving feels good! 🏺💛',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's2-m8-b',
          text: 'I have the same amount as before',
          isBest: false,
          consequenceText: 'And that\'s great! ✨',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's2-m9',
      text: 'Your friend texts: "Did you get candy?" What do you say?',
      choices: [
        {
          id: 's2-m9-a',
          text: '"No, I\'m saving for something bigger!"',
          isBest: true,
          consequenceText: 'Your friend says "Cool!" 📱',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's2-m9-b',
          text: '"No, maybe next time"',
          isBest: false,
          consequenceText: 'They understand 👍',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's2-m10',
      text: 'Tonight you learned that waiting can feel good. Your coins are safe. You can choose again tomorrow. How do you feel?',
      choices: [
        {
          id: 's2-m10-a',
          text: 'Proud and strong!',
          isBest: true,
          consequenceText: 'You made it! 🏆',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's2-m10-b',
          text: 'Good about myself',
          isBest: false,
          consequenceText: 'That\'s wonderful! 💫',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
      ],
    },
  ],
  happyEnding: {
    good: 'Amazing! You learned that waiting can feel even better than rushing. Your coins are safe, and you\'re thinking about bigger dreams. You\'re growing up! 🌟💛',
    okay: 'Great job today! Choosing isn\'t always easy, but you thought about it. Your coins are there, and tomorrow brings new chances! 💫',
    learning: 'What a learning day! You saw how tempting things can be, and that\'s okay. Next time you\'ll know even more. You\'re doing great! 🎉💛',
  },
};

// STORY 3: "The Toy I Want"
const story3: Story = {
  id: 'ch1-story3',
  title: 'The Toy I Want',
  description: 'You see the perfect toy! But it costs more than you have. What will you do?',
  moments: [
    {
      id: 's3-m1',
      text: 'You walk past a toy store and see it: the most perfect toy ever! Your eyes go wide. How do you feel?',
      choices: [
        {
          id: 's3-m1-a',
          text: 'So excited! I love it!',
          isBest: true,
          consequenceText: 'Your heart jumps! 💓',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's3-m1-b',
          text: 'I NEED that toy NOW!',
          isBest: false,
          consequenceText: 'Strong feelings! 😲',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's3-m2',
      text: 'You look at the price tag: 8 coins. You count your coins at home: only 5. Your shoulders drop. What do you think?',
      choices: [
        {
          id: 's3-m2-a',
          text: 'I can save up until I have enough!',
          isBest: true,
          consequenceText: 'You have a plan! 📋',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's3-m2-b',
          text: 'This is impossible! I\'ll never get it!',
          isBest: false,
          consequenceText: 'Don\'t give up! 😢',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
        {
          id: 's3-m2-c',
          text: 'Maybe I can ask Mom to buy it',
          isBest: false,
          consequenceText: 'Mom says "Save your own coins" 👩',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's3-m3',
      text: 'You need 3 more coins. Mom gives you 2 coins for allowance this week. You\'re getting closer! What do you do with them?',
      choices: [
        {
          id: 's3-m3-a',
          text: 'Put them straight in my jar for the toy!',
          isBest: true,
          consequenceText: 'Now you have 7 coins! 🪙🪙🪙',
          emotionalImpact: { coins: 2, mood: 'happy' },
        },
        {
          id: 's3-m3-b',
          text: 'Spend 1 coin on candy, save 1 coin',
          isBest: false,
          consequenceText: 'Candy is gone, toy is further away 🍬',
          emotionalImpact: { coins: 1, mood: 'calm' },
        },
      ],
    },
    {
      id: 's3-m4',
      teaser: 'A few days pass...',
      text: 'You help Dad wash the car. He gives you 2 coins! "Great work!" he says. Now you have enough! What do you feel?',
      choices: [
        {
          id: 's3-m4-a',
          text: 'So happy! I did it!',
          isBest: true,
          consequenceText: 'You earned it! 🎉',
          emotionalImpact: { coins: 2, mood: 'excited' },
        },
        {
          id: 's3-m4-b',
          text: 'Excited to go buy the toy!',
          isBest: false,
          consequenceText: 'You run to tell Mom! 🏃',
          emotionalImpact: { coins: 2, mood: 'excited' },
        },
      ],
    },
    {
      id: 's3-m5',
      text: 'Before going to the store, you count your coins one more time: 9 coins! The toy costs 8. You have 1 extra. What do you think?',
      choices: [
        {
          id: 's3-m5-a',
          text: 'Perfect! I can buy it and have 1 left over',
          isBest: true,
          consequenceText: 'Smart thinking! 🧠',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's3-m5-b',
          text: 'I can buy it and spend my last coin on candy!',
          isBest: false,
          consequenceText: 'You\'d have zero coins left 🪙💨',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's3-m6',
      text: 'At the store, you hold the toy in your hands. It\'s really yours now! You give 8 coins to the cashier. How does it feel?',
      choices: [
        {
          id: 's3-m6-a',
          text: 'Amazing! I worked hard for this!',
          isBest: true,
          consequenceText: 'Pride fills your heart! 💛',
          emotionalImpact: { coins: -8, mood: 'happy' },
        },
        {
          id: 's3-m6-b',
          text: 'Excited! Finally mine!',
          isBest: false,
          consequenceText: 'You clutch the toy tight 🎁',
          emotionalImpact: { coins: -8, mood: 'excited' },
        },
      ],
    },
    {
      id: 's3-m7',
      text: 'Walking home with your new toy, you notice you still have 1 coin left in your pocket. What do you do with it?',
      choices: [
        {
          id: 's3-m7-a',
          text: 'Save it to start my next goal!',
          isBest: true,
          consequenceText: 'The saving continues! 🔄',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's3-m7-b',
          text: 'Spend it on a small treat',
          isBest: false,
          consequenceText: 'Now you have zero again 🪙💨',
          emotionalImpact: { coins: -1, mood: 'happy' },
        },
      ],
    },
    {
      id: 's3-m8',
      text: 'At home, you play with your toy. It was worth waiting for! You remember when you first saw it and didn\'t have enough. What did you learn?',
      choices: [
        {
          id: 's3-m8-a',
          text: 'I can save for things I really want!',
          isBest: true,
          consequenceText: 'Powerful lesson! 💪',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's3-m8-b',
          text: 'Waiting was hard but okay',
          isBest: false,
          consequenceText: 'That\'s true! ⏰',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's3-m9',
      text: 'Your friend comes over and sees your new toy. "Wow! How did you get it?" they ask. What do you say?',
      choices: [
        {
          id: 's3-m9-a',
          text: '"I saved my coins and waited!"',
          isBest: true,
          consequenceText: 'Your friend is impressed! 🌟',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's3-m9-b',
          text: '"I just bought it"',
          isBest: false,
          consequenceText: 'True, but doesn\'t tell the whole story 📖',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's3-m10',
      text: 'Tonight, the toy sits on your shelf. You earned it yourself by saving. You feel...',
      choices: [
        {
          id: 's3-m10-a',
          text: 'Proud and strong!',
          isBest: true,
          consequenceText: 'You did something hard! 🏆',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's3-m10-b',
          text: 'Happy it\'s finally mine',
          isBest: false,
          consequenceText: 'Enjoy it! 🎁✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
      ],
    },
  ],
  happyEnding: {
    good: 'Incredible! You set a goal, saved your coins, and made it happen! You learned that patient saving makes rewards feel even better. You\'re a champion! 🏆💛',
    okay: 'Wonderful job! Getting that toy took planning and patience. You learned that good things are worth waiting for. Keep it up! 🌟',
    learning: 'You got your toy, and that\'s amazing! You learned that saving takes time, and that\'s okay. Every choice teaches you something new! 💫💛',
  },
};

// STORY 4: "Friends Have Ideas"
const story4: Story = {
  id: 'ch1-story4',
  title: 'Friends Have Ideas',
  description: 'Your friends want to do fun things that cost coins. What will you choose?',
  moments: [
    {
      id: 's4-m1',
      text: 'Your friend Jamie calls: "Want to go to the arcade? It costs 3 coins!" You have 4 coins saved. What do you think first?',
      choices: [
        {
          id: 's4-m1-a',
          text: 'Let me think about my coins first',
          isBest: true,
          consequenceText: 'Smart pause! 💭',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's4-m1-b',
          text: 'Yes! Arcade sounds fun!',
          isBest: false,
          consequenceText: 'Your heart races! 🎮',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's4-m2',
      text: 'You think: "If I spend 3 coins at the arcade, I\'ll only have 1 left." Is the arcade worth it?',
      choices: [
        {
          id: 's4-m2-a',
          text: 'Maybe we can play at the park for free instead',
          isBest: true,
          consequenceText: 'Creative thinking! 🌳',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's4-m2-b',
          text: 'The arcade is special, I want to go!',
          isBest: false,
          consequenceText: 'Fun now, less later 🎮',
          emotionalImpact: { coins: -3, mood: 'excited' },
        },
        {
          id: 's4-m2-c',
          text: 'I don\'t know what to do',
          isBest: false,
          consequenceText: 'That\'s honest! 😬',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's4-m3',
      text: 'You suggest the park to Jamie. They say, "Okay! But the arcade would be cooler." You feel a little torn. What do you do?',
      choices: [
        {
          id: 's4-m3-a',
          text: 'Stick with the park - we can have fun for free!',
          isBest: true,
          consequenceText: 'You stay strong! 💪',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m3-b',
          text: 'Change my mind and go to the arcade',
          isBest: false,
          consequenceText: 'Peer pressure won 😬',
          emotionalImpact: { coins: -3, mood: 'worried' },
        },
      ],
    },
    {
      id: 's4-m4',
      teaser: 'At the park...',
      text: 'You and Jamie play at the park. You climb, run, and laugh! It cost zero coins. How do you feel?',
      choices: [
        {
          id: 's4-m4-a',
          text: 'Happy! This is just as fun!',
          isBest: true,
          consequenceText: 'Fun doesn\'t need to cost coins! 🎉',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m4-b',
          text: 'It\'s okay, but arcade would be better',
          isBest: false,
          consequenceText: 'You\'re still thinking about it 💭',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's4-m5',
      text: 'Jamie says, "You\'re right, this is fun AND free!" Your coins are still safe at home. What do you notice?',
      choices: [
        {
          id: 's4-m5-a',
          text: 'I can have fun without spending!',
          isBest: true,
          consequenceText: 'Big discovery! 🌟',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's4-m5-b',
          text: 'My coins are still there',
          isBest: false,
          consequenceText: 'Safe and sound! 🪙',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's4-m6',
      teaser: 'The next day...',
      text: 'Another friend, Alex, texts: "Ice cream truck! 2 coins! Come quick!" You just saved your coins yesterday. What do you feel?',
      choices: [
        {
          id: 's4-m6-a',
          text: 'Tempted, but I just saved yesterday',
          isBest: true,
          consequenceText: 'You remember your goal! 🎯',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's4-m6-b',
          text: 'Excited! Ice cream sounds perfect!',
          isBest: false,
          consequenceText: 'Sweet but quick 🍦',
          emotionalImpact: { coins: -2, mood: 'excited' },
        },
      ],
    },
    {
      id: 's4-m7',
      text: 'You text Alex: "Not today, saving my coins!" Alex replies "Cool! Want to ride bikes instead?" How do you feel?',
      choices: [
        {
          id: 's4-m7-a',
          text: 'Great! I can have fun AND save!',
          isBest: true,
          consequenceText: 'Win-win! 🚲✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m7-b',
          text: 'Okay, bikes are fun too',
          isBest: false,
          consequenceText: 'You adjust 🚴',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's4-m8',
      text: 'You ride bikes with Alex. The sun is warm, and you\'re laughing. You didn\'t spend any coins. What do you realize?',
      choices: [
        {
          id: 's4-m8-a',
          text: 'The best things in life can be free!',
          isBest: true,
          consequenceText: 'Wise words! 🌞',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m8-b',
          text: 'I can say no to spending and still have fun',
          isBest: false,
          consequenceText: 'That\'s right! 💪',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
      ],
    },
    {
      id: 's4-m9',
      text: 'At home, you check your coin jar. You still have 4 coins! Your friends had fun ideas, but you chose wisely. What do you think?',
      choices: [
        {
          id: 's4-m9-a',
          text: 'I\'m proud I didn\'t waste my coins!',
          isBest: true,
          consequenceText: 'Self-control win! 🏆',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m9-b',
          text: 'I had fun without spending',
          isBest: false,
          consequenceText: 'Perfect! 🎈',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's4-m10',
      text: 'Tonight you learned: friends are great, and fun doesn\'t always cost coins. Your jar is full. How do you feel?',
      choices: [
        {
          id: 's4-m10-a',
          text: 'Smart and happy!',
          isBest: true,
          consequenceText: 'You made great choices! 🌟💛',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's4-m10-b',
          text: 'Good about my decisions',
          isBest: false,
          consequenceText: 'You should! 💫',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
      ],
    },
  ],
  happyEnding: {
    good: 'You\'re a superstar! You learned that friends are fun, but you don\'t have to spend coins every time. Free fun is just as good! Your coins are safe, and your friendships are strong! 💛🎉',
    okay: 'Great work! You navigated friend choices and kept your coins safe. You learned that fun comes in many forms, not just spending. Keep it up! 🌟',
    learning: 'What a day! Friends can be tempting, and that\'s okay. You\'re learning to balance fun and saving. Tomorrow you\'ll be even smarter! 💫💛',
  },
};

// STORY 5: "A Smart Day"
const story5: Story = {
  id: 'ch1-story5',
  title: 'A Smart Day',
  description: 'You put everything you learned together. Today you get to make smart choices all day long!',
  moments: [
    {
      id: 's5-m1',
      text: 'You wake up and look at your coin jar on your dresser. You have 5 coins saved! You feel proud. What do you think about?',
      choices: [
        {
          id: 's5-m1-a',
          text: 'All the smart choices I made to save these!',
          isBest: true,
          consequenceText: 'You\'ve grown so much! 🌱',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's5-m1-b',
          text: 'What I might buy today',
          isBest: false,
          consequenceText: 'So many possibilities 🤔',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's5-m2',
      text: 'Mom says, "Today you can spend your coins however you want - or save them. Your choice!" You feel excited and a little nervous. What do you do?',
      choices: [
        {
          id: 's5-m2-a',
          text: 'Think carefully about my choices today',
          isBest: true,
          consequenceText: 'Wise approach! 🧠',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's5-m2-b',
          text: 'Make a plan for the day',
          isBest: false,
          consequenceText: 'Planning helps! 📋',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's5-m3',
      teaser: 'Morning: At the breakfast table...',
      text: 'Your little sister asks, "Can I borrow 1 coin? I\'ll give it back later!" You remember the last time... she forgot. What do you say?',
      choices: [
        {
          id: 's5-m3-a',
          text: '"These are mine, but I can help you earn your own"',
          isBest: true,
          consequenceText: 'Teaching moment! 📚',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's5-m3-b',
          text: '"Okay, here\'s one coin"',
          isBest: false,
          consequenceText: 'She might not remember 😬',
          emotionalImpact: { coins: -1, mood: 'worried' },
        },
        {
          id: 's5-m3-c',
          text: '"No, you didn\'t give it back last time"',
          isBest: false,
          consequenceText: 'She looks sad 😔',
          emotionalImpact: { coins: 0, mood: 'worried' },
        },
      ],
    },
    {
      id: 's5-m4',
      text: 'At the store, you see THREE things: candy (2 coins), a small toy (3 coins), and stickers (1 coin). You have 5 coins. What interests you most?',
      choices: [
        {
          id: 's5-m4-a',
          text: 'Think about what lasts longest',
          isBest: true,
          consequenceText: 'Quality over quick fun! 💡',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
        {
          id: 's5-m4-b',
          text: 'The candy looks so good!',
          isBest: false,
          consequenceText: 'Tempting! 🍬',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's5-m4-c',
          text: 'I want to save all my coins',
          isBest: false,
          consequenceText: 'Saving is good! 🪙',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's5-m5',
      text: 'You think: "The candy goes away fast. The small toy lasts longer. Stickers are cheap and fun." What do you decide?',
      choices: [
        {
          id: 's5-m5-a',
          text: 'Buy the small toy and save 2 coins',
          isBest: true,
          consequenceText: 'Balanced choice! 🎯',
          emotionalImpact: { coins: -3, mood: 'happy' },
        },
        {
          id: 's5-m5-b',
          text: 'Buy stickers and save 4 coins',
          isBest: false,
          consequenceText: 'Good saving! 🌟',
          emotionalImpact: { coins: -1, mood: 'happy' },
        },
        {
          id: 's5-m5-c',
          text: 'Don\'t buy anything today',
          isBest: false,
          consequenceText: 'All coins saved! 🪙✨',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's5-m6',
      text: 'You bought something (or saved)! Either way, you still have coins left. How does that feel?',
      choices: [
        {
          id: 's5-m6-a',
          text: 'Safe! I didn\'t spend everything!',
          isBest: true,
          consequenceText: 'Security feels good! 🛡️',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's5-m6-b',
          text: 'Good! I made a choice!',
          isBest: false,
          consequenceText: 'Decision made! ✅',
          emotionalImpact: { coins: 0, mood: 'calm' },
        },
      ],
    },
    {
      id: 's5-m7',
      teaser: 'Afternoon: A surprise!',
      text: 'Dad gives you 2 more coins for helping clean! Now your jar has more coins than this morning! What do you think?',
      choices: [
        {
          id: 's5-m7-a',
          text: 'Earning coins feels great!',
          isBest: true,
          consequenceText: 'Work pays off! 💪',
          emotionalImpact: { coins: 2, mood: 'excited' },
        },
        {
          id: 's5-m7-b',
          text: 'Now I have even more!',
          isBest: false,
          consequenceText: 'Your jar grows! 🏺',
          emotionalImpact: { coins: 2, mood: 'happy' },
        },
      ],
    },
    {
      id: 's5-m8',
      text: 'You count your coins before bed. You made smart choices all day! What did you learn about yourself?',
      choices: [
        {
          id: 's5-m8-a',
          text: 'I can think before I spend!',
          isBest: true,
          consequenceText: 'Self-control! 🧠✨',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's5-m8-b',
          text: 'I can save and still have fun!',
          isBest: false,
          consequenceText: 'Balance! ⚖️',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
      ],
    },
    {
      id: 's5-m9',
      text: 'Mom says, "I\'m so proud of how you handled your coins today." You smile big. What do you want to do next?',
      choices: [
        {
          id: 's5-m9-a',
          text: 'Keep making smart choices!',
          isBest: true,
          consequenceText: 'Growth mindset! 🌟',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
        {
          id: 's5-m9-b',
          text: 'Save for something even bigger!',
          isBest: false,
          consequenceText: 'Big dreams! 🎈',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
    {
      id: 's5-m10',
      text: 'You put your coin jar back on the dresser. Today you were smart, kind, and thoughtful. You learned SO much. How do you feel?',
      choices: [
        {
          id: 's5-m10-a',
          text: 'Proud, safe, and happy!',
          isBest: true,
          consequenceText: 'You\'re amazing! 🏆💛',
          emotionalImpact: { coins: 0, mood: 'happy' },
        },
        {
          id: 's5-m10-b',
          text: 'Ready for tomorrow!',
          isBest: false,
          consequenceText: 'The adventure continues! 🚀',
          emotionalImpact: { coins: 0, mood: 'excited' },
        },
      ],
    },
  ],
  happyEnding: {
    good: 'WOW! You are a money champion! Today you made smart choices, thought before spending, and your coins are SAFE! You learned that you\'re strong, smart, and capable. Tomorrow is full of possibilities! 🏆💛✨',
    okay: 'Fantastic day! You made choices, learned from them, and kept coins safe. You\'re growing every single day! Your jar is there, your future is bright! 🌟💫',
    learning: 'What an adventure! Today you practiced making choices, and that\'s what matters. Every day you get smarter and stronger. Your coins are safe, and you\'re learning! 💛🎉',
  },
};

export const chapter1: Chapter = {
  id: 'chapter-1',
  number: 1,
  title: 'My First Money',
  stories: [story1, story2, story3, story4, story5],
};
