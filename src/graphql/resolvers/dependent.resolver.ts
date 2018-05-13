import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import { IDiscountsService } from '../../business/services/benefits/discounts.service';
import BenefitsDiscount from '../../business/contracts/benefits/benefitsDiscount';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';


const dependentResolver = (
    benefitsService: IBenefitsService, 
    discountsService: IDiscountsService): any => {

    const getBenefitsDiscounts = async (dependent): Bluebird<string[]> => { 
        const discounts = await discountsService.getAllEligableBenefitsDiscounts(dependent); 

        return discounts.map((discount: BenefitsDiscount) => discount.name);
    };

    const getAddonCost = async (dependent): Bluebird<number> => { 
        const addonCost = await benefitsService.getDependentAddonCost(dependent); 

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