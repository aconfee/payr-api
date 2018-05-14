import Dependent from '../../contracts/benefits/dependent';
import sinon from 'sinon';
import {assert} from 'chai';
import DiscountsService from './discounts.service';
import Employee from '../../contracts/payroll/employee';
import BenefitsDiscount from '../../contracts/benefits/benefitsDiscount';

describe('Discounts Service', () => {

    describe('applyBenefitsDiscounts', () => {
        it('Can apply discount.', () => {

            // Arrange 
            const employee = new Employee(1, 'firstname', 'lastname');
            const discounts = [ new BenefitsDiscount('10% Off - Firstname starts with the letter A', 0.1) ];
            const discountsService = new DiscountsService();
            const stubGetAllEligabelBenefitsDiscounts = sinon.stub().returns(discounts);
            discountsService.getAllEligableBenefitsDiscounts = stubGetAllEligabelBenefitsDiscounts;

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 90);

            assert.isTrue(stubGetAllEligabelBenefitsDiscounts.calledOnceWith(employee));
        });

        it('Can apply none if no discounts exist.', () => {

            // Arrange 
            const employee = new Employee(1, 'firstname', 'lastname');
            const discountsService = new DiscountsService();
            const stubGetAllEligabelBenefitsDiscounts = sinon.stub().returns([]);
            discountsService.getAllEligableBenefitsDiscounts = stubGetAllEligabelBenefitsDiscounts;

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 100);

            assert.isTrue(stubGetAllEligabelBenefitsDiscounts.calledOnceWith(employee));
        });

        it('Can fail if bad person parameter.', () => {

            // Arrange 
            const discountsService = new DiscountsService();
            const stubGetAllEligabelBenefitsDiscounts = sinon.stub();
            discountsService.getAllEligableBenefitsDiscounts = stubGetAllEligabelBenefitsDiscounts;

            // Act
            let nullError: Error = null;
            try{discountsService.applyBenefitsDiscounts(null, 100);}
            catch(e){nullError = e;}

            let undefinedError: Error = null;
            let undef;
            try{discountsService.applyBenefitsDiscounts(undef, 100);}
            catch(e){undefinedError = e;}

            // Assert
            assert.isNotNull(nullError);
            assert.isNotNull(undefinedError);
            assert.equal(nullError.message, 'Please provide a valid dependent or employee to get discounts for.');
            assert.equal(undefinedError.message, 'Please provide a valid dependent or employee to get discounts for.');

            assert.isTrue(stubGetAllEligabelBenefitsDiscounts.notCalled);
        });

        it('Can fail if bad cost parameter.', () => {

            // Arrange 
            const employee = new Employee(1, 'firstname', 'lastname');
            const discountsService = new DiscountsService();
            const stubGetAllEligabelBenefitsDiscounts = sinon.stub();
            discountsService.getAllEligableBenefitsDiscounts = stubGetAllEligabelBenefitsDiscounts;

            // Act
            let nullError: Error = null;
            try{ discountsService.applyBenefitsDiscounts(employee, null); }
            catch(e){ nullError = e; }

            let undefinedError: Error = null;
            let undef;
            try{ discountsService.applyBenefitsDiscounts(employee, undef); }
            catch(e){ undefinedError = e; }

            let zeroError: Error = null;
            try{ discountsService.applyBenefitsDiscounts(employee, 0); }
            catch(e){ zeroError = e; }

            let negativeError: Error = null;
            try{ discountsService.applyBenefitsDiscounts(employee, -1); }
            catch(e){ negativeError = e; }

            // Assert
            assert.isNotNull(nullError);
            assert.isNotNull(undefinedError);
            assert.isNotNull(zeroError);
            assert.isNotNull(negativeError);
            assert.equal(nullError.message, 'Please provide a valid current cost to apply discounts to.');
            assert.equal(undefinedError.message, 'Please provide a valid current cost to apply discounts to.');
            assert.equal(zeroError.message, 'Please provide a valid current cost to apply discounts to.');
            assert.equal(negativeError.message, 'Please provide a valid current cost to apply discounts to.');

            assert.isTrue(stubGetAllEligabelBenefitsDiscounts.notCalled);
        });
    });

    // TODO: Come back to this boring stuff.
    describe('getAllEligableBenefitsDiscounts', () => {
        it('Can get discounts for employee.', () => {

            // Arrange 
            const employee = new Employee(1, 'Adam', 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discounts: BenefitsDiscount[] = discountsService.getAllEligableBenefitsDiscounts(employee);

            // Assert
            assert.isNotNull(discounts);
            assert.equal(discounts.length, 1);
            assert.equal(discounts[0].name, '10% Off - Firstname starts with the letter A');
            assert.equal(discounts[0].discountPercent, 0.1);
        });

        it('Can get discounts for dependent.', () => {

            // Arrange 
            const dependent = new Dependent(1, 1, 'Adam', 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discounts: BenefitsDiscount[] = discountsService.getAllEligableBenefitsDiscounts(dependent);

            // Assert
            assert.isNotNull(discounts);
            assert.equal(discounts.length, 1);
            assert.equal(discounts[0].name, '10% Off - Firstname starts with the letter A');
            assert.equal(discounts[0].discountPercent, 0.1);
        });

        it('Can return no discounts.', () => {

            // Arrange 
            const employee = new Employee(1, 'Brett', 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discounts: BenefitsDiscount[] = discountsService.getAllEligableBenefitsDiscounts(employee);

            // Assert
            assert.isNotNull(discounts);
            assert.equal(discounts.length, 0);
        });

        it.skip('Can cache result.', () => {
            // Would need to DI the cache. Overkill for now.
        });

        it('Can fail if bad person.', () => {

            // Arrange 
            const discountsService = new DiscountsService();

            // Act
            let nullError: Error = null;
            try{ discountsService.getAllEligableBenefitsDiscounts(null); }
            catch(e){ nullError = e }

            let undefinedError: Error = null;
            let undef;
            try{ discountsService.getAllEligableBenefitsDiscounts(undef); }
            catch(e){ undefinedError = e }

            // Assert
            assert.isNotNull(nullError);
            assert.equal(nullError.message, 'Please provide a valid dependent or employee to get discounts for.');
            assert.isNotNull(undefinedError);
            assert.equal(undefinedError.message, 'Please provide a valid dependent or employee to get discounts for.');
        });
    });

    describe('10% Off - Firstname starts with the letter A', () => {
        it('Can apply correctly.', () => {

            // Arrange 
            const employee = new Employee(1, 'Adam', 'Lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 90);
        });

        it('Can apply correctly with lowercase.', () => {

            // Arrange 
            const employee = new Employee(1, 'adam', 'Lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 90);
        });

        it('Can fail correctly.', () => {

            // Arrange 
            const employee = new Employee(1, 'Brett', 'Lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 100);
        });

        it('Can fail correctly with null employee properties.', () => {

            // Arrange 
            const employee = new Employee(1, null, 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 100);
        });

        it('Can fail correctly with invalid employee properties.', () => {

            // Arrange 
            const employee = new Employee(1, '', 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 100);
        });

        it('Can fail correctly with undefined employee properties.', () => {

            // Arrange 
            let undef;
            const employee = new Employee(1, undef, 'lastname');
            const discountsService = new DiscountsService();

            // Act
            const discountedCost: number = discountsService.applyBenefitsDiscounts(employee, 100);

            // Assert
            assert.isNotNull(discountedCost);
            assert.equal(discountedCost, 100);
        });
    });
});