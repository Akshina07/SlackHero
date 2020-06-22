import useHandleResponse from '../Utilities/handle-response';
import useBotResponse from '../Utilities/handleBotResponse';
import authHeader from '../Utilities/auth-header';
import useCreateRoomResponse from '../Utilities/handleCreateRoomResponse';
import { useSnackbar } from 'notistack';

// Receive global messages
export function useGetGlobalMessages() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();
    // const BotResponase = useBotResponse();
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const getGlobalMessages = () => {
        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/global`,
            requestOptions
        )
            .then(handleResponse)
            .catch(() =>
                enqueueSnackbar('Could not load Global Chat', {
                    variant: 'error',
                })
            );
    };

    return getGlobalMessages;
}


export function useGetBotResponse() {
    const { enqueueSnackbar } = useSnackbar();
    // const handleResponse = useHandleResponse();
    const handleBotResponse = useBotResponse();
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const getBotMessages = () => {
        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/bot`,
            requestOptions
        )
            .then(handleBotResponse)
            .catch(() =>
                enqueueSnackbar('Could not load Bot Chat', {
                    variant: 'error',
                })
            );
    };
    

    return getBotMessages;
}


export function useSendBotMessage() {
    const { enqueueSnackbar } = useSnackbar();
    const handleBotResponse = useBotResponse();

    const sendBotMessage = body => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ body: body, global: true }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/bot`,
            requestOptions
        )
            .then(handleBotResponse)
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Could send message', {
                    variant: 'error',
                });
            });
    };

    return sendBotMessage;
}

// Send a global message
export function useSendGlobalMessage() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const sendGlobalMessage = body => {
        // console.log(body);
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ body: body, createRoom:true}),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/global`,
            requestOptions
        )
            .then(handleResponse)
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Could not create room', {
                    variant: 'error',
                });
            });
    };

    return sendGlobalMessage;
}

// Get list of users conversations
export function useGetConversations() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const getConversations = () => {
        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/conversations`,
            requestOptions
        )
            .then(handleResponse)
            .catch(() =>
                enqueueSnackbar('Could not load chats', {
                    variant: 'error',
                })
            );
    };

    return getConversations;
}




// get conversation messages based on
// to and from id's
export function useGetConversationMessages() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    const getConversationMessages = id => {
        return fetch(
            `${
                process.env.REACT_APP_API_URL
            }/api/messages/conversations/query?userId=${id}`,
            requestOptions
        )
            .then(handleResponse)
            .catch(() =>
                enqueueSnackbar('Could not load chats', {
                    variant: 'error',
                })
            );
    };

    return getConversationMessages;
}

export function useSendConversationMessage() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const sendConversationMessage = (id, body) => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ to: id, body: body }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/`,
            requestOptions
        )
            .then(handleResponse)
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Could send message', {
                    variant: 'error',
                });
            });
    };

    return sendConversationMessage;
}


export function useCreateRoom() {
    const { enqueueSnackbar } = useSnackbar();
    const HandleRoomResponse = useCreateRoomResponse();

    const createRoom = (body) => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ body: body }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/createRoom`,
            requestOptions
        )
            .then()
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Could not create a room', {
                    variant: 'error',
                });
            });
    };

    return createRoom;
}
