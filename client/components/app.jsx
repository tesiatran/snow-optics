import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  placeOrder(userInfo) {
    fetch('/api/orders.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    })
      .then(response => {
        response.json();
      })
      .then(data => {
        this.setState({
          cart: []
        });
        this.setView('catalog', {});
      });
  }

  addToCart(product) {
    fetch('/api/cart.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          cart: this.state.cart.concat(data)
        });
      });
  }

  componentDidMount() {
    this.getCartItems();
  }

  getCartItems() {
    fetch('/api/cart.php')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          cart: data
        });
      });
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params: params
      }
    });
  }

  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <div className="container">
          <Header nameText="Snow Optics" cartItemCount={this.state.cart.length} setView={this.setView}/>
          <ProductList setView={this.setView}/>
        </div>
      );
    } else if (this.state.view.name === 'details') {
      return (
        <div className="container">
          <Header nameText="Snow Optics" cartItemCount={this.state.cart.length} setView={this.setView}/>
          <ProductDetails
            setView={this.setView}
            viewParams={this.state.view.params}
            backText="<Back to catalog"
            addText="Add to cart"
            addToCart={this.addToCart}/>
        </div>
      );
    } else if (this.state.view.name === 'cart') {
      return (
        <div className="container">
          <Header nameText="Snow Optics" cartItemCount={this.state.cart.length} setView={this.setView}/>
          <CartSummary cartTotalData={this.state.cart} setView={this.setView} backText="<Back to catalog"/>
        </div>
      );
    } else if (this.state.view.name === 'checkout') {
      return (
        <div className="container">
          <Header nameText="Snow Optics" cartItemCount={this.state.cart.length} setView={this.setView}/>
          <CheckoutForm
            placeOrder={this.placeOrder}
            cartTotalData={this.state.cart}
            setView={this.setView}
            backText="<Back to catalog"
            continueText="<Continue shopping"/>
        </div>
      );
    }
  }
}
