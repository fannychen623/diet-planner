// import packages
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// import local components
import Header from "./components/Header";
import LoginSignup from "./pages/LoginSignup";
import Home from "./pages/Home";
import Food from "./pages/Food";
import AddFood from "./components/AddFood";
import Meal from "./pages/Meal";
import NewMeal from "./pages/NewMeal";
import EditMeal from "./pages/EditMeal";
import Search from "./components/Search";
import Calendar from "./pages/Calendar";

// import local global style sheet
import './styles/Global.css';

// define http request link
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="global">
          <Header />
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/loginSignup" element={<LoginSignup />} />
              <Route path="/food" element={<Food />} />
              <Route path="/food/add" element={<AddFood />} />
              <Route path="/meal" element={<Meal />} />
              <Route path="/meal/new" element={<NewMeal />} />
              <Route path="/meal/edit/:mealId" element={<EditMeal />} />
              <Route path="/search" element={<Search />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;