import { Col, Row } from "react-bootstrap";
import LayoutPage from "../components/layoutPage";
import { unauthPage } from "../middleware/authorizationPage";

export async function getServerSideProps(ctx) {
  await unauthPage(ctx);

  return { props: {} };
}
export default function Home() {
  return (
    <>
      <div className="title">
        <Row className="row-index">
          <Col>
            <img src="/images/cashier.png" alt="logos" className="logo-title" />
          </Col>
        </Row>
        <Row className="row-index">
          <Col>
            <h4 className="text-title">Sumber Rezeki Makmur</h4>
          </Col>
        </Row>
      </div>
    </>
  );
}
Home.getLayout = function getLayout(page) {
  return <LayoutPage>{page}</LayoutPage>;
};
