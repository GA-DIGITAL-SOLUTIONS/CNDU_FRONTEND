import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { ConfigProvider } from "antd";

// Priority 3: Ant Design v5 tree-shaking is automatic with named imports.
// ConfigProvider sets global tokens ONCE, reducing per-component CSS-in-JS overhead.
// NOTE: Removed global FontAwesome CSS (all.min.css ≈ 300KB) — import icons per-component instead.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#F24C88",
					colorLink: "#F24C88",
					fontFamily: "Open Sans, sans-serif",
				},
			}}
		>
			<Router>
				<App />
			</Router>
		</ConfigProvider>
	</Provider>
);

reportWebVitals();
