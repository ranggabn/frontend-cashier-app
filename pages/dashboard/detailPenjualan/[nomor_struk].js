import { Button, Input, Space, Table } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import LayoutPage from "../../../components/layoutPage";
import { api } from "../../../components/utils/api";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { numberWithCommasString } from "../../../components/utils/koma";

export default function DetailPenjualan() {
  const router = useRouter();
  const [detail, setDetail] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { nomor_struk } = router.query;
      if (!nomor_struk) return null;
      getDetailPenjualan(nomor_struk);
    }
  }, [router.isReady]);

  const getDetailPenjualan = (nomor_struk) => {
    axios
      .get(api + "getDetailPenjualan", {
        params: {
          nomor_struk: nomor_struk,
        },
      })
      .then((res) => {
        setDetail(res.data.data);
      });
  };

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
            onClick={() =>
              clearFilters &&
              handleReset(clearFilters) &&
              handleSearch(selectedKeys, confirm, dataIndex)
            }
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
      title: "Nomor Struk",
      dataIndex: "nomor_struk",
      key: "nomor_struk",
      width: "20%",
      ...getColumnSearchProps("nomor_struk"),
    },
    {
      title: "Nama Barang",
      dataIndex: "nama",
      key: "nama",
      width: "15%",
      ...getColumnSearchProps("nama"),
    },
    {
      title: "Jumlah Barang",
      key: "jumlah_barang",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            {data.jumlah_barang + " " + data.satuan}
          </p>
        </>
      ),
    },
    {
      title: "Total Harga",
      key: "harga",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            Rp. {numberWithCommasString(data.harga * data.jumlah_barang)}
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
                <h1 className="page-title">Laporan Detail Penjualan</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan laporan detail penjualan.
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Container style={{ marginBottom: "80px" }}>
        <Row className="row-table">
          <Table columns={columns} dataSource={detail} />
        </Row>
      </Container>
    </>
  );
}
DetailPenjualan.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
