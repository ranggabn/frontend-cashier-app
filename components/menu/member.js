import Cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import { Button, Form, Nav } from "react-bootstrap";

export default function Member({ handleClick }) {
  const logout = () => {
    Cookie.remove("username");
    Cookie.remove("token");
    Cookie.remove("role");

    setTimeout(() => {
      Router.push("/");
    }, 50);
  };

  return (
    <>
      <Nav
        className="me-auto my-2 my-lg-0"
        style={{ maxHeight: "100px" }}
        navbarScroll
      >
        <Nav.Link onClick={() => handleClick("/dashboard/cashier")}>
          Kasir
        </Nav.Link>
        <Nav.Link onClick={() => handleClick("/dashboard/laporanPenjualan")}>
          Laporan Penjualan
        </Nav.Link>
        <Nav.Link onClick={() => handleClick("/dashboard/laporanPembelian")}>
          Laporan Pembelian
        </Nav.Link>
        <Nav.Link onClick={() => handleClick("/dashboard/laporanPenggilingan")}>
          Laporan Jasa Penggilingan
        </Nav.Link>
        <Nav.Link onClick={() => handleClick("/dashboard/laporanKeuangan")}>
          Laporan Keuangan
        </Nav.Link>
      </Nav>
      <Form className="d-flex">
        <Button variant="outline-success" onClick={() => logout()}>
          Logout
        </Button>
      </Form>
    </>
  );
}
