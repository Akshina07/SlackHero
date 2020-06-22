import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { CardMedia } from '@material-ui/core';
import socketIOClient from 'socket.io-client';


import {
    useGetGlobalMessages,
    useSendGlobalMessage,
    useGetConversationMessages,
    useSendConversationMessage,
    useGetBotResponse,
    useSendBotMessage
} from '../Services/chatService';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    headerRow: {
        maxHeight: 60,
        zIndex: 5,
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.palette.primary.dark,
    },
    messageContainer: {
        height: '100%',
    },
    messagesRow: {
        maxHeight: '70vh',
        overflowY: 'auto',
    },
    newMessageRow: {
        width: '100%',
        padding: theme.spacing(0, 2, 1),
    },
    inputRow: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    form: {
        width: '100%',
    },
    avatar: {
        margin: theme.spacing(1, 1.5),
    },
    listItem: {
        width: '80%',
    },
    dashboard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: theme.palette.primary.dark,
        variant: 'outlined',
        minHeight: 'calc(10vh - 64px)'
    },
}));

const ChatBox = props => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [lastBotResponse, setBotResponse] = useState(null);
    const [dashboard, setDashboard]=useState(null);
    // const [slack, setSlackMessage] = useState('');

    const getGlobalMessages = useGetGlobalMessages();
    const sendGlobalMessage = useSendGlobalMessage();
    const getConversationMessages = useGetConversationMessages();
    const sendConversationMessage = useSendConversationMessage();
    const getBotMessage = useGetBotResponse();
    const sendBotMessage = useSendBotMessage();

    let chatBottom = useRef(null);
    const classes = useStyles();

    useEffect(() => {
        reloadMessages();
        scrollToBottom();
    }, [lastMessage,dashboard, props.scope, props.conversationId]);

    useEffect(()=>{
        reloadMessages();
        scrollToBottom();
    },[lastBotResponse]);

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_API_URL);
        socket.on('messages', data => {
            
            setLastMessage(data);
        });
        socket.on('slackmessages', data => {
            
            setLastMessage(data);
        });
        socket.on('bot', data => {
            console.log("received bot messade client");
            if(data.image){
                var img = new Image();
                img.src = 'data:image/jpeg;base64,' + data.buffer;
                setDashboard(img);
            }
            
            setLastMessage('');
            // console.log("Bot message");
            // console.log(data);
            // reloadMessages();
            // scrollToBottom();
            }
        );
    }, []);

    // useEffect(() => {
    //     const socket = socketIOClient(process.env.REACT_APP_API_URL);
    //     socket.on('bot', data => {
    //         if(data.image){
    //             var img = new Image();
    //             img.src = 'data:image/jpeg;base64,' + data.buffer;
    //             setDashboard(img);
    //         }
            
    //         setLastMessage(data);
    //         console.log("Bot message");
    //         console.log(data);
    //         reloadMessages();
    //         scrollToBottom();
    //         }
    //     );
    // }, []);

    // useEffect(() => {
    //     const socket = socketIOClient(process.env.REACT_APP_API_URL);
    //     socket.on('Slackmessages', data => {
    //         console.log("Inside Slack messages");
    //         setLastMessage(data);
    //         console.log(data);
    //         reloadMessages();
    //         scrollToBottom();
    //         // setLastMessage('');
    //     });
    // }, []);

    

    const reloadMessages = () => {
        console.log("Inside reload messages 1");
        if (props.scope === 'Global Chat') {
            console.log("Inside reload messages");
            getGlobalMessages().then(res => {
                console.log(res);
                setMessages(res);
            });
        } else if (props.scope !== null && props.conversationId !== null) {
            console.log("Inside reload messages 2");
            getConversationMessages(props.user._id).then(res =>
                setMessages(res)
            );
        } else {
            console.log("Inside reload messages 3");
            setMessages([]);
        }
    };

    const scrollToBottom = () => {
        chatBottom.current.scrollIntoView({ behavior: 'smooth' });
    };

    // const displayConsole = () => {
    //     getBotMessage().then(res => {
    //         // console.log(res);
    //         setDashboard(res);
    //         // console.log(dashboard);
    //     })
    //     console.log("Display in Console");
    // }

    // useEffect(displayConsole,[dashboard]);

    useEffect(scrollToBottom, [messages,dashboard]);

    const handleSubmit = e => {
        e.preventDefault();


        if (props.scope === 'Global Chat') {
            if(newMessage[0]==="/"){
                sendBotMessage(newMessage).then(() =>{
                    setNewMessage('');
                });
            }
            else{
                sendGlobalMessage(newMessage).then(() => {
                    setNewMessage('');

                });
            }
        } else {
            sendConversationMessage(props.user._id, newMessage).then(res => {
                setNewMessage('');
            });
        }
    };

    return (
        <Grid container className={classes.root} >
            <Grid item xs={4}>
                <Grid item xs={12} className={classes.headerRow}>
                    <Paper className={classes.paper} square elevation={2}>
                        <Typography color="inherit" variant="h6">
                            {props.scope}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.messageContainer}>
                        <Grid item xs={12} className={classes.messagesRow}>
                            {messages && (
                                <List>
                                    {messages.map(m => (
                                        <ListItem
                                            key={m._id}
                                            className={classes.listItem}
                                            alignItems="flex-start"
                                        >
                                            <ListItemAvatar
                                                className={classes.avatar}
                                            >
                                                <Avatar>H</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={m.fromObj[0].name}
                                                secondary={
                                                    <React.Fragment>
                                                        {m.body}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            <div ref={chatBottom} />
                        </Grid>
                        <Grid item xs={12} className={classes.inputRow}>
                            <form onSubmit={handleSubmit} className={classes.form}>
                                <Grid
                                    container
                                    className={classes.newMessageRow}
                                    alignItems="flex-end"
                                >
                                    <Grid item xs={11}>
                                        <TextField
                                            id="message"
                                            label="Message or /stock"
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth
                                            value={newMessage}
                                            onChange={e =>
                                                setNewMessage(e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton type="submit">
                                            <SendIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={8}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.dashboard} square elevation={2} >
                                <Typography color="inherit" variant="h6" align="center">
                                    DASHBOARD
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                             {/* <iframe title="YAHOO" src="https://www.goldmansachs.com/" width="680" height="480" allowfullscreen></iframe> */}
                             {(dashboard == null)  ? <iframe align="center" title="YAHOO" src="https://www.goldmansachs.com/" width="700" height="600"></iframe> :<img align="center" width="100%" height="150%" alt="gs-stocks" src={dashboard.src}/> }                
                        </Grid>
                    </Grid>
            </Grid> 
        </Grid>
    );
};

export default ChatBox;
