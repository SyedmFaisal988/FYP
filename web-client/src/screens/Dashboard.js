import React, { useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Table, AppBarComponent } from '../component'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
  }));

export const DashBoard = () => {
    const classes = useStyles()
    console.log('render')
    return (
        <div className={classes.root} >
          <AppBarComponent title="Dashboard" />
            <Table />
        </div>
    )
}