import { toast } from "sonner";

export const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied");
}