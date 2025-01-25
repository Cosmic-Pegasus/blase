import React, { Component } from 'react';
import Loader from '../Loader'; // Adjust the import path as needed
import WShop from './WomenShop/WShop';

class WShopLoader extends Component {
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

                    <WShop />

                )}
            </div>

        );
    }
}

export default WShopLoader;
