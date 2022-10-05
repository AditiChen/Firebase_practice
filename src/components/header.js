import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 80px;
  padding: 20px 80px;
  background-color: #303030;
  display: flex;
  box-shadow: 0px 1px 3px gray;
  z-index: 999;
`;

const CategoryLink = styled(Link)`
  margin: auto 20px;
  background-color: #303030;
  font-size: 20px;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-shadow: 1px 1px 5px gray;
  }
`;

function Header() {
  return (
    <Wrapper>
      <CategoryLink to="/">Articles</CategoryLink>
      <CategoryLink to="firends">Friends</CategoryLink>
    </Wrapper>
  );
}

export default Header;
