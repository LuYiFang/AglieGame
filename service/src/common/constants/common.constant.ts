export const noe4jDateReturn = (variableName = 'd') => `
    createdAt: apoc.date.format(${variableName}.createdAt.epochMillis, 'ms', 'yyyy-MM-dd HH:mm:ss'), 
    updatedAt: apoc.date.format(${variableName}.updatedAt.epochMillis, 'ms', 'yyyy-MM-dd HH:mm:ss')`;
