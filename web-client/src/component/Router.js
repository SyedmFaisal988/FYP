import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from '../screens/Login'

export default (props) => <Router>
    <Switch>
        <Route exact path="/login" component={Login} />
    </Switch>
</Router>