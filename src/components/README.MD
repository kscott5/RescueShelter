# ReactJS - javascript tips
```
This library relies on the browser's HTML Document Object Model (DOM) & Javascript for all  
manipulation of client side html tags and routes throughout the app.  
  
  
For example: after a fetch completes successfully, the app changes the React.Component

window.loction.href = "/animals";  
  
  
It furthers publishes a series of lifecyle events the app should obverse or subscribe  
that provide addition information about the frameworks intent. 
  
  
For example:

componentDidMount() {
    // good locnation where the fetch of data or setState 
    // after the component renders
}

shouldComponentUpdate(nextProps, nextState, nextContext) {
    // good location where modification of properties, state of context  
    // should force component render and calls componentDidMount()

    return (this.props !== nextProps) ||
        (this.state !== nextState) ||
        (this.context !== nextContext);
}
```

