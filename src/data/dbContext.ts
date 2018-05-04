require('dotenv').config()
import Sequelize from 'sequelize';
import _ from 'lodash';
const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

if(_.isUndefined(PGDATABASE) || _.isNull(PGDATABASE)){
    console.error('ERROR: MISSING ENVIRONMENT VARIABLE: PGDATABASE');
    throw new Error('Missing environment variable: PGDATABASE.');
}

if(_.isUndefined(PGUSER) || _.isNull(PGUSER)){
    console.error('ERROR: MISSING ENVIRONMENT VARIABLE: PGUSER');
    throw new Error('Missing environment variable: PGUSER.');
}

if(_.isUndefined(PGPASSWORD) || _.isNull(PGPASSWORD)){
    console.error('ERROR: MISSING ENVIRONMENT VARIABLE: PGPASSWORD');
    throw new Error('Missing environment variable: PGPASSWORD.');
}

if(_.isUndefined(PGHOST) || _.isNull(PGHOST)){
    console.error('ERROR: MISSING ENVIRONMENT VARIABLE: PGHOST');
    throw new Error('Missing environment variable: PGHOST.');
}

if(_.isUndefined(PGPORT) || _.isNull(PGPORT)){
    console.error('ERROR: MISSING ENVIRONMENT VARIABLE: PGPORT');
    throw new Error('Missing environment variable: PGPORT.');
}

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: parseInt(PGPORT),
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true
    }
});

export default sequelize;