import { UserAnswers } from "./types";

export const filipeAnswers: UserAnswers = {
  // Age is computed dynamically in the Filipe page — this is a fallback
  age: 39,
  sex: "male",
  country: "PT",
  whoopEnabled: true,
  whoopAge: 35.6,
  exerciseDays: null,
  sleepHours: null,
  smoking: 1, // quit 10+ years ago
  upf: 27,
  body: 80,
  workMovement: 10,
  workStress: 50,
  closeTies: 5,
  monday: 90,
  optimism: 100,
};

export const filipeCommentary = {
  bio: "I'm Filipe Macedo. I build things, write a bit, and split my time between Lisbon and NYC.",

  whyIBuiltThis:
    "I'm turning 40 this year, and a question kept nagging at me: am I past the halfway point of my life? I couldn't shake it, so I built this calculator to answer it.",

  headline:
    "Not quite halfway. I have roughly as much life ahead of me as I've already lived.",

  whatTheMathSays: [
    {
      title: "Close relationships (+3.0y)",
      text: "I have the deep social infrastructure most 40-year-old men don't. This is the single largest contribution to my expected lifespan.",
    },
    {
      title: "Optimism (+3.0y)",
      text: "Expecting good things is, according to the research, not just nicer to live with but measurably life-extending.",
    },
    {
      title: "Whoop Age (+2.6y)",
      text: "My body is doing the hard work of being 4.4 years younger than my birthday.",
    },
    {
      title: "Monday mornings (+2.5y)",
      text: "Having work that genuinely energizes me at 40 is rarer than it sounds.",
    },
  ],

  costingYears: [
    {
      title: "Work stress (−1.0y)",
      text: 'Middle-of-the-road "normal ups and downs" is fine, but this is where I have genuine room to improve without changing what I do.',
    },
    {
      title: "Work movement (−0.8y)",
      text: "I sit all day. Early-stage founder life guarantees this.",
    },
  ],

  personalNote:
    "I built this calculator for my 40th birthday. Not because I'm obsessed with longevity — but because I wanted to feel the arithmetic of my own life. The four biggest additions to my years come from four different domains: relationships, outlook, biology, and purpose. That's what you want — resilience in depth. The two things costing me years are both work-related, and they're both fixable. Standing desk + walking meetings + actually taking my workouts seriously on work days are worth more than any of the meaning-side optimization I'm probably tempted toward.",

  disclaimer:
    "This is a toy, not medical advice. It's also a reasonably informed toy.",
};
