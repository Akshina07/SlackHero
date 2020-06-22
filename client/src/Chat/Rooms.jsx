import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LanguageIcon from '@material-ui/icons/Language';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import socketIOClient from 'socket.io-client';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';
import { Icon, IconButton } from '@material-ui/core';
import { Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import  {Button} from '@material-ui/core';
import { useCreateRoom } from '../Services/chatService';
// import { authenticationService } from '../Services/authenticationService';

const useStyles = makeStyles(theme => ({
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
    list: {
        maxHeight: '80vh',
        overflowY: 'auto',
    },
}));

const Rooms = props => {
    const classes = useStyles();
    const [dialog, setOpenDialog] = useState(false);
    const [newRoom, setNewRoom] = useState(null);    // const [open, setOpen] = useState(false);
    // const [conversations, setConversations] = useState([]);
    // const [newConversation, setNewConversation] = useState(null);
    const createRoom= useCreateRoom();

    // Returns the recipient name that does not
    // belong to the current user.

    // const handleRecipient = recipients => {
    //     for (let i = 0; i < recipients.length; i++) {
    //         if (
    //             recipients[i].username !==
    //             authenticationService.currentUserValue.username
    //         ) {
    //             return recipients[i];
    //         }
    //     }
    //     return null;
    // };

    // useEffect(() => {
    //     getConversations().then(res => setConversations(res));
    // }, [newConversation]);

    // useEffect(() => {
    //     let socket = socketIOClient(process.env.REACT_APP_API_URL);
    //     socket.on('messages', data => setNewConversation(data));

    //     return () => {
    //         socket.removeListener('messages');
    //     };
    // }, []);

   

    const handleClickOpen = () => {
        setOpenDialog(true);
      };
    
      const handleClose = () => {
        setOpenDialog(false);
      };

      const handleCreate = () => {
          if(newRoom!==''){
            console.log(props);
            createRoom(newRoom).then(()=>{
                
                setOpenDialog(false);
                setNewRoom('');
            })
          }else{
              console.log("Incorrect Input");
          }
        
      };

    return (
        <List className={classes.list}>
            <ListItem
                classes={{ root: classes.subheader }}
                // onClick={() => {
                //     props.setScope('Create Room');
                // }}
            >
                <ListItemAvatar>
                    {/* <Avatar className={classes.globe}> */}
                    <IconButton type="submit" onClick={ e => {e.preventDefault();setOpenDialog(true);}}>
                        <AddCircleOutlineSharpIcon />
                    </IconButton>
                </ListItemAvatar>
                <ListItemText
                    className={classes.subheaderText}
                    primary="Create Room"
                />
                <Dialog open={dialog} onClose={handleClose}>
                    <DialogTitle id="form-dialog-title">Create a new room</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create a new room for users to interact. This will automatically create a new slack channel that can be added to your workspace.
                        </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Room Name"
                        type="text"
                        fullWidth
                        onChange={e =>
                            setNewRoom(e.target.value)
                        }
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} color="primary">
                            Create
                        </Button>
                    </DialogActions>

                </Dialog>
            </ListItem>
            <Divider />
        </List>
    );
};

export default Rooms;
