import Users, {IUserModel} from '../model/User'
import Message, {IMessageModel} from '../model/Message'
import Notification, {INotificationModel} from '../model/Notification'

function sumDigitsFromString(str: string) {
	var sum = 0;
	for (var i = 0; i < str.length; i++) {
	  if (!isNaN(parseInt(str[i]))) {
		sum += parseInt(str[i]);
	  }
	}
	return sum;
  }

const onSocket = (io: any) => {
    io.on("connection", (socket: any) => {

        socket.on("user:join", async (payload: any) => {
            const user = await Users.findById(payload.receiver);
            if (user) {
				const key: number = sumDigitsFromString(payload.sender) + sumDigitsFromString(payload.receiver);
				socket.join(key);
            }
        });

        socket.on("message:send", async (payload: any) => {
            const message: IMessageModel = new Message({
				sender: payload.sender,
				receiver: payload.receiver,
				message: payload.message
			})
			await message.save();
			const key: number = sumDigitsFromString(payload.sender) + sumDigitsFromString(payload.receiver);
			payload.sender = await Users.findById(payload.sender);
			payload.receiver = await Users.findById(payload.receiver);
			if (!payload.sender.contacts.includes(payload.receiver._id)) {
				payload.sender.contacts.push(payload.receiver._id);
				payload.receiver.contacts.push(payload.sender._id);
				await payload.sender.save();
				await payload.receiver.save();
			}
			payload.message = message;
			io.to(key).emit("message:receive", payload);
        });

        socket.on("disconnect", () => {
        });

		socket.on('like', async (payload: any) => {
			const user: IUserModel | null = await Users.findById(payload.sender);
			if (user) {
				const message = `Пользователю ${user.firstName} понравилась ваша фотография`;
					const notification: INotificationModel = new Notification({
						sender:  payload.sender,
						receiver:  payload.receiver,
						message: message,
					});
					await notification.save();
					const key: number = sumDigitsFromString(payload.sender) + sumDigitsFromString(payload.receiver);
					io.emit("new-notification", {notification, user });	
				
			}
    	});
})};
export default onSocket;