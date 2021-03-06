import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FileHandler from "./FileHandler";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import {
  useCloseFileHandle,
  useGetFileHandle,
} from "../../Context/AppProvider";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginTop: "1rem",
  },
}));

export default function FileView(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const getFileHandle = useGetFileHandle();
  const dispatchCloseFileHandle = useCloseFileHandle();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFileClose = (option) => {
    dispatchCloseFileHandle(option.id);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {getFileHandle.map((x, i) => (
            <Tab
              key={x.id}
              label={x.name}
              icon={<CancelRoundedIcon onClick={() => handleFileClose(x)} />}
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      </AppBar>

      {getFileHandle.map((x, i) => (
        <TabPanel key={x.id} value={value} index={i}>
          <FileHandler data={x.handle} fileId={x.id} />
        </TabPanel>
      ))}
    </div>
  );
}
