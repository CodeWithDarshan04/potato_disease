import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Container,
  Card,
  CardContent,
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress
} from "@material-ui/core";
import cblogo from "./cblogo.png";
import image from "./bg.png";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";
import React from "react";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#ffffff",
    color: "black",
    fontSize: "18px",
    fontWeight: 700,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "2em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`, // Set background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh",
    paddingTop: "40px",
    overflow: 'hidden', // Disable scrolling
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 10px 40px rgba(0,0,0,0.2)',
    // borderRadius: '50px',
    overflow: 'hidden',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  table: {
    backgroundColor: 'transparent',
  },
  tableHead: {
    backgroundColor: 'transparent',
  },
  tableRow: {
    backgroundColor: 'transparent',
  },
  tableCell: {
    fontSize: '20px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '1px 24px 1px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: '1px 24px 1px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#0077b6',
    boxShadow: 'none',
    color: 'white',
  },
  loader: {
    color: '#0077b6 !important',
  },
  alertBox: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '10px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
    textAlign: theme.spacing(2),
  },
  dropzoneContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.9)', // Solid background for dropzone
    backgroundColor: 'transparent', // Solid background for dropzone
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  }
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image ? (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="image"
                    title="Preview"
                  />
                </CardActionArea>
              ) : (
                <CardContent>
                  <div className={classes.dropzoneContainer}>
                    <DropzoneArea
                      acceptedFiles={['image/*']}
                      dropzoneText={"Drop an image of a potato plant leaf to process"}
                      onChange={onSelectFile}
                    />
                  </div>
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableCell1}>Label:</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableCell}>{data.class}</TableCell>
                          <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {confidence < 50 && (
                    <div className={classes.alertBox}>
                      Warning: Low confidence in prediction. Please try a clearer image.
                    </div>
                  )}
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography variant="h6" noWrap>
                    Processing
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                size="large"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
