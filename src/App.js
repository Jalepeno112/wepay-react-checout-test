import React, { Component } from 'react';
import {PaymentForm} from 'wepay-react-checkout';
import { Grid, FormGroup, Col, Button } from 'react-bootstrap';

import './App.css';

class PaymentForm2 extends PaymentForm {
  render() {
    console.log("PAYMENT FORM 2: ", this.props);
    const payment_info = this.props.payment_info ? this.props.payment_info : {};
    const name = this.props.name ? this.props.name : {};
    const email = this.props.email ? this.props.email : {};
    const amount = this.props.amount ? this.props.amount: {};

    return (<div className="App">
      <Grid>
        <form
          className="form-horizontal"
          onSubmit={this.handleSubmit}>
          <FormGroup>
            <Col lg={12}>
              <PaymentForm.Name
                onChange={this.handleChange}
                {...name} />
            </Col>
          </FormGroup>
          <Col lg={12}>
            <PaymentForm.Email
              onChange={this.handleChange}
              {...email} />
          </Col>
          <FormGroup>
            <Col lg={12}>
              <PaymentForm.PaymentInfo
                onChange={this.handleChange}
                {...payment_info}
              />
            </Col>
          </FormGroup>
          <Col lg={12}>
              <PaymentForm.Amount
                onChange={this.handleChange}
                {...amount}
              />
            </Col>
          <FormGroup>
            <Col lg={12}>
              <Button
                type="submit"
                bsStyle="success"
                block>
            Pay
              </Button>
            </Col>
          </FormGroup>
        </form>
      </Grid>
    </div>)
  }
}

class PaymentRequestForm extends PaymentForm {
  constructor(props){
    super(props);

    this.state = {};

    this.handlePaymentRequest = this.handlePaymentRequest.bind(this);
    this.handleSubmit = this.handlePaymentRequest;
  }

  render(){
    console.log("PAYMENT REQUEST PROPS: ", this.props);
    const name = this.props.name ? this.props.name : {};
    const email = this.props.email ? this.props.email : {};
    const amount = this.props.amount ? this.props.amount: {};

    return (<div className="App">
      <Grid>
        <form
          className="form-horizontal"
          onSubmit={this.handleSubmit}>
          <Col lg={12}>
            <PaymentForm.Email
              onChange={this.handleChange}
              {...email} />
          </Col>
          
          <Col lg={12}>
            <PaymentForm.Amount
              onChange={this.handleChange}
              {...amount}
            />
          </Col>
          <FormGroup>
            <Col lg={12}>
              <Button
                type="submit"
                bsStyle="success"
                block>
            Pay
              </Button>
            </Col>
          </FormGroup>
         
        </form>

      </Grid>
    </div>);
  }

   // trigger the PaymentRequest overlay
   handlePaymentRequest(e) { 
    e.preventDefault();
    console.log(JSON.stringify(this.state, null, 2));
    const supportedPaymentMethods = [  
      {  
        supportedMethods: ['basic-card'],  
      }  
    ];  

    const amount = {  
      currency: this.props.amount.currency === undefined ? 'USD' : this.props.amount.currency,  
      value: this.props.amount.value === undefined ? 0 : this.props.amount.value
    }  

    const paymentDetails = {  
      total: {
        label: 'Total',  
        amount: amount
      }
    };
    const request = new window.PaymentRequest(
      supportedPaymentMethods,
      paymentDetails
    );

    request.show()  
      .then((paymentResponse) => {
        console.log("PAYMENT: ", JSON.stringify(paymentResponse, null, 2));
        var token_payload = {
          client_id: this.props.client_id,
          user_name: paymentResponse.details.cardholderName,
          expiration_month: paymentResponse.details.expiryMonth,
          expiration_year: paymentResponse.details.expiryYear,
          email: this.props.email.value,
          address: {
            postal_code: paymentResponse.details.billingAddress.postalCode,
            country: paymentResponse.details.billingAddress.country
          },
          cc_number: paymentResponse.details.cardNumber,
          cvv: paymentResponse.details.cardSecurityCode
        };
        console.log("CARD: ", token_payload);

        // tokenize the card and handle the response
        // this is the place where we will insert the logic to send it to our backend
        return this.tokenizeCard(token_payload)
          .then((token) => {
            var cc_id = token.id;
            if(token.error) {
              throw token;
            }
            console.log("TOKEN: ", JSON.stringify(token, null, 2));
            return paymentResponse.complete()  
              .then(() => {  
                // TODO: Get the payment details from paymentResponse object.  
                // TODO: Process payment  
                alert("Payment Request complete: ", cc_id);
              });
          })
      })
      .catch((err) => {  
        console.error('Payment Request API error: ', err);  
      });
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment_form: {
        payment_info: {
          address:{
            country: {
              value:'US'
            }
          }
        },
        name: {},
        email: {},
        amount: {value: '100', currency: 'USD', editable:true}
      }
    };
    console.log("INITIALIZE APP: ", this.state);
    this.handleChange = this.handleChange.bind(this);
    this.handleTokenized = this.handleTokenized.bind(this);
  }

  handleChange(name, value) {
    var new_state = this.state;
    new_state[name] = value;
    
    this.setState(new_state);
  }

  // on success occurs when the card is tokenized
  // at this point, you need to send the tokenized card to your backend server
  // along with the payment information (such as cost)
  handleTokenized(response) {
    // we are going to re-package the info
    // this is all we need to call WePay's /checkout/create
    var payload = {
      credit_card_id:response.credit_card_id,
      amount: this.state.payment_form.amount.value,
      currency: this.state.payment_form.amount.currency,
    };
    alert(`Submit to backend: ${JSON.stringify(payload)}`);
  }
  

  render() {
    console.log("APP STATE: ", this.state);
    const payment_form = this.state.payment_form ? this.state.payment_form : {};

    // render this if window.PaymentRequest is not available.
    const default_payment_form = ( <PaymentForm2
      client_id="123490"
      production={false}
      onChange={this.handleChange}
      onTokenized={this.handleTokenized}
      name={payment_form.name}
      email={payment_form.email}
      amount={payment_form.amount}
      payment_info={payment_form.payment_info}
    /> );

    // render this if window.PaymentRequest is available
    const payment_request_form = (<PaymentRequestForm
      client_id="123490"
      production={false}
      onChange={this.handleChange}
      name={payment_form.name}
      email={payment_form.email}
      amount={payment_form.amount}
    />);
    return(
      
    window.PaymentRequest ? payment_request_form : default_payment_form
     //window.PaymentRequest ? default_payment_form : payment_request_form
    )
  }
}

export default App;
