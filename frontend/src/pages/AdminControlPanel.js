import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import RecommendIcon from '@mui/icons-material/Recommend';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AdminControlPanel = () => {
  // State for AI agent status
  const [agents, setAgents] = useState({
    dealDiscovery: { active: true, status: 'healthy', logs: [], performance: 85 },
    recommendation: { active: true, status: 'healthy', logs: [], performance: 90 },
    priceMonitoring: { active: false, status: 'inactive', logs: [], performance: 0 },
    customerSupport: { active: false, status: 'inactive', logs: [], performance: 0 }
  });
  
  // State for system metrics
  const [metrics, setMetrics] = useState({
    apiCalls: 0,
    searchQueries: 0,
    bookingClicks: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    errorRate: 0
  });
  
  // State for logs
  const [logs, setLogs] = useState([]);
  
  // State for alerts
  const [alerts, setAlerts] = useState([]);
  
  // State for notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // State for selected tab
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  // Mock data loading
  useEffect(() => {
    // Simulate loading metrics
    setMetrics({
      apiCalls: 1243,
      searchQueries: 587,
      bookingClicks: 89,
      conversionRate: 15.2,
      averageResponseTime: 245,
      errorRate: 1.2
    });
    
    // Simulate loading logs
    setLogs([
      { timestamp: '2025-03-30 16:45:12', level: 'info', agent: 'dealDiscovery', message: 'Successfully analyzed 150 hotel prices' },
      { timestamp: '2025-03-30 16:42:35', level: 'info', agent: 'recommendation', message: 'Generated recommendations for user #12345' },
      { timestamp: '2025-03-30 16:40:18', level: 'warning', agent: 'dealDiscovery', message: 'Slow response from Booking.com API' },
      { timestamp: '2025-03-30 16:38:22', level: 'error', agent: 'recommendation', message: 'Failed to retrieve user preferences' },
      { timestamp: '2025-03-30 16:35:47', level: 'info', agent: 'dealDiscovery', message: 'New deal detected for Hotel Excelsior' }
    ]);
    
    // Simulate loading alerts
    setAlerts([
      { id: 1, timestamp: '2025-03-30 16:40:18', level: 'warning', message: 'Slow response from Booking.com API', resolved: false },
      { id: 2, timestamp: '2025-03-30 16:38:22', level: 'error', message: 'Failed to retrieve user preferences', resolved: true }
    ]);
  }, []);
  
  // Handle agent toggle
  const handleAgentToggle = (agent) => {
    setAgents(prev => ({
      ...prev,
      [agent]: {
        ...prev[agent],
        active: !prev[agent].active,
        status: !prev[agent].active ? 'starting' : 'stopping'
      }
    }));
    
    // Simulate status change after delay
    setTimeout(() => {
      setAgents(prev => ({
        ...prev,
        [agent]: {
          ...prev[agent],
          status: !prev[agent].active ? 'healthy' : 'inactive'
        }
      }));
      
      setNotification({
        open: true,
        message: `${agent.charAt(0).toUpperCase() + agent.slice(1)} agent ${!prev[agent].active ? 'started' : 'stopped'} successfully`,
        severity: 'success'
      });
    }, 2000);
  };
  
  // Handle alert resolution
  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    
    setNotification({
      open: true,
      message: 'Alert marked as resolved',
      severity: 'success'
    });
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Render dashboard tab
  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>System Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>API Calls (24h)</Typography>
              <Typography variant="h4">{metrics.apiCalls}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Search Queries (24h)</Typography>
              <Typography variant="h4">{metrics.searchQueries}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Booking Clicks (24h)</Typography>
              <Typography variant="h4">{metrics.bookingClicks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Conversion Rate</Typography>
              <Typography variant="h4">{metrics.conversionRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="AI Agent Status" />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SearchIcon color={agents.dealDiscovery.active ? "primary" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Deal Discovery Agent" 
                    secondary={`Status: ${agents.dealDiscovery.status}`} 
                  />
                  <Switch 
                    checked={agents.dealDiscovery.active} 
                    onChange={() => handleAgentToggle('dealDiscovery')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RecommendIcon color={agents.recommendation.active ? "primary" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Recommendation Agent" 
                    secondary={`Status: ${agents.recommendation.status}`} 
                  />
                  <Switch 
                    checked={agents.recommendation.active} 
                    onChange={() => handleAgentToggle('recommendation')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color={agents.priceMonitoring.active ? "primary" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Price Monitoring Agent" 
                    secondary={`Status: ${agents.priceMonitoring.status}`} 
                  />
                  <Switch 
                    checked={agents.priceMonitoring.active} 
                    onChange={() => handleAgentToggle('priceMonitoring')} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SupportAgentIcon color={agents.customerSupport.active ? "primary" : "disabled"} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Customer Support Agent" 
                    secondary={`Status: ${agents.customerSupport.status}`} 
                  />
                  <Switch 
                    checked={agents.customerSupport.active} 
                    onChange={() => handleAgentToggle('customerSupport')} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Alerts" />
            <Divider />
            <CardContent>
              {alerts.length > 0 ? (
                <List>
                  {alerts.map((alert) => (
                    <ListItem key={alert.id}>
                      <ListItemIcon>
                        {alert.level === 'error' ? <ErrorIcon color="error" /> : 
                         alert.level === 'warning' ? <WarningIcon color="warning" /> : 
                         <InfoIcon color="info" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={alert.message} 
                        secondary={`${alert.timestamp} - ${alert.resolved ? 'Resolved' : 'Active'}`} 
                      />
                      {!alert.resolved && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleResolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                  No alerts to display
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
  
  // Render agent monitoring tab
  const renderAgentMonitoring = () => (
    <Box>
      <Typography variant="h5" gutterBottom>AI Agent Monitoring</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Deal Discovery Agent" />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Performance Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <Slider
                      value={agents.dealDiscovery.performance}
                      disabled
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {agents.dealDiscovery.performance}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Configuration</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Min Deal Score"
                      type="number"
                      defaultValue={70}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price History Days"
                      type="number"
                      defaultValue={30}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Box>
                <Typography gutterBottom>Recent Activity</Typography>
                <List dense>
                  {logs.filter(log => log.agent === 'dealDiscovery').slice(0, 3).map((log, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {log.level === 'error' ? <ErrorIcon color="error" fontSize="small" /> : 
                         log.level === 'warning' ? <WarningIcon color="warning" fontSize="small" /> : 
                         <InfoIcon color="info" fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={log.message} 
                        secondary={log.timestamp} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recommendation Agent" />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Performance Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <Slider
                      value={agents.recommendation.performance}
                      disabled
                      valueLabelDisplay="auto"
                      step={1}
                      min={0}
                      max={100}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {agents.recommendation.performance}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Configuration</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Min Recommendation Score"
                      type="number"
                      defaultValue={60}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Sort</InputLabel>
                      <Select
                        value="best_match"
                        label="Default Sort"
                      >
                        <MenuItem value="best_match">Best Match</MenuItem>
                        <MenuItem value="price_low">Price: Low to High</MenuItem>
                        <MenuItem value="rating">Highest Rating</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              
              <Box>
                <Typography gutterBottom>Recent Activity</Typography>
                <List dense>
                  {logs.filter(log => log.agent === 'recommendation').slice(0, 3).map((log, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {log.level === 'error' ? <ErrorIcon color="error" fontSize="small" /> : 
                         log.level === 'warning' ? <WarningIcon color="warning" fontSize="small" /> : 
                         <InfoIcon color="info" fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={log.message} 
                        secondary={log.timestamp} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
  
  // Render logs tab
  const renderLogs = () => (
    <Box>
      <Typography variant="h5" gutterBottom>System Logs</Typography>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Log Level</InputLabel>
              <Select
                value="all"
                label="Log Level"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Agent</InputLabel>
              <Select
                value="all"
                label="Agent"
              >
                <MenuItem value="all">All Agents</MenuItem>
                <MenuItem value="dealDiscovery">Deal Discovery</MenuItem>
                <MenuItem value="recommendation">Recommendation</MenuItem>
                <MenuItem value="priceMonitoring">Price Monitoring</MenuItem>
                <MenuItem value="customerSupport">Customer Support</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Search"
              size="small"
              fullWidth
              placeholder="Filter logs..."
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button variant="outlined">Clear Filters</Button>
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {log.level === 'error' ? <ErrorIcon color="error" fontSize="small" sx={{ mr: 1 }} /> : 
                     log.level === 'warning' ? <WarningIcon color="warning" fontSize="small" sx={{ mr: 1 }} /> : 
                     <InfoIcon color="info" fontSize="small" sx={{ mr: 1 }} />}
                    {log.level}
                  </Box>
                </TableCell>
                <TableCell>{log.agent}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
  
  // Render settings tab
  const renderSettings = () => (
    <Box>
      <Typography variant="h5" gutterBottom>System Settings</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>API Integration</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Booking.com Affiliate ID"
              fullWidth
              defaultValue="demo-affiliate-id"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Booking.com API Key"
              fullWidth
              type="password"
              defaultValue="••••••••••••••••"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save API Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>AI Agent Settings</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Deal Discovery Frequency</InputLabel>
              <Select
                value="hourly"
                label="Deal Discovery Frequency"
              >
                <MenuItem value="realtime">Real-time</MenuItem>
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Price Monitoring Frequency</InputLabel>
              <Select
                value="daily"
                label="Price Monitoring Frequency"
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Save Agent Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>System Maintenance</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" color="primary" fullWidth>
              Clear Cache
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" color="primary" fullWidth>
              Rebuild Indexes
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="outlined" color="error" fullWidth>
              Reset System
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
  
  // Render content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return renderDashboard();
      case 'agents':
        return renderAgentMonitoring();
      case 'logs':
        return renderLogs();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Budget Travel Platform - Admin Control Panel
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={2}>
          <Paper sx={{ p: 2 }}>
            <List component="nav">
              <ListItem 
                button 
                selected={selectedTab === 'dashboard'} 
                onClick={() => setSelectedTab('dashboard')}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem 
                button 
                selected={selectedTab === 'agents'} 
                onClick={() => setSelectedTab('agents')}
              >
                <ListItemIcon>
                  <RecommendIcon />
                </ListItemIcon>
                <ListItemText primary="AI Agents" />
              </ListItem>
              <ListItem 
                button 
                selected={selectedTab === 'logs'} 
                onClick={() => setSelectedTab('logs')}
              >
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary="Logs" />
              </ListItem>
              <ListItem 
                button 
                selected={selectedTab === 'settings'} 
                onClick={() => setSelectedTab('settings')}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9} lg={10}>
          <Paper sx={{ p: 3 }}>
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminControlPanel;
