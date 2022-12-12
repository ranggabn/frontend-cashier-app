import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  ListGroup,
  Form,
  Badge,
  InputGroup,
  Table,
} from "react-bootstrap";
import { Pagination, Modal, Select, Input } from "antd";
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
import ModalKeranjang from "../../components/modal/modalKeranjang";
import ModalKeranjangJasa from "../../components/modal/modalKeranjangJasa";
import { useReactToPrint } from "react-to-print";

const { confirm } = Modal;
const { Option } = Select;

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function Cashier() {
  const componentRef = useRef();
  const [kategori, setKategori] = useState([]);
  const [barang, setBarang] = useState([]);
  const [jasa, setJasa] = useState([]);
  const [keranjang, setKeranjang] = useState([]);
  const [keranjangJasa, setKeranjangJasa] = useState([]);
  const [detail, setDetail] = useState([]);
  const [detailJasa, setDetailJasa] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataPelanggan, setDataPelanggan] = useState({
    nama: "",
    nomor_telefon: "",
  });
  const [pelanggan, setPelanggan] = useState("");
  const [option, setOption] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [struk, setStruk] = useState("");
  const [currentPagination, setCurrentPagination] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openJasa, setOpenJasa] = useState(false);

  useEffect(() => {
    getKategori();
    getBarang("");
    getKeranjang();
    getJasa();
    getPelanggan();
  }, []);

  const getKategori = () => {
    axios.get(api + "getKategori").then((res) => {
      setKategori(res.data.data);
    });
  };

  const getJasa = () => {
    axios.get(api + "getJasa").then((res) => {
      setJasa(res.data.data);
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
    axios.get(api + "getKeranjang").then((res) => {
      setKeranjang(res.data.data);
      getTotalharga();
    });
    axios.get(api + "getKeranjangJasa").then((res) => {
      setKeranjangJasa(res.data.data);
    });
  };

  const getTotalharga = async () => {
    await axios.get(api + "getTotalHarga").then((res) => {
      let harga_total = res.data.data[0].total_harga;
      axios.get(api + "getTotalHargaJasa").then((res) => {
        setTotal(harga_total + res.data.data[0].total_harga);
      });
    });
  };

  const deleteAllKeranjang = async (status) => {
    await axios.delete(api + "deleteAllKeranjang").then((res) => {
      if (status) {
        keranjang.map((data) =>
          axios.put(api + "returnBarang", data).then((res) => {
            getBarang("");
            swal({
              title: "Sukses Bersihkan Keranjang",
              text: "Keranjang telah kosong!",
              icon: "success",
              button: false,
              timer: 1200,
            });
          })
        );
      }
    });
    await axios.delete(api + "deleteKeranjangJasa").then((res) => {
      swal({
        title: "Sukses Bersihkan Keranjang",
        text: "Keranjang telah kosong!",
        icon: "success",
        button: false,
        timer: 1200,
      });
    });
    getKeranjang();
    setPelanggan("");
  };

  const handleChangeKateg = (key) => {
    getBarang(key);
  };

  const postKeranjang = (id_barang) => {
    const requestBody = {
      id_barang: id_barang,
    };

    axios
      .get(api + "getDetailKeranjang", {
        params: {
          id_barang: id_barang,
        },
      })
      .then((res) => {
        if (res.data.data.length > 0) {
          axios
            .put(api + "putKeranjang", qs.stringify(requestBody))
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
            .post(api + "postKeranjang", qs.stringify(requestBody))
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
    putBarang(id_barang, 1);
  };

  const putBarang = (id_barang, jumlah_barang) => {
    const requestBody = {
      id_barang: id_barang,
      jumlah_barang: jumlah_barang,
    };

    axios.put(api + "putBarang", qs.stringify(requestBody)).then((res) => {
      getBarang("");
    });
  };

  const postKeranjangJasa = (id_jasa) => {
    const requestBody = {
      id_jasa: id_jasa,
    };

    axios
      .get(api + "getDetailKeranjangJasa", {
        params: {
          id_jasa: id_jasa,
        },
      })
      .then((res) => {
        if (res.data.data.length > 0) {
          axios
            .put(api + "putKeranjangJasa", qs.stringify(requestBody))
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
            .post(api + "postKeranjangJasa", qs.stringify(requestBody))
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
      title: "Yakin ingin melanjutkan pembayaran?",
      icon: <ExclamationCircleFilled />,
      content:
        "Perhatian! Setelah menekan tombol ok barang akan masuk ke dalam laporan penjualan.",
      onOk() {
        postPenjualan();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const jenisPelanggan = (e) => {
    setPelanggan(e);
    if (e == "2") {
      getPelanggan();
    }
  };

  const getPelanggan = () => {
    axios.get(api + "getPelanggan").then((res) => {
      const result = Object.values(res.data.data);
      result.map(
        (data) => (
          (data["label"] = data["nama_pelanggan"]),
          (data["value"] = data["nama_pelanggan"])
        )
      );
      setOption(result);
    });
  };

  const showModal = (id_barang, type) => {
    if (type == "barang") {
      axios
        .get(api + "getDetailKeranjang", {
          params: {
            id_barang: id_barang,
          },
        })
        .then((res) => {
          setDetail(res.data.data[0]);
          setOpen(true);
        });
    } else {
      axios
        .get(api + "getDetailKeranjangJasa", {
          params: {
            id_jasa: id_barang,
          },
        })
        .then((res) => {
          setDetailJasa(res.data.data[0]);
          setOpenJasa(true);
        });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setOpenJasa(false);
  };

  const handleChange = (e) => {
    const newData = { ...detail };
    newData[e.target.name] = e.target.value;
    let result = keranjang.find((obj) => {
      return obj.key === newData.id_barang;
    });
    if (newData.jumlah_barang !== undefined) {
      if (newData.jumlah_barang < 1) {
        newData.jumlah_barang = 1;
      }
      if (newData.jumlah_barang > detail.stok + result.jumlah_barang) {
        newData.jumlah_barang = detail.stok + result.jumlah_barang;
      }
    }
    setDetail({ ...newData });

    const newPelanggan = { ...dataPelanggan };
    newPelanggan[e.target.name] = e.target.value;
    setDataPelanggan({ ...newPelanggan });
  };

  const handleChangeJasa = (e) => {
    const newJasa = { ...detailJasa };
    newJasa[e.target.name] = e.target.value;
    setDetailJasa({ ...newJasa });
  };

  const putKeranjang = () => {
    setLoading(true);
    const requestBody = {
      id_barang: detail.id_barang,
      jumlah_barang: detail.jumlah_barang,
    };

    putBarang(
      requestBody.id_barang,
      detail.jumlah_barang - keranjang[0].jumlah_barang
    );

    axios
      .put(api + "putDetailKeranjang", qs.stringify(requestBody))
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

  const putKeranjangJasa = () => {
    const requestBody = {
      id_jasa: detailJasa.id_jasa,
      jumlah: detailJasa.jumlah,
    };

    axios
      .put(api + "putDetailKeranjangJasa", qs.stringify(requestBody))
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

  const postPenjualan = async () => {
    const requestBody = {
      nomor_struk: "SP-" + new Date().getTime(),
      nama_pelanggan: dataPelanggan.nama,
      nomor_telefon: dataPelanggan.nomor_telefon,
      total_harga: total,
    };
    setStruk(requestBody.nomor_struk);

    await axios
      .post(api + "postPenjualan", qs.stringify(requestBody))
      .then((res) => {
        if (keranjangJasa.length > 0) {
          keranjangJasa[0]["nomor_struk"] = requestBody.nomor_struk;
        }
        axios
          .post(api + "postDetailJasa", qs.stringify(keranjangJasa[0]))
          .then((res) => {
            swal({
              title: "BERHASIL!",
              text: res.data.message,
              icon: "success",
              button: false,
              timer: 1200,
            });
            deleteAllKeranjang(false);
          });
        keranjang.map(
          (data) => (data["nomor_struk"] = requestBody.nomor_struk)
        );
        keranjang.map((data) =>
          axios.post(api + "postDetailPenjualan", data).then((res) => {
            swal({
              title: "BERHASIL!",
              text: res.data.message,
              icon: "success",
              button: false,
              timer: 1200,
            });
            deleteAllKeranjang(false);
          })
        );
      });
    await handlePrint();
  };

  const onChange = (value, data) => {
    setDataPelanggan({
      nama: value,
      nomor_telefon: data.nomor_telefon,
    });

    axios
      .get(api + "getKeranjangByNomor", {
        params: {
          nomor_telefon: data.nomor_telefon,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setKeranjang(res.data.data);
        const result = Object.values(res.data.data);
        result.map((data) =>
          axios.post(api + "postKeranjangMany", data).then((res) => {
            axios.put(api + "putBarangMany", data).then((res) => {
              getBarang("");
            });
            getKeranjang();
          })
        );
      });
  };

  const deleteKeranjang = (id_barang, type) => {
    if (type == "barang") {
      const data = {
        id_barang: id_barang,
        jumlah_barang: keranjang[0].jumlah_barang,
      };

      axios
        .delete(api + "deleteKeranjang", {
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
          axios.put(api + "returnBarang", data).then((res) => {
            getBarang("");
            swal({
              title: "Sukses Bersihkan Keranjang",
              text: "Keranjang telah kosong!",
              icon: "success",
              button: false,
              timer: 1200,
            });
          });
          getKeranjang();
        });
    } else {
      axios.delete(api + "deleteKeranjangJasa").then((res) => {
        setOpenJasa(false);
        swal({
          title: "Sukses Bersihkan Keranjang",
          text: "Keranjang telah kosong!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        getKeranjang();
        getBarang("");
      });
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container-cashier">
      <Container>
        <Row className="mt-5">
          <Col>
            <h3 className="text-center">
              <b className="kasir-title">KASIR</b>
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
                    <th>#</th>
                    <th>Nama Jasa</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jasa.map((jasa) => (
                    <tr key={jasa.key}>
                      <td>1</td>
                      <td>{jasa.nama_jasa}</td>
                      <td>
                        Rp. {numberWithCommasString(jasa.harga_jasa)} / Kg
                      </td>
                      <td>
                        <Button onClick={() => postKeranjangJasa(jasa.key)}>
                          Tambah Keranjang
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row>
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
                    <Col md={4} xs={6} className="mb-4" key={barang.key}>
                      <Card className="shadow card-body-toko">
                        <Card.Img
                          variant="top"
                          className="card-image"
                          src={barang.image}
                          alt="gambar"
                        />
                        <Card.Body>
                          <Card.Title tag="h5">{barang.nama}</Card.Title>
                          <Card.Text
                            style={{
                              fontFamily: "sans-serif",
                              fontWeight: "bolder",
                              fontSize: "16px",
                            }}
                          >
                            <strong>
                              Rp. {numberWithCommasString(barang.harga)}
                            </strong>
                          </Card.Text>
                          <Card.Text>Stok : {barang.stok}</Card.Text>
                          <Button
                            color="info"
                            className="mb-1 mt-2"
                            type="button"
                            onClick={() => postKeranjang(barang.key)}
                            disabled={barang.stok ? false : true}
                          >
                            {barang.stok ? "Tambah Keranjang" : "Stok Habis"}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
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
                  <h4 className="text-center">Struk Penjualan Barang</h4>
                  <h5 className="text-center">Sumber Rezeki Makmur</h5>
                  <hr />
                  <p>
                    Nomor Struk : <b>{struk}</b>
                  </p>
                  <p>
                    Nama Pelanggan : <b>{dataPelanggan.nama}</b>
                  </p>
                  <p>
                    Nomor Telefon : <b>{dataPelanggan.nomor_telefon}</b>
                  </p>
                  <hr />
                  <ListGroup>
                    {keranjang.map((keranjang) => (
                      <ListGroup.Item key={keranjang.key} type="button" action>
                        <Row>
                          <Col xl={1} lg={1} md={1} xs={1}>
                            <Badge pill bg="success">
                              {keranjang.jumlah_barang}
                            </Badge>
                          </Col>
                          <Col xl={7} lg={5} md={6} xs={7}>
                            <h5>{keranjang.nama}</h5>
                            <p>Rp. {numberWithCommasString(keranjang.harga)}</p>
                          </Col>
                          <Col xl={4} lg={5} md={4} xs={4}>
                            <b>
                              <p style={{ fontWeight: "bolder" }}>
                                Rp.{" "}
                                {numberWithCommasString(
                                  keranjang.jumlah_barang * keranjang.harga
                                )}
                              </p>
                            </b>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                    {keranjangJasa.map((jasa) => (
                      <ListGroup.Item
                        key={jasa.key}
                        type="button"
                        onClick={() => showModal(jasa.id_jasa, "jasa")}
                        action
                      >
                        <Row>
                          <Col xl={1} lg={1} md={1} xs={1}>
                            <Badge pill bg="success">
                              {jasa.jumlah}
                            </Badge>
                          </Col>
                          <Col xl={7} lg={5} md={6} xs={7}>
                            <h5>{jasa.nama_jasa}</h5>
                            <p>Rp. {numberWithCommasString(jasa.harga_jasa)}</p>
                          </Col>
                          <Col xl={4} lg={5} md={4} xs={4}>
                            <b>
                              <p style={{ fontWeight: "bolder" }}>
                                Rp.{" "}
                                {numberWithCommasString(
                                  jasa.jumlah * jasa.harga_jasa
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
              <Select
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                defaultValue=""
                value={pelanggan}
                onChange={(e) => jenisPelanggan(e)}
              >
                <Option value="" disabled>
                  Pilih Jenis Pelanggan
                </Option>
                <Option value="1">Baru</Option>
                <Option value="2">Lama</Option>
              </Select>
              {pelanggan ? (
                pelanggan == "1" ? (
                  <>
                    <Input
                      placeholder="Nama Pelanggan"
                      name="nama"
                      onChange={(e) => handleChange(e)}
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    />
                    <Input
                      placeholder="Nomor Telefon"
                      name="nomor_telefon"
                      onChange={(e) => handleChange(e)}
                      style={{
                        width: "100%",
                        marginBottom: "10px",
                      }}
                    />
                  </>
                ) : (
                  <Select
                    showSearch
                    placeholder="Cari Pelanggan"
                    optionFilterProp="children"
                    style={{ minWidth: "100%", marginBottom: "10px" }}
                    onChange={onChange}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={option}
                  />
                )
              ) : (
                ""
              )}
              <ListGroup>
                {keranjang.map((keranjang) => (
                  <ListGroup.Item
                    key={keranjang.key}
                    type="button"
                    onClick={() => showModal(keranjang.id_barang, "barang")}
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
                        <p>Rp. {numberWithCommasString(keranjang.harga)}</p>
                      </Col>
                      <Col xl={4} lg={5} md={4} xs={4}>
                        <b>
                          <p style={{ fontWeight: "bolder" }}>
                            Rp.{" "}
                            {numberWithCommasString(
                              keranjang.jumlah_barang * keranjang.harga
                            )}
                          </p>
                        </b>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                {keranjangJasa.map((jasa) => (
                  <ListGroup.Item
                    key={jasa.key}
                    type="button"
                    onClick={() => showModal(jasa.id_jasa, "jasa")}
                    action
                  >
                    <Row>
                      <Col xl={1} lg={1} md={1} xs={1}>
                        <Badge pill bg="success">
                          {jasa.jumlah}
                        </Badge>
                      </Col>
                      <Col xl={7} lg={5} md={6} xs={7}>
                        <h5>{jasa.nama_jasa}</h5>
                        <p>Rp. {numberWithCommasString(jasa.harga_jasa)}</p>
                      </Col>
                      <Col xl={4} lg={5} md={4} xs={4}>
                        <b>
                          <p style={{ fontWeight: "bolder" }}>
                            Rp.{" "}
                            {numberWithCommasString(
                              jasa.jumlah * jasa.harga_jasa
                            )}
                          </p>
                        </b>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
                <ModalKeranjang
                  loading={loading}
                  handleCancel={handleCancel}
                  open={open}
                  detail={detail}
                  handleChange={handleChange}
                  putKeranjang={putKeranjang}
                  deleteKeranjang={deleteKeranjang}
                />
                <ModalKeranjangJasa
                  loading={loading}
                  handleCancel={handleCancel}
                  open={openJasa}
                  detail={detailJasa}
                  handleChangeJasa={handleChangeJasa}
                  putKeranjangJasa={putKeranjangJasa}
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
              {(keranjang.length > 0 || keranjangJasa.length > 0) && (
                <Row className="mt-3">
                  <Container>
                    <Button color="success" onClick={showConfirm}>
                      Lanjutkan Pembayaran
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
Cashier.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
