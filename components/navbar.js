import React from "react";
import { Container, Navbar } from "react-bootstrap";
import Router from "next/router";
import Member from "./menu/member";
import User from "./menu/user";
import Admin from "./menu/admin";

export default function NavbarComp({ token, admin }) {
  const handleClick = (path) => {
    Router.push(path);
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="#">SRM</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {token ? (
            admin ? (
              <Admin handleClick={handleClick} />
            ) : (
              <Member handleClick={handleClick} />
            )
          ) : (
            <User handleClick={handleClick} />
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
