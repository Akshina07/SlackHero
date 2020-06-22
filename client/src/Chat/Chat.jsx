import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Header from '../Layout/Header';
import ChatBox from './ChatBox';
import {Button, Divider} from '@material-ui/core'
import Conversations from './Conversations';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import Users from './Users';
import Rooms from './Rooms';

const useStyles = makeStyles(theme => ({
    paper: {
        minHeight: 'calc(100vh - 64px)',
        borderRadius: 0,
    },
    sidebar: {
        zIndex: 8,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    globe: {
        backgroundColor: theme.palette.primary.dark,
    },
    subheaderText: {
        color: theme.palette.primary.dark,
    },
    
    headerRow: {
        maxHeight: 60,
        zIndex: 5,
    },
    tabbar: {
        minWidth: 70, // a number of your choice
        width: 70, // a number of your choice
    },
    createRoom: {
        color: theme.palette.primary.dark,
        maxwidth: "200"

    }
}));

const Chat = () => {
    const [scope, setScope] = useState('Global Chat');
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const classes = useStyles();

    const handleChange = (e, newVal) => {
        console.log(newVal);
        setTab(newVal);
    };

    return (
        <React.Fragment>
            <Header />
            <Grid container direction="row">
                <Grid item md={2} className={classes.sidebar}>
                    <Paper className={classes.paper} square elevation={5}>
                        <Paper square>
                            {/* <Button value="Chats" onClick={handleChange}>Chats</Button> */}
                            <Tabs
                                onChange={handleChange}
                                // variant="fullWidth"
                                value={tab}
                                indicatorColor="primary"
                                textColor="primary"
                                
                            >
                                <Tab label="Chats" className={classes.tabbar}/>
                                <Tab label="Users" className={classes.tabbar}/>
                                <Tab label="Rooms" className={classes.tabbar}/>
                            </Tabs>
                        </Paper>
                        {tab === 0 && (
                            <Conversations
                                setUser={setUser}
                                setScope={setScope}
                            />
                        )}
                        {tab === 1 && (
                            <Users setUser={setUser} setScope={setScope} />
                        )}
                        {tab === 2 && (
                    
                            <Rooms setRoom={setRoom} setScope={setScope} />
                        )}
                    </Paper>
                </Grid>
                <Grid item md={10}>
                    <ChatBox scope={scope} user={user} />
                </Grid>

                
            </Grid>
        </React.Fragment>
    );
};

export default Chat;
