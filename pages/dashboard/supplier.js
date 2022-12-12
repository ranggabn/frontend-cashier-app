import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Container,
  Button,
  ListGroup,
  Form,
  Badge,
  InputGroup,
  Table,
} from "react-bootstrap";
import { Pagination, Modal } from "antd";
import axios from "axios";
import { numberWithCommasString } from "../../components/utils/koma";
import {
  SearchOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import swal from "sweetalert";
import qs from "querystring";
import LayoutPage from "../../components/layoutPage";
import { api } from "../../components/utils/api";
import { authPage } from "../../middleware/authorizationPage";
import ModalKeranjangBeli from "../../components/modal/modalKeranjangBeli";
import { useReactToPrint } from "react-to-print";

const { confirm } = Modal;

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}

export default function Supplier() {
  const componentRef = useRef();
  const [kategori, setKategori] = useState([]);
  const [barang, setBarang] = useState([]);
  const [keranjang, setKeranjang] = useState([]);
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [supplier, setSupplier] = useState("");
  const [struk, setStruk] = useState("");
  const [currentPagination, setCurrentPagination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getKategori();
    getBarang("");
    getKeranjang();
  }, []);

  const getKategori = () => {
    axios.get(api + "getKategori").then((res) => {
      setKategori(res.data.data);
    });
  };

  const getBarang = (kategori) => {
    axios
      .get(api + "getBarang", {
        params: {
          kategori: kategori,
        },
      })
      .then((res) => {
        setBarang(res.data.data);
      });
  };

  const getKeranjang = () => {
    axios.get(api + "getKeranjangBeli").then((res) => {
      setKeranjang(res.data.data);
      getTotalharga();
    });
  };

  const getTotalharga = () => {
    axios.get(api + "getTotalHargaBeli").then((res) => {
      setTotal(res.data.data[0].total_harga);
    });
  };

  const deleteAllKeranjang = (status) => {
    axios.delete(api + "deleteAllKeranjangBeli").then((res) => {
      getKeranjang();
      if (status) {
        swal({
          title: "Sukses Bersihkan Keranjang",
          text: "Keranjang telah kosong!",
          icon: "success",
          button: false,
          timer: 1200,
        });
      }
    });
  };

  const handleChangeKateg = (key) => {
    getBarang(key);
  };

  const postKeranjang = (id_barang) => {
    const requestBody = {
      id_barang: id_barang,
    };

    axios
      .get(api + "getDetailKeranjangBeli", {
        params: {
          id_barang: id_barang,
        },
      })
      .then((res) => {
        if (res.data.data.length > 0) {
          axios
            .put(api + "putKeranjangBeli", qs.stringify(requestBody))
            .then((res) => {
              swal({
                title: "Sukses Masuk Keranjang",
                text: "Cek Keranjang Anda!",
                icon: "success",
                button: false,
                timer: 1200,
              });
              getKeranjang();
            });
        } else {
          axios
            .post(api + "postKeranjangBeli", qs.stringify(requestBody))
            .then((res) => {
              swal({
                title: "Sukses Masuk Keranjang",
                text: "Cek Keranjang Anda!",
                icon: "success",
                button: false,
                timer: 1200,
              });
              getKeranjang();
            });
        }
      });
  };

  const showConfirm = () => {
    confirm({
      title: "Yakin ingin melanjutkan restok barang?",
      icon: <ExclamationCircleFilled />,
      content:
        "Perhatian! Setelah menekan tombol ok barang akan masuk ke dalam laporan pembelian.",
      onOk() {
        postPembelian();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showModal = (id_barang) => {
    axios
      .get(api + "getDetailKeranjangBeli", {
        params: {
          id_barang: id_barang,
        },
      })
      .then((res) => {
        setDetail(res.data.data[0]);
        setOpen(true);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const newData = { ...detail };
    newData[e.target.name] = e.target.value;
    setDetail({ ...newData });
  };

  const putKeranjang = () => {
    setLoading(true);
    const requestBody = {
      id_barang: detail.id_barang,
      jumlah_barang: detail.jumlah_barang,
    };

    axios
      .put(api + "putDetailKeranjangBeli", qs.stringify(requestBody))
      .then((res) => {
        setLoading(false);
        handleCancel();
        swal({
          title: "Sukses Masuk Keranjang",
          text: "Cek Keranjang Anda!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        getKeranjang();
      });
  };

  const postPembelian = async (e) => {
    const requestBody = {
      nomor_struk: "SP-" + new Date().getTime(),
      total_harga: total,
      nama_supplier: supplier,
    };
    setStruk(requestBody.nomor_struk);

    await axios
      .post(api + "postPembelian", qs.stringify(requestBody))
      .then((res) => {
        keranjang.map(
          (data) => (data["nomor_struk"] = requestBody.nomor_struk)
        );
        keranjang.map((data) =>
          axios.post(api + "postDetailPembelian", data).then((res) => {
            swal({
              title: "BERHASIL!",
              text: res.data.message,
              icon: "success",
              button: false,
              timer: 1200,
            });
            deleteAllKeranjang(false);
            setSupplier("");
          })
        );
        handlePrint();
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const deleteKeranjang = (id_barang) => {
    const data = {
      id_barang: id_barang,
      jumlah_barang: keranjang[0].jumlah_barang,
    };

    axios
      .delete(api + "deleteKeranjangBeli", {
        params: {
          id_barang: id_barang,
        },
      })
      .then((res) => {
        setOpen(false);
        swal({
          title: "Sukses Delete Keranjang",
          text: "Cek Keranjang Anda!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        getKeranjang();
      });
  };

  return (
    <div className="container-cashier">
      <Container>
        <Row className="mt-5">
          <Col>
            <h3 className="text-center">
              <b className="kasir-title">Restok Barang</b>
            </h3>
            <h5 className="text-center">Sumber Rezeki Makmur</h5>
          </Col>
        </Row>
      </Container>

      <Row className="mt-5 mx-1">
        <Col md={2} mt="2">
          <hr />
          <h4>
            <strong>Kategori</strong>
          </h4>
          <hr />
          <ListGroup>
            <ListGroup.Item
              tag="button"
              action
              onClick={() => handleChangeKateg("")}
            >
              Semua Kategori
            </ListGroup.Item>
            {kategori.map((kateg) => (
              <ListGroup.Item
                tag="button"
                action
                key={kateg.key}
                onClick={() => handleChangeKateg(kateg.key)}
              >
                {kateg.nama}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={10}>
          <Row className="row-cashier">
            <Col md={8}>
              <hr />
              <h4>
                <strong>Daftar Produk</strong>
              </h4>
              <hr />
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  <SearchOutlined />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Cari Nama Barang"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={(event) => setsearchTerm(event.target.value)}
                />
              </InputGroup>
              <Table striped bordered hover size="sm" className="table-jasa">
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Harga Supplier</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barang
                    .filter((barang) => {
                      if (searchTerm === "") {
                        return barang;
                      } else if (
                        barang.nama
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return barang;
                      }
                    })
                    .slice((currentPagination - 1) * 10, 10 * currentPagination)
                    .map((barang, key) => (
                      <tr key={barang.key}>
                        <td>{barang.nama}</td>
                        <td>
                          Rp. {numberWithCommasString(barang.harga_supplier)} /{" "}
                          {barang.satuan}
                        </td>
                        <td>{barang.stok}</td>
                        <td>
                          <Button onClick={() => postKeranjang(barang.key)}>
                            Tambah Keranjang
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div style={{ marginBottom: "80px", float: "right" }}>
                <Pagination
                  defaultCurrent={currentPagination}
                  current={currentPagination}
                  total={barang?.length}
                  onShowSizeChange={(e) => console.log(e)}
                  onChange={(e) => setCurrentPagination(e)}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            </Col>
            <Col md={4} mt="2">
              <hr />
              <h4>
                <strong>Keranjang</strong>
              </h4>
              <hr />
              <div style={{ position: "absolute", zIndex: "-1" }}>
                <div ref={componentRef} style={{ padding: "40px" }}>
                  <h4 className="text-center">Struk Pembelian Ke Supplier</h4>
                  <h5 className="text-center">Sumber Rezeki Makmur</h5>
                  <hr />
                  <p>
                    Nomor Struk : <b>{struk}</b>
                  </p>
                  <p>
                    Nama Supplier : <b>{supplier}</b>
                  </p>
                  <hr />
                  <ListGroup>
                    {keranjang.map((keranjang) => (
                      <ListGroup.Item
                        key={keranjang.key}
                        type="button"
                        onClick={() => showModal(keranjang.id_barang)}
                        action
                      >
                        <Row>
                          <Col xl={1} lg={1} md={1} xs={1}>
                            <Badge pill bg="success">
                              {keranjang.jumlah_barang}
                            </Badge>
                          </Col>
                          <Col xl={7} lg={5} md={6} xs={7}>
                            <h5>{keranjang.nama}</h5>
                            <p>
                              Rp.{" "}
                              {numberWithCommasString(keranjang.harga_supplier)}
                            </p>
                          </Col>
                          <Col xl={4} lg={5} md={4} xs={4}>
                            <b>
                              <p style={{ fontWeight: "bolder" }}>
                                Rp.{" "}
                                {numberWithCommasString(
                                  keranjang.jumlah_barang *
                                    keranjang.harga_supplier
                                )}
                              </p>
                            </b>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                    <br />
                  </ListGroup>
                  <hr />
                  <Row className="row-total">
                    <Col
                      xl={3}
                      lg={3}
                      md={4}
                      sm={2}
                      xs={3}
                      style={{ paddingRight: "0px" }}
                    >
                      <h5 style={{ marginBottom: "5px" }}>Total : </h5>
                    </Col>
                    <Col xl={9} lg={9} md={8} sm={10} xs={9}>
                      <ListGroup>
                        <ListGroup.Item variant="success">
                          <h5
                            style={{
                              whiteSpace: "nowrap",
                              marginBottom: "5px",
                            }}
                          >
                            {total
                              ? "Rp. " + numberWithCommasString(total)
                              : ""}
                          </h5>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </div>
              </div>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Nama Supplier"
                  aria-label="Nama Supplier"
                  aria-describedby="basic-addon1"
                  onChange={(event) => setSupplier(event.target.value)}
                />
              </InputGroup>
              <ListGroup>
                {keranjang.map((keranjang) => (
                  <ListGroup.Item
                    key={keranjang.key}
                    type="button"
                    onClick={() => showModal(keranjang.id_barang)}
                    action
                  >
                    <Row>
                      <Col xl={1} lg={1} md={1} xs={1}>
                        <Badge pill bg="success">
                          {keranjang.jumlah_barang}
                        </Badge>
                      </Col>
                      <Col xl={7} lg={5} md={6} xs={7}>
                        <h5>{keranjang.nama}</h5>
                        <p>
                          Rp. {numberWithCommasString(keranjang.harga_supplier)}
                        </p>
                      </Col>
                      <Col xl={4} lg={5} md={4} xs={4}>
                        <b>
                          <p style={{ fontWeight: "bolder" }}>
                            Rp.{" "}
                            {numberWithCommasString(
                              keranjang.jumlah_barang * keranjang.harga_supplier
                            )}
                          </p>
                        </b>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                <ModalKeranjangBeli
                  loading={loading}
                  handleCancel={handleCancel}
                  open={open}
                  detail={detail}
                  handleChange={handleChange}
                  putKeranjang={putKeranjang}
                  deleteKeranjang={deleteKeranjang}
                />
                <Form.Text color="muted">
                  <InfoCircleOutlined className="info-icon" />
                  Tekan list barang untuk mengedit keranjang
                </Form.Text>
                <br />
              </ListGroup>
              <Row className="row-total">
                <Col
                  xl={3}
                  lg={3}
                  md={4}
                  sm={2}
                  xs={3}
                  style={{ paddingRight: "0px" }}
                >
                  <h5 style={{ marginBottom: "5px" }}>Total : </h5>
                </Col>
                <Col xl={9} lg={9} md={8} sm={10} xs={9}>
                  <ListGroup>
                    <ListGroup.Item variant="success">
                      <h5 style={{ whiteSpace: "nowrap", marginBottom: "5px" }}>
                        {total ? "Rp. " + numberWithCommasString(total) : ""}
                      </h5>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              {keranjang.length > 0 && (
                <Row className="mt-3">
                  <Container>
                    <Button color="success" onClick={showConfirm}>
                      Restok Barang
                    </Button>
                  </Container>
                </Row>
              )}
              <Row className="mt-3">
                <Container>
                  <Button
                    color="danger"
                    onClick={() => deleteAllKeranjang(true)}
                  >
                    Bersihkan Keranjang
                  </Button>
                </Container>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
Supplier.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
