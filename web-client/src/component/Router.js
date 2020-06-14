import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Login, DashBoard } from '../screens'

export default () => <Router>
    <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path='/' component={DashBoard} />
    </Switch>
</Router>