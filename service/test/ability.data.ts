export const abilities = [
  {
    name: 'equipment',
    properties: {
      levels: ['low', 'medium', 'high'],
      levelRange: [0, 100],
      levelThreshold: [33, 66],
      proficiencies: ['low', 'medium', 'high'],
      proficiencyRange: [0, 100],
      proficiencyThreshold: [33, 66],
    },
  },
  {
    name: 'skill',
    properties: {
      difficulties: ['low', 'medium', 'high'],
      difficultyRange: [0, 100],
      difficultyThreshold: [33, 66],
      proficiencies: ['low', 'medium', 'high'],
      proficiencyRange: [0, 100],
      proficiencyThreshold: [33, 66],
    },
  },
  {
    name: 'quality',
    properties: {
      importance: ['low', 'medium', 'high'],
      importanceRange: [0, 100],
      importanceThreshold: [33, 66],
      levels: ['low', 'medium', 'high'],
      levelRange: [0, 100],
      levelThreshold: [33, 66],
    },
  },
];

export const abilitySubs = [
  {
    abilityTypeName: 'equipment',
    name: 'computer',
    properties: {},
  },
  {
    abilityTypeName: 'equipment',
    name: 'OS',
    properties: {},
  },
  {
    abilityTypeName: 'skill',
    name: 'computer Language',
    properties: {},
  },
  {
    abilityTypeName: 'skill',
    name: 'container',
    properties: {},
  },
  {
    abilityTypeName: 'skill',
    name: 'project management',
    properties: {},
  },
  {
    abilityTypeName: 'quality',
    name: 'stress resistance',
    properties: {},
  },
  {
    abilityTypeName: 'quality',
    name: 'social',
    properties: {},
  },
];

export const abilityItems = [
  {
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'computer',
    name: 'macbook',
    properties: {
      score: 80,
      proficiency: 20,
      cpu: 'm3',
    },
  },
  {
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'computer',
    name: 'custom-built computer',
    properties: {
      score: 80,
      proficiency: 90,
      cpu: 'i7',
    },
  },
  {
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'OS',
    name: 'macOS',
    properties: {
      score: 90,
      proficiency: 20,
    },
  },
  {
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'OS',
    name: 'windows11',
    properties: {
      score: 50,
      proficiency: 90,
    },
  },
  {
    abilityTypeName: 'skill',
    abilitySubTypeName: 'computer Language',
    name: 'python',
    properties: {
      difficultyScore: 20,
      proficiencyScore: 90,
    },
  },
  {
    abilityTypeName: 'skill',
    abilitySubTypeName: 'computer Language',
    name: 'javascript',
    properties: {
      difficultyScore: 20,
      proficiencyScore: 85,
    },
  },
  {
    abilityTypeName: 'skill',
    abilitySubTypeName: 'container',
    name: 'docker',
    properties: {
      difficultyScore: 50,
      proficiencyScore: 70,
    },
  },
  {
    abilityTypeName: 'skill',
    abilitySubTypeName: 'project management',
    name: 'notion',
    properties: {
      difficultyScore: 60,
      proficiencyScore: 80,
    },
  },
  {
    abilityTypeName: 'skill',
    abilitySubTypeName: 'project management',
    name: 'jira',
    properties: {
      difficultyScore: 70,
      proficiencyScore: 50,
    },
  },
  {
    abilityTypeName: 'quality',
    abilitySubTypeName: 'stress resistance',
    name: 'self-regulation',
    properties: {
      importanceScore: 60,
      score: 60,
    },
  },
  {
    abilityTypeName: 'quality',
    abilitySubTypeName: 'stress resistance',
    name: 'emotional stability',
    properties: {
      importanceScore: 80,
      score: 80,
    },
  },
  {
    abilityTypeName: 'quality',
    abilitySubTypeName: 'social',
    name: 'communication skills',
    properties: {
      importanceScore: 50,
      score: 60,
    },
  },
  {
    abilityTypeName: 'quality',
    abilitySubTypeName: 'social',
    name: 'expression',
    properties: {
      importanceScore: 50,
      score: 20,
    },
  },
];
