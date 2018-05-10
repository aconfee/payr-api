import { IBenefitsService } from '../../services/benefits.service';
import { IEmployeeService } from '../../services/employee.service';
import { IDiscountsService } from '../../services/discounts.service';


const employeeResolver = (
    benefitsService: IBenefitsService, 
    employeeService: IEmployeeService,
    discountsService: IDiscountsService): any => {

    return {
        Employee: {
            dependents: (employee): any => { return benefitsService.getEmployeeDependents(employee.id); },
            payrollInfo: (employee): any => { return employeeService.getEmployeePayrollInfo(employee.id); },
            benefitsDiscounts: (employee): any => { return discountsService.getAllEligableBenefitsDiscounts(employee).map(discount => discount.name); },
            benefitsTotalAnnualCost: async (employee): Promise<any> => { return benefitsService.getTotalAnnualCost(employee); }
        }
    };

}

export default employeeResolver;