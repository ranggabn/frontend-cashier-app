import React, { useEffect, useState } from "react";
import NavbarComp from "./navbar";
import { Layout } from "antd";
import { CopyrightOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Footer, Content } = Layout;

export default function LayoutPage({ children }) {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    Cookies.get("token") ? setAuth(true) : setAuth(false);
  }, [Cookies.get("token")]);

  return (
    <>
      <Layout>
        <NavbarComp className="navbar-dashboard" token={auth} />
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
