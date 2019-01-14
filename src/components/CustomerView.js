import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { FormControl } from '@material-ui/core';
import {observer} from 'mobx-react'
import Store from '../store/Store'

//Things to learn about react will be labeled with a TtL tag



//TtL: mobx global state storage (./store/Store.js)
const store = new Store();


//Main container
class CustomerView extends Component {
    constructor(props) {
        //TtL: props are the arguments to the component 
        //presented in the tag. Non-mutable. 
        super(props);
        //TtL: states are withen the scope 
        //of the component. Must be changed async through
        //  this.setState({key:val,,,})
        this.state = {
            searchTerm: "",
        };
        //TtL: methods must be binded to be called with 'this'
        this.handleSearch=this.handleSearch.bind(this);
        this.apiSearch = this.apiSearch.bind(this);
    }

    //All api calls are on this component
    apiSearch(searchTerm) {
        let apiString;
        if (searchTerm === undefined || searchTerm === "") {
            apiString = 'http://192.168.106.227:8080/customers.json'
        }
        else {
            apiString = 'http://192.168.106.227:8080/customers/' + searchTerm + '.json'
        }
        //TtL: fetch api is a super easy way to request. Can add 
        //additional args for other types (PUT, POST, ect.)

        //lookup: observable
        fetch(apiString)
        .then((res) => res.json())
        .then((resj) => {
            store.change(resj)
        })
        .catch((error) => {
            console.error(error);
        });
    }

    componentWillMount() {
        //TtL: componant will mount is the best time in
        //the life cycle to fetch
        this.apiSearch("");
    }

    handleSearch(searchTerm) {
        //API search and update customers
        this.apiSearch(searchTerm);
    }
    

    render() {
        //Search Bar
        //List of customers
        //Detail of selected customer
        //Customer counter
        //TtL: responsive grid, 12 cols, like bootstrap
        return (
            <Grid container>
                <Grid item sm={3} xs={6}>
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <CustomerSearch onHandleSearch={this.handleSearch}/>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomerList store={store}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={9} xs={6}>
                    <CustomerDetail store={store}/>
                </Grid>
            </Grid>
        )
    }
}



class CustomerSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        }
        this.handleSubmit=this.handleSubmit.bind(this) ;
        this.handleChange=this.handleChange.bind(this);
        this.handleReset=this.handleReset.bind(this);
    }

    //canonnical with FormControl
    handleChange(event) {
        this.setState({
            searchTerm: event.target.value
        })
    }


    handleSubmit(event) {
        //TtL: protocol is to use a callback for
        //passing data between compononents. This doesn't
        //scale well. We use global state for UI elements

        //Sends input value to parent to be searched.
        this.props.onHandleSearch(this.state.searchTerm);
        //
    }

    
    handleReset(event) {
        //Empty API search: getAll
        this.props.onHandleSearch();
    }

    

    render() {
        //Testing Material-UI components
        return (
            <div>
                <Button color="secondary" onClick={this.handleReset}>Reset</Button>
                <FormControl>
                    <InputLabel htmlFor="last-name-field">Last Name:</InputLabel>
                    <Input id="last-name-field" type="text" onChange={this.handleChange}/>
                </FormControl>
                <Button color="primary" onClick={this.handleSubmit}>Search</Button>
            </div>
        );
    }
}

class CustomerList extends Component {
    constructor(props) {
        super(props);
        //index of selected customer (for highlight)
        this.handleClick=this.handleClick.bind(this) ;
    }
    
    handleClick(event, index) {
        this.props.store.select(index)
    }

    render() {
        let listItems = [];
        //Make array of 'ListItem's with each customer
        //https://egghead.io/lessons/react-use-map-to-create-react-components-from-arrays-of-data
        //TtL: here is an example of dynamic data rendering and how
        //http elements can be stored
        if (this.props.store.customers !== undefined && this.props.store.customers !== []) {
            listItems = this.props.store.customers.map((cust, index) =>
            <div>
                <ListItem key={cust.key} selected={this.props.store.selectedIndex === index}
                onClick={event => this.handleClick(event, index)}>
                    <ListItemText>{cust.firstName} {cust.lastName}</ListItemText>
                </ListItem>
                <Divider />
            </div>
            );
        } 
        return (
            <List>
                {listItems}
            </List>
        )
    }
}


CustomerList = observer(CustomerList)


class CustomerDetail extends Component {
    //Neat types of conditional rendering https://blog.logrocket.com/conditional-rendering-in-react-c6b0e5af381e

    render() {
        const selectedCustomer = this.props.store.selectedCustomer;
        if (selectedCustomer){
            return (
                <div>
                    <div>
                        <h3>Name: {selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                    </div>
                    <div>
                        <h4>ID: {selectedCustomer.id}</h4>
                    </div>
                </div>
            );
        }
        else {
            return (<div/>)
        }
    }
}

CustomerDetail = observer(CustomerDetail)

export default CustomerView;