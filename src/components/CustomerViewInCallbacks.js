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
import CountStore from '../store/CountStore'

//Things to learn about react will be labeled with a TtL tag

//Main container
class CustomerView extends Component {
    constructor(props) {
        //TtL: props are the arguments to the component 
        //presented in the tag. Non-mutable. 
        super(props);
        //TtL: states are withen the scope 
        //of the component. Must be changed async through
        //this.setState({key:val,,,})
        this.state = {
            searchTerm: "",
            customers : [],
            selectedCustomer :""
        };
        //TtL: methods must be binded to be called
        this.handleSearch=this.handleSearch.bind(this);
        this.handleSelection=this.handleSelection.bind(this);
        this.apiSearch = this.apiSearch.bind(this);
      
    }

    //All api calls are on this component
    apiSearch(searchTerm) {
        let apiString;
        if (searchTerm === undefined || searchTerm === "") {
            apiString = 'http://localhost:8080/customers.json'
        }
        else {
            apiString = 'http://localhost:8080/customers/' + searchTerm + '.json'
        }
        console.log(apiString)
        //TtL: fetch is a super easy way to request. Can add 
        //additional args for other types (PUT, POST, ect.)
        fetch(apiString)
        .then((res) => res.json())
        .then((resj) => {
          this.setState({
            customers: resj,
            selectedCustomer: ""
          });
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

    handleSelection(index) {
        this.setState({
            selectedCustomer: this.state.customers[index]
        });
    }
    

    render() {
        //Search Bar
        //List of customers
        //Detail of selected customer
        //Customer counter
        //TtL: responsive grid, 12 cols, like bootstrap
        return (
            <Grid container>
                <Grid item xs={3}>
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <CustomerSearch store={store} onHandleSearch={this.handleSearch}/>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomerList store={store} customers={this.state.customers} onHandleSelection={this.handleSelection}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <CustomerDetail customer={this.state.selectedCustomer}/>
                </Grid>
                <Grid item xs={1}>
                    <DetailCounter store={store}/>
                </Grid>
            </Grid>
        )
    }
}

const store = new CountStore();


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

    handleChange(event) {
        //not the best way to save data but 
        //good demonstration of passing between comp.
        this.setState({
            searchTerm: event.target.value
        })
    }


    handleSubmit(event) {
        console.log(event.target.value)
        //TtL: to pass data between components,
        //protocol is to use a callback. This doesn't
        //scale well, which is where global state come in

        //Sends input value to parent to be searched.
        this.props.onHandleSearch(this.state.searchTerm);

        //
    }

    
    handleReset(event) {
        //Empty API search: getAll
        this.props.store.clear();
        this.props.onHandleSearch();
    }

    

    render() {
        //Testing Material-UI components
        return (
            <div>
                <Button color="secondary" onClick={this.handleReset}>Reset</Button>
                <FormControl>
                    <Input id="last-name-field" type="text" onChange={this.handleChange}/>
                    <InputLabel htmlFor="last-name-field">Last Name:</InputLabel>
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
      this.state = {
          selectedIndex: -1
      }
      this.handleClick=this.handleClick.bind(this) ;
    }
    
    handleClick(event, index) {
        this.props.store.increment();
        this.setState({
            selectedIndex: index
        });
        this.props.onHandleSelection(index);
    }

    render() {
        let listItems = [];
        //Make array of 'ListItem's with each customer
        //https://egghead.io/lessons/react-use-map-to-create-react-components-from-arrays-of-data
        //TtL: here is an example of dynamic data rendering and how
        //http elements can be stored
        if (this.props.customers !== undefined) {
            listItems = this.props.customers.map((cust, index) =>
            <div>
                <ListItem key={cust.key} selected={this.state.selectedIndex === index}
                onClick={event => this.handleClick(event, index)}>
                    <ListItemText>{cust.firstName} {cust.lastName}</ListItemText>
                </ListItem>
                <Divider />
            </div>
            );
        }
        return (
            <div>
                <List>
                    {listItems}
                </List>
            </div>
        )
    }
}

class CustomerDetail extends Component {
    //Neat types of conditional rendering https://blog.logrocket.com/conditional-rendering-in-react-c6b0e5af381e

    render() {
        if (this.props.customer){
            return (
                <div>
                    <div>
                        Name: {this.props.customer.firstName} {this.props.customer.lastName}
                    </div>
                    <div>
                        ID: {this.props.customer.id}
                    </div>
                </div>
            );
        }
        else {
            return (<div/>)
        }
    }
}


//@observer
class DetailCounter extends Component {
    
    render() {
        const {store} = this.props
        return (
            <div>
                {store.count}
            </div>
        );
    }
    
}

DetailCounter = observer(DetailCounter)


export default CustomerView;