import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './employee.dao';

const DependentDao = sequelize.define('dependent', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    employeeId: { 
        type: Sequelize.INTEGER,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    lastname: {
        type: Sequelize.STRING,
        defaultValue: null
    }
});

export default DependentDao;