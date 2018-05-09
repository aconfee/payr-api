import Sequelize from 'sequelize';
import sequelize from './dbContext';
import EmployeeDao from './employee.dao';
import EmployeeBenefitsDiscountDao from './employeeBenefitsDiscount.dao';

const BenefitsDiscountDao = sequelize.define('benefitsdiscount', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    discountPercent: {
        type: Sequelize.FLOAT,
        defaultValue: null
    }
});

export default BenefitsDiscountDao;