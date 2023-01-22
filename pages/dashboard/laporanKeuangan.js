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
import moment from "moment";

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function LaporanKeuangan() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [totalPengeluaran, setTotalPengeluaran] = useState(null);
  const [totalPemasukkan, setTotalPemasukkan] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  let tahun = "";
  let bulan = "";
  let tanggal = "";

  useEffect(() => {
    getLaporanKeuangan();
  }, []);

  const getLaporanKeuangan = () => {
    axios
      .get(api + "getLaporanKeuangan", {
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
      .get(api + "getTotalKeuangan", {
        params: {
          tahun: tahun,
          bulan: bulan,
          tanggal: tanggal,
        },
      })
      .then((res) => {
        setTotal(res.data.data[0].keuntungan);
        setTotalPemasukkan(res.data.data[0].pemasukkan);
        setTotalPengeluaran(res.data.data[0].pengeluaran);
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
      align: "center",
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

  const onTahunChange = (date, dateString) => {
    tahun = dateString;
    getLaporanKeuangan();
    if (dateString) {
      getTotal();
    } else {
      setTotal(null);
    }
  };

  const onBulanChange = async (date, dateString) => {
    bulan = dateString;
    getLaporanKeuangan();
    if (dateString) {
      getTotal();
    } else {
      setTotal(null);
    }
  };

  const onTanggalChange = (date, dateString) => {
    tanggal = dateString;
    getLaporanKeuangan();
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
            <>
              <Input
                addonBefore="TOTAL PEMASUKAN"
                style={{ marginBottom: "10px" }}
                value={"Rp. " + numberWithCommasString(totalPemasukkan)}
                readOnly
              />
              <Input
                addonBefore="TOTAL PENGELUARAN"
                style={{ marginBottom: "10px" }}
                value={"Rp. " + numberWithCommasString(totalPengeluaran)}
                readOnly
              />
              <Input
                addonBefore="TOTAL KEUNTUNGAN"
                style={{ marginBottom: "10px" }}
                value={"Rp. " + numberWithCommasString(total)}
                readOnly
              />
            </>
          )}
          <Table columns={columns} dataSource={data} />
        </Row>
      </Container>
    </>
  );
}

LaporanKeuangan.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
