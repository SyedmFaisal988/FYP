import React from 'react';
import AuthLoading from './navigator/authLoading';
import { ContextProvider } from './context'


export default function App() {
  console.disableYellowBox = true
  return <ContextProvider><AuthLoading /></ContextProvider>
}
