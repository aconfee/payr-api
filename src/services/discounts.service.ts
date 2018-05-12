import Employee from './models/employee.model';
import Dependent from './models/dependent.model';
import BenefitsDiscount from './models/benefitsDiscount.model';

export interface IDiscountsService {
    applyBenefitsDiscounts(person: Employee | Dependent, cost: number): number;
    getAllEligableBenefitsDiscounts(person: Employee | Dependent): BenefitsDiscount[];
};

class DiscountsService implements IDiscountsService {

    /**
     * Observe the entity passed in and apply any eligable discounts to the cost provided. 
     * At the moment the call for employee and dependent is ubiquitous. This is set up in such a way that it's
     * easy to change, spearate, and extend later on.
     * 
     * @param person The employee or dependent to apply discounts to
     * @param cost The current cost that will be discounted.
     * 
     * @returns The new cost after all eligable discounts are applied.
     */
    public applyBenefitsDiscounts = (person: Employee | Dependent, cost: number): number => {
        const discounts = this.getAllEligableBenefitsDiscounts(person);
        var totalDiscountPercent = 0.0;
        discounts.forEach((discount) => {
            totalDiscountPercent += discount.discountPercent;
        });

        totalDiscountPercent = Math.min(1, totalDiscountPercent);
        totalDiscountPercent = 1 - totalDiscountPercent; // Invert to apply to cost.

        return cost * totalDiscountPercent;
    };

    /**
     * Get all the eligable discounts for employees and dependents. This may become two separate functions
     * if employee and dependent discounts diverge. 
     * 
     * @param person The person to get eligable discounts for. 
     * 
     * @returns All eligable discounts for this person.
     */
    public getAllEligableBenefitsDiscounts = (person: Employee | Dependent): BenefitsDiscount[] => {
        var allDiscounts: BenefitsDiscount[] = [];

        if(this.discountNameStartsWithACriteria(person)) allDiscounts = allDiscounts.concat(this.discountNameStartsWithA);

        return allDiscounts;
    };

    /**
     * Checks eligability for discount rule: 10% off if firstname begins with letter A. 
     * 
     * This rule is eligable for employees and dependents as indicated by accepted types.
     * 
     * @param person The person to check eligability against for this discount's criteria. 
     * 
     * @returns True or false if the provided person meets the criteria for this discount.
     */
    private discountNameStartsWithACriteria = (person: Employee | Dependent): boolean => { 
        return person && person.firstname && person.firstname.length > 0 && person.firstname.toLowerCase()[0] === 'a';
    };

    /**
     * Discounts details
     */
    private discountNameStartsWithA = new BenefitsDiscount('10% Off - Firstname starts with the letter A', 0.1);

};

export default DiscountsService;