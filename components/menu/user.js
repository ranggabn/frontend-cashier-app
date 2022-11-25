import React from "react";
import { Button, Form, Nav } from "react-bootstrap";

export default function User({ handleClick }) {
  return (
    <>
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: "100px" }}
        navbarScroll
      >
        <Nav.Link onClick={() => handleClick("/")}>Home</Nav.Link>
      </Nav>
      <Form className="d-flex">
        <Button
          variant="outline-success"
          onClick={() => handleClick("/auth/login")}
        >
          Login
        </Button>
      </Form>
    </>
  );
}
