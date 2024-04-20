const { api, postApi, getApi, deleteApi, patchApi } = require('./fetchApi');

const abilities = [
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

const abilitySubs = [
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

const abilityItems = [
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

const createAbilities = async () => {
  await Promise.all(
    abilities.map((ability) => {
      return postApi(`${api}/ability/type`, {
        username: 'Alice',
        ...ability,
      });
    }),
  );

  await Promise.all(
    abilitySubs.map((abilitySub) => {
      return postApi(`${api}/ability/sub`, {
        username: 'Alice',
        ...abilitySub,
      });
    }),
  );

  await Promise.all(
    abilityItems.map((abilityItem) => {
      return postApi(`${api}/ability/item`, {
        username: 'Alice',
        ...abilityItem,
      });
    }),
  );
};

const getAllByUser = async () => {
  const data = await getApi(`${api}/ability/Alice/all`);
  console.log('data', data);
};

const createTest = async () => {
  postApi(`${api}/ability/type`, {
    username: 'Alice',
    name: 'testType',
    properties: {
      importance: ['low', 'medium', 'high'],
      importanceRange: [0, 100],
      importanceThreshold: [33, 66],
      levels: ['low', 'medium', 'high'],
      levelRange: [0, 100],
      levelThreshold: [33, 66],
    },
  });

  postApi(`${api}/ability/sub`, {
    username: 'Alice',
    abilityTypeName: 'testType',
    name: 'testSubType',
    properties: {},
  });

  postApi(`${api}/ability/item`, {
    username: 'Alice',
    abilityTypeName: 'testType',
    abilitySubTypeName: 'testSubType',
    name: 'test',
    properties: {
      importanceScore: 50,
      score: 20,
    },
  });
};

const testDelete = async () => {
  await deleteApi(
    `${api}/ability/Alice/equipment/computer/custom-built computer`,
  );
  await deleteApi(`${api}/ability/Alice/skill/computer Language`);
  await deleteApi(`${api}/ability/Alice/quality`);
};

const updateAbility = async () => {
  await patchApi(`${api}/ability`, {
    username: 'Alice',
    propertyName: 'levelThreshold',
    propertyValue: [30, 66],
    abilityTypeName: 'equipment',
  });

  await patchApi(`${api}/ability`, {
    username: 'Alice',
    propertyName: 'description',
    propertyValue: 'computer OS',
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'OS',
  });

  await patchApi(`${api}/ability`, {
    username: 'Alice',
    propertyName: 'score',
    propertyValue: 95,
    abilityTypeName: 'equipment',
    abilitySubTypeName: 'OS',
    itemName: 'macOS',
  });
};

const deleteAbilityProperty = async () => {
  await deleteApi(`${api}/ability/property/Alice/skill/container/docker/0000`);
  await deleteApi(
    `${api}/ability/property/Alice/skill/project management/jira/difficultyScore`,
  );
};

createAbilities();
getAllByUser();

createTest();
testDelete();

updateAbility();
deleteAbilityProperty();
