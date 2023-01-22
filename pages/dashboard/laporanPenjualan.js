import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import LayoutPage from "../../components/layoutPage";
import axios from "axios";
import { api } from "../../components/utils/api";
import { Col, Container, Row } from "react-bootstrap";
import { numberWithCommasString } from "../../components/utils/koma";
import { authPage } from "../../middleware/authorizationPage";
import Router from "next/router";
import moment from "moment";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function LaporanPenjualan() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  let tahun = "";
  let bulan = "";
  let tanggal = "";

  useEffect(() => {
    getPenjualan();
  }, []);

  const getPenjualan = () => {
    axios
      .get(api + "getPenjualan", {
        params: {
          tahun: tahun,
          bulan: bulan,
          tanggal: tanggal,
        },
      })
      .then((res) => {
        setData(res.data.data);
      });
  };

  const getTotal = () => {
    axios
      .get(api + "getTotalPenjualan", {
        params: {
          tahun: tahun,
          bulan: bulan,
          tanggal: tanggal,
        },
      })
      .then((res) => {
        setTotal(res.data.data[0].total);
      });
  };

  const handleClick = (record) => {
    Router.push("/dashboard/detailPenjualan/" + record.nomor_struk);
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
      title: "Nama Pelanggan",
      dataIndex: "nama_pelanggan",
      key: "nama_pelanggan",
      width: "15%",
      ...getColumnSearchProps("nama_pelanggan"),
    },
    {
      title: "Nomor Telefon",
      dataIndex: "nomor_telefon",
      key: "nomor_telefon",
      width: "10%",
      ...getColumnSearchProps("nomor_telefon"),
    },
    {
      title: "Total Harga",
      key: "total_harga",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            Rp. {numberWithCommasString(data.total_harga)}
          </p>
        </>
      ),
    },
    {
      title: "Tanggal",
      key: "insert_date",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            {moment(data.insert_date).format("YYYY-MM-DD HH:mm:ss")}
          </p>
        </>
      ),
    },
    {
      title: "Action",
      width: "10%",
      render: (text, record) => (
        <>
          <Row className="row-btn-table">
            <Col lg={12} md={12} className="col-btn">
              <Button
                className="btn-action"
                onClick={() => handleClick(record)}
              >
                Detail
              </Button>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const onTahunChange = (date, dateString) => {
    tahun = dateString;
    getPenjualan();
    if (dateString) {
      getTotal();
    } else {
      setTotal(null);
    }
  };

  const onBulanChange = async (date, dateString) => {
    bulan = dateString;
    getPenjualan();
    if (dateString) {
      getTotal();
    } else {
      setTotal(null);
    }
  };

  const onTanggalChange = (date, dateString) => {
    tanggal = dateString;
    getPenjualan();
    if (dateString) {
      getTotal();
    } else {
      setTotal(null);
    }
  };

  return (
    <>
      <Row>
        <Col className="col-title">
          <Container>
            <Row>
              <Col>
                <h1 className="page-title">Laporan Penjualan</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan laporan data penjualan dari pelanggan
                  beserta detailnya.
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Container style={{ marginBottom: "80px" }}>
        <Row className="row-table">
          <Row className="mb-2">
            <p style={{ marginBottom: "5px", marginLeft: "5px" }}>
              Filter Pertahun
            </p>
            <DatePicker
              onChange={onTahunChange}
              picker="year"
              style={{
                maxWidth: "400px",
                marginBottom: "10px",
                marginLeft: "1em",
              }}
            />
            <p style={{ marginBottom: "5px", marginLeft: "5px" }}>
              Filter Perbulan
            </p>
            <DatePicker
              onChange={onBulanChange}
              picker="month"
              style={{
                maxWidth: "400px",
                marginBottom: "10px",
                marginLeft: "1em",
              }}
            />
            <p style={{ marginBottom: "5px", marginLeft: "5px" }}>
              Filter Pertanggal
            </p>
            <DatePicker
              onChange={onTanggalChange}
              style={{
                maxWidth: "400px",
                marginBottom: "10px",
                marginLeft: "1em",
              }}
            />
          </Row>
          {total != null && (
            <Input
              addonBefore="TOTAL HARGA"
              style={{ marginBottom: "10px" }}
              value={"Rp. " + numberWithCommasString(total)}
              readOnly
            />
          )}
          <Table columns={columns} dataSource={data} />
        </Row>
      </Container>
    </>
  );
}

LaporanPenjualan.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
