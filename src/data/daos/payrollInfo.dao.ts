import Sequelize from 'sequelize';
import sequelize from '../dbContext';

const PayrollInfoDao = sequelize.define('payrollinfo', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    employeeId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
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