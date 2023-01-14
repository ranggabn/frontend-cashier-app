import React, { useState } from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import LayoutPage from "../components/layoutPage";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Router from "next/router";
import { unauthPage } from "../middleware/authorizationPage";
import Cookie from "js-cookie";
import axios from "axios";
import { api } from "../components/utils/api";

const qs = require("querystring");

export async function getServerSideProps(ctx) {
  await unauthPage(ctx);

  return { props: {} };
}

export default function Login() {
  const initialState = {
    username: "",
    password: "",
  };
  const [isAlert, setIsAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(initialState);

  const handleInputChange = (event) => {
    setIsAlert(false);
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = async () => {
    setData({ ...data });
    const requestBody = {
      username: data.username,
      password: data.password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(api + "auth/api/v1/login", qs.stringify(requestBody), config)
      .then((res) => {
        if (res.data.status === "99") {
          setMessage(res.data.message);
          setIsAlert(true);
        } else {
          Cookie.set("username", res.data.data.username);
          Cookie.set("role", res.data.data.role);
          Cookie.set("token", res.data.token);
          setTimeout(() => {
            Router.push("/dashboard/cashier");
          }, 50);
        }
      });
  };
  return (
    <>
      <div className="title">
        <Container>
          <Row className="row-index">
            <Col xl={5} md={7} xs={10}>
              <Card className="card-login">
                <Row style={{ marginBottom: "30px !important" }}>
                  <Col className="row-index">
                    <img
                      src="/images/password.png"
                      alt="logo"
                      className="logo-login"
                    />
                  </Col>
                </Row>
                <Row>
                  <Form
                    layout="vertical"
                    autoComplete="off"
                    onFinish={submitForm}
                  >
                    {isAlert && (
                      <Alert
                        message={message}
                        type="error"
                        className="alert-form"
                        showIcon
                      />
                    )}
                    <Form.Item label="Username*">
                      <Input
                        size="large"
                        placeholder="Input your username"
                        prefix={<UserOutlined />}
                        value={data.username}
                        name="username"
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Item>
                    <Form.Item label="Password*">
                      <Input.Password
                        size="large"
                        placeholder="Input your password"
                        prefix={<LockOutlined />}
                        value={data.password}
                        name="password"
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Item>
                    <Form.Item className="item-btn">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="btn-primary"
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
Login.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
