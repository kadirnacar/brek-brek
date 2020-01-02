import { toast } from "react-toastify";

export class Ui {

    static showErrors(messages) {
        if (Array.isArray(messages)) {
            messages.forEach(x => {
                if (!Array.isArray(x)) {
                    toast.error(x);
                    console.error(x);
                }
                else {
                    (x as any).forEach((y: string) => toast.error(y));
                }
            });
        } else {
            toast.error(messages);
            console.error(messages);
        }
    }

    static showInfo(message: string) {
        toast.info(message);
        console.info(message);
    }
}