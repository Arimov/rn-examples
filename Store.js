import { observable, makeObservable, action, runInAction, computed } from 'mobx'
import Api from './Api'

export class CustomersStore {
    currentCustomer = null
    customers = []
    filter = ''

    get getCustomers(){
        return this.filter === '' ?
            this.customers
            : this.customers.filter(
                customer => customer.Name.toLowerCase().includes(this.filter.toLowerCase()))
    }

    constructor(rootStore) {
        this.rootStore = rootStore
        makeObservable(this, {
            rootStore: false,
            customers: observable,
            currentCustomer: observable,
            filter: observable,
            getCustomers: computed,
            get: action.bound,
            setCustomer: action.bound,
            setCustomers: action.bound,
            setFilter: action.bound,
        })
    }

    async get(token) {
        const api = new Api(token)
        let result = await api.CustomersGet() 
        runInAction(() => {
            if (result){
                this.customers = result
                console.log('GET CUSTOMERS FROM API')
            }
        })
    }
    
    setCustomers( newCustomersList ) {
        this.customers = newCustomersList.concat([])
    }

    setCustomer(customer) {
        this.currentCustomer.CustomerId = customer.CustomerId
        this.currentCustomer.Name = customer.Name
        this.currentCustomer.OverdueBalance = customer.OverdueBalance
        this.currentCustomer.TotalBalance = customer.TotalBalance
    }

    setFilter(filter){
        this.filter = filter
    }
}