import Sequelize from 'sequelize';
import sequelize from '../dbContext';
import EmployeeDao from './employee.dao';

const DependentDao = sequelize.define('dependent', {
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
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default DependentDao;