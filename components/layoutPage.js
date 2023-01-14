import React, { useEffect, useState } from "react";
import NavbarComp from "./navbar";
import { Layout } from "antd";
import { CopyrightOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Footer, Content } = Layout;

export default function LayoutPage({ children }) {
  const [auth, setAuth] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    Cookies.get("token") ? setAuth(true) : setAuth(false);
    Cookies.get("role") == 1 ? setAdmin(true) : setAdmin(false);
  }, [Cookies.get("token"), Cookies.get("role")]);

  return (
    <>
      <Layout>
        <NavbarComp className="navbar-dashboard" token={auth} admin={admin} />
        <Content className="content-dashboard">{children}</Content>
        <Footer className="footer-dashboard">
          2022&nbsp;
          <CopyrightOutlined className="copyright-icon" />
          &nbsp;Sumber Rezeki Makmur
        </Footer>
      </Layout>
    </>
  );
}
