import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateAbilityItemDto,
  CreateAbilitySubTypeDto,
  CreateAbilityTypeDto,
  AbilityDto,
  UpdateAbilityDto,
  DeleteAbilityPropertyDto,
} from './dto/create-ability.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { UserService } from '../user.service';
import { HandleNeo4jResult } from '../../common/decorators/extract-neo4j-record.decorator';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
  Porperties,
} from '../../common/interfaces/common.interface';
import * as _ from 'lodash';
import {
  noe4jDateReturn,
  successReturn,
  unManualChangeableProperties,
} from '../../common/constants/common.constant';
import { query } from 'express';

const NODE_TYPE = ['AbilityType', 'AbilitySubType', 'AbilityItem'];
const RELATIONSHIP_TYPE = ['HAS_ABILITY_TYPE', 'HAS_SUB_TYPE', 'HAS_ITEM'];

@Injectable()
export class AbilityService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly userService: UserService,
  ) {
    this.createIndex();
  }

  async createIndex() {
    try {
      _.each(NODE_TYPE, (ability) => {
        this.neo4jService.write(
          `CREATE INDEX ${ability.replace(/^(.)/, (match) => match.toLowerCase())}Index IF NOT EXISTS FOR (a:${ability}) ON (a.name)`,
        );
      });
    } catch (error) {
      throw new InternalServerErrorException('Error when init ability', {
        cause: error,
      });
    }
  }

  matchAbilityType =
    'MATCH (:User {username: $username})-[:HAS_ABILITY_TYPE]->(a:AbilityType {name: $abilityTypeName})';
  matchAbilitySubType =
    'MATCH (a)-[:HAS_SUB_TYPE]->(as:AbilitySubType {name: $abilitySubTypeName})';
  matchAbilityItem =
    'MATCH (as)-[:HAS_ITEM]->(ai:AbilityItem {name: $itemName})';

  matchALLType =
    'MATCH (:User {username: $username})-[:HAS_ABILITY_TYPE]->(a:AbilityType)';
  matchALLSubType = 'MATCH (a)-[:HAS_SUB_TYPE]->(as:AbilitySubType)';
  matchALLItem = 'MATCH (as)-[:HAS_ITEM]->(ai:AbilityItem)';

  createNode = (ability: string) => `
    CALL apoc.create.node(["${ability}"], $properties)
    YIELD node AS n
    SET n.name = $name,
        n.createdAt = datetime(),
        n.updatedAt = datetime(),
        n.createdBy = $username
    WITH n`;

  updateNode = (finalVariable) => `
      CALL apoc.create.setProperty(${finalVariable}, $propertyName, $propertyValue)
      YIELD node
      RETURN node
      `;

  async getAbilityQuery(
    username: string,
    abilityTypeName: string,
    abilitySubTypeName?: string,
    itemName?: string,
    fetchAllChildren?: boolean,
  ) {
    let query = this.matchAbilityType;
    let queryParams = { username, abilityTypeName };

    let finalVariable = 'a';

    if (abilitySubTypeName) {
      query += this.matchAbilitySubType;
      queryParams['abilitySubTypeName'] = abilitySubTypeName;
      finalVariable = 'as';
    } else if (fetchAllChildren) {
      query += this.matchALLSubType;
      finalVariable += ',as';
    }

    if (itemName) {
      query += this.matchAbilityItem;
      queryParams['itemName'] = itemName;
      finalVariable = 'ai';
    } else if (fetchAllChildren) {
      query += this.matchALLItem;
      finalVariable += ',ai';
    }

    return { query, queryParams, finalVariable };
  }

  @HandleNeo4jResult(false)
  async queryAbility(
    username: string,
    abilityTypeName: string,
    abilitySubTypeName?: string,
    itemName?: string,
  ): Neo4jExtractSingle {
    const { query, queryParams, finalVariable } = await this.getAbilityQuery(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    );

    return await this.neo4jService.read(
      `${query}
          RETURN { 
            elementId: elementId(${finalVariable}), 
            properties: ${finalVariable} {.*, ${noe4jDateReturn(finalVariable)}}
          } AS u`,
      queryParams,
    );
  }

  async getAbility(
    username: string,
    abilityTypeName: string,
    abilitySubTypeName?: string,
    itemName?: string,
    properties: Array<string> = ['name'],
  ): Promise<{ [key: string]: any } | null> {
    const data = await this.queryAbility(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    );
    if (!data) return null;

    return _.pick(data, properties);
  }

  async checkAbilityExist(
    username: string,
    abilityTypeName: string,
    abilitySubTypeName?: string,
    itemName?: string,
  ) {
    const data = await this.getAbility(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
      ['name'],
    );
    if (!data || _.keys(data).length <= 0) {
      return false;
    }
    return true;
  }

  async createAbilityType({
    username,
    name,
    properties,
  }: CreateAbilityTypeDto) {
    if (!(await this.userService.checkUserExist(username))) {
      throw new BadRequestException('User not exist');
    }

    if (await this.checkAbilityExist(username, name)) {
      throw new BadRequestException('Ability type already exist');
    }

    await this.neo4jService.write(
      `
        ${this.createNode('AbilityType')}
        MATCH (u:User {username: $username}) 
        CREATE (u)-[:HAS_ABILITY_TYPE]->(n)
      `,
      { username, name, properties },
    );
    return successReturn;
  }

  async createAbilitySubType({
    username,
    abilityTypeName,
    name,
    properties,
  }: CreateAbilitySubTypeDto) {
    if (!(await this.userService.checkUserExist(username))) {
      throw new BadRequestException('User not exist');
    }

    if (!(await this.checkAbilityExist(username, abilityTypeName))) {
      throw new BadRequestException('Ability type not exist');
    }

    if (await this.checkAbilityExist(username, abilityTypeName, name)) {
      throw new BadRequestException('Ability sub type already exist');
    }

    await this.neo4jService.write(
      `
        ${this.createNode('AbilitySubType')}
        ${this.matchAbilityType}
        CREATE (a)-[:HAS_SUB_TYPE]->(n)
      `,
      { username, abilityTypeName, name, properties },
    );
    return successReturn;
  }

  async createAbilityItemType({
    username,
    abilityTypeName,
    abilitySubTypeName,
    name,
    properties,
  }: CreateAbilityItemDto) {
    if (!(await this.userService.checkUserExist(username))) {
      throw new BadRequestException('User not exist');
    }

    if (!(await this.checkAbilityExist(username, abilityTypeName))) {
      throw new BadRequestException('Ability type not exist');
    }

    if (
      !(await this.checkAbilityExist(
        username,
        abilityTypeName,
        abilitySubTypeName,
      ))
    ) {
      throw new BadRequestException('Ability sub type not exist');
    }

    if (
      await this.checkAbilityExist(
        username,
        abilityTypeName,
        abilitySubTypeName,
        name,
      )
    ) {
      throw new BadRequestException('Ability item already exist');
    }

    await this.neo4jService.write(
      `
        ${this.createNode('AbilityItem')}
        ${this.matchAbilityType}
        ${this.matchAbilitySubType}
        CREATE (as)-[:HAS_ITEM]->(n)
      `,
      { username, abilityTypeName, abilitySubTypeName, name, properties },
    );
    return successReturn;
  }

  async updateAbility({
    username,
    propertyName,
    propertyValue,
    abilityTypeName,
    abilitySubTypeName,
    itemName,
  }: UpdateAbilityDto) {
    if (!(await this.userService.checkUserExist(username))) {
      throw new BadRequestException('User not exist');
    }

    if (
      itemName &&
      !(await this.checkAbilityExist(
        username,
        abilityTypeName,
        abilitySubTypeName,
        itemName,
      ))
    ) {
      throw new BadRequestException('Ability not exist');
    }

    const { query, queryParams, finalVariable } = await this.getAbilityQuery(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    );

    await this.neo4jService.write(
      `${query}
       ${this.updateNode(finalVariable)}
      `,
      { ...queryParams, propertyName, propertyValue },
    );
    return successReturn;
  }

  // async updateAbilityName({
  //   username,
  //   name,
  //   newName,
  //   abilityTypeName,
  //   abilitySubTypeName,
  //   itemName,
  // }: UpdateAbilityNameDto) {
  //   if (
  //     abilitySubTypeName &&
  //     !(await this.checkAbilityExist(
  //       username,
  //       abilityTypeName,
  //       abilitySubTypeName,
  //     ))
  //   ) {
  //     throw new BadRequestException('Ability sub type not exist');
  //   }

  //   if (_.includes(unManualChangeableProperties, name)){
  //     throw new BadRequestException('Unchangeable property')
  //   }

  //   const { query, queryParams, finalVariable } = await this.getAbilityQuery(
  //     username,
  //     abilityTypeName,
  //     abilitySubTypeName,
  //     itemName,
  //   );

  //   await this.neo4jService.write(
  //     `
  //       ${query}
  //       CALL apoc.refactor.rename.nodeProperty($name, $newName, [${finalVariable}])
  //       YIELD batches
  //       RETURN batches
  //       `,
  //     { ...queryParams, name, newName },
  //   );
  //   return successReturn;
  // }

  async deleteProperty({
    username,
    property,
    abilityTypeName,
    abilitySubTypeName,
    itemName,
  }: DeleteAbilityPropertyDto) {
    if (
      abilitySubTypeName &&
      !(await this.checkAbilityExist(
        username,
        abilityTypeName,
        abilitySubTypeName,
        itemName,
      ))
    ) {
      throw new BadRequestException('Ability sub type not exist');
    }

    if (_.includes(unManualChangeableProperties, property)) {
      throw new BadRequestException('Unchangeable property');
    }

    const { query, queryParams, finalVariable } = await this.getAbilityQuery(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    );

    return await this.neo4jService.write(
      `
        ${query}
        WITH ${finalVariable}
        CALL apoc.create.removeProperties(${finalVariable}, [$property])
        YIELD node
        RETURN node AS u
    `,
      { ...queryParams, property },
    );
  }

  async deleteAbility({
    username,
    abilityTypeName,
    abilitySubTypeName,
    itemName,
  }: AbilityDto) {
    if (
      abilitySubTypeName &&
      !(await this.checkAbilityExist(
        username,
        abilityTypeName,
        abilitySubTypeName,
        itemName,
      ))
    ) {
      throw new BadRequestException('Ability not exist');
    }

    const { query, queryParams, finalVariable } = await this.getAbilityQuery(
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
      true,
    );

    let propertyName = itemName || abilitySubTypeName || abilityTypeName;

    await this.neo4jService.write(
      `
        ${query}
        DETACH DELETE ${finalVariable}
        `,
      { ...queryParams, propertyName },
    );
    return successReturn;
  }

  @HandleNeo4jResult()
  async findAllByUser(username: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `${this.matchALLType}
      ${this.matchALLSubType}
      ${this.matchALLItem}
        WITH a, as, collect(ai) AS items
        WITH a, collect({subType: as, items: items}) AS SubTypes
        RETURN {AbilityType: a, SubTypes: SubTypes} AS u
        `,
      { username },
    );
  }
}
