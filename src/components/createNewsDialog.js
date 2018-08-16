import React, { PureComponent } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, withStyles, Grid, FormControl } from '@material-ui/core';
import PropTypes from 'prop-types';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { connect } from 'react-redux';
import { fetchCreateNews } from '../reducers/newsReducer';
import CenterSpinner from './centerSpinner';

const styles = theme => ({
  input: {
    display: 'none'
  },
  uploadButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit
  },
  uploadIcon: {
    marginLeft: theme.spacing.unit
  },
  uploadedImage: {
    maxWidth: '100%'
  },
  deleteIcon: {
    marginLeft: theme.spacing.unit,
    display: 'flex',
    flex: '1 0 auto'
  },
  titleInput: {
    flexGrow: 1
  }
});

const defaultState = {
  newsBody: '',
  newsTitle: '',
  pictures: [],
  file: null,
  fileUrl: null
}

class CreateNewsDialog extends PureComponent {
  state = defaultState

  componentDidUpdate() {
    // Remove all cached data after logout
    if (!this.props.isAuthenticated) {
      this.setState({ ...defaultState });
    }
  }
  
  handleChange = key => event => {
    this.setState({ [key]: event.target.value })
  }

  handleCreateNewsButton = () => {
    let news = {
      id: null,
      title: this.state.newsTitle,
      details: this.state.newsBody,
      author: 'Alex Tishkov',
      img: this.state.fileUrl
    };

    this.props.fetchCreateNews(news)
      .then(() => {
        this.handleClose();
      },
      error => {

      })
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose();
  }

  onDrop = picture => {
    this.setState({
      pictures: this.state.pictures.concat(picture)
    });
  }

  handleDeleteImageButton = () => {
    this.setState({
      file: null,
      fileUrl: null
    });
  }

  handleImageChange = event => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    // Removing selected file from DOM input selection.
    // This way second selection of same file would be seen
    // in event.target.files[0]. Otherwise we get undefined
    event.target.value = '';

    reader.onloadend = () => {
      this.setState({
        file,
        fileUrl: reader.result
      });
    }

    if (file) {
      console.log('reading file')
      reader.readAsDataURL(file)
    }
    else {
      this.setState({
        file: null,
        fileUrl: null
      });
    }
      
  }

  render() {
    const { classes, isFetchingCreatingNews } = this.props;
    const { fileUrl } = this.state;
    
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        fullScreen
      >
        <Grid container justify='center'>
          <Grid item xs={12} md={8}>
            <DialogTitle>Create News</DialogTitle>
            <DialogContent>
              <Grid container spacing={16}>
                <Grid item md={8} className={classes.titleInput}>
                  <TextField
                    label='Title'
                    fullWidth
                    value={this.state.newsTitle}
                    onChange={this.handleChange('newsTitle')}
                    margin='normal'
                  />
                </Grid>
                <Grid item md={4} className={classes.uploadButtonContainer}>
                  <input 
                    type='file'
                    accept='image/*' 
                    className={classes.input} 
                    id='news-upload-image'
                    onChange={this.handleImageChange}
                  />
                  <label htmlFor='news-upload-image'>
                    <Grid container wrap='nowrap'>
                      <Button variant='contained' component='span'>
                        Upload image
                        <UploadIcon className={classes.uploadIcon}/>
                      </Button>
                      <Button 
                        variant='fab' 
                        mini 
                        color='secondary' 
                        className={classes.deleteIcon} 
                        onClick={this.handleDeleteImageButton}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </label>
                </Grid>
              </Grid>
              {
                fileUrl && (
                  <Grid container justify='center' spacing={16}>
                    <Grid item>
                      <img src={fileUrl} className={classes.uploadedImage}/>
                    </Grid>
                  </Grid>
                )
              }
              <TextField
                id="multiline-flexible"
                label="News body"
                multiline
                fullWidth
                value={this.state.newsBody}
                onChange={this.handleChange('newsBody')}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button variant='outlined' onClick={this.handleCreateNewsButton}>
                Create
                {
                  isFetchingCreatingNews &&
                    <CenterSpinner size={30}/>
                }
              </Button>
              <Button variant='outlined' onClick={this.handleClose}>Cancel</Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    )
  }
}

CreateNewsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  isFetchingCreatingNews: state.news.isFetchingCreatingNews,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
  fetchCreateNews: (news) => dispatch(fetchCreateNews(news))

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateNewsDialog));
