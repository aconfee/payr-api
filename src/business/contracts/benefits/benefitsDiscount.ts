export default class BenefitsDiscount {
    constructor(name?: string, discountPercent?: number) {
        this.name = name;
        this.discountPercent = discountPercent;
    }

    public name: string;
    public discountPercent: number; 
};