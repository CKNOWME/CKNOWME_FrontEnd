import Message from "../components/Message.tsx";

type Propsdata = {
    message: string;
}

const MessageIsland = ({message}:Propsdata) => {
    return (
        <Message message={message} />
    );
}  
export default MessageIsland;