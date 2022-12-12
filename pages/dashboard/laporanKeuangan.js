import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import LayoutPage from "../../components/layoutPage";
import axios from "axios";
import { api } from "../../components/utils/api";
import { Col, Container, Row } from "react-bootstrap";
import { numberWithCommasString } from "../../components/utils/koma";
import { authPage } from "../../middleware/authorizationPage";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function LaporanKeuangan() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    axios.get(api + "getLaporanKeuangan").then((res) => {
      setData(res.data.data);
    });
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "insert_date",
      align: "center",
      key: "insert_date",
      width: "10%",
      ...getColumnSearchProps("insert_date"),
    },
    {
      title: "Total Pemasukan",
      children: [
        {
          title: "Penjualan",
          key: "penjualan",
          align: "center",
          width: "10%",
          render: (data) => (
            <>
              <p style={{ marginBottom: "0px" }}>
                Rp. {numberWithCommasString(data.penjualan)}
              </p>
            </>
          ),
        },
        {
          title: "Jasa Giling",
          key: "jasa_giling",
          align: "center",
          width: "10%",
          render: (data) => (
            <>
              <p style={{ marginBottom: "0px" }}>
                Rp. {numberWithCommasString(data.jasa_giling)}
              </p>
            </>
          ),
        },
      ],
    },

    {
      title: "Total Pengeluaran",
      align: "center",
      children: [
        {
          title: "Stok Barang",
          key: "pengeluaran",
          align: "center",
          width: "10%",
          render: (data) => (
            <>
              <p style={{ marginBottom: "0px" }}>
                Rp. {numberWithCommasString(data.pengeluaran)}
              </p>
            </>
          ),
        },
      ],
    },
    {
      title: "Total Keuntungan",
      key: "keuntungan",
      align: "center",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            Rp. {numberWithCommasString(data.keuntungan)}
          </p>
        </>
      ),
    },
  ];
  return (
    <>
      <Row>
        <Col className="col-title">
          <Container>
            <Row>
              <Col>
                <h1 className="page-title">Laporan Keuangan</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan laporan keuangan harian.
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Container style={{ marginBottom: "80px" }}>
        <Row className="row-table">
          <Table columns={columns} dataSource={data} />
        </Row>
      </Container>
    </>
  );
}

LaporanKeuangan.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
