import Sequelize from 'sequelize';
import sequelize from '../../dbContext';

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
        unique: true,
        validate: {
            isAlphanumeric: true,
            notEmpty: true,
            len: [1, 200]
        }
    },
    baseCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 9999999
        }
    },
    dependentCost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 9999999
        }
    }
});

export default BenefitsPackageSchema;