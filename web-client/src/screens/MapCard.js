import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import CheckIcon from "@material-ui/icons/Check";
import { updateStatus } from '../api/location'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  content: {
    padding: "0px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  checkButton: {
    padding: '0px',
    paddingRight: 10,
    marginLeft: 'auto',
  }
}));

export const DisplayCard = ({
  data: { url, processing, complete, created, point }, refresh
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <img src={url} width="100%" />
      <div className={classes.content}>
        <div
          style={{
            display: "flex",
          }}
        >
          <Typography variant="body1">Status:</Typography>
          <Typography style={{ marginLeft: 4 }} color="primary" variant="body1">
            {complete ? "Completed" : processing ? "Processing" : "Pending"}
          </Typography>
        </div>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ padding: 10 }}>
          {created && (
            <div
              style={{
                display: "flex",
              }}
            >
              <Typography style={{ width: 85, textAlign: 'left' }} variant="body1">Created:</Typography>
              <Typography
                style={{ marginLeft: 4 }}
                color="primary"
                variant="body1"
              >
                {new Date(created).toDateString()}
              </Typography>
              {!processing && !complete && <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                className={classes.checkButton}
                onClick={() => {
                  updateStatus({
                    point,
                    status: 'processing'
                  }).then(() => {
                    refresh();
                  })
                }}
              >
                <CheckIcon />
              </IconButton>}
            </div>
          )}
          {processing && (
            <div
              style={{
                display: "flex",
              }}
            >
              <Typography style={{ width: 85, textAlign: 'left' }} variant="body1">Processing:</Typography>
              <Typography
                style={{ marginLeft: 4 }}
                color="primary"
                variant="body1"
              >
                {new Date(processing).toDateString()}
              </Typography>
              {!complete && <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                className={classes.checkButton}
                onClick={() => {
                  updateStatus({
                    point,
                    status: 'complete'
                  }).then(() => {
                    refresh();
                  })
                }}
              >
                <CheckIcon />
              </IconButton>}
            </div>
          )}
          {complete && (
            <div
              style={{
                display: "flex",
              }}
            >
              <Typography style={{ width: 85, textAlign: 'left' }} variant="body1">Complete:</Typography>
              <Typography
                style={{ marginLeft: 4 }}
                color="primary"
                variant="body1"
              >
                {new Date(complete).toDateString()}
              </Typography>
            </div>
          )}
        </div>
      </Collapse>
    </Card>
  );
};
