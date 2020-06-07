import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    display: "flex",
    flex: 1,
    border: "1px solid",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    border: "1px solid",
    width: 430,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 15,
    paddingRight: 15,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    padding: "15px",
    textAlign: "left",
  },
  loginButton: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: '15px',
    paddingTop: 10
  },
}));

export default (props) => {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <form noValidate autoComplete="off">
          <div className={classes.row}>
            <div style={{ width: "150px" }}>
              <Typography className={classes.cell} variant="h6">
                Email
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                style={{ width: 250 }}
                id="outlined-basic"
                label="Outlined"
                onChange={(event) =>
                  setValues({
                    ...values,
                    email: event.target.value,
                  })
                }
                value={values.email}
                variant="outlined"
              />
            </div>
          </div>

          <div className={classes.row}>
            <div style={{ width: "150px" }}>
              <Typography className={classes.cell} variant="h6">
                Password
              </Typography>
            </div>
            <div className={classes.cell}>
              <TextField
                style={{ width: 250 }}
                type={values.showPassword ? "text" : "password"}
                id="outlined-basic"
                label="Outlined"
                onChange={(event) =>
                  setValues({
                    ...values,
                    password: event.target.value,
                  })
                }
                value={values.password}
                variant="outlined"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </div>
          <div className={classes.loginButton}>
            <Button variant="contained" color="primary">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
