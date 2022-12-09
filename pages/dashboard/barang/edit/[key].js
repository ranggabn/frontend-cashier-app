import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Select, Upload } from "antd";
import {
  TagOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import qs from "querystring";
import swal from "sweetalert";
import { Col, Container, Row } from "react-bootstrap";
import { authPage } from "../../../../middleware/authorizationPage";
import { api } from "../../../../components/utils/api";
import LayoutPage from "../../../../components/layoutPage";
import { getBase64 } from "../../../../components/utils/getBase64";
import { useRouter } from "next/router";

const { Option } = Select;

export async function getServerSideProps(ctx) {
  const { token } = await authPage(ctx);

  return { props: { token } };
}
export default function EditBarang() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { key } = router.query;
  const [data, setData] = useState({
    nama: "",
    harga: "",
    harga_supplier: "",
    satuan: "",
    stok: "",
  });
  const [image, setImage] = useState("");
  const [imageStat, setImageStat] = useState(false);
  const [idKategori, setIdKategori] = useState("");
  const [kategori, setKategori] = useState([]);

  useEffect(() => {
    getKategori();
    getBarang();
  }, []);

  const getKategori = () => {
    axios.get(api + "getKategori").then((res) => {
      setKategori(res.data.data);
    });
  };

  const getBarang = async () => {
    await axios
      .get(api + "getBarangById", {
        params: {
          key: key,
        },
      })
      .then((res) => {
        setData(res.data.data);
        const datas = res.data.data;
        form.setFieldsValue({
          nama: datas.nama,
          harga: datas.harga,
          harga_supplier: datas.harga_supplier,
          satuan: datas.satuan,
          stok: datas.stok,
          id_kategori: datas.id_kategori,
          image: datas.image,
        });
      });
  };

  const handleChange = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData({ ...newData });
  };

  const handleChangeImage = async (e) => {
    if (e.fileList.length) {
      setImageStat(true);
    } else {
      setImageStat(false);
    }
    const image = await getBase64(e.file.originFileObj);
    setImage(image);
  };

  const handleSubmit = () => {
    const bodyRequest = {
      key: key,
      nama: data.nama,
      harga: data.harga,
      harga_supplier: data.harga_supplier,
      satuan: data.satuan,
      stok: data.stok,
      id_kategori: idKategori ? idKategori : data.id_kategori,
      image: image ? image : data.image,
    };

    axios
      .put(api + "putDataBarang", qs.stringify(bodyRequest))
      .then((res) => {
        swal({
          title: "Sukses Update Data",
          text: "Cek Daftar Barang!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        setTimeout(() => {
          router.push("/dashboard/barang");
        }, 100);
      })
      .catch((error) => {
        swal({
          title: "Gagal Update Data",
          text: "Ukuran Foto Terlalu Besar!",
          icon: "error",
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
                <h1 className="page-title">Edit Barang</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="page-title">
                  Halaman ini menampilkan formulir untuk mengubah data barang.
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
                <Image
                  width={200}
                  src={imageStat ? image : data.image}
                  className="mt-3"
                />
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
EditBarang.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
