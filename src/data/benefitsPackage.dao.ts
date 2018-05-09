import Sequelize from 'sequelize';
import sequelize from './dbContext';
import PayrollInfoDao from './payrollInfo.dao';

const BenefitsPackageDao = sequelize.define('benefitspackage', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        defaultValue: null
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

export default BenefitsPackageDao;