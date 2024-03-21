import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateAbilityItemDto,
  CreateAbilitySubTypeDto,
  CreateAbilityTypeDto,
} from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { UserService } from '../user.service';
import { HandleNeo4jResult } from '../../common/decorators/extract-neo4j-record.decorator';
import { Neo4jExtractSingle } from '../../common/interfaces/common.interface';
import * as _ from 'lodash';
import { noe4jDateReturn } from '../../common/constants/common.constant';

const NODE_TYPE = ['AbilityType', 'AbilitySubType', 'AbilityItem'];
const RELATIONSHIP_TYPE = ['HAS_ABILITY_TYPE', 'HAS_SUB_TYPE', 'HAS_ITEM'];

@Injectable()
export class AbilityService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly userService: UserService,
  ) {}

  matchAbilityType =
    'MATCH (:User {username: $username})-[:HAS_ABILITY_TYPE]->(a:AbilityType {name: $abilityTypeName})';
  matchAbilitySubType =
    'MATCH (a)-[:HAS_SUB_TYPE]->(as:AbilitySubType {name: $abilitySubTypeName})';
  matchAbilityItem =
    'MATCH (as)-[:HAS_ITEM]->(d:AbilityItem {name: $itemName})';

  @HandleNeo4jResult(false)
  async queryAbility(
    username: string,
    abilityTypeName: string,
    abilitySubTypeName?: string,
    itemName?: string,
  ): Neo4jExtractSingle {
    let query = this.matchAbilityType;
    let queryParams = { username, abilityTypeName };

    let finalVariable = 'a';

    if (abilitySubTypeName) {
      query += this.matchAbilitySubType;
      queryParams['abilitySubTypeName'] = abilitySubTypeName;
      finalVariable = 'as';

      if (itemName) {
        query += this.matchAbilityItem;
        queryParams['itemName'] = itemName;
        finalVariable = 'ai';
      }
    }

    return await this.neo4jService.read(
      `${query}
        RETURN ${finalVariable} { .*, ${noe4jDateReturn(finalVariable)}} AS u`,
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
        CALL apoc.create.node(["AbilityType"], $properties)
        YIELD node AS a
        SET a.name = $name,
            a.createdAt = datetime(),
            a.updatedAt = datetime(),
            a.createdBy = $username
        WITH a
        MATCH (u:User {username: $username}) 
        CREATE (u)-[:HAS_ABILITY_TYPE]->(a)
      `,
      { username, name, properties },
    );
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
        CALL apoc.create.node(["AbilitySubType"], $properties)
        YIELD node AS as
        SET as.name = $name,
            as.createdAt = datetime(),
            as.updatedAt = datetime(),
            as.createdBy = $username
        WITH as
        MATCH (:User {username: $username})-[:HAS_ABILITY_TYPE]->(a:AbilityType {name: $abilityTypeName})
        CREATE (a)-[:HAS_SUB_TYPE]->(as)
      `,
      { username, abilityTypeName, name, properties },
    );
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
        CALL apoc.create.node(["AbilityItem"], $properties)
        YIELD node AS ai
        SET ai.name = $name,
            ai.createdAt = datetime(),
            ai.updatedAt = datetime(),
            ai.createdBy = $username
        WITH ai
        MATCH (:User {username: $username})-[:HAS_ABILITY_TYPE]->(a:AbilityType {name: $abilityTypeName})
        MATCH (a)-[:HAS_SUB_TYPE]->(as:AbilitySubType {name: $abilitySubTypeName})
        CREATE (as)-[:HAS_ITEM]->(ai)
      `,
      { username, abilityTypeName, abilitySubTypeName, name, properties },
    );
  }

  findAll() {
    return `This action returns all ability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ability`;
  }

  update(id: number, updateAbilityDto: UpdateAbilityDto) {
    return `This action updates a #${id} ability`;
  }

  remove(id: number) {
    return `This action removes a #${id} ability`;
  }
}
