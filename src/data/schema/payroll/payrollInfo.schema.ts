import Sequelize from 'sequelize';
import sequelize from '../../dbContext';

const PayrollInfoSchema = sequelize.define('payrollinfo', {
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
        defaultValue: null,
        validate: {
            min: 0,
            max: 9999999
        }
    },
    paychecksPerYear: {
        type: Sequelize.INTEGER,
        defaultValue: 26,
        validate: {
            min: 0,
            max: 52
        }
    },
    benefitsPackageId: {
        type: Sequelize.INTEGER,
        defaultValue: null
    }
});

export default PayrollInfoSchema;