import Sequelize from 'sequelize';
import sequelize from '../dbContext';
import PayrollInfoSchema from './payrollInfo.schema';

const BenefitsPackageSchema = sequelize.define('benefitspackage', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    baseCost: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    dependentCost: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

export default BenefitsPackageSchema;