import React, {useState} from "react";
import MaterialTable from "material-table";

import moment from 'moment';
import { getDashboardData } from '../api';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
}));

const checkDate = (date, filter) => {
  console.log(date, filter)
  if (!filter) {
    return true;
  }
  return moment().isSame(moment(date), filter);;
}

const Table = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [state, setState] = useState({
    username: '',
    employee: '',
    date: '',
  });

  const handleFilterData = ({date, ...filters}) => {
    setFilterData(
      data.filter(
        (record) =>
          Object.keys(filters).every((elem) => {
            if (!filters[elem]) return true;
            return record[elem] === filters[elem]
          }
          ) && checkDate(record.date, date)
      )
    );
  }

  const handleChange = (key, value) => {
    const newState = {
      ...state,
      [key]: value
    }
    handleFilterData(newState)
    setState(newState);
  }

  React.useEffect(() => {
    getDashboardData()
      .then((res) => {
        if (res.status) {
          console.log(res.message)
          const formatedData = res.message.map((record) => ({
            description: record.description,
            id: record.id,
            username: record.user.username,
            employee: record.employee.username,
            type1: record.maintainceDetails.type1.replace('K.G;', ''),
            type2: record.maintainceDetails.type2.replace('K.G;', ''),
            type3: record.maintainceDetails.type3.replace('K.G;', ''),
            type4: record.maintainceDetails.type4.replace('K.G;', ''),
            date: moment(record.complete).format('MMM-DD-YYYY HH:mm:ss')
          }));
          console.log({formatedData})
          setData(formatedData);
          setFilterData(formatedData)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  const columns = [
    { title: 'User', field: 'username' },
    { title: "Description", field: "description" },
    { title: "Employee", field: 'employee'},
    {title: 'Date', field: 'date'},
    {title: 'Brown', field: 'type1'},
    {title: 'Yellow', field: 'type2'},
    {title: 'White', field: 'type3'},
    {title: 'Green', field: 'type4'},
  ];
  return (
    <div style={{ marginRight: 10, marginLeft: 10 }}>
      {/* <div> */}
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">User</InputLabel>
          <Select
            labelId="simple-select-user-label"
            id="simple-select-user"
            value={state.username}
            onChange={(event) => handleChange("username", event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {data
              .reduce((prevValue, nextValue) => {
                const index = prevValue.findIndex(
                  (ele) => ele === nextValue.username
                );
                if (index < 0) {
                  prevValue.push(nextValue.username);
                }
                return prevValue;
              }, [])
              .map((ele) => (
                <MenuItem value={ele}>{ele}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Employee</InputLabel>
          <Select
            labelId="simple-select-employee-label"
            id="simple-select-employee"
            value={state.employee}
            onChange={(event) => handleChange("employee", event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {data
              .reduce((prevValue, nextValue) => {
                const index = prevValue.findIndex(
                  (ele) => ele === nextValue.employee
                );
                if (index < 0) {
                  prevValue.push(nextValue.employee);
                }
                return prevValue;
              }, [])
              .map((ele) => (
                <MenuItem value={ele}>{ele}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Date</InputLabel>
          <Select
            labelId="simple-select-date-label"
            id="simple-select-date"
            value={state.date}
            onChange={(event) => handleChange("date", event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="week">Last week</MenuItem>
            <MenuItem value="month">last month</MenuItem>
            <MenuItem value="Year">last year</MenuItem>
          </Select>
        </FormControl>
      {/* </div> */}
      <MaterialTable
        options={{
          search: false,
          selection: true,
        }}
        columns={columns}
        data={filterData}
        title="Demo Title"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Total quatity collected
          </Typography>
          <div className={classes.demo}>
            <List>
              <ListItem>
                <ListItemText
                  primary={`Type Brown:  ${filterData.reduce((acc, next) => {
                    return acc += +next.type1
                  }, 0)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Type Yellow:  ${filterData.reduce((acc, next) => {
                    return acc += +next.type2
                  }, 0)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Type White:  ${filterData.reduce((acc, next) => {
                    return acc += +next.type3
                  }, 0)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Type Green:  ${filterData.reduce((acc, next) => {
                    return acc += +next.type4
                  }, 0)}`}
                />
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export { Table };