import * as React from "react";
import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { MainLayout } from "./viewComponents/mainLayout";
import { getStore } from "./store";

function _tick() {
    const store = getStore(); 
    const _render = (Component) => {
        render(<AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
            document.getElementById("root")
        );
    };
    _render(ShellPage);

    if (module.hot) {
        module.hot.accept("./viewComponents/mainLayout", () => {
            const NextApp = require("./viewComponents/mainLayout") as any;
            _render(NextApp.MainLayout);
        });
    }
}

/** Perhaps do something async then */
_tick();
