import React, { Component } from 'react';
import {PaymentForm} from 'wepay-react-checkout';
import { Grid, FormGroup, Col, Button } from 'react-bootstrap';

import './App.css';

class PaymentForm2 extends PaymentForm {
  render() {
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
          <FormGroup>
            <Col lg={12}>
              <PaymentForm.Amount
                onChange={this.handleChange}
                {...amount}
              />
            </Col>
          </FormGroup>
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment_form: {
        payment_info: {},
        name: {},
        email: {},
      }
    };
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
    const payment_form = this.state.payment_form ? this.state.payment_form : {};
    /*return (<PaymentForm
      client_id="123490"
      production={false}
      onChange={this.handleChange}
      onTokenized={this.handleTokenized}
      name={payment_form.name}
      email={payment_form.email}
      amount={payment_form.amount}
      payment_info={payment_form.payment_info}
    />)*/;
    return(
      <PaymentForm2
        client_id="123490"
        production={false}
        onChange={this.handleChange}
        onTokenized={this.handleTokenized}
        name={payment_form.name}
        email={payment_form.email}
        amount={payment_form.amount}
        payment_info={payment_form.payment_info}
      />
    )
  }
}

export default App;
