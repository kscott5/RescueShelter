# Rescue Shelter [Typescript](https://github.com/microsoft/TypeScript) v3.5.2 issue
Multiple <form/> on HTML page. [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) provides different results from the browser console viewer and tsc - cli  
 
 DOM query selector command | javascript  | typescript |  
 -------------------------- | ---------- | ------------ |  
 document.querySelector("form").checkValidity() | OK | OK  
 document.querySelector("form.ui.form.register").checkValidity() | OK | NOT OK  
 document.querySelector("form[class='ui form register']").checkValidity() | OK | NOT OK  
  

# WORK AROUND  
Casting with javascript. Stop it now. This is a typescript function.  
The lib.ts.d should check the HTMLElement DOCUMENT_NODE_TYPE or other value  
```
querySelector(selector: string) : any {
    return document.querySelector(selector);
}

   
querySelector("[form.ui.form.register").checkValidity() ;   

 <form class="ui form">
 </form>

 <form class="ui form register">
 </form>
 ```  
   
Rescue Shelter [index.tsx](https://github.com/kscott5/RescueShelter/blob/master/src/components/index.tsx) and
[newsponsor.tsx](https://github.com/kscott5/RescueShelter/blob/master/src/components/sponsors/newsponsor.tsx)