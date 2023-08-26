import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material';

const StyledToolBar = styled(Toolbar)`
  background-color: #ffcc02;
  display: flex,
  justifyContent: space-between,
`

const Header = () => {
  return (
    <AppBar>
      <StyledToolBar>
      </StyledToolBar>
    </AppBar>
  );
}

export default Header;