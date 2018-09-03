import React, { Component } from 'react'
import { withStyles, Grid, Button, CardMedia, CardActions, Typography, Card, CardContent, Menu, MenuItem, Collapse, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { connect } from 'react-redux';
import CreateNewsDialog from './createNewsDialog';
import { fetchNews, fetchRemoveNews, toggleExpandedNews } from '../reducers/newsReducer';
import CenterSpinner from './centerSpinner';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';

const spinnerSize = 40;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  gridList: {
    width: 550,
    [theme.breakpoints.down('xs')]:{
      width: 300
    }
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  tile: {
    display: 'flex',
    justifyContent: 'center',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20%',
    [theme.breakpoints.down('xs')]: {
      right: '20px'
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    cursor: 'pointer'
  },
  card: {
    marginTop: theme.spacing.unit * 2
  },
  link: {
    textDecoration: 'none'
  },
  tileBody: {
    fontSize: 16,
    lineHeight: '24px'
  },
  moreIcon: {
    color: theme.palette.primary.light
  },
  expand: {
    marginLeft: 'auto',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  expandIcon: {
    color: theme.palette.primary.main
  }
})

class NewsFeed extends Component {
  state = {
    isCreateNewsDialogOpened: false,
    moreAnchor: null
  }

  componentDidMount() {
    this.props.fetchNews();
  }

  handleCreateNewsButton = () => {
    this.setState({ isCreateNewsDialogOpened: true });
  }

  handleCreateNewsDialogClose = () => {
    this.setState({ isCreateNewsDialogOpened: false })
  }

  handleMoreOpen = newsId => event => {
    this.setState({ 
      moreAnchor: event.currentTarget,
      selectedNewsId: newsId
    });
  }

  handleMoreClose = () => {
    this.setState({ moreAnchor: null });
  }

  handleRemove = newsId => () => {
    this.props.fetchRemoveNews(newsId)
      .then(() => {
        this.handleMoreClose();
      },
      error => {

      });
  }

  handleExpandClick = news => () => {
    this.props.toggleExpanded(news.id, !news.expanded);
  }

  render() {
    const { isCreateNewsDialogOpened, moreAnchor, selectedNewsId } = this.state;
    const { classes, isNewsFetching, isAdmin, isFetchingRemoveNews } = this.props;

    return (
      <Grid container justify='center'>
        {
          isNewsFetching && (
            <CenterSpinner />
          )
        }
        <Grid item xs={12} md={8} lg={6}>
          {
            this.props.news && !isNewsFetching &&
              this.props.news.map((news, index) => (
                <Card className={classes.card} key={news.id}>
                  <CardMedia 
                    className={classes.media}
                    image={news.img}
                    onClick={this.handleExpandClick(news)}
                  />
                  <CardContent>
                    <Typography variant='headline'>
                      {news.title}
                    </Typography>
                    <Typography component='p' className={classes.tileBody}>
                      {news.author}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={`/news/${news.id}`} className={classes.link}>
                      <Button size='small' color='primary'>Open in distinct page</Button>
                    </Link>
                    <Button onClick={this.handleMoreOpen(news.id)}>
                      <MoreIcon className={classes.moreIcon}/>
                    </Button>
                    <IconButton
                      onClick={this.handleExpandClick(news)}
                      className={classNames(classes.expand, {
                        [classes.expandOpen]: news.expanded
                      })}
                    >
                      <ExpandMoreIcon className={classes.expandIcon}/>
                    </IconButton>
                  </CardActions>
                  <Collapse in={news.expanded}>
                    <CardContent>
                      <Typography paragraph variant="body2">
                        {
                          news.details
                        }
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              ))
          }
        <Menu
          anchorEl={moreAnchor}
          open={Boolean(moreAnchor)}
          onClose={this.handleMoreClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <MenuItem onClick={this.handleMoreClose}>Share</MenuItem>
          {
            isAdmin &&
              <MenuItem onClick={this.handleRemove(selectedNewsId)}>
                Remove
                {
                  isFetchingRemoveNews &&
                    <CenterSpinner />
                }
              </MenuItem>
          }
        </Menu>     
        </Grid>
        {
          isAdmin && (
            <Button variant='fab' color='secondary' className={classes.addButton} onClick={this.handleCreateNewsButton}>
              <AddIcon />
            </Button>
          )
        }
        <CreateNewsDialog open={isCreateNewsDialogOpened} onClose={this.handleCreateNewsDialogClose}/>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth.isAuthenticated,
  news: state.news.news,
  isNewsFetching: state.news.isNewsFetching,
  isAdmin: state.auth.isAdmin,
  isFetchingRemoveNews: state.news.isFetchingRemoveNews
});

const mapDispatchToProps = dispatch => ({
  fetchNews: () => dispatch(fetchNews()),
  fetchRemoveNews: (newsId) => dispatch(fetchRemoveNews(newsId)),
  toggleExpanded: (newsId, isExpanded) => dispatch(toggleExpandedNews(newsId, isExpanded))

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NewsFeed));
