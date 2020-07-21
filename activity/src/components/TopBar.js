import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import IconMenu from '@material-ui/icons/Menu';
import IconMenuBook from '@material-ui/icons/MenuBook';
import IconIfigure from '@material-ui/icons/CastForEducation';
import IconRxitToApp from '@material-ui/icons/ExitToApp';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import LinearProgress from '@material-ui/core/LinearProgress';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    colorPrimary: {
      background: '#9FA8DA',
    },
    barColorPrimary: {
      background: '#5C6BC0',
    },
    logo: {
      color: theme.palette.secondary.light,
    }
  }));
  
  export function TopBar(props) {
    const theme = useTheme();
    const classes = useStyles(theme);
    
    return (
      <div className={classes.root}>
        <AppBar position="fixed" elevation={props.elevation ? 4 : 0}>
          <Toolbar>
            <IconButton edge="start" className={ classes.menuButton } color="inherit" aria-label="menu">
              <IconMenu />
            </IconButton>
            {/* <IconButton edge="start" className={ classes.menuBook } color="inherit" aria-label="menu">
              <IconMenuBook />
            </IconButton> */}
            <Typography variant="h6" className={ classes.title }>
             הדמיית תנועה פעילות ראשונה
            </Typography>
            <Typography edge="end" variant="h6" className={ classes.logo }>
              <InsertEmoticonIcon />
              Hapi
            </Typography>
          </Toolbar>
          <LinearProgress color="primary" classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} variant="determinate" value={props.progress} />
        </AppBar>
      </div>
    );
  }


  /*
              
            <Button edge="end" className={ classes.menuBook } color="inherit" aria-label="menu" onclick={ window.open('https://webhome.weizmann.ac.il/home/ifigures/ifigure.ifig.html','_blank') } >
                <Typography edge="end" variant="h6">
                New Empty IFigure 
                </Typography>
              <IconIfigure />
            </Button>
            */
  