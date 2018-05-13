import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import { IDiscountsService } from '../../business/services/benefits/discounts.service';
import BenefitsDiscount from '../../business/contracts/benefits/benefitsDiscount';
import DependentVM from '../models/benefits/dependent.viewmodel';
import Dependent from '../../business/contracts/benefits/dependent';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';

const dependentResolver = (
    benefitsService: IBenefitsService, 
    discountsService: IDiscountsService): any => {

    const getBenefitsDiscounts = async (dependent: DependentVM): Bluebird<string[]> => { 
        if(isNil(dependent)) throw Error('Please provide a dependent to get their eligable benefits discounts.');

        const discounts: BenefitsDiscount[] = await discountsService.getAllEligableBenefitsDiscounts(dependent.toContract()); 

        return discounts.map((discount: BenefitsDiscount) => discount.name);
    };

    const getAddonCost = async (dependent: DependentVM): Bluebird<number> => { 
        if(isNil(dependent)) throw Error('Please provide a dependent to get their addon cost.');

        const addonCost = await benefitsService.getDependentAddonCost(dependent.toContract()); 

        if(isNull(addonCost)) throw Error(`Could not calculate total cost for employee ${dependent}. See logs for more details.`);

        return addonCost;
    };

    return {
        Dependent: {
            benefitsDiscounts: getBenefitsDiscounts,
            addonCost: getAddonCost
        }
    };

}

export default dependentResolver;