import { Button, Input, Modal } from "antd";
import React from "react";
import { Row } from "react-bootstrap";
import { numberWithCommasString } from "../utils/koma";

export default function ModalKeranjangBeli({
  open,
  handleCancel,
  loading,
  detail,
  handleChange,
  putKeranjang,
  deleteKeranjang,
}) {
  return (
    <Modal
      open={open}
      title={detail.nama}
      onOk={() => putKeranjang()}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="delete"
          onClick={() => deleteKeranjang(detail.id_barang)}
          type="primary"
          danger
        >
          Delete
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={putKeranjang}
        >
          Save
        </Button>,
      ]}
    >
      <b>
        <p>
          Rp. {numberWithCommasString(detail.harga_supplier)} / {detail.satuan}
        </p>
      </b>
      <Row style={{ padding: "0px 15px" }}>
        <p style={{ margin: "0px", paddingLeft: "0px" }}>Jumlah : </p>
        <Input
          value={detail.jumlah_barang}
          name="jumlah_barang"
          type="number"
          onChange={(e) => handleChange(e)}
          style={{
            width: "100%",
            marginBottom: "15px",
          }}
        />
      </Row>
      <Row style={{ padding: "0px 15px" }}>
        <p style={{ margin: "0px", paddingLeft: "0px" }}>Total Harga : </p>
        <Input
          value={
            "Rp. " +
            numberWithCommasString(detail.jumlah_barang * detail.harga_supplier)
          }
          name="total"
          disabled
          style={{
            width: "100%",
            marginBottom: "15px",
          }}
        />
      </Row>
    </Modal>
  );
}
