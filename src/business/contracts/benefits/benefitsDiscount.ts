import IContract from '../IContract';

export default class BenefitsDiscount implements IContract {
    constructor(name?: string, discountPercent?: number) {
        this.name = name;
        this.discountPercent = discountPercent;
    }

    public name: string;
    public discountPercent: number; 

    public toDataModel(): any {
        throw Error('Not implemented. Discounts do not exist in the data layer.');
    };

    public toViewModel(): any {
        throw Error('Not implemented. Discounts don\'t resolve individually. They are returned as an array of strings.');
    }
};