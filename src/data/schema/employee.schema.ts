import Sequelize from 'sequelize';
import sequelize from '../dbContext';
import PayrollInfoDao from './payrollInfo.schema';
import DependentDao from './dependent.schema';

const EmployeeSchema = sequelize.define('employee', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
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

export default EmployeeSchema;