import { assert } from 'chai';
import sinon from 'sinon';

import BenefitsPackageDao, { IBenefitsPackageDao } from '../../../data/daos/benefits/benefitsPackage.dao';
import DependentDao, { IDependentDao } from '../../../data/daos/benefits/dependent.dao';
import PayrollInfoDao, { IPayrollInfoDao } from '../../../data/daos/payroll/payrollInfo.dao';
import BenefitsPackageDM from '../../../data/models/benefits/benefitsPackage.datamodel';
import DependentDM from '../../../data/models/benefits/dependent.datamodel';
import PayrollInfoDM from '../../../data/models/payroll/payrollInfo.datamodel';
import BenefitsPackage from '../../contracts/benefits/benefitsPackage';
import Dependent from '../../contracts/benefits/dependent';
import Employee from '../../contracts/payroll/employee';
import DiscountsService, { IDiscountsService } from '../../services/benefits/discounts.service';
import BenefitsService from './benefits.service';

class MockDependentDao implements IDependentDao {
    findAll = null;
    create = null;
    destroy = null;
};

class MockPayrollInfoDao implements IPayrollInfoDao {
    findOne = null;
    create = null;
};

class MockBenefitsPackageDao implements IBenefitsPackageDao {
    findById = null;
};

class MockDiscountsService implements IDiscountsService {
    applyBenefitsDiscounts = null;
    getAllEligableBenefitsDiscounts = null;
};

describe('Benefits Service', () => {

    describe('getEmployeeDependents', () => {
        it('Can get dependents.', async () => {

            // Arrange 
            const stubDependents = [
                new DependentDM(1, 1, 'Firstname1', 'Lastname1', new Date(), new Date)
            ];
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub().returns(stubDependents);
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const dependents: Dependent[] = await benefitsService.getEmployeeDependents(1);

            // Assert
            assert.isNotNull(dependents);
            assert.isNotEmpty(dependents);
            assert.equal(dependents.length, 1);
            const { id, employeeId, firstname, lastname } = dependents[0];
            const expectedDependent = stubDependents[0];
            assert.equal(id, expectedDependent.id);
            assert.equal(employeeId, expectedDependent.employeeId);
            assert.equal(firstname, expectedDependent.firstname);
            assert.equal(lastname, expectedDependent.lastname);

            assert.isTrue(stubFindAll.calledOnce);
        });

        it('Can return empty if empty data.', async () => {
            
            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub().returns([]);
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const dependents: Dependent[] = await benefitsService.getEmployeeDependents(3);

            // Assert
            assert.isNotNull(dependents);
            assert.isEmpty(dependents);

            assert.isTrue(stubFindAll.calledOnce);
        });

        it('Can return empty if null data.', async () => {
            
            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub().returns(null);
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const dependents: Dependent[] = await benefitsService.getEmployeeDependents(3);

            // Assert
            assert.isNotNull(dependents);
            assert.isEmpty(dependents);

            assert.isTrue(stubFindAll.calledOnce);
        });

        it('Can throw error if no employee id.', async () => {
            
            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub();
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let error: Error = null;
            await benefitsService.getEmployeeDependents(null)
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, 'Please provide a valid employeeId.');
            assert.isTrue(stubFindAll.notCalled);
        });

        it('Can throw error if undefined employee id.', async () => {
            
            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub();
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let error: Error = null;
            let undef;
            await benefitsService.getEmployeeDependents(undef)
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, 'Please provide a valid employeeId.');
            assert.isTrue(stubFindAll.notCalled);
        });

        it('Can throw error if bad employee id.', async () => {
            
            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubFindAll = sinon.stub();
            mockDependentDao.findAll = stubFindAll;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let error: Error = null;
            await benefitsService.getEmployeeDependents(-1)
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, 'Please provide a valid employeeId.');
            assert.isTrue(stubFindAll.notCalled);
        });
    });

    describe('addEmployeeDependents', () => {
        it('Can add dependent.', async () => {

            // Arrange 
            const stubDependent = new DependentDM(1, 1, 'Firstname1', 'Lastname1', new Date(), new Date);
            const mockDependentDao = new MockDependentDao();
            const stubCreate = sinon.stub().returns(stubDependent);
            mockDependentDao.create = stubCreate;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const dependent: Dependent = await benefitsService.addEmployeeDependent(
                stubDependent.employeeId,
                stubDependent.firstname,
                stubDependent.lastname
            );

            // Assert
            assert.isNotNull(dependent);
            const { id, employeeId, firstname, lastname } = dependent;
            const expectedDependent = stubDependent;
            assert.equal(id, expectedDependent.id);
            assert.equal(employeeId, expectedDependent.employeeId);
            assert.equal(firstname, expectedDependent.firstname);
            assert.equal(lastname, expectedDependent.lastname);

            assert.isTrue(stubCreate.calledOnce);
        });

        it('Can return null if not created.', async () => {

            // Arrange 
            const stubDependent = new DependentDM(1, 1, 'Firstname1', 'Lastname1', new Date(), new Date);
            const mockDependentDao = new MockDependentDao();
            const stubCreate = sinon.stub().returns(null);
            mockDependentDao.create = stubCreate;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const dependent: Dependent = await benefitsService.addEmployeeDependent(
                stubDependent.employeeId,
                stubDependent.firstname,
                stubDependent.lastname
            );

            // Assert
            assert.isNull(dependent);

            assert.isTrue(stubCreate.calledOnce);
        });

        it('Can throw error if bad employee id.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubCreate = sinon.stub();
            mockDependentDao.create = stubCreate;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let nullError: Error = null;
            await benefitsService.addEmployeeDependent(null, 'firstname', 'lastname')
                .catch(e => { nullError = e });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.addEmployeeDependent(undef, 'firstname', 'lastname')
                .catch(e => { undefinedError = e });

            let invalidError: Error = null;
            await benefitsService.addEmployeeDependent(-1, 'firstname', 'lastname')
                .catch(e => { invalidError = e });

            // Assert
            assert.isNotNull(nullError);
            assert.equal(nullError.message, 'Please provide a valid employeeId.');
            assert.isNotNull(undefinedError);
            assert.equal(undefinedError.message, 'Please provide a valid employeeId.');
            assert.isNotNull(invalidError);
            assert.equal(invalidError.message, 'Please provide a valid employeeId.');

            assert.isTrue(stubCreate.notCalled);
        });

        it('Can throw error if bad firstname.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubCreate = sinon.stub();
            mockDependentDao.create = stubCreate;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let nullError: Error = null;
            await benefitsService.addEmployeeDependent(1, null, 'lastname')
                .catch(e => { nullError = e });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.addEmployeeDependent(1, undef, 'lastname')
                .catch(e => { undefinedError = e });

            let emptyError: Error = null;
            await benefitsService.addEmployeeDependent(1, '', 'lastname')
                .catch(e => { emptyError = e });

            let emptyOnTrimError: Error = null;
            await benefitsService.addEmployeeDependent(1, '  ', 'lastname')
                .catch(e => { emptyOnTrimError = e });

            // Assert
            assert.isNotNull(nullError);
            assert.equal(nullError.message, 'Please provide a valid firstname.');
            assert.isNotNull(undefinedError);
            assert.equal(undefinedError.message, 'Please provide a valid firstname.');
            assert.isNotNull(emptyError);
            assert.equal(emptyError.message, 'Please provide a valid firstname.');
            assert.isNotNull(emptyOnTrimError);
            assert.equal(emptyOnTrimError.message, 'Please provide a valid firstname.');
            
            assert.isTrue(stubCreate.notCalled);
        });

        it('Can throw error if bad lastname.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubCreate = sinon.stub();
            mockDependentDao.create = stubCreate;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let nullError: Error = null;
            await benefitsService.addEmployeeDependent(1, 'firstname', null)
                .catch(e => { nullError = e });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.addEmployeeDependent(1, 'firstname', undef)
                .catch(e => { undefinedError = e });

            let emptyError: Error = null;
            await benefitsService.addEmployeeDependent(1, 'firstname', '')
                .catch(e => { emptyError = e });

            let emptyOnTrimError: Error = null;
            await benefitsService.addEmployeeDependent(1, 'firstname', '  ')
                .catch(e => { emptyOnTrimError = e });

            // Assert
            assert.isNotNull(nullError);
            assert.equal(nullError.message, 'Please provide a valid lastname.');
            assert.isNotNull(undefinedError);
            assert.equal(undefinedError.message, 'Please provide a valid lastname.');
            assert.isNotNull(emptyError);
            assert.equal(emptyError.message, 'Please provide a valid lastname.');
            assert.isNotNull(emptyOnTrimError);
            assert.equal(emptyOnTrimError.message, 'Please provide a valid lastname.');
            
            assert.isTrue(stubCreate.notCalled);
        });
    });

    describe('removeEmployeeDependents', () => {
        it('Can remove dependent.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubDestroy = sinon.stub().returns(true);
            mockDependentDao.destroy = stubDestroy;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const result: boolean = await benefitsService.removeEmployeeDependent(1);

            // Assert
            assert.isNotNull(result);
            assert.isTrue(result);

            assert.isTrue(stubDestroy.calledOnce);
        });

        it('Can return false if failed to remove dependent.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubDestroy = sinon.stub().returns(false);
            mockDependentDao.destroy = stubDestroy;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            const result: boolean = await benefitsService.removeEmployeeDependent(1);

            // Assert
            assert.isNotNull(result);
            assert.isFalse(result);

            assert.isTrue(stubDestroy.calledOnce);
        });

        it('Can throw if bad id provided.', async () => {

            // Arrange 
            const mockDependentDao = new MockDependentDao();
            const stubDestroy = sinon.stub();
            mockDependentDao.destroy = stubDestroy;

            const benefitsService = new BenefitsService(mockDependentDao, null, null, null);

            // Act
            let nullError: Error = null;
            await benefitsService.removeEmployeeDependent(null)
                .catch(e => { nullError = e });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.removeEmployeeDependent(undef)
                .catch(e => { undefinedError = e });

            let invalidError: Error = null;
            await benefitsService.removeEmployeeDependent(-1)
                .catch(e => { invalidError = e });

            // Assert
            assert.isNotNull(nullError);
            assert.isNotNull(undefinedError);
            assert.isNotNull(invalidError);
            assert.equal(nullError.message, 'Please provide a valid id.');
            assert.equal(undefinedError.message, 'Please provide a valid id.');
            assert.equal(invalidError.message, 'Please provide a valid id.');

            assert.isTrue(stubDestroy.notCalled);
        });
    });

    describe('getEmployeeBenefitsPackage', () => {
        it('Can get benefits for an employee.', async () => {

            // Arrange 
            const payrollInfo = new PayrollInfoDM(1, 1, 52000, 26, 1, new Date(), new Date());
            const mockPayrollInfoDao = new MockPayrollInfoDao();
            const stubFindOnePayroll = sinon.stub().returns(payrollInfo);
            mockPayrollInfoDao.findOne = stubFindOnePayroll;

            const benefitsPackage = new BenefitsPackageDM(1, 'Default', 1000, 500, new Date(), new Date());
            const mockBenefitsPackageDao = new MockBenefitsPackageDao();
            const stubFindBenefitsPackageById = sinon.stub().returns(benefitsPackage);
            mockBenefitsPackageDao.findById = stubFindBenefitsPackageById;

            const benefitsService = new BenefitsService(null, mockPayrollInfoDao, mockBenefitsPackageDao, null);

            // Act
            const result: BenefitsPackage = await benefitsService.getEmployeeBenefitsPackage(1);

            // Assert
            assert.isNotNull(result);
            assert.equal(result.name, benefitsPackage.name);
            assert.equal(result.baseCost, benefitsPackage.baseCost);
            assert.equal(result.dependentCost, benefitsPackage.dependentCost);

            assert.isTrue(stubFindOnePayroll.calledOnce)
            assert.isTrue(stubFindOnePayroll.calledBefore(stubFindBenefitsPackageById));
            assert.isTrue(stubFindBenefitsPackageById.calledOnceWith(payrollInfo.benefitsPackageId));
        });

        it('Can return null if not found.', async () => {

            // Arrange 
            const payrollInfo = new PayrollInfoDM(1, 1, 52000, 26, 1, new Date(), new Date());
            const mockPayrollInfoDao = new MockPayrollInfoDao();
            const stubFindOnePayroll = sinon.stub().returns(payrollInfo);
            mockPayrollInfoDao.findOne = stubFindOnePayroll;

            const mockBenefitsPackageDao = new MockBenefitsPackageDao();
            const stubFindBenefitsPackageById = sinon.stub().returns(null);
            mockBenefitsPackageDao.findById = stubFindBenefitsPackageById;

            const benefitsService = new BenefitsService(null, mockPayrollInfoDao, mockBenefitsPackageDao, null);

            // Act
            const result: BenefitsPackage = await benefitsService.getEmployeeBenefitsPackage(1);

            // Assert
            assert.isNull(result);

            assert.isTrue(stubFindOnePayroll.calledOnce)
            assert.isTrue(stubFindOnePayroll.calledBefore(stubFindBenefitsPackageById));
            assert.isTrue(stubFindBenefitsPackageById.calledOnceWith(payrollInfo.benefitsPackageId));
        });

        it('Can fail if no payroll info found.', async () => {

            // Arrange 
            const mockPayrollInfoDao = new MockPayrollInfoDao();
            const stubFindOnePayroll = sinon.stub().returns(null);
            mockPayrollInfoDao.findOne = stubFindOnePayroll;

            const mockBenefitsPackageDao = new MockBenefitsPackageDao();
            const stubFindBenefitsPackageById = sinon.stub();
            mockBenefitsPackageDao.findById = stubFindBenefitsPackageById;

            const benefitsService = new BenefitsService(null, mockPayrollInfoDao, mockBenefitsPackageDao, null);

            // Act
            let error: Error = null;
            await benefitsService.getEmployeeBenefitsPackage(1)
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, "Could not find payroll info for employee with id 1. All employees should have payroll info.");

            assert.isTrue(stubFindOnePayroll.calledOnce)
            assert.isTrue(stubFindBenefitsPackageById.notCalled);
        });

        it('Can fail if bad employee id.', async () => {

            // Arrange 
            const mockPayrollInfoDao = new MockPayrollInfoDao();
            const stubFindOnePayroll = sinon.stub();
            mockPayrollInfoDao.findOne = stubFindOnePayroll;

            const mockBenefitsPackageDao = new MockBenefitsPackageDao();
            const stubFindBenefitsPackageById = sinon.stub();
            mockBenefitsPackageDao.findById = stubFindBenefitsPackageById;

            const benefitsService = new BenefitsService(null, mockPayrollInfoDao, mockBenefitsPackageDao, null);

            // Act
            let nullError: Error = null;
            await benefitsService.getEmployeeBenefitsPackage(null)
                .catch(e => { nullError = e; });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.getEmployeeBenefitsPackage(undef)
                .catch(e => { undefinedError = e; });

            let invalidError: Error = null;
            await benefitsService.getEmployeeBenefitsPackage(-1)
                .catch(e => { invalidError = e; });

            // Assert
            assert.isNotNull(nullError);
            assert.isNotNull(undefinedError);
            assert.isNotNull(invalidError);
            assert.equal(nullError.message, 'Please provide a valid employeeId.');
            assert.equal(undefinedError.message, 'Please provide a valid employeeId.');
            assert.equal(invalidError.message, 'Please provide a valid employeeId.');

            assert.isTrue(stubFindOnePayroll.notCalled)
            assert.isTrue(stubFindBenefitsPackageById.notCalled);
        });
    });
    
    describe('getDependentAddonCost', () => {
        it('Can get the addon cost for a dependent.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub().returns(450);
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const benefitsPackage = new BenefitsPackageDM(1, 'Default', 1000, 500, new Date(), new Date());
            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(benefitsPackage);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;
            const dependent = new Dependent(null, 1);

            // Act
            const result: number = await benefitsService.getDependentAddonCost(dependent);

            // Assert
            assert.isNotNull(result);
            assert.equal(result, 450);

            assert.isTrue(stubGetEmployeeBenefitsPackage.calledOnce);
            assert.isTrue(stubApplyBenefitsDiscounts.calledOnce);
            assert.isTrue(stubApplyBenefitsDiscounts.calledWith(dependent, benefitsPackage.dependentCost));
        });

        it('Can fail if no benefits package.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub();
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(null);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            // Act
            let error: Error = null;
            await benefitsService.getDependentAddonCost(new Dependent(null, 1))
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, 'Could not find benefits package for employee 1.');

            assert.isTrue(stubGetEmployeeBenefitsPackage.calledOnce);
            assert.isTrue(stubApplyBenefitsDiscounts.notCalled);
        });

        it('Can fail if bad dependent.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub();
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const stubGetEmployeeBenefitsPackage = sinon.stub();
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            // Act
            let nullError: Error = null;
            await benefitsService.getDependentAddonCost(null)
                .catch(e => { nullError = e; });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.getDependentAddonCost(undef)
                .catch(e => { undefinedError = e; });

            // Assert
            assert.isNotNull(nullError);
            assert.isNotNull(undefinedError);
            assert.equal(nullError.message, 'Please provide a valid dependent.');
            assert.equal(undefinedError.message, 'Please provide a valid dependent.');

            assert.isTrue(stubGetEmployeeBenefitsPackage.notCalled);
            assert.isTrue(stubApplyBenefitsDiscounts.notCalled);
        });
    });

    describe('getTotalAnnualCost', () => {
        it('Can get the total annual cost of benefits for an employee.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub();
            stubApplyBenefitsDiscounts.onCall(0).returns(900);
            stubApplyBenefitsDiscounts.onCall(1).returns(500);
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const benefitsPackage = new BenefitsPackageDM(1, 'Default', 1000, 500, new Date(), new Date());
            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(benefitsPackage);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            const dependents = [ new Dependent(1, 1, 'firstname', 'lastname') ];
            const stubGetEmployeeDependents = sinon.stub().returns(dependents);
            benefitsService.getEmployeeDependents = stubGetEmployeeDependents;

            const employee = new Employee(1, 'firstname', 'lastname');

            // Act
            const result: number = await benefitsService.getTotalAnnualCost(employee);

            // Assert
            assert.isNotNull(result);
            assert.equal(result, 1400);

            assert.isTrue(stubGetEmployeeBenefitsPackage.calledOnce);
            assert.isTrue(stubGetEmployeeBenefitsPackage.calledWith(employee.id));
            assert.isTrue(stubApplyBenefitsDiscounts.calledTwice);
            assert.isTrue(stubApplyBenefitsDiscounts.calledWith(employee, benefitsPackage.baseCost));
            assert.isTrue(stubApplyBenefitsDiscounts.calledWith(dependents[0], benefitsPackage.dependentCost));
            assert.isTrue(stubGetEmployeeDependents.calledOnce);
            assert.isTrue(stubGetEmployeeDependents.calledWith(employee.id));
        });

        it('Can get the total annual cost of benefits for an employee with no dependents.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub().returns(900);
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const benefitsPackage = new BenefitsPackageDM(1, 'Default', 1000, 500, new Date(), new Date());
            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(benefitsPackage);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            const stubGetEmployeeDependents = sinon.stub().returns([]);
            benefitsService.getEmployeeDependents = stubGetEmployeeDependents;

            const employee = new Employee(1, 'firstname', 'lastname');

            // Act
            const result: number = await benefitsService.getTotalAnnualCost(employee);

            // Assert
            assert.isNotNull(result);
            assert.equal(result, 900);

            assert.isTrue(stubGetEmployeeBenefitsPackage.calledOnce);
            assert.isTrue(stubGetEmployeeBenefitsPackage.calledWith(employee.id));
            assert.isTrue(stubApplyBenefitsDiscounts.calledOnce);
            assert.isTrue(stubApplyBenefitsDiscounts.calledWith(employee, benefitsPackage.baseCost));
            assert.isTrue(stubGetEmployeeDependents.calledOnce);
            assert.isTrue(stubGetEmployeeDependents.calledWith(employee.id));
        });

        it('Can fail if no benefits package.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub();
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(null);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            const stubGetEmployeeDependents = sinon.stub();
            benefitsService.getEmployeeDependents = stubGetEmployeeDependents;

            const employee = new Employee(1, 'firstname', 'lastname');

            // Act
            let error: Error = null;
            await benefitsService.getTotalAnnualCost(employee)
                .catch(e => { error = e; });

            // Assert
            assert.isNotNull(error);
            assert.equal(error.message, 'Could not find benefits package for employee 1.');

            assert.isTrue(stubGetEmployeeBenefitsPackage.calledOnce);
            assert.isTrue(stubGetEmployeeBenefitsPackage.calledWith(employee.id));
            assert.isTrue(stubApplyBenefitsDiscounts.notCalled);
            assert.isTrue(stubGetEmployeeDependents.notCalled);
        });

        it('Can fail if bad employee.', async () => {

            // Arrange 
            const mockDiscountsService = new MockDiscountsService();
            const stubApplyBenefitsDiscounts = sinon.stub();
            mockDiscountsService.applyBenefitsDiscounts = stubApplyBenefitsDiscounts;

            const benefitsService = new BenefitsService(null, null, null, mockDiscountsService);

            const stubGetEmployeeBenefitsPackage = sinon.stub().returns(null);
            benefitsService.getEmployeeBenefitsPackage = stubGetEmployeeBenefitsPackage;

            const stubGetEmployeeDependents = sinon.stub();
            benefitsService.getEmployeeDependents = stubGetEmployeeDependents;

            const employee = new Employee(1, 'firstname', 'lastname');

            // Act
            let nullError: Error = null;
            await benefitsService.getTotalAnnualCost(null)
                .catch(e => { nullError = e; });

            let undefinedError: Error = null;
            let undef;
            await benefitsService.getTotalAnnualCost(undef)
                .catch(e => { undefinedError = e; });

            // Assert
            assert.isNotNull(nullError);
            assert.equal(nullError.message, 'Please provide a valid employee.');
            assert.isNotNull(undefinedError);
            assert.equal(undefinedError.message, 'Please provide a valid employee.');

            assert.isTrue(stubGetEmployeeBenefitsPackage.notCalled);
            assert.isTrue(stubApplyBenefitsDiscounts.notCalled);
            assert.isTrue(stubGetEmployeeDependents.notCalled);
        });
    });
    

});