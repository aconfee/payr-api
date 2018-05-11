import db from '../index';
import Bluebird from 'bluebird';
import Dependent from '../../services/models/dependent.model';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IDependentDao {
    findAllByEmployeeId(employeeId: number, attributes: string[]): Bluebird<Dependent[]>
};

class DependentDao implements IDependentDao {

    public findAllByEmployeeId = async (employeeId: number, attributes: string[]): Bluebird<Dependent[]> => {
        const dependentRows: any = await db.DependentSchema.findAll({ 
            where: { employeeId },
            attributes
        })
        .catch((e) => { console.error(e); });

        if(isNull(dependentRows) || isUndefined(dependentRows)){
            return null;
        }

        const dependents = dependentRows.map((dependentRow) => {
            return new Dependent(
                dependentRow.id,
                dependentRow.firstname, 
                dependentRow.lastname
            );
        });

        return dependents;
    };
};

export default DependentDao;