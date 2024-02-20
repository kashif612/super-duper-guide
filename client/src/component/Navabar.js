import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: #333; /* Background color of the navbar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow effect */
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #fff; /* Text color of the logo */
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
`;

const NavLinkItem = styled.li`
  margin-right: 20px;
`;

const NavLink = styled.a`
  color: #fff; /* Text color of the links */
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00bcd4; /* Hover color of the links */
  }
`;

const ShadowedNavbar = () => {
  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo>My Cool Website</Logo>
        <NavLinks>
          <NavLinkItem><NavLink href="#">Home</NavLink></NavLinkItem>
          <NavLinkItem><NavLink href="#">About</NavLink></NavLinkItem>
          <NavLinkItem><NavLink href="#">Contact</NavLink></NavLinkItem>
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
}

export default ShadowedNavbar;
