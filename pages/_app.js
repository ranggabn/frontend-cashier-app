import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.scss";
import "antd/dist/reset.css";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
