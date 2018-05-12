/**
 * These daos decouple Sequelize from the rest of the app. I could, for example,
 * swap out Sequelize with Knex and these dao classes are the only things that would have to be updated.
 */

import Bluebird from 'bluebird';

export class QueryOptions {
    constructor(where?: any, attributes?: string[]){
        this.where = where;
        this.attributes = attributes;
    }

    public where: any;
    public attributes: string[];
};

export default interface IDao {
    findById(id: number, options?: QueryOptions ): Bluebird<any>;
    findAll(options?: QueryOptions): Bluebird<any[]>;
    findOne(options?: QueryOptions): Bluebird<any>;
    create(record: any): Bluebird<any>;
    destroy(id: number): Bluebird<boolean>;
};