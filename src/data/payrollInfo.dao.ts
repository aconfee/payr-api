import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './employee.dao';

const PayrollInfoDao = sequelize.define('payrollinfo', {
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
    salary: {
        type: Sequelize.FLOAT,
        defaultValue: null
    },
    paychecksPerYear: {
        type: Sequelize.INTEGER,
        defaultValue: 26
    },
    benefitsPackageId: {
        type: Sequelize.INTEGER,
        defaultValue: null
    }
});

export default PayrollInfoDao;