import React, { createContext, Component } from 'react'
const Context = createContext()

class ContextProvider extends Component {
    state = { 
        mapRegion: null,
    }

    setMapRegion = (mapRegion)=> {
        this.setState({
            mapRegion
        })
    }

    getValues = () => ({
        ...this.state,
        setMapRegion: this.setMapRegion
    })

    render(){
        return(
            <Context.Provider value={this.getValues()}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export { ContextProvider, Context }  