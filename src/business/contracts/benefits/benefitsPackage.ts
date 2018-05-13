import IContract from '../IContract';
import BenefitsPackageDM from '../../../data/models/benefits/benefitsPackage.datamodel';

export default class BenefitsPackage implements IContract {
    constructor(name?: string, baseCost?: number, dependentCost?: number) {
        this.name = name;
        this.baseCost = baseCost;
        this.dependentCost = dependentCost;
    }

    public name: string;
    public baseCost: number; 
    public dependentCost: number;

    public toDataModel(): BenefitsPackageDM {
        return new BenefitsPackageDM(
            null,
            this.name,
            this.baseCost,
            this.dependentCost,
            null,
            null
        );
    };

    public toViewModel(): any {
        throw Error('Not implemented. Benefits package is never exposed to the view, but used to derive values that are exposed.');
    };
};