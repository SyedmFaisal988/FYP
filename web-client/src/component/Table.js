import React from "react";
import MaterialTable from "material-table";
import { getCrowdData } from '../api';

const Table = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getCrowdData()
    .then((res) => {
      setData(res)
    })
    .catch((err) => console.log(err, 'err'))
  }, [])

  const columns = [
    { title: "Description", field: "description" },
    { title: "Quantity", field: "quality" },
    { title: "Unit", field: "selectedItems" },
  ];
  return <MaterialTable columns={columns} data={data} title="Demo Title" />;
};

export { Table };