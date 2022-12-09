import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Upload } from "antd";
import {
  TagOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getBase64 } from "../../../components/utils/getBase64";
import axios from "axios";
import { api } from "../../../components/utils/api";
import qs from "querystring";
import swal from "sweetalert";
import { Col, Container, Row } from "react-bootstrap";
import LayoutPage from "../../../components/layoutPage";
import { authPage } from "../../../middleware/authorizationPage";

const { Option } = Select;

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function New() {
  const [form] = Form.useForm();
  const [data, setData] = useState({
    nama: "",
    harga: "",
    harga_supplier: "",
    satuan: "",
    stok: "",
  });
  const [image, setImage] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    getKategori();
  }, []);

  const getKategori = () => {
    axios.get(api + "getKategori").then((res) => {
      setKategori(res.data.data);
    });
  };

  const handleChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData({ ...newData });
  };

  const handleChangeImage = async (e) => {
    const image = await getBase64(e.file.originFileObj);
    setImage(image);
  };

  const handleSubmit = () => {
    const bodyRequest = {
      nama: data.nama,
      harga: data.harga,
      harga_supplier: data.harga_supplier,
      satuan: data.satuan,
      stok: data.stok,
      id_kategori: idKategori,
      image: image,
    };

    axios
      .post(api + "postBarang", qs.stringify(bodyRequest))
      .then((res) => {
        form.resetFields();
        swal({
          title: "Sukses Menambah Barang",
          text: "Cek Daftar Barang!",
          icon: "success",
          button: false,
          timer: 1200,
        });
      })
      .catch((error) => {
        swal({
          title: "Gagal Menambah Barang",
          text: "Ukuran Foto Terlalu Besar!",
          icon: "success",
          button: false,
          timer: 1800,
        });
      });
  };
  return (
    <>
      <Row>
        <Col className="col-title">
          <Container>
            <Row>
              <Col>
                <h1 className="page-title">Tambah Barang</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan formulir untuk menambah barang.
                </p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Container style={{ marginBottom: "80px" }}>
        <Row className="row-table">
          <Col xl={12} md={12} sm={12}>
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                label="Nama Barang"
                name="nama"
                rules={[
                  {
                    required: true,
                    message: "Harap isi nama barang !",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: Tepung Terigu"
                  size="large"
                  name="nama"
                  onChange={(e) => handleChange(e)}
                  prefix={<TagOutlined />}
                  required
                />
              </Form.Item>
              <Form.Item
                label="Harga"
                name="harga"
                rules={[
                  {
                    required: true,
                    message: "Harap isi harga barang !",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: 5000"
                  size="large"
                  type="number"
                  name="harga"
                  addonBefore="Rp. "
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Form.Item>
              <Form.Item label="Harga Supplier" name="harga_supplier">
                <Input
                  placeholder="Ex: 5000"
                  size="large"
                  type="number"
                  name="harga_supplier"
                  addonBefore="Rp. "
                  onChange={(e) => handleChange(e)}
                />
              </Form.Item>
              <Form.Item
                label="Satuan"
                name="satuan"
                rules={[
                  {
                    required: true,
                    message: "Harap isi jenis satuan !",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: kg"
                  size="large"
                  name="satuan"
                  onChange={(e) => handleChange(e)}
                  prefix={<ToolOutlined />}
                  required
                />
              </Form.Item>
              <Form.Item
                label="Stok Barang"
                name="stok"
                rules={[
                  {
                    required: true,
                    message: "Harap isi stok barang!",
                  },
                ]}
              >
                <Input
                  placeholder="Ex: 20"
                  size="large"
                  type="number"
                  name="stok"
                  onChange={(e) => handleChange(e)}
                  prefix={<ShoppingCartOutlined />}
                  required
                />
              </Form.Item>
              <Form.Item
                label="Kategori"
                name="id_kategori"
                rules={[
                  {
                    required: true,
                    message: "Harap isi kategori !",
                  },
                ]}
              >
                <Select
                  defaultValue="0"
                  name="id_kategori"
                  size="large"
                  onChange={(e) => setIdKategori(e)}
                  required
                >
                  <Option value="0" disabled>
                    Pilih Kategori
                  </Option>
                  {kategori.map((kategori) => (
                    <Option value={kategori.key} key={kategori.key}>
                      {kategori.nama}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Foto Barang"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Harap upload foto barang !",
                  },
                ]}
              >
                <Upload
                  listType="picture"
                  name="image"
                  maxCount={1}
                  onChange={(e) => handleChangeImage(e)}
                  required
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "80px",
                      minWidth: "100%",
                      borderStyle: "dotted",
                    }}
                  >
                    Upload Foto Barang (JPG/PNG/JPEG) - Max. 2MB
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
New.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
