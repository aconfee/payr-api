import Sequelize from 'sequelize';
import sequelize from '../../dbContext';

const DependentSchema = sequelize.define('dependent', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    employeeId: { 
        type: Sequelize.INTEGER,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true,
            len: [1, 50]
        }
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true,
            len: [1, 50]
        }
    }
});

export default DependentSchema;