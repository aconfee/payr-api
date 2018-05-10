import Sequelize from 'sequelize';
import sequelize from './dbContext';
import PayrollInfoDao from './payrollInfo.dao';
import DependentDao from './dependent.dao';

const EmployeeDao = sequelize.define('employee', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

export default EmployeeDao;