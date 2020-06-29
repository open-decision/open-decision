//FIXME Refactor Tabs component
import { Tabs, Tab } from "@material-ui/core";

import { TableItem } from "components";

import React from "react";

const Table = ({ className }) => (
  <div
    sx={{ gridTemplateColumns: "1fr 3fr 4fr 3fr 1fr", mt: 5 }}
    className={className}
  >
    <TableHeader />
    <TableItem sx={{ my: 3 }} />
  </div>
);

const TableHeader = () => {
  return (
    <div
      sx={{
        display: "grid",
        gridTemplateColumns: "inherit",
        py: 3,
        borderBottom: "1px solid black",
      }}
    >
      <div></div>
      <div>NAME</div>
      <div>TAGS</div>
      <div>ZULETZT GEÄNDERT</div>
    </div>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const TreeTable = ({ className }) => {
  const [value, setValue] = React.useState(0);

  return (
    <div className={className}>
      <Tabs value={value} onChange={(event, newValue) => setValue(newValue)}>
        <Tab label="Meine Bäume" {...a11yProps(0)} />
        <Tab label="Veröffentlicht" {...a11yProps(1)} />
        <Tab label="Exportiert" {...a11yProps(2)} />
        <Tab label="Archiv" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Table />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Table />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Table />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Table />
      </TabPanel>
    </div>
  );
};
