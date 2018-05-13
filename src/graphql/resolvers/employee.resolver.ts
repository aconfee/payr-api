import { IBenefitsService } from '../../business/services/benefits/benefits.service';
import { IEmployeeService } from '../../business/services/payroll/employee.service';
import { IDiscountsService } from '../../business/services/benefits/discounts.service';
import Dependent from '../../business/contracts/benefits/dependent';
import DependentVM from '../models/benefits/dependent.viewmodel';
import PayrollInfo from '../../business/contracts/payroll/payrollInfo';
import PayrollInfoVM from '../models/payroll/payrollInfo.viewmodel';
import BenefitsDiscount from '../../business/contracts/benefits/benefitsDiscount';
import Employee from '../../business/contracts/payroll/employee';
import EmployeeVM from '../models/payroll/employee.viewmodel';
import Bluebird from 'bluebird';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';


const employeeResolver = (
    benefitsService: IBenefitsService, 
    employeeService: IEmployeeService,
    discountsService: IDiscountsService): any => {

    const getEmployeeDependents = async (employee: EmployeeVM): Bluebird<DependentVM[]> => { 
        if(isNil(employee)) throw Error('Please provide an employee to get their dependents.');

        const dependents: Dependent[] = await benefitsService.getEmployeeDependents(employee.id); 

        return dependents.map((dependent: Dependent) => {
            return dependent.toViewModel();
        });
    };

    const getPayrollInfo = async (employee: EmployeeVM): Bluebird<PayrollInfoVM> => { 
        if(isNil(employee)) throw Error('Please provide an employee to get their payroll info.');

        const payrollInfo: PayrollInfo = await employeeService.getEmployeePayrollInfo(employee.id); 

        if(isNull(payrollInfo)) throw Error(`Could not find payroll info for employee ${employee}`);

        return payrollInfo.toViewModel();
    };

    const getBenefitsDiscounts = async (employee: EmployeeVM): Bluebird<string[]> => { 
        if(isNil(employee)) throw Error('Please provide an employee to get their eligable benefits discounts.');

        const discounts: BenefitsDiscount[] = await discountsService.getAllEligableBenefitsDiscounts(employee.toContract()); 

        return discounts.map((discount: BenefitsDiscount) => discount.name);
    };

    const getBenefitsTotalAnnualCost = async (employee: EmployeeVM): Bluebird<number> => { 
        if(isNil(employee)) throw Error('Please provide an employee to get their total annual benefits cost.');

        const totalCost = await benefitsService.getTotalAnnualCost(employee.toContract()); 

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