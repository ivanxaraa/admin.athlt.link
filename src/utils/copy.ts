import { toast } from "sonner";

export const copy = (text: string, action?: any) => {
  navigator.clipboard.writeText(text);
  action ? action() : toast.success("Text copied");
};
