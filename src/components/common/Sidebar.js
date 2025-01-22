import { Drawer, List, ListItem, ListItemText, Box, IconButton, Collapse, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const DRAWER_WIDTH = 240;

const ProjectSquare = styled(Box)({
    width: 32,
    height: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginRight: 12
});

const StyledNavLink = styled(NavLink)({
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    display: 'block',
    '&:hover .MuiListItem-root': {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    '& .MuiListItem-root': {
        borderRadius: 8,
        margin: '2px 8px',
        padding: '8px 16px',
        width: 'auto',
    },
    '&.active .MuiListItem-root': {
        backgroundColor: '#f0f0f0',
    },
});

const ProjectHeader = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    marginBottom: 8,
    width: '100%',
    boxSizing: 'border-box'
});

const ProjectDropdown = styled(Box)({
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '0 16px',
    overflow: 'hidden'
});

const ProjectItem = styled(ListItem)({
    padding: '12px 16px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#e0e0e0'
    }
});

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const projects = [
        { name: 'proj1', color: '#4CAF50' },
        { name: 'proj2', color: '#2196F3' },
        { name: 'proj3', color: '#FF9800' }
    ];

    const menuItems = [
        { text: 'Overview', path: '/overview' },
        { text: 'Product Backlog', path: '/productbacklog' },
        { text: 'Sprint', path: '/sprint' },
        { text: 'Calendar', path: '/calendar' }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: '#dddddd',
                    border: 'none'
                },
            }}
        >
            <ProjectHeader>
                <ProjectSquare />
                <Box sx={{ flexGrow: 1 }}>Proj1</Box>
                <IconButton 
                    size="small"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </ProjectHeader>
            
            <Collapse in={isOpen}>
                <ProjectDropdown>
                    {projects.map((project) => (
                        <ProjectItem key={project.name}>
                            <ProjectSquare sx={{ bgcolor: project.color, width: 24, height: 24 }} />
                            <Typography sx={{ ml: 1 }}>{project.name}</Typography>
                        </ProjectItem>
                    ))}
                </ProjectDropdown>
            </Collapse>

            <List>
                {menuItems.map((item) => (
                    <StyledNavLink 
                        key={item.path} 
                        to={item.path}
                    >
                        <ListItem>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    </StyledNavLink>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
