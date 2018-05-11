import db from '../index';
import Bluebird from 'bluebird';
import BenefitsPackage from '../../services/models/benefitsPackage.model';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

export interface IBenefitsPackageDao {
    findOneById(id: number, attributes: string[]): Bluebird<BenefitsPackage>
};

class BenefitsPackageDao implements IBenefitsPackageDao {

    public findOneById = async (id: number, attributes: string[]): Bluebird<BenefitsPackage> => {
        const benefitsPackage: any = await db.BenefitsPackageSchema.findOne({ 
            where: { id: id },
            attributes: attributes
        })
        .catch((e) => { console.error(e); });

        if(isNull(benefitsPackage) || isUndefined(benefitsPackage)){
            return null;
        }   

        return new BenefitsPackage(
            benefitsPackage.name, 
            benefitsPackage.baseCost,
            benefitsPackage.dependentCost
        );
    };
};

export default BenefitsPackageDao;