import React, { Component } from 'react';
import Loader from './Loader'; // Adjust the import path as needed
import Shop from './Shop/Shop';
import MShop from './MShop';

class ShopLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true, // Initially, set loading to true
        };
    }

    componentDidMount() {
        // Simulate an API call or other asynchronous data loading
        setTimeout(() => {
            this.setState({ isLoading: false }); // Set loading to false when the data is loaded
        }, 1500); // Replace with your actual data loading logic
    }

    render() {
        return (

            <div>
                {this.state.isLoading ? (
                    <Loader />
                ) : (

                    <Shop />

                )}
            </div>

        );
    }
}

export default ShopLoader;
