import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import { IEmployeeService } from '../../business/services/payroll/employee.service';
import { IDiscountsService } from '../../business/services/benefits/discounts.service';
import Dependent from '../../business/contracts/benefits/dependent';
import DependentVM from '../models/benefits/dependent.viewmodel';
import PayrollInfo from '../../business/contracts/payroll/payrollInfo';
import PayrollInfoVM from '../models/payroll/payrollInfo.viewmodel';
import BenefitsDiscount from '../../business/contracts/benefits/benefitsDiscount';
import Employee from '../../business/contracts/payroll/employee';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';


const employeeResolver = (
    benefitsService: IBenefitsService, 
    employeeService: IEmployeeService,
    discountsService: IDiscountsService): any => {

    const getEmployeeDependents = async (employee): Bluebird<DependentVM[]> => { 
        const dependents: Dependent[] = await benefitsService.getEmployeeDependents(employee.id); 

        return dependents.map((dependent: Dependent) => {
            return new DependentVM(
                dependent.id,
                dependent.employeeId,
                dependent.firstname,
                dependent.lastname
            );
        });
    };

    const getPayrollInfo = async (employee): Bluebird<PayrollInfoVM> => { 
        const payrollInfo: PayrollInfo = await employeeService.getEmployeePayrollInfo(employee.id); 

        if(isNull(payrollInfo)) throw Error(`Could not find payroll info for employee ${employee}`);

        return new PayrollInfoVM(
            payrollInfo.salary,
            payrollInfo.paychecksPerYear,
            payrollInfo.benefitsPackageId
        );
    };

    const getBenefitsDiscounts = async (employee): Bluebird<string[]> => { 
        const discounts = await discountsService.getAllEligableBenefitsDiscounts(employee); 

        return discounts.map((discount: BenefitsDiscount) => discount.name);
    };

    const getBenefitsTotalAnnualCost = async (employee): Bluebird<number> => { 
        const totalCost = await benefitsService.getTotalAnnualCost(new Employee(employee.id, employee.firstname, employee.lastname)); 

        if(isNull(totalCost)) throw Error(`Could not calculate total cost for employee ${employee}. See logs for more details.`);

        return totalCost;
    };

    return {
        Employee: {
            dependents: getEmployeeDependents,
            payrollInfo: getPayrollInfo,
            benefitsDiscounts: getBenefitsDiscounts,
            benefitsTotalAnnualCost: getBenefitsTotalAnnualCost
        }
    };

}

export default employeeResolver;