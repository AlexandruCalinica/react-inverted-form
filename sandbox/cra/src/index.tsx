import "./styles.css";

import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import BasicSetup from "./views/basic-setup";
import MultiFormSetup from "./views/multi-form-setup";
import BasicSetupYup from "./views/basic-setup-with-yup";
import GenericFormElement from "./views/generic-form-element";
import ConditionalFieldValue from "./views/conditional-field-value";
import BasicSetupDefaultValues from "./views/basic-setup-default-values";
import CustomMixedFormElements from "./views/custom-mixed-form-elements";
import IndividualStepValidation from "./views/individual-step-validation";
import BasicSetupClassValidator from "./views/basic-setup-with-class-validator";

import {
  Link,
  Route,
  Router,
  Outlet,
  RootRoute,
  RouterProvider,
} from "@tanstack/react-router";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/basic-setup">Basic setup</Link>
        <Link to="/basic-setup-default-values">Basic setup default values</Link>
        <Link to="/basic-setup-with-class-validator">
          Basic setup with class validator
        </Link>
        <Link to="/basic-setup-with-yup">Basic setup with yup</Link>
        <Link to="/multi-form-setup">Multi form setup</Link>
        <Link to="/individual-step-validation">Individual step validation</Link>
        <Link to="/conditional-field-value">Conditional field value</Link>
        <Link to="/generic-form-element">Generic form element</Link>
        <Link to="/custom-mixed-form-elements">Custom mixed form elements</Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});
const basicSetupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/basic-setup",
  component: BasicSetup,
});
const multiFormSetupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/multi-form-setup",
  component: MultiFormSetup,
});
const basicSetupClassValidatorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/basic-setup-with-class-validator",
  component: BasicSetupClassValidator,
});
const basicSetupYupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/basic-setup-with-yup",
  component: BasicSetupYup,
});
const basicSetupDefaultValuesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/basic-setup-default-values",
  component: BasicSetupDefaultValues,
});
const individualStepValidationRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/individual-step-validation",
  component: IndividualStepValidation,
});
const conditionalFieldValueRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/conditional-field-value",
  component: ConditionalFieldValue,
});
const genericFormElementRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/generic-form-element",
  component: GenericFormElement,
});
const customMixedFormElementsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/custom-mixed-form-elements",
  component: CustomMixedFormElements,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  basicSetupRoute,
  basicSetupYupRoute,
  multiFormSetupRoute,
  genericFormElementRoute,
  conditionalFieldValueRoute,
  basicSetupDefaultValuesRoute,
  customMixedFormElementsRoute,
  basicSetupClassValidatorRoute,
  individualStepValidationRoute,
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
