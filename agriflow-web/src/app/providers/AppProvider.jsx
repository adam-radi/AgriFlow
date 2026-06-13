import store from "../store";
import { Provider } from "react-redux";

export const AppProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default AppProvider;

