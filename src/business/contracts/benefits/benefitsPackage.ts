export default class BenefitsPackage {
    constructor(name?: string, baseCost?: number, dependentCost?: number) {
        this.name = name;
        this.baseCost = baseCost;
        this.dependentCost = dependentCost;
    }

    public name: string;
    public baseCost: number; 
    public dependentCost: number;
};