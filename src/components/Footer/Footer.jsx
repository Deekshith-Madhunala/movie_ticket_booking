import React from 'react';
import { Box, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box sx={{ backgroundColor: 'background.paper', color: 'text.primary', py: 4, mt: 4 }}>
            <Divider sx={{ bgcolor: '#ccc' }} />
            <Grid container spacing={4} justifyContent="space-between" mt={1}>
                {/* Logo and Brand Name */}
                <Grid item xs={12} md={4} container justifyContent="center" alignItems="center">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: 'secondary.main',
                                marginRight: 2,
                            }}
                        >
                            {/* Brand Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="24" height="24">
                                <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
                            </svg>
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                            Movie TIX
                        </Typography>
                    </Box>
                </Grid>

                {/* Links Section */}
                <Grid item xs={12} md={8} container spacing={4}>
                    <Grid item xs={6} sm={3} textAlign={'start'}>
                        <Typography variant="subtitle2" fontWeight="bold" >Product</Typography>
                        <Box  gap={2} alignItems="start">
                            <Link href="#" color="text.secondary" underline="hover">Features</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">Integrations</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">Pricing</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">FAQ</Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={3} textAlign={'start'}>
                        <Typography variant="subtitle2" fontWeight="bold">Company</Typography>
                        <Box>
                            <Link href="#" color="text.secondary" underline="hover">Privacy</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">Terms of Service</Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={3} textAlign={'start'}>
                        <Typography variant="subtitle2" fontWeight="bold">Developers</Typography>
                        <Box>
                            <Link href="#" color="text.secondary" underline="hover">Public API</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">Documentation</Link>
                            <br />
                            <Link href="#" color="text.secondary" underline="hover">Guides</Link>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={3} textAlign={'start'}>
                        <Typography variant="subtitle2" fontWeight="bold">Social Media</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0 }}>
                            <IconButton color="primary" href="#" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="primary" href="#" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="primary" href="#" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
