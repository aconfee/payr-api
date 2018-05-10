import Sequelize from 'sequelize';
import sequelize from '../dbContext';
import PayrollInfoDao from './payrollInfo.dao';
import DependentDao from './dependent.dao';

const EmployeeDao = sequelize.define('employee', {
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

// Employee has one payroll info.
// TODO: hasOne or belongsTo here? FK on source or target? What's the implication?
EmployeeDao.hasOne(PayrollInfoDao, { foreignKey: 'employeeId' });

// Employee has many dependents. Each dependent belongs to one employee.
EmployeeDao.hasMany(DependentDao, { foreignKey: 'employeeId' });
DependentDao.belongsTo(EmployeeDao, { foreignKey: 'employeeId' });

export default EmployeeDao;