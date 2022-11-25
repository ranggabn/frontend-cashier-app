import { Button, Input, Modal } from "antd";
import React from "react";
import { Row } from "react-bootstrap";
import { numberWithCommasString } from "../utils/koma";

export default function ModalKeranjangJasa({
  open,
  handleCancel,
  loading,
  detail,
  handleChangeJasa,
  putKeranjangJasa,
  deleteKeranjang,
}) {
  return (
    <Modal
      open={open}
      title={detail.nama_jasa}
      onOk={() => putKeranjangJasa()}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="delete"
          onClick={() => deleteKeranjang(detail.id_jasa, "jasa")}
          type="primary"
          danger
        >
          Delete
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={putKeranjangJasa}
        >
          Save
        </Button>,
      ]}
    >
      <b>
        <p>Rp. {numberWithCommasString(detail.harga_jasa)} / Kg</p>
      </b>
      <Row style={{ padding: "0px 15px" }}>
        <p style={{ margin: "0px", paddingLeft: "0px" }}>Jumlah : </p>
        <Input
          value={detail.jumlah}
          name="jumlah"
          type="number"
          onChange={(e) => handleChangeJasa(e)}
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
            "Rp. " + numberWithCommasString(detail.jumlah * detail.harga_jasa)
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
