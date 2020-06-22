// import { authenticationService } from '../Services/authenticationService';
import { useSnackbar } from 'notistack';

const useCreateRoomResponse = () => {
    const { enqueueSnackbar } = useSnackbar();

    const HandleRoomResponse = response => {
        // /console.log(response.text());
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                console.log("response not ohk");
            // console.log(data);
            };
            return data;
        });
    };

    return HandleRoomResponse;
};

export default useCreateRoomResponse;
