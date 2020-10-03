import React, { useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Table, AppBarComponent } from '../component'
import { getLocationData } from '../api'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
  }));

export const DashBoard = () => {
    const classes = useStyles()
    const [data, setData] = useState([]);
    return (
        <div className={classes.root} >
          <AppBarComponent title="Dashboard" />
            <Table />
        </div>
    )
}