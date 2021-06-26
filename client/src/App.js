import { Container, createMuiTheme, Grid, ThemeProvider } from "@material-ui/core";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Catalog from "./screens/Catalog/Catalog";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SingleProduct from "./screens/SingleProduct/SingleProduct";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FBBCA9',
      dark: '#F7AF99'
    }, 
    secondary: {
      main: '#58ACA7',
      dark: '#266057',
    }
  }, 
  shape: {
    borderRadius: 10
  }
})
 
function App() {
  return (
    <ThemeProvider theme={theme}>

      {/* <Login_Signup /> */}

      <div className="App">
      <Router>
        <Grid container>
          <Grid item lg={12} md={12} sm={12}>
            <Header />
          </Grid>

          <Grid item lg={12} md={12} sm={12}>
            <Switch>
              <Route path="/product/:id" component={SingleProduct} />

              <Route path="/product">
                <Catalog />
              </Route>
            </Switch>
          </Grid>

          <Grid item lg={12} md={12} sm={12}>
            <Footer />
          </Grid>
        </Grid>
      </Router>
      </div>
  </ThemeProvider>
    
  );
}

export default App;
