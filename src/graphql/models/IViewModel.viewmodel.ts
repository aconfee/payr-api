import IContract from '../../business/contracts/IContract';

export default interface IViewModel {
    toContract(): IContract;
};