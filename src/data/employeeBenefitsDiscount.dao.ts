import Sequelize from 'sequelize';
import sequelize from './dbContext';

const EmployeeBenefitsDiscountDao = sequelize.define('employeebenefitsdiscount', {
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
    benefitsdiscountId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default EmployeeBenefitsDiscountDao;