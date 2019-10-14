import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { createUser } from "../actions/userActions";

import { Input, Button, Radio } from "antd";

export class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      gender: "Male",
      redirect: false
    };
  }
  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };

  onCreateUser = () => {
    const { name, email, gender } = this.state;
    this.props.createUser(name, email, gender);
    this.setState({
      redirect: true
    });
  };
  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/users" />;
    }
    return (
      <form>
        <label htmlFor="name">Name:</label>
        <br />
        <Input
          type="text"
          id="name"
          name="name"
          onChange={this.handleInputChange}
          value={this.state.name}
        />
        <br />
        <br />
        <label htmlFor="email">Email:</label>
        <br />
        <Input
          type="email"
          id="email"
          name="email"
          onChange={this.handleInputChange}
          value={this.state.email}
        />
        <br />
        <br />
        <Radio.Group
          onChange={this.handleInputChange}
          value={this.state.gender}
          name="gender"
        >
          <Radio value={"Male"}>Male</Radio>
          <Radio value={"Female"}>Female</Radio>
        </Radio.Group>{" "}
        <br />
        <br />
        <Button
          type="primary"
          style={{ backgroundColor: "#95de64" }}
          onClick={this.onCreateUser}
          ghost
        >
          Create
        </Button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  data: state.userReducers.users
});

const mapDispatchToProps = {
  createUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);
