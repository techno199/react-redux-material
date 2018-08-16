import React, { Component } from 'react'
import { Typography, withStyles, Grid, CircularProgress, Paper } from '@material-ui/core';
import { EditorState, RichUtils } from 'draft-js'
import { fetchNewsDetails } from '../reducers/newsReducer';
import { connect } from 'react-redux';
import CenterSpinner from './centerSpinner';

const styles = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column'
  },
  titleImage: {
    maxWidth: '100%'
  },
  detailsContainer: {
    padding: 16
  },
  detailsBody: {
    fontSize: 16,
    lineHeight: '24px'
  }
})

class NewsDetails extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  componentDidMount() {
    const { match, fetchNewsDetails } = this.props;
    const newsId = match.params.newsId
    fetchNewsDetails(newsId);
  }

  handleEditorChange = editorState => {
    this.setState({ editorState: editorState })
  }

  handleBoldButton = () => {
    this.handleEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    const { classes, newsDetails, isDetailsFetching } = this.props;

    return (
      <Grid container justify='center'>
        <Grid item lg={7} md={8} xs={12}>
          {
            isDetailsFetching &&
              <CenterSpinner />
          }
          {
            // Show news after they're loaded.
            newsDetails && !isDetailsFetching && 
              <Paper className={classes.detailsContainer}>
                <img alt='' src={newsDetails.img} className={classes.titleImage}/>
                <Typography paragraph>{newsDetails.author}</Typography>
                <Typography variant='title'>{newsDetails.title}</Typography>
                <Typography paragraph variant='body2'>
                  {newsDetails.details}
                </Typography>
              </Paper>
            }
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  newsDetails: state.news.newsDetails,
  isDetailsFetching: state.news.isDetailsFetching
});

const mapDispatchToProps = dispatch => ({
  fetchNewsDetails: (newsId) => dispatch(fetchNewsDetails(newsId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewsDetails));