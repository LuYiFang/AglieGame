export const noe4jDateReturn = `
    createdAt: apoc.date.format(d.createdAt.epochMillis, 'ms', 'yyyy-MM-dd HH:mm:ss'), 
    updatedAt: apoc.date.format(d.updatedAt.epochMillis, 'ms', 'yyyy-MM-dd HH:mm:ss')`;
