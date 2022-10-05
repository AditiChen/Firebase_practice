import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./components/header";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    background-color: #313538;
    color:white
  }
  body {
    font-family: 'Noto Sans TC';
  }

  #root {
    margin: 0;
    min-height: 100vh;
    position: relative;

  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
}

export default App;
