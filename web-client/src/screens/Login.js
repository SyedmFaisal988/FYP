import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { adminLogin } from '../api'
import { useHistory } from 'react-router-dom'

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
    height: '100vh'
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

export const Login = () => {
  const classes = useStyles();
  const history = useHistory()
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    const response = await adminLogin({
      username: values.username,
      password: values.password
    })
    console.log({ response })
    if(response.success){
      localStorage.setItem('AUTH_TOKEN', response.token)
      history.push('/')
    }
  }
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <form noValidate autoComplete="off">
          <div className={classes.row}>
            <div style={{ width: "150px" }}>
              <Typography className={classes.cell} variant="h6">
                User Name
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
                    username: event.target.value,
                  })
                }
                value={values.username}
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
            <Button onClick={handleLogin} variant="contained" color="primary">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
