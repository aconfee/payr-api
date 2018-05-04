import Sequelize from 'sequelize';
import sequelize from './dbContext';

const DummyDao = sequelize.define('dummy', {
    id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message: { 
        type: Sequelize.STRING,
        defaultValue: null
    }
});

export default DummyDao;