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
     * WARNING: Really dumb implementation for a cache. Would connect redis cache or data loader in real life.
     */
    private dumbCache = new DumbCache();

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
        if(isNil(person)) throw Error('Please provide a valid dependent or employee to get discounts for.');
        if(isNil(cost) || cost <= 0) throw Error('Please provide a valid current cost to apply discounts to.');

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
        if(isNil(person)) throw Error('Please provide a valid dependent or employee to get discounts for.');

        // Cache since the only thing that would change this is 1) updated code 2) changed info (in which case, hash is different).
        const cachedDiscounts = this.dumbCache.get(this.getHash(person));
        if(!isNil(cachedDiscounts)) return cachedDiscounts;

        var allDiscounts: BenefitsDiscount[] = [];

        this.DISCOUNTS.forEach((discount) => {
            if(discount.criteria(person)) {
                allDiscounts.push(discount.discountObject);
            }
        });

        this.dumbCache.set(this.getHash(person), allDiscounts);

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
    ];

    private getHash(person: Employee | Dependent): string {
        let hash: string;

        Object.keys(person).forEach((key) => {
            hash += person[key].toString();
        });

        return hash;
    };

};

class DumbCache {
    private cache = {};

    constructor(){
        const SECONDS_IN_A_DAY = 86400; 

        setInterval(() => {
            this.cache = {};
        }, SECONDS_IN_A_DAY);
    };

    public set = (key: any, value: any) => {
        this.cache[key] = value;
    };

    public get = (key: any) => {
        return this.cache[key];
    };
};

export default DiscountsService;