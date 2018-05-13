import IDataModel from '../IDataModel.datamodel';
import BenefitsPackage from '../../../business/contracts/benefits/benefitsPackage';

export default class BenefitsPackageDM implements IDataModel {
    constructor(
        id?: number, 
        name?: string, 
        baseCost?: number, 
        dependentCost?: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = name;
        this.baseCost = baseCost;
        this.dependentCost = dependentCost;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    public id: number;
    public name: string;
    public baseCost: number; 
    public dependentCost: number;
    public createdAt: Date;
    public updatedAt: Date;

    public toContract(): BenefitsPackage {
        return new BenefitsPackage(
            this.name,
            this.baseCost,
            this.dependentCost
        );
    };
};