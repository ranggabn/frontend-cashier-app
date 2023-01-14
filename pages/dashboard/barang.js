import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table, Modal } from "antd";
import Highlighter from "react-highlight-words";
import LayoutPage from "../../components/layoutPage";
import axios from "axios";
import { api } from "../../components/utils/api";
import { numberWithCommasString } from "../../components/utils/koma";
import { Col, Container, Row } from "react-bootstrap";
import { authPage } from "../../middleware/authorizationPage";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import Router from "next/router";
import swal from "sweetalert";

const { confirm } = Modal;

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function Barang() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    getBarang();
  }, []);

  const getBarang = () => {
    axios.get(api + "getAllBarang").then((res) => {
      setData(res.data.data);
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

  const showConfirm = (record) => {
    confirm({
      title: "Yakin ingin menghapus barang?",
      icon: <ExclamationCircleFilled />,
      content:
        "Perhatian! Barang yang sudah dihapus akan hilang dan tidak dapat dikembalikan.",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = (record) => {
    axios
      .delete(api + "deleteBarang", {
        params: {
          id_barang: record.id_barang,
        },
      })
      .then((res) => {
        swal({
          title: res.data.message,
          text: "Cek List Barang",
          icon: "success",
          button: false,
          timer: 1200,
        });
        getBarang();
      });
  };

  const handleClick = (path) => {
    Router.push(path);
  };

  const editBarang = (record) => {
    Router.push("/dashboard/barang/edit/" + record.id_barang);
  };

  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
      width: "10%",
      ...getColumnSearchProps("nama"),
    },
    {
      title: "Harga Jual",
      key: "harga",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            Rp. {numberWithCommasString(data.harga)}
          </p>
        </>
      ),
    },
    {
      title: "Harga Supplier",
      key: "harga_supplier",
      width: "10%",
      render: (data) => (
        <>
          <p style={{ marginBottom: "0px" }}>
            Rp. {numberWithCommasString(data.harga_supplier)}
          </p>
        </>
      ),
    },
    {
      title: "Satuan",
      dataIndex: "satuan",
      key: "satuan",
      width: "5%",
      ...getColumnSearchProps("satuan"),
    },
    {
      title: "Stok",
      dataIndex: "stok",
      key: "stok",
      width: "5%",
      ...getColumnSearchProps("stok"),
    },
    {
      title: "Kategori",
      dataIndex: "nama_kategori",
      key: "nama_kategori",
      width: "20%",
      ...getColumnSearchProps("nama_kategori"),
    },
    {
      title: "Action",
      width: "15%",
      render: (text, record) => (
        <>
          <Row className="row-btn-table">
            <Col lg={5} md={12} className="col-btn">
              <Button className="btn-action" onClick={() => editBarang(record)}>
                Edit
              </Button>
            </Col>
            <Col lg={6} md={12} className="col-btn">
              <Button
                type="primary"
                danger
                className="btn-action"
                onClick={() => showConfirm(record)}
              >
                Hapus
              </Button>
            </Col>
          </Row>
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
                <h1 className="page-title">Daftar Barang</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan data barang beserta detailnya.
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Container style={{ marginBottom: "80px" }}>
        <Row>
          <Col lg={12} sm={12} className="btn-tambah">
            <Button
              size="large"
              onClick={() => handleClick("/dashboard/barang/new")}
            >
              Tambah Barang
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ marginLeft: "10px" }}
              onClick={() => handleClick("/dashboard/supplier")}
            >
              Beli Ke Supplier
            </Button>
          </Col>
        </Row>
        <Row className="row-table">
          <Table columns={columns} dataSource={data} />
        </Row>
      </Container>
    </>
  );
}

Barang.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
