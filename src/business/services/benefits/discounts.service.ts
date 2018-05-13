import Employee from '../../contracts/payroll/employee';
import Dependent from '../../contracts/benefits/dependent';
import BenefitsDiscount from '../../contracts/benefits/benefitsDiscount';
import isNil from 'lodash/isNil';

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
        const discounts: BenefitsDiscount[] = this.getAllEligableBenefitsDiscounts(person);
        var totalDiscountPercent = 0.0;
        discounts.forEach((discount: BenefitsDiscount) => {
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

        this.DISCOUNTS.forEach((discount) => {
            if(discount.criteria(person)) {
                allDiscounts.push(discount.discountObject);
            }
        });

        return allDiscounts;
    };

    /**
     * All discounts. Each discount object has a criteria function that evaluates true or false, and the actual discount object to return
     * to the employee if eligable.
     */
    private readonly DISCOUNTS = [
        {
            criteria: (person: Employee | Dependent): boolean => { 
                return !isNil(person) && !isNil(person.firstname) && person.firstname.length > 0 && person.firstname.toLowerCase()[0] === 'a';
            },
            discountObject: new BenefitsDiscount('10% Off - Firstname starts with the letter A', 0.1)
        }
    ]

};

export default DiscountsService;